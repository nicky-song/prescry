// Copyright 2018 Prescryptive Health, Inc.

import {
  IPendingPrescription,
  IPendingPrescriptionsList,
} from '../../../../models/pending-prescription';
import { mockTelemetryIds } from '../../__mocks__/pending-prescriptions.mock';
import { RootState } from '../root-reducer';
import {
  PrescriptionsStateActionKeys,
  updatePrescriptionsAction,
  initializePrescriptionsDispatch,
} from './prescriptions-reducer.actions';
import { GuestExperienceConfig } from '../../guest-experience-config';
import { rootStackNavigationMock } from './../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { updateTelemetryId } from './../../guest-experience-logger.middleware';
import { getPendingPrescriptions } from '../../api/api-v1';
import { IGetPendingPrescriptionResponse } from '../../../../models/api-response';
import { ISettings } from '../../guest-experience-settings';
import { ITelemetryState } from '../telemetry/telemetry-reducer';
import { getMemberProfileInfo } from '../../api/api-v1.get-member-profile';
import { IMemberInfoResponse } from '../../../../models/api-response/member-info-response';
import { popToTop } from '../../navigation/navigation.helper';
import { ErrorShowPinFeatureWelcomeScreen } from '../../../../errors/error-show-pin-feature-welcome-screen';
import { internalErrorDispatch } from '../error-handling/dispatch/internal-error.dispatch';

jest.mock('./../../guest-experience-logger.middleware');
const updateTelemetryIdMock = updateTelemetryId as jest.Mock;

jest.mock('../../api/api-v1');
const getPendingPrescriptionsMock = getPendingPrescriptions as jest.Mock;

jest.mock('../../api/api-v1.get-member-profile');
const getMemberProfileInfoMock = getMemberProfileInfo as jest.Mock;

jest.mock('../../api/api-v1', () => ({
  getMemberContactInfo: jest.fn(),
  getPendingPrescriptions: jest.fn().mockImplementation(() => ({
    mockPendingPrescriptionsList,
  })),
}));

jest.mock('../error-handling.actions');

jest.mock('../navigation/navigation-reducer.actions');

jest.mock('../../guest-experience-settings', () => ({
  GuestExperienceSettings: {
    initialState: {
      isDeviceRestricted: true,
    },
  },
}));

jest.mock('../../navigation/navigation.helper');
const popToTopMock = popToTop as jest.Mock;

jest.mock('../error-handling/dispatch/internal-error.dispatch');
const internalErrorDispatchMock = internalErrorDispatch as jest.Mock;

const mockPendingPrescriptionsList = {
  identifier: 'mock-list',
  prescriptions: [
    {
      identifier: 'mock-rx',
    },
  ],
} as IPendingPrescriptionsList;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('updatePrescriptionsAction', () => {
  it('returns UPDATE_PRESCRIPTIONS action', () => {
    const mockPrescriptions: IPendingPrescription[] = [];
    const mockList: IPendingPrescriptionsList = {
      events: [mockTelemetryIds],
      identifier: 'mock',
      prescriptions: mockPrescriptions,
    };
    const result = updatePrescriptionsAction(mockList);
    expect(result).toMatchObject({
      payload: {
        pendingPrescriptionsList: mockList,
      },
      type: PrescriptionsStateActionKeys.UPDATE_PRESCRIPTIONS,
    });
  });
});

