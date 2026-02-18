export function isAdminSubdomain() {
  const host = window.location.hostname;

  // contoh: admin.localhost atau admin.domain.com
  return host.startsWith("admin.");
}