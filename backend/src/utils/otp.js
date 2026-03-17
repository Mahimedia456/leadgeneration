export function generateOtp(length = 6) {
  return String(Math.floor(Math.random() * 10 ** length)).padStart(length, "0");
}