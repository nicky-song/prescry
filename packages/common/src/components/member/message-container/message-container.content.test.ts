// Copyright 2020 Prescryptive Health, Inc.

import { messageContainerContent } from './message-container.content';

describe('messageContainerContent', () => {
  it('has expected content', () => {
    expect(messageContainerContent.defaultHeaderText).toEqual('');
    expect(messageContainerContent.defaultBodyText).toEqual(
      `Vaccine supply is currently limited and therefore subject to strict prioritization. Please verify that you are eligible per your state guidelines before scheduling an appointment.
  You will be denied at the pharmacy if you are not in your state’s current priority group.`
    );
  });
});
