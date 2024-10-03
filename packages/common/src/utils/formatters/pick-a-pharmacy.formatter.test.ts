// Copyright 2022 Prescryptive Health, Inc.

import pickAPharmacyFormatter from './pick-a-pharmacy.formatter';
import dateFormatter, { IOpenStatusContent } from './date.formatter';
import { IHours } from '../../models/date-time/hours';

jest.mock('./date.formatter', () => ({
  ...jest.requireActual('./date.formatter'),
  formatOpenStatus: jest.fn(),
}));

describe('pickAPharmacyFormatter', () => {
  it('calls dateFormatter formatOpenStatus as expected', () => {
    const nowMock = new Date();
    const hoursMock: IHours[] = [];
    const isOpenTwentyFourHoursMock = true;

    const openStatusContentMock: IOpenStatusContent = {
      closed: 'closed',
      open: 'open',
      open24Hours: 'open-24-hours',
      opensAt: 'opens-at-label',
      closesAt: 'closes-at-label',
    };

    pickAPharmacyFormatter.formatOpenStatus(
      nowMock,
      hoursMock,
      isOpenTwentyFourHoursMock,
      openStatusContentMock
    );

    const openStatusContent: IOpenStatusContent = {
      open24Hours: openStatusContentMock.open24Hours,
      closed: openStatusContentMock.closed,
      open: openStatusContentMock.open,
      opensAt: openStatusContentMock.opensAt,
      closesAt: openStatusContentMock.closesAt,
    };

    expect(dateFormatter.formatOpenStatus).toHaveBeenCalledWith(
      nowMock,
      hoursMock,
      isOpenTwentyFourHoursMock,
      openStatusContent
    );
  });
});
