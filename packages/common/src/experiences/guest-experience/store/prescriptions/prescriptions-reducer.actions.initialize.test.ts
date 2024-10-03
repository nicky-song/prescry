// Copyright 2018 Prescryptive Health, Inc.

import { ErrorApiResponse } from '../../../../errors/error-api-response';
import { ErrorRequireUserVerifyPin } from '../../../../errors/error-require-user-verify-pin';
import { ErrorUnauthorizedAlertUrl } from '../../../../errors/error-unauthorized-alert-url';
import { ErrorConstants } from '../../../../theming/constants';
import { IConfigState } from '../../../../utils/api.helper';
import { getPendingPrescriptions } from '../../api/api-v1';
import { handleRedirectSuccessResponse } from '../../api/api-v1-helper';
import {
  GuestExperienceConfig,
  GuestExperienceConfigApiNames,
} from '../../guest-experience-config';
import { updateTelemetryId } from '../../guest-experience-logger.middleware';

import { dispatchResetStackToPhoneLoginScreen } from '../navigation/navigation-reducer.actions';
import { setPrescribedMemberDetailsAction } from '../prescribed-member/prescribed-member-reducer.actions';
import {
  getPrescribedMemberFromList,
  initializePrescriptionsDispatch,
  PrescriptionsStateActionKeys,
} from './prescriptions-reducer.actions';
import { tokenUpdateDispatch } from '../settings/dispatch/token-update.dispatch';
import { getMemberProfileInfo } from '../../api/api-v1.get-member-profile';
import { storeMemberProfileApiResponseDispatch } from '../member-profile/dispatch/store-member-profile-api-response.dispatch';
import { loginPinNavigateDispatch } from '../navigation/dispatch/sign-in/login-pin-navigate.dispatch';
import { rootStackNavigationMock } from './../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import {
  ILimitedAccount,
  IProfile,
  IPrimaryProfile,
  IDependentProfile,
} from '../../../../models/member-profile/member-profile-info';
import { IMemberInfoResponse } from '../../../../models/api-response/member-info-response';
import { IMemberProfileState } from '../member-profile/member-profile-reducer';
import { ErrorShowPinFeatureWelcomeScreen } from '../../../../errors/error-show-pin-feature-welcome-screen';
import { resetSettingsAction } from '../settings/settings-reducer.actions';

jest.mock('../../guest-experience-logger.middleware');

jest.mock('../../api/api-v1');

jest.mock(
  '../../../guest-experience/store/settings/settings-reducer.actions',
  () => ({
    resetSettingsAction: jest.fn().mockReturnValue(jest.fn()),
  })
);

jest.mock('../navigation/navigation-reducer.actions');

jest.mock('../prescribed-member/prescribed-member-reducer.actions');
jest.mock('../../api/api-v1-helper');
jest.mock('../../api/api-v1.get-member-profile');
jest.mock(
  '../member-profile/dispatch/store-member-profile-api-response.dispatch'
);
jest.mock('../navigation/dispatch/sign-in/login-pin-navigate.dispatch');

jest.mock('../settings/dispatch/token-update.dispatch');
const tokenUpdateDispatchMock = tokenUpdateDispatch as jest.Mock;

const mockReduxDispatchHandler = jest.fn();
const mockDispatchResetStackToPhoneLoginScreen =
  dispatchResetStackToPhoneLoginScreen as jest.Mock;
const mockGetPendingPrescriptions = getPendingPrescriptions as jest.Mock;
const updateTelemetryIdMock = updateTelemetryId as jest.Mock;
const mockSetPrescribedMemberDetailsAction =
  setPrescribedMemberDetailsAction as jest.Mock;
const mockHandleRedirectSuccessResponse =
  handleRedirectSuccessResponse as jest.Mock;
const mockDispatchToLoginPinScreen = loginPinNavigateDispatch as jest.Mock;
const getMemberProfileInfoMock = getMemberProfileInfo as jest.Mock;
const storeMemberProfileApiResponseDispatchMock =
  storeMemberProfileApiResponseDispatch as jest.Mock;

const resetSettingsActionMock = resetSettingsAction as jest.Mock;

