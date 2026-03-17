export function slugify(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function generateUniqueSlug(name, suffix = "") {
  const base = slugify(name);
  if (!suffix) return base;

  return `${base}-${String(suffix).trim().toLowerCase()}`;
}