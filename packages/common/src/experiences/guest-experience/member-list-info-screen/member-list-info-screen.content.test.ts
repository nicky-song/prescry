// Copyright 2021 Prescryptive Health, Inc.

import {
  IMemberInfoListScreenContent,
  memberInfoListScreenContent,
} from './member-list-info-screen.content';

describe('memberInfoListScreenContent', () => {
  it('has expected content', () => {
    const expectedContent: IMemberInfoListScreenContent = {
      dependentMembersUnder13: 'Dependent members under 13',
    };

    expect(memberInfoListScreenContent).toEqual(expectedContent);
  });
});
