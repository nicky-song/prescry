// Copyright 2022 Prescryptive Health, Inc.

import { IHours } from '@phx/common/src/models/date-time/hours';
import { IPrescriptionPharmacyHours } from '../models/platform/pharmacy-lookup.response';

export const convertHours = (
  pharmacyHours: IPrescriptionPharmacyHours[]
): IHours[] => {
  const hours: IHours[] = [];

  pharmacyHours.map((x) => {
    hours.push({
      day: x.day,
      opens: x.opens
        ? { h: x.opens.hours, m: x.opens.minutes, pm: x.opens.pm }
        : undefined,
      closes: x.closes
        ? { h: x.closes.hours, m: x.closes.minutes, pm: x.closes.pm }
        : undefined,
    });
  });
  return hours;
};
