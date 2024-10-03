// Copyright 2018 Prescryptive Health, Inc.

import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { Request } from 'express';
import { ITermsAndConditionsWithAuthTokenAcceptance } from '../models/terms-and-conditions-acceptance-info';
import { buildTermsAndConditionsAcceptance } from './terms-and-conditions.helper';

jest.mock('@phx/common/src/utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

describe('buildTermsAndConditionsAcceptance', () => {
  it('returns termsAndConditionsAcceptances object', () => {
    const nowMock = new Date();
    getNewDateMock.mockReturnValue(nowMock);

    const requestMock = {
      socket: {
        remoteAddress: '110.10.10.3',
      },
      headers: {
        'user-agent': 'chrome',
      },
    } as Request;

    const tokenMock = 'token';

    const termsAndConditionsAcceptance = buildTermsAndConditionsAcceptance(
      requestMock,
      tokenMock
    );

    const expectedAcceptance: ITermsAndConditionsWithAuthTokenAcceptance = {
      acceptedDateTime: nowMock.toISOString(),
      allowEmailMessages: true,
      allowSmsMessages: true,
      authToken: tokenMock,
      browser: requestMock.headers['user-agent'],
      fromIP: requestMock.socket.remoteAddress,
      hasAccepted: true,
    };
    expect(termsAndConditionsAcceptance).toEqual(expectedAcceptance);
  });
});
