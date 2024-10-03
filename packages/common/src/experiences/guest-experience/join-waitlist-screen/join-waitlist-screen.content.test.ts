// Copyright 2021 Prescryptive Health, Inc.

import { JoinWaitlistScreenContent } from './join-waitlist-screen.content';

describe('JoinWaitlistScreenContent', () => {
  it('has expected content', () => {
    expect(JoinWaitlistScreenContent.headerText).toEqual('Join waitlist');
    expect(JoinWaitlistScreenContent.instructions).toEqual(
      `By joining a waitlist, you could be invited from any number of pharmacies within the distance you specify below.`
    );
    expect(JoinWaitlistScreenContent.joinButtonLabel).toEqual('Join');
    expect(JoinWaitlistScreenContent.interestedIn).toEqual(
      'Service interested in'
    );
    expect(JoinWaitlistScreenContent.zipCodePlaceholder).toEqual(
      'Enter zip code'
    );
    expect(JoinWaitlistScreenContent.toggleOptionMyself).toEqual('Myself');
    expect(JoinWaitlistScreenContent.toggleOptionOtherPerson).toEqual(
      'Another person'
    );
    expect(JoinWaitlistScreenContent.toggleHeaderText).toEqual(
      `Who would you like to add to the waitlist?`
    );
    expect(JoinWaitlistScreenContent.searchDistanceText).toEqual(
      'Search up to'
    );
    expect(JoinWaitlistScreenContent.zipCodeText).toEqual('Zip code');
    expect(JoinWaitlistScreenContent.phoneNumberPlaceholder).toEqual(
      '(999) 999-9999'
    );
    expect(JoinWaitlistScreenContent.phoneNumberLength).toEqual(10);
    expect(JoinWaitlistScreenContent.firstNameText).toEqual('First name');
    expect(JoinWaitlistScreenContent.lastNameText).toEqual('Last name');
    expect(JoinWaitlistScreenContent.dateOfBirthText).toEqual('Date of birth');
    expect(JoinWaitlistScreenContent.phoneNumberText).toEqual(
      'Mobile phone no.'
    );
    expect(JoinWaitlistScreenContent.otherPersonConsentText).toEqual(
      `We will inform the person that you have added them to the waitlist.`
    );
    expect(JoinWaitlistScreenContent.zipCodeLength).toEqual(5);
    expect(JoinWaitlistScreenContent.mileOptionsList).toEqual([5, 10, 25, 50]);
    expect(JoinWaitlistScreenContent.distance(9)).toEqual('9 miles');
    expect(JoinWaitlistScreenContent.distance(1)).toEqual('1 mile');
  });
});
