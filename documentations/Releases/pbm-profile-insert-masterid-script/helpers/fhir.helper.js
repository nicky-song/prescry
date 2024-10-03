// Copyright 2022 Prescryptive Health, Inc.

export const matchFirstName = (userFirstName, humanName) => {
  const firstNameArray = splitFirstName(userFirstName);
  return humanName.find((name) =>
    name.given?.some((element) =>
      firstNameArray.includes(element.toUpperCase())
    )
  );
};

const splitFirstName = (firstName = '') =>
  firstName.split(' ').filter((name) => name.length);
