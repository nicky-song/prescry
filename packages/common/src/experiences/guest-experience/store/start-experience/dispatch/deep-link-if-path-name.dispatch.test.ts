// Copyright 2020 Prescryptive Health, Inc.

import { ISettings } from '../../../guest-experience-settings';
import { ModalPopupNames } from '../../modal-popup/modal-popup-names';
import { RootState } from '../../root-reducer';
import { testResultsDeepNavigateDispatch } from '../../navigation/dispatch/test-results-deep-navigate.dispatch';
import { deepLinkIfPathNameDispatch } from './deep-link-if-path-name.dispatch';
import { checkoutResultDeepNavigateDispatch } from './checkout-result-deep-navigate.dispatch';
import { ILocation } from '../../../../../utils/api.helper';
import { pickAPharmacyDeepNavigateDispatch } from '../../navigation/dispatch/shopping/pick-a-pharmacy-deep-navigate.dispatch';
import { locationDeepNavigateDispatch } from '../../navigation/dispatch/location-deep-navigate-dispatch';
import { getPrescriptionUserStatusDispatch } from '../../navigation/dispatch/shopping/prescription-user-status.dispatch';
import { IPrescriptionUserStatusResponse } from '../../../../../models/api-response/prescription-user-status-response';
import { rootStackNavigationMock } from './../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { appointmentDeepNavigateDispatch } from '../../navigation/dispatch/appointment-deep-navigate.dispatch';
import { decodeAscii } from '../../../../../utils/base-64-helper';
import { getPhoneNumberFromDeviceToken } from '../../../../../utils/json-web-token-helper/json-web-token-helper';
import { ICreateAccountScreenRouteProps } from '../../../screens/sign-in/create-account/create-account.screen';
import { inviteCodeDeepNavigateDispatch } from '../../navigation/dispatch/invite-code-deep-navigate-dispatch';
import { appointmentsDeepNavigateDispatch } from '../../navigation/dispatch/appointments-deep-navigate.dispatch';

jest.mock('../../../../../utils/json-web-token-helper/json-web-token-helper');
const getPhoneNumberFromDeviceTokenMock =
  getPhoneNumberFromDeviceToken as jest.Mock;
import { handleCommonErrorAction } from '../../error-handling.actions';
import { ErrorConstants } from '../../../../../theming/constants';
import { prescriptionPersonNavigateDispatch } from '../../navigation/dispatch/account-and-family/prescription-person-navigate.dispatch';
import { IGuestExperienceConfig } from '../../../guest-experience-config';
import { cabinetDeepNavigateDispatch } from '../../navigation/dispatch/cabinet-deep-navigate.dispatch';
import { vaccineDeepNavigateDispatch } from '../../navigation/dispatch/vaccine-deep-navigate.dispatch';
import { testResultDeepNavigateDispatch } from '../../navigation/dispatch/test-result-deep-navigate.dispatch';
import { loadMemberDataDispatch } from '../../member-list-info/dispatch/load-member-data.dispatch';
import { popToTop } from '../../../navigation/navigation.helper';
import { handleKnownAuthenticationErrorAction } from '../../root-navigation.actions';
import { dispatchResetStackToFatalErrorScreen } from '../../navigation/navigation-reducer.actions';
import { IFeaturesState } from '../../../guest-experience-features';

jest.mock('../../navigation/navigation-reducer.actions');
const dispatchResetStackToFatalErrorScreenMock =
  dispatchResetStackToFatalErrorScreen as jest.Mock;

jest.mock('../../root-navigation.actions');
const handleKnownAuthenticationErrorActionMock =
  handleKnownAuthenticationErrorAction as jest.Mock;

jest.mock('../../../navigation/navigation.helper');
const popToTopMock = popToTop as jest.Mock;

jest.mock('../../member-list-info/dispatch/load-member-data.dispatch');
const loadMemberDataDispatchMock = loadMemberDataDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/test-result-deep-navigate.dispatch');
const testResultDeepNavigateDispatchMock =
  testResultDeepNavigateDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/vaccine-deep-navigate.dispatch');
