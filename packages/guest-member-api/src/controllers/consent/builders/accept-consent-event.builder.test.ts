// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { UTCDate } from '@phx/common/src/utils/date-time-helper';
import { IHealthRecordEvent } from '../../../models/health-record-event';
import { IConsentEvent } from '../../../models/consent-event';
import { getSessionIdFromRequest } from '../../../utils/health-record-event/get-sessionid-from-request';
import { fetchRequestHeader } from '../../../utils/request-helper';
import { acceptConsentEventBuilder } from './accept-consent-event.builder';
import { mapServiceTypeToEventType } from '../../../utils/service-to-event-type-map.helper';
import { ServiceTypes } from '@phx/common/src/models/provider-location';
import { getLoggedInUserProfileForRxGroupType } from '../../../utils/person/get-dependent-person.helper';

jest.mock('@phx/common/src/utils/date-time-helper');
const UTCDateMock = UTCDate as jest.Mock;

jest.mock('../../../utils/health-record-event/get-sessionid-from-request');
const getSessionIdFromRequestMock = getSessionIdFromRequest as jest.Mock;

jest.mock('../../../utils/request-helper');
const fetchRequestHeaderMock = fetchRequestHeader as jest.Mock;

jest.mock('../../../utils/service-to-event-type-map.helper');
const mapServiceTypeToEventTypeMock = mapServiceTypeToEventType as jest.Mock;

jest.mock('../../../utils/person/get-dependent-person.helper');
const getLoggedInUserProfileForRxGroupTypeMock =
  getLoggedInUserProfileForRxGroupType as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  getLoggedInUserProfileForRxGroupTypeMock.mockReturnValue({
    primaryMemberRxId: 'fake-rx-member-id',
  });
});

describe('acceptConsentEventBuilder', () => {
  it('should create consent healthrecord event', () => {
    const requestMock = {
      query: { servicetype: ServiceTypes.covid },
      app: {
        locals: {
          personInfo: {
            primaryMemberRxId: 'fake-rx-member-id',
          },
          accountIdentifier: 'fake-account-id',
        },
      },
      connection: {
        remoteAddress: '192.168.10.3',
      },
      headers: {
        authorization: 'token',
      },
    } as unknown as Request;
    const responseMock = {
      locals: {
        personInfo: {
          primaryMemberRxId: 'fake-rx-member-id',
        },
        accountIdentifier: 'fake-account-id',
      },
    } as unknown as Response;
    mapServiceTypeToEventTypeMock.mockReturnValue('consent/pcr');
    const healthRecordEventMock = {
      identifiers: [
        { type: 'primaryMemberRxId', value: 'fake-rx-member-id' },
        {
          type: 'accountIdentifier',
          value: 'fake-account-id',
        },
      ],
      createdOn: 1590954515,
      createdBy: 'rxassistant-api',
      tags: ['fake-rx-member-id'],
      eventType: 'consent/pcr',
      eventData: {
        acceptedDateTime: '1590954515',
        authToken: 'token',
        browser: 'chrome',
        fromIP: '192.168.10.3',
        sessionId: 'fake-session-id',
      },
    } as IHealthRecordEvent<IConsentEvent>;
    getSessionIdFromRequestMock.mockReturnValueOnce('fake-session-id');
    fetchRequestHeaderMock.mockReturnValue('chrome');
    UTCDateMock.mockReturnValue(1590954515);
    expect(
      acceptConsentEventBuilder(
        requestMock,
        responseMock,
        'COVID-19 Antibody Testing'
      )
    ).toStrictEqual(healthRecordEventMock);
    expect(UTCDateMock).toHaveBeenCalled();
    expect(mapServiceTypeToEventTypeMock).toHaveBeenCalled();
    expect(fetchRequestHeaderMock).toHaveBeenCalled();
    expect(getSessionIdFromRequestMock).toHaveBeenCalled();
    expect(getLoggedInUserProfileForRxGroupTypeMock).toHaveBeenCalledWith(
      responseMock,
      'CASH'
    );
  });

  it('should create consent healthrecord event object using request with PrimaryMemberRxId as null', () => {
    const requestWithOutPrimaryMemberRxIdMock = {
      query: {
        servicetype: ServiceTypes.antigen,
      } as unknown,
      connection: {
        remoteAddress: '192.168.10.3',
      },
      headers: {
        authorization: 'token',
      },
    } as Request;
    const responseMock = {
      locals: {
        personInfo: {},
        accountIdentifier: 'fake-account-id',
      },
    } as unknown as Response;
    const healthRecordWithOutPrimaryMemberRxIdEventMock = {
      identifiers: [
        {
          type: 'accountIdentifier',
          value: 'fake-account-id',
        },
      ],
      createdOn: 1590954515,
      createdBy: 'rxassistant-api',
      tags: [],
      eventType: 'consent/antigen',
      eventData: {
        acceptedDateTime: '1590954515',
        authToken: 'token',
        browser: 'chrome',
        fromIP: '192.168.10.3',
        sessionId: 'fake-session-id',
      },
    } as IHealthRecordEvent<IConsentEvent>;
    mapServiceTypeToEventTypeMock.mockReturnValue('consent/antigen');
    getSessionIdFromRequestMock.mockReturnValueOnce('fake-session-id');
    fetchRequestHeaderMock.mockReturnValue('chrome');
    UTCDateMock.mockReturnValue(1590954515);
    getLoggedInUserProfileForRxGroupTypeMock.mockReturnValueOnce(undefined);
    expect(
      acceptConsentEventBuilder(
        requestWithOutPrimaryMemberRxIdMock,
        responseMock,
        'COVID-19 Antigen Testing'
      )
    ).toStrictEqual(healthRecordWithOutPrimaryMemberRxIdEventMock);
    expect(UTCDateMock).toHaveBeenCalled();
    expect(fetchRequestHeaderMock).toHaveBeenCalled();
    expect(getSessionIdFromRequestMock).toHaveBeenCalled();
  });
});