const accountMock: ILimitedAccount = {
  firstName: 'fake-first',
  lastName: 'fake-last',
  dateOfBirth: '01-01-2000',
  phoneNumber: 'fake-phone',
  recoveryEmail: 'test@test.com',
  favoritedPharmacies: [],
};
const primary: IPrimaryProfile = {
  email: '',
  firstName: 'ME',
  identifier: 'id-1',
  isLimited: false,
  isPhoneNumberVerified: true,
  isPrimary: true,
  lastName: 'TEST',
  phoneNumber: 'phone',
  primaryMemberFamilyId: 'CA7F7K',
  primaryMemberPersonCode: '01',
  primaryMemberRxId: 'CA7F7K01',
  age: 21,
  rxGroupType: 'SIE',
  rxSubGroup: 'HMA01',
  dateOfBirth: '01/01/2000',
};
const under13Dependent: IDependentProfile = {
  firstName: 'TEST',
  identifier: 'id-2',
  isLimited: false,
  isPrimary: false,
  lastName: 'TEST',
  primaryMemberFamilyId: 'CA7F7K',
  primaryMemberPersonCode: '03',
  primaryMemberRxId: 'CA7F7K03',
  age: 4,
  rxGroupType: 'SIE',
  rxSubGroup: 'HMA01',
};
const over13Dependent: IDependentProfile = {
  firstName: 'ADULT',
  identifier: 'id-3',
  isLimited: false,
  isPrimary: false,
  lastName: '>18',
  primaryMemberFamilyId: 'CA7F7K',
  primaryMemberPersonCode: '05',
  primaryMemberRxId: 'CA7F7K05',
  age: 20,
  rxGroupType: 'SIE',
  rxSubGroup: 'HMA01',
};
const primaryCash: IPrimaryProfile = {
  email: '',
  firstName: 'ME',
  identifier: 'id-cash',
  isLimited: false,
  isPhoneNumberVerified: true,
  isPrimary: true,
  lastName: 'TEST',
  phoneNumber: 'phone',
  primaryMemberFamilyId: 'CASH',
  primaryMemberPersonCode: '01',
  primaryMemberRxId: 'CA7F7K01',
  age: 21,
  rxGroupType: 'SIE',
  dateOfBirth: '01/01/2000',
  rxSubGroup: 'HMA01',
};
const under13DependentCash: IDependentProfile = {
  firstName: 'TEST',
  identifier: 'id-cash-2',
  isLimited: false,
  isPrimary: false,
  lastName: 'TEST',
  primaryMemberFamilyId: 'CASH',
  primaryMemberPersonCode: '03',
  primaryMemberRxId: 'CASH03',
  age: 4,
  rxGroupType: 'CASH',
  rxSubGroup: 'CASH01',
};
const over13DependentCash: IDependentProfile = {
  firstName: 'ADULT',
  identifier: 'id-cash-3',
  isLimited: false,
  isPrimary: false,
  lastName: '>18',
  primaryMemberFamilyId: 'CASH',
  primaryMemberPersonCode: '05',
  primaryMemberRxId: 'CASH05',
  age: 20,
  rxGroupType: 'CASH',
  rxSubGroup: 'CASH01',
};
const profileListMock: IProfile[] = [
  {
    rxGroupType: 'SIE',
    primary,
    childMembers: [under13Dependent],
    adultMembers: [over13Dependent],
  },
  {
    rxGroupType: 'CASH',
    primary: primaryCash,
    childMembers: [under13DependentCash],
    adultMembers: [over13DependentCash],
  },
];
beforeEach(() => {
  jest.clearAllMocks();
});

const errorHandlingActions = jest.requireActual('../error-handling.actions');
errorHandlingActions.handleAuthenticationErrorAction = jest.fn().mockReset();
errorHandlingActions.handleCommonErrorAction = jest.fn().mockReset();

const supportEmail = 'support@somewhere.com';
const config: IConfigState<GuestExperienceConfigApiNames> = {
  ...GuestExperienceConfig,
  supportEmail,
} as IConfigState<GuestExperienceConfigApiNames>;

