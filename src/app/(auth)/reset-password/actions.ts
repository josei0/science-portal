"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ResetResult = { success: true; error?: never } | { error: string; success?: never };
type AdminClient = ReturnType<typeof createAdminClient>;
const unavailable = "Reset password belum dapat diproses. Silakan hubungi admin.";
const accountMismatch = "Akun tidak ditemukan atau tipe akun tidak sesuai.";

function validatePassword(password: unknown): string | null {
  if (typeof password !== "string" || password.length < 6) {
    return "Password baru harus minimal 6 karakter.";
  }
  if (password.length > 128) return "Password baru maksimal 128 karakter.";
  return null;
}

function validRecoveryCode(code: unknown): boolean {
  // Recovery is an administrator-assisted operation, separate from teacher signup.
  const expected = process.env.PASSWORD_RESET_ACCESS_CODE?.trim();
  const signupCode = process.env.TEACHER_ACCESS_CODE?.trim();
  if (!expected || expected.length < 32 || expected.length > 256 || typeof code !== "string" || code.length > 256) {
    return false;
  }
  if (expected.toLowerCase() === signupCode?.toLowerCase()) return false;
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(code.trim()), digest(expected));
}

async function updatePassword(
  admin: AdminClient,
  userId: string,
  password: string
): Promise<ResetResult> {
  const { data, error } = await admin.auth.admin.updateUserById(userId, { password });
  if (error) {
    if (error.code === "weak_password") {
      return { error: "Password belum memenuhi kebijakan keamanan. Gunakan password yang lebih kuat." };
    }
    if (error.code === "same_password") {
      return { error: "Password baru harus berbeda dari password sebelumnya." };
    }
    return { error: unavailable };
  }
  if (!data.user) return { error: unavailable };
  return { success: true };
}

/** Authenticated teachers may reset students only, never another teacher. */
export async function resetStudentPassword(
  studentId: string,
  newPassword: string
): Promise<ResetResult> {
  const passwordError = validatePassword(newPassword);
  if (passwordError) return { error: passwordError };
  if (typeof studentId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(studentId)) {
    return { error: "ID siswa tidak valid." };
  }

  try {
    const supabase = await createClient();
    const { data, error: authError } = await supabase.auth.getUser();
    if (authError || !data.user) return { error: "Silakan login kembali." };

    const { data: caller, error: callerError } = await supabase
      .from("profiles").select("role").eq("id", data.user.id).single();
    if (callerError || caller?.role !== "teacher") {
      return { error: "Hanya guru yang dapat mereset password siswa." };
    }

    const admin = createAdminClient();
    const { data: target, error: targetError } = await admin
      .from("profiles").select("role").eq("id", studentId).single();
    if (targetError || target?.role !== "student") return { error: accountMismatch };

    return await updatePassword(admin, studentId, newPassword);
  } catch {
    return { error: unavailable };
  }
}

async function resetWithRecoveryCode(
  username: unknown,
  accessCode: unknown,
  newPassword: unknown,
  role: "student" | "teacher"
): Promise<ResetResult> {
  if (!validRecoveryCode(accessCode)) {
    return { error: "Kode pemulihan tidak valid atau layanan belum diaktifkan. Silakan hubungi admin." };
  }
  const passwordError = validatePassword(newPassword);
  if (passwordError) return { error: passwordError };
  if (typeof username !== "string" || !username.trim() || username.trim().length > 64 || /[\s@]/.test(username.trim())) {
    return { error: "Masukkan username yang valid, tanpa spasi atau alamat email." };
  }
  const email = `${username.trim().toLowerCase()}@scienceportal.local`;

  try {
    const admin = createAdminClient();
    // listUsers is paginated. Searching only the first page misses older accounts.
    const perPage = 100;
    for (let page = 1; ; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
      if (error) return { error: unavailable };
      const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email);
      if (user) {
        // Never authorize based on user_metadata, which the user can edit.
        const { data: profile, error: profileError } = await admin
          .from("profiles").select("role").eq("id", user.id).single();
        if (profileError || profile?.role !== role) return { error: accountMismatch };
        return await updatePassword(admin, user.id, newPassword as string);
      }
      if (data.users.length < perPage) return { error: accountMismatch };
    }
  } catch {
    return { error: unavailable };
  }
}

/** Public entry points require the private administrator recovery credential. */
export async function resetTeacherPassword(
  username: string,
  accessCode: string,
  newPassword: string
): Promise<ResetResult> {
  return resetWithRecoveryCode(username, accessCode, newPassword, "teacher");
}

export async function resetStudentPasswordPublic(
  username: string,
  accessCode: string,
  newPassword: string
): Promise<ResetResult> {
  return resetWithRecoveryCode(username, accessCode, newPassword, "student");
}
