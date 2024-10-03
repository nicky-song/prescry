// Copyright 2022 Prescryptive Health, Inc.

import { IHumanName } from '../../models/fhir/human-name';
import { NameUse } from '../../models/fhir/types';

export const getHumanName = (
  names: IHumanName[] = [],
  nameUse: NameUse
): IHumanName | undefined => {
  const foundName = names.find((name) => name.use === nameUse);
  if (foundName) {
    return foundName;
  }

  return nameUse === 'official' ? names.find((name) => !name.use) : undefined;
};

export const buildFirstName = (name: IHumanName | undefined): string =>
  name?.given ? name.given.join(' ') : '';

export const splitFirstName = (firstName = ''): string[] =>
  firstName.split(' ').filter((name) => name.length);

export const buildLastName = (name: IHumanName | undefined): string =>
  name?.family ?? '';

export const matchFirstName = (
  userFirstName: string,
  humanName: IHumanName[]
): IHumanName | undefined => {
  return humanName.find(
    (name) => buildFirstName(name).toUpperCase() === userFirstName.toUpperCase()
  );
};
