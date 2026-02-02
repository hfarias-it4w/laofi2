export function getAdminEmails(): string[] {
  const emails = process.env.ADMIN_EMAILS || "";
  return emails.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.toLowerCase().trim());
}
