"use server";

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