describe('initializePrescriptionsAction, when identifier found in url', () => {
  it('calls api to get rxs, dispatches updatePrescriptions, sets prescribed member, and navigates to offerList', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    const mockInitialState = {
      config,
      settings: {
        deviceToken: 'fake-device-token',
        token: 'mock-token',
      },
      telemetry: {
        memberInfoRequestId: 'memberInfoRequestId',
      },
      features: {},
    };

    const mockSecondState = {
      ...mockInitialState,
      prescription: {
        selectedPrescription: {
          identifier: 'mock-rx',
          prescription: {},
        },
      },
    };

    const apiResponseMock = {
      data: {
        memberIdentifier: 'id-1',
        pendingPrescriptionList: {
          identifier: 'mock-list',
          prescriptions: [mockSecondState.prescription.selectedPrescription],
        },
      },
      refreshToken: 'refresh-token',
    };

    mockGetPendingPrescriptions.mockResolvedValue(apiResponseMock);
    const memberDetails = {
      account: accountMock,
      profileList: profileListMock,
    };
    const memberProfileResponseMock: IMemberInfoResponse = {
      data: memberDetails,
      message: 'success',
      status: '200',
    };
    getMemberProfileInfoMock.mockResolvedValue(memberProfileResponseMock);

    getStateMock.mockReturnValue(mockSecondState);

    await initializePrescriptionsDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      'mock-rx'
    );
    expect(updateTelemetryIdMock).toHaveBeenCalledWith('memberInfoRequestId');
    expect(mockGetPendingPrescriptions).toHaveBeenNthCalledWith(
      1,
      config.apis.guestExperienceApi,
      'mock-rx',
      'mock-token',
      'fake-device-token'
    );
    expect(getStateMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenNthCalledWith(1, {
      payload: {
        arePrescriptionsInitialized: true,
        pendingPrescriptionsList: {
          identifier: 'mock-list',
          prescriptions: [mockSecondState.prescription.selectedPrescription],
        },
      },
      type: PrescriptionsStateActionKeys.UPDATE_PRESCRIPTIONS,
    });
    expect(storeMemberProfileApiResponseDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      memberProfileResponseMock
    );
    expect(mockSetPrescribedMemberDetailsAction).toHaveBeenNthCalledWith(1, {
      firstName: primary.firstName,
      identifier: primary.identifier,
      isPrimary: primary.isPrimary,
      lastName: primary.lastName,
    });

    expect(tokenUpdateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      'refresh-token'
    );
  });
  it('should call handleRedirectSuccessResponse if getPendingPrescriptions returns redirect response', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const redirectResponse = {
      data: { deviceToken: 'deviceToken' },
      responseCode: 2001,
    };
    const mockInitialState = {
      config,
      settings: {
        deviceToken: 'fake-device-token',
        token: 'mock-token',
      },
      telemetry: {
        memberInfoRequestId: 'memberInfoRequestId',
      },
    };
    const mockSecondState = {
      ...mockInitialState,
      prescription: {
        selectedPrescription: {
          identifier: 'mock-rx',
          prescription: {},
        },
      },
    };

    getStateMock.mockReturnValueOnce(mockInitialState);
    getStateMock.mockReturnValueOnce(mockSecondState);
    mockGetPendingPrescriptions.mockReturnValue(redirectResponse);
    await initializePrescriptionsDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      'mock-rx'
    );

    expect(mockHandleRedirectSuccessResponse).toHaveBeenCalledWith(
      redirectResponse,
      dispatchMock,
      rootStackNavigationMock
    );
  });

  it('should navigate to login screen when user is trying to access unauthorized url', async () => {
    const mockState = {
      config,
      prescription: {
        selectedPrescription: {
          identifier: 'mock-rx',
          prescription: {},
        },
      },
      settings: {
        token: 'mock-token',
      },
      telemetry: {
        memberInfoRequestId: 'memberInfoRequestId',
      },
    };
    mockGetPendingPrescriptions.mockImplementationOnce(() => {
      throw new ErrorUnauthorizedAlertUrl('fake error');
    });
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue(mockState);
    await initializePrescriptionsDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      'mock-rx'
    );
    expect(resetSettingsActionMock).toHaveBeenCalled();
    expect(mockDispatchResetStackToPhoneLoginScreen).toHaveBeenCalledWith(
      rootStackNavigationMock,
      undefined,
      'fake error'
    );
  });

  it('should navigate to FatalErrorScreen with error message when ErrorApiResponse is thrown', async () => {
    mockGetPendingPrescriptions.mockImplementation(() => {
      throw new ErrorApiResponse(ErrorConstants.errorInternalServer());
    });
    const mockState = {
      config,

      prescription: {
        selectedPrescription: {
          identifier: 'mock-rx',
          prescription: {},
        },
      },
      settings: {
        token: 'mock-token',
      },
      telemetry: {
        memberInfoRequestId: 'fake memberInfoRequestId',
      },
    };

    const getStateMock = jest.fn().mockReturnValue(mockState);
    await initializePrescriptionsDispatch(
      mockReduxDispatchHandler,
      getStateMock,
      rootStackNavigationMock,
      'mock-rx'
    );
    expect(errorHandlingActions.handleCommonErrorAction).toHaveBeenCalledWith(
      rootStackNavigationMock,
      ErrorConstants.errorInternalServer(),
      new Error(ErrorConstants.errorInternalServer())
    );
  });

  it('should navigate to loginPinScreen if ErrorRequireUserVerifyPin is thrown', async () => {
    mockGetPendingPrescriptions.mockImplementation(() => {
      throw new ErrorRequireUserVerifyPin();
    });
    const mockState = {
      config,

      prescription: {
        selectedPrescription: {
          identifier: 'mock-rx',
          prescription: {},
        },
      },
      settings: {
        token: 'mock-token',
      },
      telemetry: {
        memberInfoRequestId: 'fake memberInfoRequestId',
      },
    };

    const getStateMock = jest.fn().mockReturnValue(mockState);
    await initializePrescriptionsDispatch(
      mockReduxDispatchHandler,
      getStateMock,
      rootStackNavigationMock,
      'mock-rx'
    );
    expect(mockDispatchToLoginPinScreen).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
  });

  it('should navigate to loginPinScreen with workflow if ErrorRequireUserVerifyPin is thrown with workflow', async () => {
    mockGetPendingPrescriptions.mockImplementation(() => {
      throw new ErrorRequireUserVerifyPin(undefined, 'prescriptionTransfer');
    });
    const mockState = {
      config,

      prescription: {
        selectedPrescription: {
          identifier: 'mock-rx',
          prescription: {},
        },
      },
      settings: {
        token: 'mock-token',
      },
      telemetry: {
        memberInfoRequestId: 'fake memberInfoRequestId',
      },
    };

    const getStateMock = jest.fn().mockReturnValue(mockState);
    await initializePrescriptionsDispatch(
      mockReduxDispatchHandler,
      getStateMock,
      rootStackNavigationMock,
      'mock-rx'
    );
    expect(mockDispatchToLoginPinScreen).toHaveBeenCalledWith(
      rootStackNavigationMock,
      {
        workflow: 'prescriptionTransfer',
      }
    );
  });
  it('should navigate to PinFeatureWelcomeScreen if ErrorShowPinFeatureWelcomeScreen is thrown', async () => {
    mockGetPendingPrescriptions.mockImplementation(() => {
      throw new ErrorShowPinFeatureWelcomeScreen();
    });
    const mockState = {
      config,
      prescription: {
        selectedPrescription: {
          identifier: 'mock-rx',
          prescription: {},
        },
      },
      settings: {
        token: 'mock-token',
      },
      telemetry: {
        memberInfoRequestId: 'fake memberInfoRequestId',
      },
    };
    const getStateMock = jest.fn().mockReturnValue(mockState);
    await initializePrescriptionsDispatch(
      mockReduxDispatchHandler,
      getStateMock,
      rootStackNavigationMock,
      'mock-rx'
    );
    expect(rootStackNavigationMock.navigate).toBeCalledWith(
      'PinFeatureWelcome',
      {}
    );
  });
});

describe('getPrescribedMemberFromList', () => {
  const memberDetails: IMemberProfileState = {
    account: accountMock,
    profileList: profileListMock,
  };

  it('should return the logged in member info if prescribedMember is same as loggedIn member primary profile', () => {
    const prescribedMemberId = 'id-1';

    const prescribedMember = getPrescribedMemberFromList(
      memberDetails,
      prescribedMemberId
    );

    expect(prescribedMember).toEqual(primary);
  });

  it('should return the child member info if prescribedMember is a child member', () => {
    const prescribedMemberId = 'id-2';

    const prescribedMember = getPrescribedMemberFromList(
      memberDetails,
      prescribedMemberId
    );

    expect(prescribedMember).toEqual(under13Dependent);
  });

  it('should return the adult member info if prescribedMember is a adult member', () => {
    const prescribedMemberId = 'id-3';

    const prescribedMember = getPrescribedMemberFromList(
      memberDetails,
      prescribedMemberId
    );

    expect(prescribedMember).toEqual(over13Dependent);
  });
});