const vaccineDeepNavigateDispatchMock =
  vaccineDeepNavigateDispatch as jest.Mock;

jest.mock(
  '../../navigation/dispatch/account-and-family/prescription-person-navigate.dispatch'
);
const prescriptionPersonNavigateDispatchMock =
  prescriptionPersonNavigateDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/test-results-deep-navigate.dispatch');
const testResultsDeepNavigateDispatchMock =
  testResultsDeepNavigateDispatch as jest.Mock;

jest.mock('./checkout-result-deep-navigate.dispatch');
const checkoutResultDeepNavigateDispatchMock =
  checkoutResultDeepNavigateDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/invite-code-deep-navigate-dispatch');
const inviteCodeDeepNavigateDispatchMock =
  inviteCodeDeepNavigateDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/appointments-deep-navigate.dispatch');
const appointmentsDeepNavigateDispatchMock =
  appointmentsDeepNavigateDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/cabinet-deep-navigate.dispatch');
const cabinetDeepNavigateDispatchMock =
  cabinetDeepNavigateDispatch as jest.Mock;

jest.mock(
  '../../navigation/dispatch/shopping/pick-a-pharmacy-deep-navigate.dispatch'
);
const pickAPharmacyDeepNavigateDispatchMock =
  pickAPharmacyDeepNavigateDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/location-deep-navigate-dispatch');
const mockLocationDeepNavigateDispatch =
  locationDeepNavigateDispatch as jest.Mock;

jest.mock('../../navigation/dispatch/appointment-deep-navigate.dispatch');
const appointmentDeepNavigateDispatchMock =
  appointmentDeepNavigateDispatch as jest.Mock;

jest.mock('../../../../../utils/base-64-helper', () => ({
  decodeAscii: jest.fn(),
}));
const decodeAsciiMock = decodeAscii as jest.Mock;

jest.mock(
  '../../navigation/dispatch/shopping/prescription-user-status.dispatch'
);
const getPrescriptionUserStatusDispatchMock =
  getPrescriptionUserStatusDispatch as jest.Mock;

jest.mock('../../error-handling.actions');
const handleCommonErrorActionMock = handleCommonErrorAction as jest.Mock;

const settingsMock: ISettings = {
  deviceToken: undefined,
  isDeviceRestricted: false,
  lastZipCode: 'unknown',
  token: 'mock-token',
};

const userStatusResponseMock: IPrescriptionUserStatusResponse = {
  data: {
    personExists: true,
  },
  message: 'success',
  status: '200',
};

const stateMock: Partial<RootState> = {
  config: {
    location: {
      pathname: '/mock',
    },
  } as IGuestExperienceConfig,
  features: {} as IFeaturesState,
  settings: settingsMock,
};

