// Copyright 2018 Prescryptive Health, Inc.

import { IHours } from '../models/date-time/hours';

export const DaysMap = new Map<string, string>([
  ['sun', 'Sunday'],
  ['mon', 'Monday'],
  ['tue', 'Tuesday'],
  ['wed', 'Wednesday'],
  ['thu', 'Thursday'],
  ['fri', 'Friday'],
  ['sat', 'Saturday'],
]);

function convertToDoubleDigit(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

export function convertHoursToMap(hours?: IHours[]) {
  const map = new Map<string, string>();
  if (hours) {
    hours.forEach((hour: IHours) => {
      let pharmacyHours = `closed`;

      if (hour.opens && hour.closes) {
        const openingTime = `${hour.opens.h}:${convertToDoubleDigit(
          hour.opens.m ?? 0
        )} ${hour.opens.pm ? 'pm' : 'am'}`;
        const closingTime = `${hour.closes.h}:${convertToDoubleDigit(
          hour.closes.m ?? 0
        )} ${hour.closes.pm ? 'pm' : 'am'}`;
        pharmacyHours =
          openingTime === closingTime
            ? 'Open 24 hours'
            : `${openingTime} to ${closingTime}`;
      }
      if (hour.day) {
        map.set(
          DaysMap.get(hour.day.toLowerCase()) || 'Unknown',
          pharmacyHours
        );
      }
    });
  }
  return map;
}

export const isOpenNow = (pharmacyHours: IHours[], currentDate: Date) => {
  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const currentTime = currentDate.getTime();

  const todayPharmacyTiming = pharmacyHours[currentDate.getDay()];
  const openHours =
    todayPharmacyTiming &&
    todayPharmacyTiming.opens &&
    todayPharmacyTiming.opens.h &&
    todayPharmacyTiming.opens.h + (todayPharmacyTiming.opens.pm ? 12 : 0);
  const closeHours =
    todayPharmacyTiming &&
    todayPharmacyTiming.closes &&
    todayPharmacyTiming.closes.h &&
    todayPharmacyTiming.closes.h + (todayPharmacyTiming.closes.pm ? 12 : 0);

  const openingTime = new Date(
    year,
    month,
    date,
    openHours,
    (todayPharmacyTiming &&
      todayPharmacyTiming.opens &&
      todayPharmacyTiming.opens.m) ||
      0
  ).getTime();

  const closingTime = new Date(
    year,
    month,
    date,
    closeHours,
    (todayPharmacyTiming &&
      todayPharmacyTiming.closes &&
      todayPharmacyTiming.closes.m) ||
      0
  ).getTime();

  return (
    (openingTime < currentTime && currentTime < closingTime) ||
    openingTime === closingTime
  );
};
export const buildDispenseType = (
  isPharmacyOpenNow: boolean,
  pharmacyHours: IHours[],
  currentDate: Date
): string => {
  const day = currentDate.getDay();
  const opens = pharmacyHours[day].opens;
  const closes = pharmacyHours[day].closes;

  if (isPharmacyOpenNow) {
    if (opens && closes) {
      if (closes.h === opens.h && closes.pm === opens.pm) {
        return `Open 24 hours`;
      }
      return `Closes at ${closes.h} ${closes.pm ? 'pm' : 'am'}`;
    }
    return 'Currently open';
  } else {
    let todayIndex = day + 1;
    todayIndex = todayIndex > 6 ? 0 : todayIndex;
    const tomorrowOpens = pharmacyHours[todayIndex].opens;
    if (tomorrowOpens) {
      return `Opens at ${tomorrowOpens.h} ${tomorrowOpens.pm ? 'pm' : 'am'}`;
    }
    return `Currently closed`;
  }
};
