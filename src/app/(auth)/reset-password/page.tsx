import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Briefcase, GraduationCap, KeyRound, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Bantuan Login — Science Portal",
  description: "Panduan pemulihan akun Science Portal untuk siswa dan guru.",
};

export default function ResetPasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 pt-12 pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/images/auth_bg.jpg')" }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black/90" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-0 h-80 w-80 rounded-full bg-amber-500/20 blur-[100px]" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-tr from-amber-400 to-orange-600 shadow-lg shadow-orange-500/30">
            <KeyRound aria-hidden="true" className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Lupa Password?</h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            Kami bantu Anda kembali belajar. Ikuti petunjuk sesuai jenis akun Anda.
          </p>
        </div>

        <div className="space-y-6 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <section aria-labelledby="student-help" className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-5">
            <div className="mb-3 flex items-center gap-3 text-amber-300">
              <GraduationCap aria-hidden="true" className="h-6 w-6 shrink-0" />
              <h2 id="student-help" className="text-lg font-bold">Untuk Siswa</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-200">
              Hubungi guru Anda dan sampaikan nama serta username akun Anda.
              Guru dapat mereset password melalui menu Kelola Siswa.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              Setelah mendapat password baru dari guru, kembali ke halaman login untuk masuk.
            </p>
          </section>

          <section aria-labelledby="teacher-help" className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="mb-3 flex items-center gap-3 text-orange-300">
              <Briefcase aria-hidden="true" className="h-6 w-6 shrink-0" />
              <h2 id="teacher-help" className="text-lg font-bold">Untuk Guru</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-200">
              Hubungi admin atau pengelola Science Portal di sekolah Anda.
              Sampaikan nama serta username agar admin dapat memeriksa identitas dan membantu pemulihan akun.
            </p>
          </section>

          <p className="flex items-start gap-2 text-sm leading-relaxed text-gray-300">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            Anda tidak perlu memasukkan kode akses atau password di halaman ini.
          </p>

          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3.5 font-bold text-white shadow-lg transition-colors hover:from-amber-400 hover:to-orange-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
          >
            <ArrowLeft aria-hidden="true" className="h-5 w-5" />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </main>
  );
}