describe('deepLinkIfPathNameDispatch', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    getPrescriptionUserStatusDispatchMock.mockReturnValue(
      userStatusResponseMock.data.personExists
    );
    decodeAsciiMock.mockReturnValue('orderNumber phoneNumber');
    getPhoneNumberFromDeviceTokenMock.mockReturnValue('phoneNumber');
  });

  it('returns false if no pathname length', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({
      ...stateMock,
      config: {
        location: {
          pathname: '/',
        },
      },
      features: {
        useAccount: false,
      },
    });

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(result).toBeFalsy();
    expect(getStateMock).toHaveBeenCalledTimes(1);
  });

  it('dispatches Test Results deep link for "results" path', async () => {
    await dispatchesTestResultsDeepLinkForResultsPath('/results');
    await dispatchesTestResultsDeepLinkForResultsPath('/results/');
  });

  it('dispatches vaccine deep link for "/results/vaccine/orderNumber" path', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({
      ...stateMock,
      config: {
        location: {
          pathname: '/results/vaccine/1234',
        },
      },
      features: {
        useAccount: false,
      },
    });
    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(vaccineDeepNavigateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      '1234'
    );
    expect(result).toEqual(true);
  });

  it('dispatches test deep link for "/results/test/orderNumber" path', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({
      ...stateMock,
      config: {
        location: {
          pathname: '/results/test/1234',
        },
      },
      features: {
        useAccount: false,
      },
    });
    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(testResultDeepNavigateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      '1234'
    );
    expect(result).toEqual(true);
  });

  it('dispatches nothing for "/results/test/": no orderNumber path', async () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({
      ...stateMock,
      config: {
        location: {
          pathname: '/results/test/',
        },
      },
      features: {
        useAccount: false,
      },
    });
    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(vaccineDeepNavigateDispatchMock).not.toHaveBeenCalledWith();
    expect(testResultDeepNavigateDispatchMock).not.toHaveBeenCalledWith();
    expect(result).toEqual(true);
  });

  it('dispatches checkout result deep link for "checkout/result" path', async () => {
    await dispatchesCheckoutResultsDeepLinkForResultsPath('/checkout/result');
    await dispatchesCheckoutResultsDeepLinkForResultsPath('/checkout/result/');
  });

  async function dispatchesCheckoutResultsDeepLinkForResultsPath(path: string) {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({
      ...stateMock,
      config: {
        location: {
          pathname: path,
        },
      },
      features: {
        useAccount: false,
      },
    });

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(checkoutResultDeepNavigateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
    expect(result).toEqual(true);
  }

  async function dispatchesTestResultsDeepLinkForResultsPath(path: string) {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({
      ...stateMock,
      config: {
        location: {
          pathname: path,
        },
      },
      features: {
        useAccount: false,
      },
    });

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(testResultsDeepNavigateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
    expect(result).toEqual(true);
  }

  it('calls loadMemberDataDispatch and navigates to ClaimExperienceScreen if path (identifier) exists', async () => {
    loadMemberDataDispatchMock.mockReturnValue(false);

    const identifierMock = 'identifier-mock';

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({
      ...stateMock,
      config: {
        location: {
          pathname: `/${identifierMock}`,
        },
      },
      modalPopUp: {
        modalName: 'mock',
        modalOpened: true,
      },
      prescription: {
        prescriptions: [{}],
      },
      features: {
        useAccount: false,
      },
    });

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(result).toBeTruthy();

    expect(loadMemberDataDispatchMock).toHaveBeenCalledTimes(1);
    expect(loadMemberDataDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );

    expect(popToTopMock).toHaveBeenCalledTimes(1);
    expect(popToTopMock).toHaveBeenNthCalledWith(1, rootStackNavigationMock);

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledTimes(1);
    expect(rootStackNavigationMock.navigate).toHaveBeenNthCalledWith(
      1,
      'RootStack',
      {
        screen: 'ClaimAlertStack',
        params: {
          screen: 'ClaimExperience',
          params: { identifier: identifierMock },
        },
      }
    );
  });

  it('calls handleKnownAuthenticationErrorAction and dispatchResetStackToFatalErrorScreen on error', async () => {
    const errorMock = new Error();

    loadMemberDataDispatchMock.mockImplementation(() => {
      throw errorMock;
    });

    handleKnownAuthenticationErrorActionMock.mockReturnValue(false);

    const identifierMock = 'identifier-mock';

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockReturnValue({
      ...stateMock,
      config: {
        location: {
          pathname: `/${identifierMock}`,
        },
      },
      modalPopUp: {
        modalName: 'mock',
        modalOpened: true,
      },
      prescription: {
        prescriptions: [{}],
      },
      features: {
        useAccount: false,
      },
    });

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(result).toBeFalsy();

    expect(loadMemberDataDispatchMock).toHaveBeenCalledTimes(1);
    expect(loadMemberDataDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );

    expect(handleKnownAuthenticationErrorActionMock).toHaveBeenCalledTimes(1);
    expect(handleKnownAuthenticationErrorActionMock).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      rootStackNavigationMock,
      errorMock
    );

    expect(dispatchResetStackToFatalErrorScreenMock).toHaveBeenCalledTimes(1);
    expect(dispatchResetStackToFatalErrorScreenMock).toHaveBeenNthCalledWith(
      1,
      rootStackNavigationMock
    );
  });

  it('does not open modal after navigating to prescription, if pathname exists, no modal is open and prescriptions are loaded', async () => {
    const dispatch = jest.fn();
    const getState = jest.fn().mockReturnValue({
      ...stateMock,
      config: {
        location: {
          pathname: 'path',
        },
      },
      modalPopUp: {
        modalName: ModalPopupNames.logoutModal,
        modalOpened: true,
      },
      prescription: {
        prescriptions: [{}],
      },
    });
    const result = await deepLinkIfPathNameDispatch(
      dispatch,
      getState,
      rootStackNavigationMock,
      true
    );
    expect(result).toBe(true);
    expect(getState).toBeCalledTimes(1);
  });

  it('navigate to MedicineCabinetScreen when url is /cabinet', async () => {
    const dispatchMock = jest.fn();

    const locationMock: Partial<ILocation> = {
      pathname: `/cabinet`,
    };

    const stateValueMock = {
      config: {
        location: locationMock,
      },
      settings: {
        deviceToken: 'device-token',
      },
      features: {
        useAccount: false,
      },
    };

    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(cabinetDeepNavigateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
    expect(result).toEqual(true);
  });

  it.each([
    ['prescription', false, false],
    ['prescription', false, true],
    ['bc', true, true],
  ])(
    'dispatches "Pick a Pharmacy" navigation if its authflow for pathname %p when cabinet is %p',
    async (
      pathNameMock: string,
      blockchainMock: boolean,
      isCabinetMock: boolean
    ) => {
      const dispatchMock = jest.fn();

      const prescriptionIdMock = 'prescription-id';
      const cabinetPath = isCabinetMock ? '/cabinet/' : '/';
      const locationMock: Partial<ILocation> = {
        pathname: `${cabinetPath}${pathNameMock}/${prescriptionIdMock}`,
        search: '',
      };
      const stateValueMock = {
        config: {
          location: locationMock,
        },
        features: { useAccount: false },
      };
      const getStateMock = jest.fn().mockReturnValue(stateValueMock);

      const result = await deepLinkIfPathNameDispatch(
        dispatchMock,
        getStateMock,
        rootStackNavigationMock,
        true
      );

      expect(pickAPharmacyDeepNavigateDispatchMock).toHaveBeenCalledWith(
        dispatchMock,
        getStateMock,
        rootStackNavigationMock,
        prescriptionIdMock,
        blockchainMock
      );
      expect(result).toEqual(true);
    }
  );

  it.each([
    ['prescription', false, false],
    ['prescription', false, true],
    ['bc', true, true],
  ])(
    'dispatches prescription person screen navigation if useAccount is true and !userExists',
    async (pathNameMock: string, isCabinetMock: boolean) => {
      const dispatchMock = jest.fn();

      getPrescriptionUserStatusDispatchMock.mockReturnValue(false);

      const prescriptionIdMock = 'prescription-id';
      const cabinetPath = isCabinetMock ? '/cabinet/' : '/';
      const locationMock: Partial<ILocation> = {
        pathname: `${cabinetPath}${pathNameMock}/${prescriptionIdMock}`,
        search: '',
      };
      const stateValueMock = {
        config: {
          location: locationMock,
        },
        features: { useAccount: true },
      };
      const getStateMock = jest.fn().mockReturnValue(stateValueMock);

      const result = await deepLinkIfPathNameDispatch(
        dispatchMock,
        getStateMock,
        rootStackNavigationMock,
        false
      );

      expect(prescriptionPersonNavigateDispatchMock).toHaveBeenCalledWith(
        rootStackNavigationMock,
        prescriptionIdMock,
        false
      );
      expect(result).toEqual(true);
    }
  );

  it.each([
    ['prescription', false, false],
    ['prescription', false, true],
    ['bc', true, true],
  ])(
    'dispatches prescription person screen navigation if useAccount is true and userExists false',
    async (pathNameMock: string, isCabinetMock: boolean) => {
      const dispatchMock = jest.fn();

      getPrescriptionUserStatusDispatchMock.mockReturnValue(false);

      const prescriptionIdMock = 'mock-no-user';
      const cabinetPath = isCabinetMock ? '/cabinet/' : '/';
      const locationMock: Partial<ILocation> = {
        pathname: `${cabinetPath}${pathNameMock}/${prescriptionIdMock}`,
        search: '',
      };
      const stateValueMock = {
        config: {
          location: locationMock,
        },
        features: { useAccount: true },
      };
      const getStateMock = jest.fn().mockReturnValue(stateValueMock);

      const result = await deepLinkIfPathNameDispatch(
        dispatchMock,
        getStateMock,
        rootStackNavigationMock,
        false
      );

      expect(prescriptionPersonNavigateDispatchMock).toHaveBeenCalledWith(
        rootStackNavigationMock,
        prescriptionIdMock,
        false
      );
      expect(result).toEqual(true);
    }
  );

  it.each([
    ['prescription', false, false],
    ['prescription', false, true],
    ['bc', true, true],
  ])(
    'dispatches to create account screen when prescription doesnt have memberID and is unauth flow',
    async (
      pathNameMock: string,
      blockchainMock: boolean,
      isCabinetMock: boolean
    ) => {
      const dispatchMock = jest.fn();

      const prescriptionIdMock = 'prescription-id';
      const cabinetPath = isCabinetMock ? '/cabinet/' : '/';
      const locationMock: Partial<ILocation> = {
        pathname: `${cabinetPath}${pathNameMock}/${prescriptionIdMock}`,
        search: '',
      };
      const stateValueMock = {
        config: {
          location: locationMock,
        },
        features: {
          useAccount: false,
        },
      };

      const userStatusMock: IPrescriptionUserStatusResponse = {
        data: {
          personExists: false,
        },
        message: 'success',
        status: '200',
      };

      const getStateMock = jest.fn().mockReturnValue(stateValueMock);

      getPrescriptionUserStatusDispatchMock.mockResolvedValueOnce(
        userStatusMock.data.personExists
      );

      const result = await deepLinkIfPathNameDispatch(
        dispatchMock,
        getStateMock,
        rootStackNavigationMock,
        false
      );
      const expectedParams: ICreateAccountScreenRouteProps = {
        workflow: 'prescriptionInvite',
        prescriptionId: prescriptionIdMock,
        blockchain: blockchainMock,
      };
      expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
        'CreateAccount',
        expectedParams
      );
      expect(result).toEqual(true);

      expect(getPrescriptionUserStatusDispatchMock).toHaveBeenCalledWith(
        getStateMock,
        prescriptionIdMock,
        blockchainMock
      );
    }
  );

  it.each([
    ['prescription', false, false],
    ['prescription', false, true],
    ['bc', true, true],
  ])(
    'dispatches to common Error action when getPrescriptionUserStatusDispatch throws error',
    async (pathNameMock: string, isCabinetMock: boolean) => {
      const dispatchMock = jest.fn();
      const error = new Error('Boom!');
      const prescriptionIdMock = 'prescription-id';
      const cabinetPath = isCabinetMock ? '/cabinet/' : '/';
      const locationMock: Partial<ILocation> = {
        pathname: `${cabinetPath}${pathNameMock}/${prescriptionIdMock}`,
        search: '',
      };
      const stateValueMock = {
        config: {
          supportEmail: 'support@prescryptive.com',
          location: locationMock,
        },
        features: {
          useAccount: false,
        },
      };

      const getStateMock = jest.fn().mockReturnValue(stateValueMock);

      getPrescriptionUserStatusDispatchMock.mockImplementation(() => {
        throw error;
      });

      await deepLinkIfPathNameDispatch(
        dispatchMock,
        getStateMock,
        rootStackNavigationMock,
        false
      );

      expect(handleCommonErrorActionMock).toBeCalledWith(
        rootStackNavigationMock,
        ErrorConstants.errorForNotFoundPrescription('support@prescryptive.com'),
        error
      );
      expect(pickAPharmacyDeepNavigateDispatchMock).not.toBeCalled();
      expect(rootStackNavigationMock.navigate).not.toBeCalled();
    }
  );

  it.each([
    ['prescription', false, false],
    ['prescription', false, true],
    ['bc', true, true],
  ])(
    'dispatches to common Error action when getPrescriptionUserStatusDispatch throws error',
    async (pathNameMock: string, isCabinetMock: boolean) => {
      const dispatchMock = jest.fn();
      const error = new Error('Boom!');
      const prescriptionIdMock = 'prescription-id';
      const cabinetPath = isCabinetMock ? '/cabinet/' : '/';
      const locationMock: Partial<ILocation> = {
        pathname: `${cabinetPath}${pathNameMock}/${prescriptionIdMock}`,
        search: '',
      };
      const stateValueMock = {
        config: {
          supportEmail: 'support@prescryptive.com',
          location: locationMock,
        },
        features: {
          useAccount: false,
        },
      };

      const getStateMock = jest.fn().mockReturnValue(stateValueMock);

      getPrescriptionUserStatusDispatchMock.mockImplementation(() => {
        throw error;
      });
      await deepLinkIfPathNameDispatch(
        dispatchMock,
        getStateMock,
        rootStackNavigationMock,
        false
      );

      expect(handleCommonErrorActionMock).toBeCalledWith(
        rootStackNavigationMock,
        ErrorConstants.errorForNotFoundPrescription('support@prescryptive.com'),
        error
      );
      expect(pickAPharmacyDeepNavigateDispatchMock).not.toBeCalled();
      expect(rootStackNavigationMock.navigate).not.toBeCalled();
    }
  );

  it.each([
    ['prescription', false, false],
    ['prescription', false, true],
    ['bc', true, true],
  ])(
    'does not dispatch "Pick a Pharmacy" navigation if no prescription id',
    async (pathNameMock: string, isCabinetMock: boolean) => {
      const dispatchMock = jest.fn();
      const cabinetPath = isCabinetMock ? '/cabinet/' : '/';

      const locationMock: Partial<ILocation> = {
        pathname: `${cabinetPath}${pathNameMock}`,
      };
      const stateValueMock = {
        config: {
          location: locationMock,
        },
        features: {
          useAccount: false,
        },
      };
      const getStateMock = jest.fn().mockReturnValue(stateValueMock);

      const result = await deepLinkIfPathNameDispatch(
        dispatchMock,
        getStateMock,
        rootStackNavigationMock,
        true
      );

      expect(pickAPharmacyDeepNavigateDispatchMock).not.toHaveBeenCalled();
      expect(result).toEqual(false);
    }
  );

  it('dispatches location deep link navigation when "p" is first path parameter', async () => {
    const dispatchMock = jest.fn();

    const mockLocationId = 'base64AndUriEncodedLocationId';
    const mockServiceType = 'base64AndUriEncodedServiceType';

    const locationMock: Partial<ILocation> = {
      pathname: `/p/${mockLocationId}/${mockServiceType}`,
    };
    const stateValueMock = {
      config: {
        location: locationMock,
      },
      features: {
        useAccount: false,
      },
    };
    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(mockLocationDeepNavigateDispatch).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      mockLocationId,
      mockServiceType
    );
    expect(result).toEqual(true);
  });

  it('does not dispatch location deep link navigation when "p" is first path parameter but location id is empty in path parameters', async () => {
    const dispatchMock = jest.fn();

    const mockServiceType = 'base64AndUriEncodedServiceType';

    const locationMock: Partial<ILocation> = {
      pathname: `/p//${mockServiceType}`,
    };
    const stateValueMock = {
      config: {
        location: locationMock,
      },
      features: {
        useAccount: false,
      },
    };
    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(mockLocationDeepNavigateDispatch).not.toHaveBeenCalled();
    expect(result).toEqual(true);
  });

  it('does not dispatch location deep link navigation when "p" is first path parameter but service type is empty in path parameters', async () => {
    const dispatchMock = jest.fn();

    const mockLocationId = 'base64AndUriEncodedLocationId';

    const locationMock: Partial<ILocation> = {
      pathname: `/p/${mockLocationId}/`,
    };
    const stateValueMock = {
      config: {
        location: locationMock,
      },
      features: {
        useAccount: false,
      },
    };
    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(mockLocationDeepNavigateDispatch).not.toHaveBeenCalled();
    expect(result).toEqual(true);
  });

  it('does not dispatch location deep link navigation when "p" is first path parameter but service type is not specified', async () => {
    const dispatchMock = jest.fn();

    const mockLocationId = 'base64AndUriEncodedLocationId';

    const locationMock: Partial<ILocation> = {
      pathname: `/p/${mockLocationId}`,
    };
    const stateValueMock = {
      config: {
        location: locationMock,
      },
      features: {
        useAccount: false,
      },
    };
    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(mockLocationDeepNavigateDispatch).not.toHaveBeenCalled();
    expect(result).toEqual(true);
  });

  it('dispatches "activate" navigation if activate deeplink is used and is not auth flow', async () => {
    const dispatchMock = jest.fn();

    const locationMock: Partial<ILocation> = {
      pathname: `/activate`,
    };
    const stateValueMock = {
      config: {
        location: locationMock,
      },
      features: {
        useAccount: false,
      },
    };
    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      false
    );

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'PbmMemberBenefits',
      {
        showBackButton: false,
      }
    );
    expect(result).toEqual(true);
  });

  it('does nothing if activate deeplink is used and is not auth flow', async () => {
    const dispatchMock = jest.fn();

    const locationMock: Partial<ILocation> = {
      pathname: `/activate`,
    };
    const stateValueMock = {
      config: {
        location: locationMock,
      },
      features: {
        useAccount: false,
      },
    };
    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      false
    );

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'PbmMemberBenefits',
      {
        showBackButton: false,
      }
    );
    expect(result).toEqual(true);
  });

  it('dispatches "activate" navigation if /activate/xxx deeplink is used and is not auth flow', async () => {
    const dispatchMock = jest.fn();

    const locationMock: Partial<ILocation> = {
      pathname: `/activate/xxx`,
    };
    const stateValueMock = {
      config: {
        location: locationMock,
      },
      features: {
        useAccount: false,
      },
    };
    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      false
    );

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'PbmMemberBenefits',
      {
        showBackButton: false,
      }
    );
    expect(result).toEqual(true);
  });

  it('does nothing if /activate/xxx deeplink is used and is not auth flow', async () => {
    const dispatchMock = jest.fn();

    const locationMock: Partial<ILocation> = {
      pathname: `/activate/xxx`,
    };
    const stateValueMock = {
      config: {
        location: locationMock,
      },
      features: {
        useAccount: false,
      },
    };
    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      false
    );

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'PbmMemberBenefits',
      {
        showBackButton: false,
      }
    );
    expect(result).toEqual(true);
  });

  it('navigate to AppointmentsList screen when url is /appointments', async () => {
    const dispatchMock = jest.fn();

    const locationMock: Partial<ILocation> = {
      pathname: `/appointments`,
    };

    const stateValueMock = {
      config: {
        location: locationMock,
      },
      settings: {
        deviceToken: 'device-token',
      },
      features: {
        useAccount: false,
      },
    };

    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(appointmentsDeepNavigateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock
    );
    expect(result).toEqual(true);
  });

  it('dispatches appointment confirmation deep link navigation when resource starts with appointment', async () => {
    const dispatchMock = jest.fn();

    const mockOrderNumber = 'base64AndUriEncodedOrderAndPhoneNumber';

    const locationMock: Partial<ILocation> = {
      pathname: `/appointment/${mockOrderNumber}`,
    };
    const stateValueMock = {
      config: {
        location: locationMock,
      },
      settings: {
        deviceToken: 'device-token',
      },
      features: {
        useAccount: false,
      },
    };
    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(appointmentDeepNavigateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      'orderNumber'
    );
    expect(result).toEqual(true);
  });
  it('doesnt dispatch appointment confirmation deep link navigation when resource starts with appointment but no device token', async () => {
    const dispatchMock = jest.fn();
    const mockOrderNumber = 'base64AndUriEncodedOrderAndPhoneNumber';

    const locationMock: Partial<ILocation> = {
      pathname: `/appointment/${mockOrderNumber}`,
    };
    const stateValueMock = {
      config: {
        location: locationMock,
      },
      settings: {},
      features: {
        useAccount: false,
      },
    };
    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(appointmentDeepNavigateDispatchMock).not.toBeCalled();
    expect(result).toEqual(false);
  });
  it('doesnt dispatch appointment confirmation deep link navigation when resource starts with "appointment" but no encoded OrderNumber', async () => {
    const dispatchMock = jest.fn();

    const locationMock: Partial<ILocation> = {
      pathname: `/appointment/`,
    };
    const stateValueMock = {
      config: {
        location: locationMock,
      },
      settings: {
        deviceToken: 'phone-number-1',
      },
      features: {
        useAccount: false,
      },
    };
    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(appointmentDeepNavigateDispatchMock).not.toBeCalled();
    expect(result).toEqual(false);
  });
  it('doesnt dispatches appointment confirmation deep link navigation when resource starts with "appointment" and deviceNumber not matched with phoneNumber ', async () => {
    const dispatchMock = jest.fn();
    getPhoneNumberFromDeviceTokenMock.mockReturnValue('phone-number-1');
    const mockOrderNumber = 'base64AndUriEncodedOrderAndPhoneNumber';

    const locationMock: Partial<ILocation> = {
      pathname: `/appointment/${mockOrderNumber}`,
    };
    const stateValueMock = {
      config: {
        location: locationMock,
      },
      settings: {
        deviceToken: 'phone-number-1',
      },
      features: {
        useAccount: false,
      },
    };
    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(appointmentDeepNavigateDispatchMock).not.toBeCalled();
    expect(result).toEqual(false);
  });
  it('dispatches invite code deep link navigation when resource is invite', async () => {
    const dispatchMock = jest.fn();

    const locationMock: Partial<ILocation> = {
      pathname: `/invite/`,
      search: `invitecode=invite-code-value`,
    };

    jest
      .spyOn(URLSearchParams.prototype, 'get')
      .mockReturnValue('invite-code-value');

    const stateValueMock = {
      config: {
        location: locationMock,
      },
      settings: {
        deviceToken: 'device-token',
      },
      features: {
        useAccount: false,
      },
    };
    const getStateMock = jest.fn().mockReturnValue(stateValueMock);
    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      true
    );

    expect(inviteCodeDeepNavigateDispatchMock).toHaveBeenCalledWith(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      'invite-code-value'
    );
    expect(result).toEqual(true);
  });
  it('dispatches "register" navigation if activate deeplink is used and is not auth flow', async () => {
    const dispatchMock = jest.fn();

    const locationMock: Partial<ILocation> = {
      pathname: `/register`,
    };
    const stateValueMock = {
      config: {
        location: locationMock,
      },
      features: {
        useAccount: false,
      },
    };
    const getStateMock = jest.fn().mockReturnValue(stateValueMock);

    const result = await deepLinkIfPathNameDispatch(
      dispatchMock,
      getStateMock,
      rootStackNavigationMock,
      false
    );

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'CreateAccount',
      {
        workflow: 'register',
      }
    );
    expect(result).toEqual(true);
  });
});
