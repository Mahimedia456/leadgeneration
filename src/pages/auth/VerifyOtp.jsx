import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import logo from "../../assets/logo.png";

const OTP_LENGTH = 6;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef([]);

  const handleChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 1);
    if (!cleanValue && value !== "") return;

    const next = [...otp];
    next[index] = cleanValue;
    setOtp(next);

    if (cleanValue && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    if (!pasted.length) return;

    const next = Array(OTP_LENGTH).fill("");
    pasted.forEach((char, i) => {
      next[i] = char;
    });
    setOtp(next);

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[focusIndex]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/reset-password");
  };

  return (
    <AuthLayout showHelp={false}>
      <main className="mx-auto w-full max-w-md auth-shell-glow">
        <div className="mb-10 flex justify-center">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Mahimedia Solutions"
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Mahimedia<span className="text-blue-500">.</span>
            </span>
          </div>
        </div>

        <section className="auth-glass-card animate-soft-glow rounded-[28px] p-8 shadow-2xl md:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Verify Your Email
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              We&apos;ve sent a 6-digit code to your email.
              <br />
              Please enter it below.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div
              className="grid grid-cols-6 gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  autoFocus={index === 0}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="auth-minimal-input h-14 w-full min-w-0 rounded-xl text-center text-xl font-bold text-slate-900 dark:text-white sm:h-16"
                />
              ))}
            </div>

            <button
              type="submit"
              className="blue-gradient-btn w-full rounded-xl py-4 font-semibold text-white"
            >
              Verify Code
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Didn&apos;t receive the code?
            <button
              type="button"
              className="ml-1 font-medium text-blue-500 transition hover:text-blue-400"
            >
              Resend
            </button>
          </div>
        </section>

        <div className="mt-12 text-center text-xs text-slate-500 dark:text-slate-500">
          © 2025 Mahimedia Solutions
        </div>
      </main>
    </AuthLayout>
  );
}