// Copyright 2021 Prescryptive Health, Inc.

export function maskPhoneNumber(phoneNumber: string) {
  const unmaskedDigits = phoneNumber.slice(phoneNumber.length - 4);
  return `(XXX) XXX-${unmaskedDigits}`;
}

export function maskEmail(email: string) {
  const emailPieces = email.split('@');
  const firstChar = email.charAt(0);
  const lastChar = emailPieces[0].charAt(emailPieces[0].length - 1);
  return `${firstChar}${'*'.repeat(5)}${lastChar}@${emailPieces[1]}`;
}