describe('initializePrescriptionsDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const pendingPrescriptionResponseMock: Partial<IGetPendingPrescriptionResponse> =
      {
        data: {
          memberIdentifier: 'member-identifier',
          pendingPrescriptionList: {
            identifier: 'pending-prescription-list-identifier',
            prescriptions: [],
          },
        },
      };
    getPendingPrescriptionsMock.mockResolvedValue(
      pendingPrescriptionResponseMock
    );

    const getMemberProfileResponseMock: Partial<IMemberInfoResponse> = {
      memberInfoRequestId: 'get-member-info-request-id',
      data: {
        account: {
          phoneNumber: 'phone-number',
          favoritedPharmacies: [],
        },
        profileList: [],
      },
    };
    getMemberProfileInfoMock.mockResolvedValue(getMemberProfileResponseMock);
  });

  it('should navigate to ClaimAlert on initializePrescriptionsDispatch success', async () => {
    const settingsMock: Partial<ISettings> = {
      deviceToken: 'device-token',
      token: 'account-token',
    };
    const telemetryStateMock: ITelemetryState = {
      memberInfoRequestId: 'telemetry-member-info-request-id',
    };
    const stateMock: Partial<RootState> = {
      config: GuestExperienceConfig,
      settings: settingsMock as ISettings,
      telemetry: telemetryStateMock,
    };
    const getStateMock = jest.fn().mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    const identifierMock = 'identifier';

    await initializePrescriptionsDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      identifierMock
    );
    expect(updateTelemetryIdMock).toHaveBeenCalledTimes(1);
    expect(updateTelemetryIdMock).toHaveBeenNthCalledWith(
      1,
      telemetryStateMock.memberInfoRequestId
    );

    expect(getPendingPrescriptionsMock).toHaveBeenCalledTimes(1);
    expect(getPendingPrescriptionsMock).toHaveBeenNthCalledWith(
      1,
      GuestExperienceConfig.apis.guestExperienceApi,
      identifierMock,
      settingsMock.token,
      settingsMock.deviceToken
    );

    expect(getMemberProfileInfoMock).toHaveBeenCalledTimes(1);
    expect(getMemberProfileInfoMock).toHaveBeenNthCalledWith(
      1,
      GuestExperienceConfig.apis.guestExperienceApi,
      settingsMock.token,
      undefined,
      settingsMock.deviceToken
    );

    expect(popToTopMock).toHaveBeenCalledTimes(1);
    expect(popToTopMock).toHaveBeenNthCalledWith(1, rootStackNavigationMock);

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'ClaimAlertStack',
      { screen: 'ClaimAlert' }
    );
  });

  it('should navigate to pinFeatureWelcomeScreen in case exception: ErrorShowPinFeatureWelcomeScreen', async () => {
    const settingsMock: Partial<ISettings> = {
      deviceToken: 'device-token',
      token: 'account-token',
    };
    const telemetryStateMock: ITelemetryState = {
      memberInfoRequestId: 'telemetry-member-info-request-id',
    };
    const stateMock: Partial<RootState> = {
      config: GuestExperienceConfig,
      settings: settingsMock as ISettings,
      telemetry: telemetryStateMock,
    };
    const getStateMock = jest.fn().mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    const identifierMock = 'identifier';

    const errorMock = new ErrorShowPinFeatureWelcomeScreen();
    getPendingPrescriptionsMock.mockImplementationOnce(() => {
      throw errorMock;
    });
    await initializePrescriptionsDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      identifierMock
    );

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'PinFeatureWelcome',
      {}
    );
  });

  it('should call internalErrorDispatch in case of any exception not pre-defined', async () => {
    const settingsMock: Partial<ISettings> = {
      deviceToken: 'device-token',
      token: 'account-token',
    };
    const telemetryStateMock: ITelemetryState = {
      memberInfoRequestId: 'telemetry-member-info-request-id',
    };
    const stateMock: Partial<RootState> = {
      config: GuestExperienceConfig,
      settings: settingsMock as ISettings,
      telemetry: telemetryStateMock,
    };
    const getStateMock = jest.fn().mockReturnValue(stateMock);

    const dispatchMock = jest.fn();
    const identifierMock = 'identifier';

    const errorMock = new Error('test error');
    getPendingPrescriptionsMock.mockImplementationOnce(() => {
      throw errorMock;
    });
    await initializePrescriptionsDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      identifierMock
    );

    expect(internalErrorDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock,
      errorMock
    );
  });
});
