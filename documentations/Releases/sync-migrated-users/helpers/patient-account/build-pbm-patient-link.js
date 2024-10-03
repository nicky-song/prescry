// Copyright 2022 Prescryptive Health, Inc.

export function buildPbmPatientLink(masterId) {
  return masterId
    ? [
        {
          other: {
            reference: `patient/${masterId}`,
          },
          type: 'seealso',
        },
      ]
    : null;
}
