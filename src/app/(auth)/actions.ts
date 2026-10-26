"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const supabase = await createClient();

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const email = `${username}@scienceportal.local`;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid username or password." };
  }

  redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
  const supabase = await createClient();

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;
  const role = formData.get("role") as string;
  const gradeLevel = formData.get("gradeLevel") as string;
  const email = `${username}@scienceportal.local`;

  if (role !== "student" && role !== "teacher") {
    return { error: "Tipe akun tidak valid." };
  }

  if (role === "teacher") {
    const teacherCode = formData.get("teacherCode") as string;
    const validCode = process.env.TEACHER_ACCESS_CODE?.trim();
    const cleanCode = typeof teacherCode === "string" ? teacherCode.trim().toUpperCase() : "";
    if (!validCode || cleanCode !== validCode.toUpperCase()) {
      return { error: "Kode Akses Guru salah. Silakan hubungi admin." };
    }
  }

  // Validate admin configuration before creating a teacher account.
  let admin: ReturnType<typeof createAdminClient> | undefined;
  if (role === "teacher") {
    try {
      admin = createAdminClient();
    } catch {
      return { error: "Pendaftaran guru belum tersedia. Silakan hubungi admin." };
    }
  }

  const { data: signupData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
        role: "student",
        username: username,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Only this server-side operation may grant a teacher role after code validation.
  if (admin) {
    if (!signupData.user || signupData.user.identities?.length === 0) {
      return { error: "Akun sudah terdaftar. Silakan login atau hubungi admin." };
    }
    try {
      const { error: promotionError } = await admin.from("profiles")
        .update({ role: "teacher" }).eq("id", signupData.user.id).select("id").single();
      if (promotionError) {
        return { error: "Akun dibuat, tetapi akses guru belum aktif. Silakan hubungi admin." };
      }
    } catch {
      return { error: "Akun dibuat, tetapi akses guru belum aktif. Silakan hubungi admin." };
    }
  }

  // Update profile with grade_level after signup
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && gradeLevel) {
    await supabase
      .from("profiles")
      .update({
        grade_level: parseInt(gradeLevel),
        display_name: displayName,
      })
      .eq("id", user.id);
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
