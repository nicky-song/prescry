// Copyright 2020 Prescryptive Health, Inc.

import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import {
  getAvailableSlots,
  ICalendarAvailabilityResponse,
} from '../../../api/api-v1.get-available-slots';
import { setCalendarStatusAction } from '../actions/set-calendar-status.action';
import { getAvailabilityDispatch } from './get-availability.dispatch';
import { IAvailableSlotsRequestBody } from '../../../../../models/api-request-body/available-slots.request-body';

jest.mock('../../../api/api-v1.get-available-slots', () => ({
  getAvailableSlots: jest
    .fn()
    .mockResolvedValue({ data: { slots: [], unAvailableDays: [] } }),
}));
const getAvailableSlotsMock = getAvailableSlots as jest.Mock;

const authTokenMock = 'auth_token';
const deviceTokenMock = 'device_token';

const defaultStateMock = {
  config: {
    apis: {},
  },
  features: {},
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
};
const getStateMock = jest.fn();
const availableSlotRequestBody: IAvailableSlotsRequestBody = {
  locationId: 'mock-location-id',
  serviceType: 'mock-service-type',
  start: '2020-06-22T08:00:00',
  end: '2020-06-30T08:00:00',
};
describe('getAvailabilityDispatch', () => {
  beforeEach(() => {
    getStateMock.mockReset();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('calls getAvailableSlots API with expected arguments', async () => {
    const guestExperienceApiMock = 'guestExperienceApiMock';

    const stateMock = {
      ...defaultStateMock,
      config: {
        apis: {
          guestExperienceApi: guestExperienceApiMock,
        },
      },
    };
    getStateMock.mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    await getAvailabilityDispatch(
      dispatchMock,
      getStateMock,
      availableSlotRequestBody
    );

    expect(getAvailableSlotsMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      availableSlotRequestBody,
      authTokenMock,
      deviceTokenMock,
      getEndpointRetryPolicy
    );
  });
  it('dispatches getAvailableSlots API response', async () => {
    const mockAvailableSlotResponse: ICalendarAvailabilityResponse = {
      slots: [
        {
          start: '2020-06-22T08:00:00',
          slotName: '8:15 am',
          day: '2020-06-22',
        },
      ],
      markedDates: {
        '2020-06-22': {
          disabled: true,
          disableTouchEvent: true,
        },
      },
    };

    getAvailableSlotsMock.mockResolvedValue(mockAvailableSlotResponse);

    const dispatchMock = jest.fn();
    await getAvailabilityDispatch(
      dispatchMock,
      getStateMock,
      availableSlotRequestBody
    );
    const responseAction = setCalendarStatusAction(mockAvailableSlotResponse);
    expect(dispatchMock).toHaveBeenCalledWith(responseAction);
  });
});
