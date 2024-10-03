// Copyright 2021 Prescryptive Health, Inc.

import { ErrorBadRequest } from '../../../../../errors/error-bad-request';
import { IAvailableSlot } from '../../../../../models/api-response/available-slots-response';
import { ILockSlotResponse } from '../../../../../models/api-response/lock-slot-response';
import { lockSlot } from '../../../api/api-v1.lock-slots';
import { unlockSlot } from '../../../api/api-v1.unlock-slots';
import { appointmentsStackNavigationMock } from '../../../navigation/stack-navigators/appointments/_mocks/appointments.stack-navigation.mock';
import { handlePostLoginApiErrorsAction } from '../../navigation/dispatch/navigate-post-login-error.dispatch';
import { tokenUpdateDispatch } from '../../settings/dispatch/token-update.dispatch';
import { changeSlotErrorAction } from '../actions/change-slot-error.action';
import { ISelectedSlot } from '../actions/change-slot.action';
import { changeSlotDispatch } from './change-slot.dispatch';

jest.mock('../../../api/api-v1.lock-slots');
jest.mock('../../../api/api-v1.unlock-slots');
jest.mock('../../settings/dispatch/token-update.dispatch');

jest.mock('../../navigation/dispatch/navigate-post-login-error.dispatch');
const handlePostLoginApiErrorsActionMock =
  handlePostLoginApiErrorsAction as jest.Mock;

const lockSlotMock = lockSlot as jest.Mock;
const unlockSlotMock = unlockSlot as jest.Mock;
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

const deviceTokenMock = 'device_token';
const authTokenMock = 'auth_token';

const defaultStateMock = {
  config: {
    apis: {},
    payments: {},
  },
  settings: {
    deviceToken: deviceTokenMock,
    token: authTokenMock,
  },
  appointment: {
    currentSlot: {
      bookingId: 'current-slot-mock-id',
    } as ISelectedSlot | undefined,
    selectedLocation: {
      id: 'location-mock-id',
      timezone: 'America/New_York',
    },
    selectedService: {
      serviceType: 'mock-service-type',
    },
  },
  memberProfile: {
    account: {
      phoneNumber: '12061234567',
    },
  },
  memberListInfo: {
    loggedInMember: {
      phoneNumber: 'fallback-phoneNumber',
    },
  },
};

const guestExperienceApiMock = 'guestExperienceApiMock';
const getStateMock = jest.fn();

const selectedSlot = {
  start: '2021-05-17T15:00:00',
  slotName: '3:00 pm',
  day: '2021-05-17',
} as IAvailableSlot;

function generateStateMock() {
  const stateMock = {
    ...defaultStateMock,
    config: {
      ...defaultStateMock.config,
      apis: {
        ...defaultStateMock.config.apis,
        guestExperienceApi: guestExperienceApiMock,
      },
    },
  };
  return stateMock;
}

describe('changeSlotDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStateMock.mockReturnValue(defaultStateMock);
  });

  it('calls lockSlot & unlock API with expected arguments', async () => {
    // Arrange
    const dispatchMock = jest.fn();
    const stateMock = generateStateMock();
    getStateMock.mockReturnValue(stateMock);

    const lockSlotResponse = {
      data: {
        bookingId: 'mock-test-booking-id',
        slotExpirationDate: new Date(new Date('2021-05-17T15:05:00')),
      },
      message: 'ok',
      status: 'success',
      refreshToken: '4214',
    } as ILockSlotResponse;

    lockSlotMock.mockResolvedValueOnce(lockSlotResponse);
    unlockSlotMock.mockResolvedValueOnce({ refreshToken: '123456' });

    // Act
    await changeSlotDispatch(
      dispatchMock,
      getStateMock,
      selectedSlot,
      appointmentsStackNavigationMock
    );

    // Assert
    expect(unlockSlotMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      'current-slot-mock-id',
      authTokenMock,
      deviceTokenMock
    );
    expect(lockSlotMock).toHaveBeenCalledWith(
      guestExperienceApiMock,
      {
        locationId: 'location-mock-id',
        startDate: new Date('2021-05-17T19:00:00.000Z'),
        customerPhoneNumber: '12061234567',
        serviceType: 'mock-service-type',
      },
      authTokenMock,
      deviceTokenMock
    );

    expect(tokenUpdateDispatchMock).toHaveBeenCalledTimes(2);
    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(dispatchMock, '4214');
    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      '123456'
    );
  });

  it('call handlePostLoginApiErrorsAction when there is a non ErrorBadRequest error during API calls', async () => {
    // Arrange
    const dispatchMock = jest.fn();
    const stateMock = generateStateMock();
    getStateMock.mockReturnValue(stateMock);

    unlockSlotMock.mockResolvedValueOnce({ refreshToken: '123456' });
    const errorMock = new Error('internal-error-mock');
    lockSlotMock.mockImplementation(() => {
      throw errorMock;
    });

    // Act
    await changeSlotDispatch(
      dispatchMock,
      getStateMock,
      selectedSlot,
      appointmentsStackNavigationMock
    );

    // Assert
    expect(handlePostLoginApiErrorsActionMock).toBeCalledWith(
      errorMock,
      dispatchMock,
      appointmentsStackNavigationMock
    );
  });

  it('dispatch changeSlotErrorAction when there is a ErrorBadRequest error during API calls', async () => {
    // Arrange
    const dispatchMock = jest.fn();
    const stateMock = generateStateMock();
    getStateMock.mockReturnValue(stateMock);

    unlockSlotMock.mockResolvedValueOnce({ refreshToken: '123456' });

    const responseChangeSlotErrorAction = changeSlotErrorAction(
      'Oops, the time you selected is already taken. Please pick another time.'
    );

    lockSlotMock.mockImplementation(() => {
      throw new ErrorBadRequest('ErrorBadRequest-error-mock');
    });

    // Act
    await changeSlotDispatch(
      dispatchMock,
      getStateMock,
      selectedSlot,
      appointmentsStackNavigationMock
    );

    // Assert
    expect(dispatchMock).toHaveBeenCalledWith(responseChangeSlotErrorAction);
    expect(handlePostLoginApiErrorsActionMock).not.toBeCalled();
  });

  test.each([undefined, ''])(
    `call lock slot API with fallback phoneNumber if memberProfile.account.phoneNumber is %s`,
    async (phoneNumber) => {
      // Arrange
      defaultStateMock.memberProfile.account.phoneNumber =
        phoneNumber as string;
      const dispatchMock = jest.fn();
      const stateMock = generateStateMock();
      getStateMock.mockReturnValue(stateMock);

      const lockSlotResponse = {
        data: {
          bookingId: 'mock-test-booking-id',
          slotExpirationDate: new Date(new Date('2021-05-17T15:05:00')),
        },
        message: 'ok',
        status: 'success',
        refreshToken: '4214',
      } as ILockSlotResponse;

      lockSlotMock.mockResolvedValueOnce(lockSlotResponse);
      unlockSlotMock.mockResolvedValueOnce({ refreshToken: '123456' });
      // Act
      await changeSlotDispatch(
        dispatchMock,
        getStateMock,
        selectedSlot,
        appointmentsStackNavigationMock
      );

      // Assert
      expect(lockSlotMock).toHaveBeenCalled();
      expect(lockSlotMock).toHaveBeenCalledWith(
        guestExperienceApiMock,
        {
          locationId: 'location-mock-id',
          startDate: new Date('2021-05-17T19:00:00.000Z'),
          customerPhoneNumber: 'fallback-phoneNumber',
          serviceType: 'mock-service-type',
        },
        authTokenMock,
        deviceTokenMock
      );
    }
  );
});
