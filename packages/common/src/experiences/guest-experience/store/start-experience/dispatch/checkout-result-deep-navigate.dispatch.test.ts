// Copyright 2020 Prescryptive Health, Inc.

import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { checkoutResultDeepNavigateDispatch } from './checkout-result-deep-navigate.dispatch';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { dispatchResetStackToFatalErrorScreen } from '../../navigation/navigation-reducer.actions';
import {
  guestExperienceCustomEventLogger,
  updateTelemetryId,
} from '../../../guest-experience-logger.middleware';
import { navigateAppointmentDetailsScreenDispatch } from '../../navigation/dispatch/navigate-appointment-details-screen-dispatch';
import { cancelBookingDispatch } from '../../appointment/dispatch/cancel-booking.dispatch';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { popToTop } from '../../../navigation/navigation.helper';

jest.mock('../../appointment/dispatch/cancel-booking.dispatch');
const cancelBookingDispatchMock = cancelBookingDispatch as jest.Mock;

jest.mock('../../member-list-info/dispatch/load-member-data.dispatch');
const loadMemberDataDispatchMock = loadMemberDataDispatch as jest.Mock;

jest.mock(
  '../../navigation/dispatch/navigate-appointment-details-screen-dispatch'
);
const navigateAppointmentDetailsScreenDispatchMock =
  navigateAppointmentDetailsScreenDispatch as jest.Mock;

jest.mock('../../../guest-experience-logger.middleware');
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;
const updateTelemetryIdMock = updateTelemetryId as jest.Mock;

jest.mock('../../root-navigation.actions');
const handleKnownAuthenticationErrorActionMock =
  handleKnownAuthenticationErrorAction as jest.Mock;

jest.mock('../../navigation/navigation-reducer.actions');
const dispatchResetStackToFatalErrorScreenMock =
  dispatchResetStackToFatalErrorScreen as jest.Mock;

jest.mock('../../../navigation/navigation.helper');
const popToTopMock = popToTop as jest.Mock;

describe('checkoutResultsDeepNavigateDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not dispatch if login is required', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    loadMemberDataDispatchMock.mockResolvedValue(true);

    await checkoutResultDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
    expect(loadMemberDataDispatchMock).toBeCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );

    expect(navigateAppointmentDetailsScreenDispatchMock).not.toHaveBeenCalled();
  });

  it('navigates to appointment screen if checkout result type is appointment', async () => {
    const p = {
      productType: 'appointment',
      orderNumber: '1234',
      sessionId: '5678',
      result: 'success',
      operationId: 'operation-id',
    };

    const state = {
      config: {
        location: {
          search: `?s=${p.sessionId}&r=${p.result}&p=${p.productType}&o=${p.orderNumber}&op=${p.operationId}&f=test:1`,
        },
      },
    };

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue(state);
    loadMemberDataDispatchMock.mockResolvedValue(false);

    await checkoutResultDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );

    expect(popToTopMock).toHaveBeenCalledWith(rootStackNavigationMock);
    expect(navigateAppointmentDetailsScreenDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      p.orderNumber,
      false,
      'success'
    );
  });

  it('dispatches cancel booking when user go back from payment screen', async () => {
    const p = {
      productType: 'appointment',
      orderNumber: '1234',
      sessionId: '5678',
      result: 'cancel',
      operationId: 'operation-id',
    };

    const state = {
      config: {
        location: {
          search: `?s=${p.sessionId}&r=${p.result}&p=${p.productType}&o=${p.orderNumber}&op=${p.operationId}&f=test:1`,
        },
      },
    };

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue(state);
    loadMemberDataDispatchMock.mockResolvedValue(false);

    await checkoutResultDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );

    expect(cancelBookingDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      p.orderNumber
    );
    expect(navigateAppointmentDetailsScreenDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      p.orderNumber,
      false,
      'cancel'
    );
  });

  it('dispatches to fatal stack if checkout session product type is not known', async () => {
    const p = {
      productType: 'UNKNOWN_TYPE',
      orderNumber: '1234',
      sessionId: '5678',
      result: 'success',
      operationId: 'operation-id',
    };

    const state = {
      config: {
        location: {
          search: `?s=${p.sessionId}&r=${p.result}&p=${p.productType}&o=${p.orderNumber}&op=${p.operationId}&f=test:1`,
        },
      },
    };

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue(state);
    loadMemberDataDispatchMock.mockResolvedValue(false);

    await checkoutResultDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );

    expect(dispatchResetStackToFatalErrorScreen).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock
    );
  });

  it('sets operationId from API(if exists) to link pre and post stripe payment process ', async () => {
    const p = {
      productType: 'appointment',
      orderNumber: '1234',
      sessionId: '5678',
      result: 'success',
      operationId: 'operation-id2',
    };

    const state = {
      config: {
        location: {
          search: `?s=${p.sessionId}&r=${p.result}&p=${p.productType}&o=${p.orderNumber}&op=${p.operationId}&f=test:1`,
        },
      },
    };

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue(state);
    loadMemberDataDispatchMock.mockResolvedValue(false);

    await checkoutResultDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
    expect(updateTelemetryIdMock).toHaveBeenCalledWith(p.operationId);
  });

  it('logs the checkout result redirect parameters from stripe', async () => {
    const p = {
      productType: 'appointment',
      orderNumber: '1234',
      sessionId: '5678',
      result: 'success',
      operationId: '',
    };

    const state = {
      config: {
        location: {
          search: `?s=${p.sessionId}&r=${p.result}&p=${p.productType}&o=${p.orderNumber}&op=${p.operationId}&f=test:1`,
        },
      },
    };

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue(state);
    loadMemberDataDispatchMock.mockResolvedValue(false);

    await checkoutResultDeepNavigateDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
    expect(updateTelemetryIdMock).not.toBeCalled();
    expect(guestExperienceCustomEventLoggerMock).toHaveBeenNthCalledWith(
      1,
      'CHECKOUT_SESSION_RESULT_REDIRECT',
      p
    );
  });

  it('handles known authentication errors', async () => {
    const dispatchMock = jest.fn();
    const error = Error('Boom!');

    loadMemberDataDispatchMock.mockImplementation(() => {
      throw error;
    });
    handleKnownAuthenticationErrorActionMock.mockReturnValue(true);

    await checkoutResultDeepNavigateDispatch(
      dispatchMock,
      jest.fn(),
      rootStackNavigationMock
    );

    expect(handleKnownAuthenticationErrorActionMock).toHaveBeenCalledWith(
      dispatchMock,
      rootStackNavigationMock,
      error
    );
    expect(dispatchResetStackToFatalErrorScreenMock).not.toHaveBeenCalled();
  });

  it('dispatches reset to fatal error screen', async () => {
    const dispatchMock = jest.fn();

    loadMemberDataDispatchMock.mockImplementation(() => {
      throw Error('Boom!');
    });
    handleKnownAuthenticationErrorActionMock.mockReturnValue(false);

    await checkoutResultDeepNavigateDispatch(
      dispatchMock,
      jest.fn(),
      rootStackNavigationMock
    );

    expect(dispatchResetStackToFatalErrorScreenMock).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
  });
});
