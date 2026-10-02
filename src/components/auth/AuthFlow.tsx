"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, FlaskConical } from "lucide-react";
import { fromBnDigits, normalizeBdMobile, phoneBn, toBnDigits } from "@/lib/format";
import { signIn } from "@/lib/demo-store";
import { inputCls, TextField } from "../ui/fields";

type Mode = "login" | "register" | "forgot";
const DEMO_OTP = "123456";
const DEMO_NAME = "মোঃ সাইদুর রহমান";

/** Only same-site paths are allowed as a return target (no open redirect). */
export function safeNext(next?: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export function AuthFlow({ mode, next }: { mode: Mode; next?: string }) {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp" | "newpass">("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const target = safeNext(next);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const normalized = normalizeBdMobile(phone);

  function finish() {
    signIn({ name: mode === "register" && name.trim() ? name.trim() : DEMO_NAME, phone: normalized! });
    router.push(target);
  }

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (mode === "register" && name.trim().length < 2) err.name = "আপনার নাম লিখুন";
    if (!normalized) err.phone = "সঠিক মোবাইল নম্বর দিন, ১১ সংখ্যা (০১XXXXXXXXX)";
    if (mode !== "forgot" && pw.length < 8) err.pw = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
    if (mode === "register" && pw !== pw2) err.pw2 = "দুটি পাসওয়ার্ড মিলছে না";
    setErrors(err);
    if (Object.keys(err).length) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if (mode === "login") finish();
      else {
        setStep("otp");
        setResendIn(60);
      }
    }, 500);
  }

  function submitOtp(e: React.FormEvent) {
    e.preventDefault();
    if (fromBnDigits(otp) !== DEMO_OTP) {
      setErrors({ otp: "কোডটি মেলেনি। SMS-এ আসা ৬ সংখ্যার কোড আবার দেখুন।" });
      return;
    }
    setErrors({});
    if (mode === "forgot") setStep("newpass");
    else finish();
  }

  function submitNewPass(e: React.FormEvent) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (pw.length < 8) err.pw = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
    if (pw !== pw2) err.pw2 = "দুটি পাসওয়ার্ড মিলছে না";
    setErrors(err);
    if (!Object.keys(err).length) finish();
  }

  const titles: Record<Mode, string> = { login: "লগইন করুন", register: "নতুন অ্যাকাউন্ট", forgot: "পাসওয়ার্ড ভুলে গেছেন" };

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
      <h1 className="text-[26px] font-extrabold text-field-900">{step === "otp" ? "কোড যাচাই করুন" : step === "newpass" ? "নতুন পাসওয়ার্ড দিন" : titles[mode]}</h1>

      <p className="mt-3 flex gap-2 rounded-xl bg-grain-100 px-3.5 py-2.5 text-[14px] text-[#5c4400]">
        <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          ডেমো সংস্করণ: যেকোনো সঠিক মোবাইল নম্বর ও ৮ অক্ষরের পাসওয়ার্ড দিন।{step === "otp" ? ` যাচাই কোড ${toBnDigits(DEMO_OTP)}।` : ""} আসল সাইটে কোড শুধু SMS-এ যাবে।
        </span>
      </p>

      {step === "form" && (
        <form onSubmit={submitForm} noValidate className="mt-5 space-y-4">
          {mode === "register" && <TextField id="a-name" label="আপনার নাম" value={name} onChange={setName} autoComplete="name" error={errors.name} />}
          <TextField
            id="a-phone"
            label="মোবাইল নম্বর"
            value={phone}
            onChange={setPhone}
            placeholder="০১৭XXXXXXXX"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            error={errors.phone}
            hint="বাংলা বা ইংরেজি সংখ্যা, দুটোই চলবে"
          />
          {mode !== "forgot" && (
            <div>
              <label htmlFor="a-pw" className="mb-1.5 block text-[15px] font-semibold">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  id="a-pw"
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  aria-invalid={errors.pw ? true : undefined}
                  aria-describedby={errors.pw ? "a-pw-err" : undefined}
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                  aria-pressed={showPw}
                  className="absolute right-1 top-1 grid size-10 place-items-center rounded-lg text-muted hover:bg-paper"
                >
                  {showPw ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {errors.pw && (
                <p id="a-pw-err" className="mt-1.5 text-[14px] font-medium text-bad">
                  {errors.pw}
                </p>
              )}
            </div>
          )}
          {mode === "register" && (
            <TextField id="a-pw2" label="পাসওয়ার্ড আবার লিখুন" type={showPw ? "text" : "password"} value={pw2} onChange={setPw2} autoComplete="new-password" error={errors.pw2} />
          )}
          {mode === "login" && (
            <p className="text-right">
              <Link href={`/forgot-password${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-[15px] font-semibold text-field-700 hover:underline">
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </p>
          )}
          <button type="submit" disabled={busy} className="h-12 w-full rounded-full bg-field-700 text-[17px] font-semibold text-white hover:bg-field-800 disabled:opacity-60">
            {busy ? "অপেক্ষা করুন…" : mode === "login" ? "লগইন" : "যাচাই কোড পাঠান"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={submitOtp} noValidate className="mt-5 space-y-4">
          <p className="text-[16px]">
            <span className="num font-semibold">{phoneBn(normalized!)}</span> নম্বরে ৬ সংখ্যার কোড পাঠানো হয়েছে।{" "}
            <button type="button" onClick={() => setStep("form")} className="font-semibold text-field-700 hover:underline">
              নম্বর বদলান
            </button>
          </p>
          <div>
            <label htmlFor="a-otp" className="mb-1.5 block text-[15px] font-semibold">
              যাচাই কোড
            </label>
            <input
              id="a-otp"
              value={otp}
              onChange={(e) => setOtp(toBnDigits(e.target.value.replace(/[^0-9০-৯]/g, "").slice(0, 6)))}
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-invalid={errors.otp ? true : undefined}
              aria-describedby={errors.otp ? "a-otp-err" : undefined}
              className={`${inputCls} num text-center text-[24px] tracking-[0.5em]`}
            />
            {errors.otp && (
              <p id="a-otp-err" className="mt-1.5 text-[14px] font-medium text-bad">
                {errors.otp}
              </p>
            )}
          </div>
          <button type="submit" className="h-12 w-full rounded-full bg-field-700 text-[17px] font-semibold text-white hover:bg-field-800">
            যাচাই করুন
          </button>
          <p className="text-center text-[15px] text-muted">
            কোড আসেনি?{" "}
            {resendIn > 0 ? (
              <span className="num">{toBnDigits(resendIn)} সেকেন্ড পর আবার পাঠাতে পারবেন</span>
            ) : (
              <button type="button" onClick={() => setResendIn(60)} className="font-semibold text-field-700 hover:underline">
                আবার পাঠান
              </button>
            )}
          </p>
        </form>
      )}

      {step === "newpass" && (
        <form onSubmit={submitNewPass} noValidate className="mt-5 space-y-4">
          <TextField id="n-pw" label="নতুন পাসওয়ার্ড" type="password" value={pw} onChange={setPw} autoComplete="new-password" error={errors.pw} hint="কমপক্ষে ৮ অক্ষর" />
          <TextField id="n-pw2" label="আবার লিখুন" type="password" value={pw2} onChange={setPw2} autoComplete="new-password" error={errors.pw2} />
          <button type="submit" className="h-12 w-full rounded-full bg-field-700 text-[17px] font-semibold text-white hover:bg-field-800">
            পাসওয়ার্ড সেভ করে লগইন
          </button>
        </form>
      )}

      {step === "form" && (
        <p className="mt-6 border-t border-line pt-5 text-center text-[15px] text-muted">
          {mode === "login" ? (
            <>
              অ্যাকাউন্ট নেই?{" "}
              <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-field-700 hover:underline">
                নতুন অ্যাকাউন্ট খুলুন
              </Link>
            </>
          ) : (
            <>
              অ্যাকাউন্ট আছে?{" "}
              <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-field-700 hover:underline">
                লগইন করুন
              </Link>
            </>
          )}
        </p>
      )}
    </div>
  );
}
