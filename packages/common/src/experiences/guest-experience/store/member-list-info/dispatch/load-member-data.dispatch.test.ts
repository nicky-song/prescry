// Copyright 2018 Prescryptive Health, Inc.

import { expectToHaveBeenCalledOnceOnlyWith } from '../../../../../testing/test.helper';
import { handleRedirectSuccessResponse } from '../../../api/api-v1-helper';
import { updateTelemetryId } from '../../../guest-experience-logger.middleware';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { handleAuthenticationErrorAction } from '../../error-handling.actions';
import { getMemberInfoDispatch } from './get-member-info.dispatch';
import { loadMemberDataDispatch } from './load-member-data.dispatch';

jest.mock('../../error-handling.actions');
const handleAuthenticationErrorActionMock =
  handleAuthenticationErrorAction as jest.Mock;

jest.mock('./get-member-info.dispatch');
const getMemberInfoDispatchMock = getMemberInfoDispatch as jest.Mock;

jest.mock('../../../guest-experience-logger.middleware');
const updateTelemetryIdMock = updateTelemetryId as jest.Mock;

jest.mock('../../../api/api-v1-helper');
const handleRedirectSuccessResponseMock =
  handleRedirectSuccessResponse as jest.Mock;

describe('loadMemberDataDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    handleRedirectSuccessResponseMock.mockReset();
    updateTelemetryIdMock.mockReset();
    handleAuthenticationErrorActionMock.mockReset();
    getMemberInfoDispatchMock.mockReset();
  });

  it('redirects authentication error action if no token', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      settings: {
        token: undefined,
      },
    });

    const result = await loadMemberDataDispatch(
      dispatch,
      getState,
      rootStackNavigationMock
    );
    expect(result).toEqual(true);

    expectToHaveBeenCalledOnceOnlyWith(
      handleAuthenticationErrorActionMock,
      dispatch,
      rootStackNavigationMock
    );

    expect(updateTelemetryIdMock).not.toHaveBeenCalled();
    expect(getMemberInfoDispatchMock).not.toHaveBeenCalled();
    expect(handleRedirectSuccessResponseMock).not.toHaveBeenCalled();
  });

  it('updates telemetry id if logged in', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      settings: {
        token: 'something',
      },
      telemetry: {
        memberInfoRequestId: 'else',
      },
    });
    getMemberInfoDispatchMock.mockResolvedValue({});

    await loadMemberDataDispatch(dispatch, getState, rootStackNavigationMock);

    expect(handleAuthenticationErrorActionMock).not.toHaveBeenCalled();
    expectToHaveBeenCalledOnceOnlyWith(updateTelemetryIdMock, 'else');
  });

  it('redirects to responseCode if returned from getMemberInfo', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      settings: {
        token: 'something',
      },
      telemetry: {
        memberInfoRequestId: 'else',
      },
    });
    const response = {
      responseCode: 'code',
    };
    getMemberInfoDispatchMock.mockResolvedValue(response);

    const memberInfoResponseDataLoggerMock = jest.fn();
    const redirected = await loadMemberDataDispatch(
      dispatch,
      getState,
      rootStackNavigationMock,
      memberInfoResponseDataLoggerMock
    );
    expect(redirected).toEqual(true);

    expect(handleAuthenticationErrorActionMock).not.toHaveBeenCalled();

    expectToHaveBeenCalledOnceOnlyWith(
      getMemberInfoDispatchMock,
      dispatch,
      getState,
      undefined,
      memberInfoResponseDataLoggerMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      handleRedirectSuccessResponseMock,
      response,
      dispatch,
      rootStackNavigationMock
    );
  });

  it('does not redirect to responseCode if not returned from getMemberInfo', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      settings: {
        token: 'something',
      },
      telemetry: {
        memberInfoRequestId: 'else',
      },
    });
    const response = {
      responseCode: undefined,
    };
    getMemberInfoDispatchMock.mockResolvedValue(response);

    const memberInfoResponseDataLoggerMock = jest.fn();

    const redirected = await loadMemberDataDispatch(
      dispatch,
      getState,
      rootStackNavigationMock,
      memberInfoResponseDataLoggerMock
    );
    expect(redirected).toEqual(false);

    expect(handleAuthenticationErrorActionMock).not.toHaveBeenCalled();
    expectToHaveBeenCalledOnceOnlyWith(
      getMemberInfoDispatchMock,
      dispatch,
      getState,
      undefined,
      memberInfoResponseDataLoggerMock
    );
    expect(handleRedirectSuccessResponseMock).not.toHaveBeenCalled();
  });
});
