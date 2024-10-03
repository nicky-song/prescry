// Copyright 2023 Prescryptive Health, Inc.

export const generateAppointmentUrl = (
  baseURL: string,
  orderNumber: string,
  phone: { dialingCode: string; phoneNumber: string },
  features?: {
    [key: string]: string;
  }
) => {
  const stringToEncode = `${orderNumber} ${phone.dialingCode}${phone.phoneNumber}`;
  const appointmentUrlSecret = Buffer.from(stringToEncode).toString('base64');
  let retValue = `${baseURL}/appointment/${appointmentUrlSecret}`;
  if (features) {
    let firstFeature = true;
    for (const key in features) {
      retValue += `${firstFeature ? '?f=' : '&'}${key}:${features[key]}`;
      if (firstFeature) {
        firstFeature = false;
      }
    }
  }
  return retValue;
};
