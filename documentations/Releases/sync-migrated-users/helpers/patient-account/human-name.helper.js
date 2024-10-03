// Copyright 2022 Prescryptive Health, Inc.

export const getHumanName = (names = [], nameUse) =>
  names.find((name) => name.use === nameUse);

export const getFirstHumanName = (names = []) =>
  names.length ? names[0] : undefined;

export const buildFirstName = (name) =>
  name?.given ? name.given.join(' ') : '';

export const splitFirstName = (firstName = '') =>
  firstName.split(' ').filter((name) => name.length);

export const buildLastName = (name) => name?.family ?? '';

export const matchFirstName = (userFirstName, humanName) => {
  return humanName.find((name) =>
    name.given?.find(
      (givenName) => givenName.toUpperCase() === userFirstName.toUpperCase()
    )
  );
};
