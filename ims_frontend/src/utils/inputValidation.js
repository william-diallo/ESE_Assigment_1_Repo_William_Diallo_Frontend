const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const XSS_PATTERN = /<|>|javascript:|on\w+\s*=|&lt;|&gt;/i;
const SQLI_PATTERN =
  /('|--|;|\/\*|\*\/|\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|EXEC)\b)/i;

export function isValidEmail(value) {
  return EMAIL_REGEX.test(String(value || "").trim());
}

export function hasUnsafeInput(value) {
  const normalized = String(value || "");
  return XSS_PATTERN.test(normalized) || SQLI_PATTERN.test(normalized);
}

export function hasUnsafeInputInObject(values) {
  return Object.values(values).some((value) => hasUnsafeInput(value));
}
