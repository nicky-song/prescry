// Copyright 2018 Prescryptive Health, Inc.

export function convertBase64ToBinary(
  base64StringWithLiteralLineBreaks: string
) {
  const base64String = base64StringWithLiteralLineBreaks.replace(/\\n/g, '\n');
  const pfx = Buffer.from(base64String, 'base64');
  return pfx;
}
