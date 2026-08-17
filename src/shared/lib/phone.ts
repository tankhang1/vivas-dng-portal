function normalizePhoneDigits(value: string) {
  return value.replace(/[^\d]/g, '');
}

export function normalizeVietnamPhoneNumber(value: string) {
  const digits = normalizePhoneDigits(value);

  if (digits.startsWith('84') && digits.length === 11) {
    return `0${digits.slice(2)}`;
  }

  return digits;
}

export function isVietnamPhoneNumber(value: string) {
  const normalized = normalizeVietnamPhoneNumber(value);
  return /^(03|05|07|08|09)\d{8}$/.test(normalized);
}

