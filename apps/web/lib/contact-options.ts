/** Contact-form choices shared by the form, the API route and the emails. */

export const ROLES = [
  { value: "owner", label: "Business owner" },
  { value: "agency", label: "Agency or partner" },
  { value: "other", label: "Something else" },
] as const;

export const NEEDS = [
  { value: "booking", label: "Booking system" },
  { value: "ordering", label: "Ordering & inventory" },
  { value: "internal", label: "Internal tool" },
  { value: "messenger", label: "Messenger automation" },
  { value: "website", label: "Website" },
  { value: "unsure", label: "Not sure yet" },
] as const;

export const BUDGETS = [
  { value: "under-50k", label: "Under ₱50k" },
  { value: "50k-100k", label: "₱50k–₱100k" },
  { value: "100k-250k", label: "₱100k–₱250k" },
  { value: "250k-plus", label: "₱250k+" },
  { value: "unsure", label: "Not sure yet" },
] as const;

export type Role = (typeof ROLES)[number]["value"];
export type Need = (typeof NEEDS)[number]["value"];
export type Budget = (typeof BUDGETS)[number]["value"];

export const values = <T extends readonly { value: string }[]>(list: T) =>
  list.map((o) => o.value) as unknown as [T[number]["value"], ...T[number]["value"][]];

export const labelOf = (list: readonly { value: string; label: string }[], value?: string) =>
  list.find((o) => o.value === value)?.label ?? value ?? "";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** "0917 123 4567", "+63 917-123-4567", "639171234567" → "+639171234567". */
export function normalizePhMobile(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, "");
  const m = digits.match(/^(?:\+?63|0)(9\d{9})$/);
  return m ? `+63${m[1]}` : null;
}

/** Splits the "Email or mobile number" field into whichever it is. */
export function parseContact(input: string): { email?: string; phone?: string } | null {
  const v = input.trim();
  if (EMAIL.test(v) && !/[\r\n]/.test(v)) return { email: v };
  const phone = normalizePhMobile(v);
  return phone ? { phone } : null;
}
