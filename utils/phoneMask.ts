export function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15)
}

export function extractDDD(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits.slice(0, 2)
}

export function extractCleanPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}
