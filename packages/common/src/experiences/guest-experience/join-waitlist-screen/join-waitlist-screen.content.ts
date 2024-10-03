// Copyright 2021 Prescryptive Health, Inc.

export const JoinWaitlistScreenContent = {
  headerText: `Join waitlist`,
  instructions: `By joining a waitlist, you could be invited from any number of pharmacies within the distance you specify below.`,
  joinButtonLabel: `Join`,
  interestedIn: `Service interested in`,
  zipCodePlaceholder: `Enter zip code`,
  toggleOptionMyself: `Myself`,
  toggleOptionOtherPerson: `Another person`,
  toggleHeaderText: `Who would you like to add to the waitlist?`,
  searchDistanceText: `Search up to`,
  zipCodeText: `Zip code`,
  phoneNumberPlaceholder: '(999) 999-9999',
  phoneNumberLength: 10,
  firstNameText: 'First name',
  lastNameText: 'Last name',
  dateOfBirthText: 'Date of birth',
  phoneNumberText: 'Mobile phone no.',
  otherPersonConsentText: `We will inform the person that you have added them to the waitlist.`,
  zipCodeLength: 5,
  mileOptionsList: [5, 10, 25, 50],
  distance: (mileOption: number) =>
    `${mileOption} mile${mileOption !== 1 ? 's' : ''}`,
};
