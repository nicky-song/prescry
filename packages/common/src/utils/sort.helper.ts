// Copyright 2018 Prescryptive Health, Inc.

export const sortAndFilterContactsBasedOnMinimumAge = <
  TContactInfo extends { firstName?: string; lastName?: string; age?: number }
>(
  contacts: TContactInfo[],
  minimumAge = 0
): TContactInfo[] => {
  return contacts
    .filter((contact) => contact.age && contact.age >= minimumAge)
    .sort((x, y) => {
      const a = x.firstName ?? '';
      const b = y.firstName ?? '';
      return a === b ? 0 : a > b ? 1 : -1;
    });
};
