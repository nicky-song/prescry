// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useReducer } from 'react';
import renderer from 'react-test-renderer';
import { SessionContextProvider } from './session.context-provider';
import { SessionContext, ISessionContext } from './session.context';
import { ITestContainer } from '../../../../testing/test.container';
import {
  defaultSessionState,
  ISessionState,
} from '../../state/session/session.state';
import { sessionReducer } from '../../state/session/session.reducer';
import { useConfigContext } from '../config/use-config-context.hook';
import { IConfigContext } from '../config/config.context';
import { GuestExperienceConfig } from '../../guest-experience-config';
import { getDrugFormsDispatch } from '../../state/session/dispatch/get-drug-forms.dispatch';
import { IDrugForm } from '../../../../models/drug-form';
import { IGetUserLocationAsyncActionArgs } from '../../state/session/async-actions/get-user-location.async-action';
import { useReduxContext } from '../redux/use-redux-context.hook';
import { ILocationCoordinates } from '../../../../models/location-coordinates';
import { getUserLocationAndCachePharmaciesDispatch } from '../../state/session/dispatch/get-user-location-and-cache-pharmacies.dispatch';
import { getQueryLanguage } from '../../../../utils/translation/get-query-language.helper';
import { useMembershipContext } from '../membership/use-membership-context.hook';
import { defaultMembershipState } from '../../state/membership/membership.state';
import { setCurrentLanguageDispatch } from '../../state/session/dispatch/set-current-language.dispatch';
import { expectToHaveBeenCalledOnceOnlyWith } from '../../../../testing/test.helper';
import { getContentLanguage } from '../../../../utils/translation/get-content-language.helper';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { updateURLWithFeatureFlagsAndLanguage } from '../../store/navigation/update-url-with-feature-flags-and-language';
import {
  defaultLanguage,
  Language,
  LanguageCodeMap,
} from '../../../../models/language';
import { getCurrentDeviceLanguageDispatch } from '../../state/session/dispatch/get-current-device-language.dispatch';

jest.mock(
  '../../state/session/dispatch/get-user-location-and-cache-pharmacies.dispatch'
);
const getUserLocationAndCachePharmaciesDispatchMock =
  getUserLocationAndCachePharmaciesDispatch as jest.Mock;

jest.mock('../redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useReducer: jest.fn(),
  useEffect: jest.fn(),
}));
const useReducerMock = useReducer as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('./session.context', () => ({
  SessionContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

jest.mock('../config/use-config-context.hook');
const useConfigContextMock = useConfigContext as jest.Mock;

jest.mock('../../state/session/dispatch/get-drug-forms.dispatch');
const getDrugFormsDispatchMock = getDrugFormsDispatch as jest.Mock;

jest.mock('../../../../utils/translation/get-query-language.helper');
const getQueryLanguageMock = getQueryLanguage as jest.Mock;

jest.mock('../membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../state/session/dispatch/set-current-language.dispatch');
const setCurrentLanguageDispatchMock = setCurrentLanguageDispatch as jest.Mock;

jest.mock('../../../../utils/translation/get-content-language.helper');
const getContentLanguageMock = getContentLanguage as jest.Mock;

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

jest.mock('../../store/navigation/update-url-with-feature-flags-and-language');
const updateURLWithFeatureFlagsAndLanguageMock =
  updateURLWithFeatureFlagsAndLanguage as jest.Mock;

jest.mock('../../state/session/dispatch/get-current-device-language.dispatch');
const getCurrentDeviceLanguageDispatchMock =
  getCurrentDeviceLanguageDispatch as jest.Mock;

const ChildMock = jest.fn().mockReturnValue(<div />);

const windowReloadMock = jest.fn();
Object.defineProperty(window, 'location', {
  configurable: true,
  value: { reload: windowReloadMock },
});

describe('SessionContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useReducerMock.mockReturnValue([{}, jest.fn()]);

    const configContextMock: IConfigContext = {
      configState: GuestExperienceConfig,
    };
    useConfigContextMock.mockReturnValue(configContextMock);

    useReduxContextMock.mockReturnValue({
      dispatch: jest.fn(),
      getState: jest.fn().mockReturnValue({
        settings: {},
      }),
    });
    useMembershipContextMock.mockReturnValue({
      membershipState: defaultMembershipState,
    });
    useFlagsMock.mockReturnValue({ usetrans: true });
  });

  it('calls useReducer', () => {
    const isUnauthExperienceMock = true;
    const isUserAuthenticatedMock = true;

    renderer.create(
      <SessionContextProvider
        isUnauthExperience={isUnauthExperienceMock}
        isUserAuthenticated={isUserAuthenticatedMock}
      >
        <ChildMock />
      </SessionContextProvider>
    );

    const expectedState: ISessionState = {
      ...defaultSessionState,
      isUnauthExperience: isUnauthExperienceMock,
      isUserAuthenticated: isUserAuthenticatedMock,
    };
    expect(useReducerMock).toHaveBeenCalledWith(sessionReducer, expectedState);
  });

  it('has expected number of effect handlers', () => {
    renderer.create(
      <SessionContextProvider>
        <ChildMock />
      </SessionContextProvider>
    );

    expect(useEffectMock).toHaveBeenCalledTimes(5);
  });

  it('gets drug forms on mount', async () => {
    const configContextMock: IConfigContext = {
      configState: GuestExperienceConfig,
    };
    useConfigContextMock.mockReturnValueOnce(configContextMock);

    const sessionDispatchMock = jest.fn();
    useReducerMock.mockReturnValueOnce([
      defaultSessionState,
      sessionDispatchMock,
    ]);

    renderer.create(
      <SessionContextProvider>
        <ChildMock />
      </SessionContextProvider>
    );

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), []);

    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();

    expect(getDrugFormsDispatchMock).toHaveBeenCalledWith(
      sessionDispatchMock,
      GuestExperienceConfig
    );
  });

  it('gets device language on mount', async () => {
    const configContextMock: IConfigContext = {
      configState: GuestExperienceConfig,
    };
    useConfigContextMock.mockReturnValueOnce(configContextMock);

    const sessionDispatchMock = jest.fn();
    useReducerMock.mockReturnValueOnce([
      defaultSessionState,
      sessionDispatchMock,
    ]);

    renderer.create(
      <SessionContextProvider>
        <ChildMock />
      </SessionContextProvider>
    );

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), []);

    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();

    expect(getCurrentDeviceLanguageDispatchMock).toHaveBeenCalledWith(
      sessionDispatchMock
    );
  });

  it.each([
    [
      { zipCode: '12345', longitude: 99, latitude: 99 } as ILocationCoordinates,
      undefined,
    ],
    [undefined, '12345'],
    [undefined, undefined],
  ])(
    'gets user location on mount if userLocationSettings is %s and lastZipCode is %s',
    async (
      userLocationSettings?: ILocationCoordinates,
      lastZipCodeSettings?: string
    ) => {
      const configContextMock: IConfigContext = {
        configState: GuestExperienceConfig,
      };
      useConfigContextMock.mockReturnValueOnce(configContextMock);

      const sessionDispatchMock = jest.fn();
      useReducerMock.mockReturnValueOnce([
        defaultSessionState,
        sessionDispatchMock,
      ]);

      const reduxDispatchMock = jest.fn();
      const reduxGetStateMock = jest.fn().mockReturnValue({
        settings: {
          userLocation: userLocationSettings,
          lastZipCode: lastZipCodeSettings,
        },
      });

      useReduxContextMock.mockReturnValue({
        dispatch: reduxDispatchMock,
        getState: reduxGetStateMock,
      });

      renderer.create(
        <SessionContextProvider>
          <ChildMock />
        </SessionContextProvider>
      );

      expect(useEffectMock).toHaveBeenNthCalledWith(
        1,
        expect.any(Function),
        []
      );

      const effectHandler = useEffectMock.mock.calls[0][0];
      await effectHandler();

      const expectedGetUserLocationAsyncActionArgs: IGetUserLocationAsyncActionArgs =
        {
          sessionDispatch: sessionDispatchMock,
          reduxDispatch: reduxDispatchMock,
          reduxGetState: reduxGetStateMock,
        };

      const userLocationFromReduxStateSettings =
        reduxGetStateMock().settings?.userLocation;
      const lastZipCodeFromReduxStateSettings =
        reduxGetStateMock().settings?.lastZipCode;

      if (userLocationFromReduxStateSettings) {
        expectedGetUserLocationAsyncActionArgs.location =
          userLocationFromReduxStateSettings;
      } else if (
        lastZipCodeFromReduxStateSettings &&
        lastZipCodeFromReduxStateSettings !== 'unknown'
      ) {
        expectedGetUserLocationAsyncActionArgs.location = {
          zipCode: lastZipCodeFromReduxStateSettings,
        };
      }

      expect(
        getUserLocationAndCachePharmaciesDispatchMock
      ).toHaveBeenCalledWith(expectedGetUserLocationAsyncActionArgs);
    }
  );

  it('does not get drug forms on mount if drug forms injected', async () => {
    const configContextMock: IConfigContext = {
      configState: GuestExperienceConfig,
    };
    useConfigContextMock.mockReturnValueOnce(configContextMock);

    const drugFormMock: IDrugForm = {
      abbreviation: 'tab',
      description: 'Tablet',
      formCode: 'TAB',
    };
    const injectedSessionState: ISessionState = {
      ...defaultSessionState,
      drugFormMap: new Map([['TAB', drugFormMock]]),
    };

    const isUnauthExperienceMock = true;
    const isUserAuthenticatedMock = true;

    const initialSessionStateMock: ISessionState = {
      ...injectedSessionState,
      isUnauthExperience: isUnauthExperienceMock,
      isUserAuthenticated: isUserAuthenticatedMock,
    };

    const sessionDispatchMock = jest.fn();
    useReducerMock.mockReturnValueOnce([
      initialSessionStateMock,
      sessionDispatchMock,
    ]);

    renderer.create(
      <SessionContextProvider
        injectedSessionState={injectedSessionState}
        isUnauthExperience={isUnauthExperienceMock}
        isUserAuthenticated={isUserAuthenticatedMock}
      >
        <ChildMock />
      </SessionContextProvider>
    );

    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();

    expect(useReducerMock).toHaveBeenCalledWith(
      sessionReducer,
      initialSessionStateMock
    );
    expect(getDrugFormsDispatchMock).not.toHaveBeenCalled();
  });

  it('updates isUnauthExperience when changed', () => {
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      isUnauthExperience: false,
    };
    const sessionDispatchMock = jest.fn();
    useReducerMock.mockReturnValue([sessionStateMock, sessionDispatchMock]);

    const isUnauthExperienceMock = true;

    renderer.create(
      <SessionContextProvider isUnauthExperience={isUnauthExperienceMock}>
        <ChildMock />
      </SessionContextProvider>
    );

    expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), [
      isUnauthExperienceMock,
    ]);

    const effectHandler = useEffectMock.mock.calls[1][0];
    effectHandler();

    const expectedState: ISessionState = {
      ...sessionStateMock,
      isUnauthExperience: isUnauthExperienceMock,
    };
    expect(sessionStateMock).toEqual(expectedState);
  });

  it('updates isUserAuthenticated when changed', () => {
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      isUserAuthenticated: false,
    };
    const sessionDispatchMock = jest.fn();
    useReducerMock.mockReturnValue([sessionStateMock, sessionDispatchMock]);

    const isUserAuthenticatedMock = true;

    renderer.create(
      <SessionContextProvider isUserAuthenticated={isUserAuthenticatedMock}>
        <ChildMock />
      </SessionContextProvider>
    );

    expect(useEffectMock).toHaveBeenNthCalledWith(3, expect.any(Function), [
      isUserAuthenticatedMock,
    ]);

    const effectHandler = useEffectMock.mock.calls[2][0];
    effectHandler();

    const expectedState: ISessionState = {
      ...sessionStateMock,
      isUserAuthenticated: isUserAuthenticatedMock,
    };
    expect(sessionStateMock).toEqual(expectedState);
  });

  it('calls setCurrentLanguageDispatch with queryLanguage', () => {
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      isUserAuthenticated: false,
    };
    const languageMock = 'Spanish';
    const sessionDispatchMock = jest.fn();
    useReducerMock.mockReturnValue([sessionStateMock, sessionDispatchMock]);

    const isUserAuthenticatedMock = true;
    getQueryLanguageMock.mockReturnValue(languageMock);

    renderer.create(
      <SessionContextProvider isUserAuthenticated={isUserAuthenticatedMock}>
        <ChildMock />
      </SessionContextProvider>
    );

    expect(useEffectMock).toHaveBeenNthCalledWith(4, expect.any(Function), [
      isUserAuthenticatedMock,
      defaultMembershipState.account.languageCode,
    ]);

    const effectHandler = useEffectMock.mock.calls[3][0];
    effectHandler();

    expectToHaveBeenCalledOnceOnlyWith(
      setCurrentLanguageDispatchMock,
      sessionDispatchMock,
      languageMock
    );
  });

  it('calls setCurrentLanguageDispatch with membership language', () => {
    const sessionStateMock: ISessionState = {
      ...defaultSessionState,
      isUserAuthenticated: false,
    };
    const languageMock = 'Spanish';
    const languageCodeMock = 'es';
    const sessionDispatchMock = jest.fn();
    useReducerMock.mockReturnValue([sessionStateMock, sessionDispatchMock]);

    const isUserAuthenticatedMock = true;
    getQueryLanguageMock.mockReset();
    const membershipStateMock = {
      ...defaultMembershipState,
      account: { languageCode: languageCodeMock },
    };
    useMembershipContextMock.mockReturnValue({
      membershipState: membershipStateMock,
    });
    getContentLanguageMock.mockReturnValue(languageMock);

    renderer.create(
      <SessionContextProvider isUserAuthenticated={isUserAuthenticatedMock}>
        <ChildMock />
      </SessionContextProvider>
    );

    expect(useEffectMock).toHaveBeenNthCalledWith(4, expect.any(Function), [
      isUserAuthenticatedMock,
      languageCodeMock,
    ]);

    const effectHandler = useEffectMock.mock.calls[3][0];
    effectHandler();

    expectToHaveBeenCalledOnceOnlyWith(
      setCurrentLanguageDispatchMock,
      sessionDispatchMock,
      languageMock
    );
  });

  it.each([
    ['Spanish' as Language, undefined, true],
    ['Spanish' as Language, undefined, false],
    ['Spanish' as Language, 'Spanish' as Language, true],
    [defaultLanguage, 'Spanish' as Language, true],
  ])(
    'uses state language %s to update query string language %s with appropriate usetrans behavior %s',
    async (
      currentLanguage: Language,
      queryLanguage: Language | undefined,
      usetransMock: boolean
    ) => {
      const configContextMock: IConfigContext = {
        configState: GuestExperienceConfig,
      };
      useConfigContextMock.mockReturnValueOnce(configContextMock);
      const sessionStateMock: ISessionState = {
        ...defaultSessionState,
        currentLanguage,
      };

      const sessionDispatchMock = jest.fn();
      useReducerMock.mockReturnValueOnce([
        sessionStateMock,
        sessionDispatchMock,
      ]);
      getQueryLanguageMock.mockReset();
      getQueryLanguageMock.mockReturnValue(queryLanguage);
      useFlagsMock.mockReset();
      useFlagsMock.mockReturnValue({ usetrans: usetransMock });
      renderer.create(
        <SessionContextProvider>
          <ChildMock />
        </SessionContextProvider>
      );

      expect(useEffectMock).toHaveBeenNthCalledWith(5, expect.any(Function), [
        currentLanguage,
      ]);

      const effectHandler = useEffectMock.mock.calls[4][0];
      await effectHandler();
      if (currentLanguage !== defaultLanguage) {
        if (queryLanguage && queryLanguage !== currentLanguage) {
          expect(updateURLWithFeatureFlagsAndLanguageMock).toHaveBeenCalledWith(
            '/',
            LanguageCodeMap.get(currentLanguage)
          );

          if (usetransMock) {
            expect(windowReloadMock).toHaveBeenCalledTimes(1);
          }
        }
      }
    }
  );

  it('renders as context provider', () => {
    const stateMock: ISessionState = defaultSessionState;
    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([stateMock, dispatchMock]);

    const testRenderer = renderer.create(
      <SessionContextProvider>
        <ChildMock />
      </SessionContextProvider>
    );

    const provider = testRenderer.root.findByType(SessionContext.Provider);

    const expectedContext: ISessionContext = {
      sessionState: stateMock,
      sessionDispatch: dispatchMock,
    };
    expect(provider.props.value).toEqual(expectedContext);
    expect(provider.props.children).toEqual(<ChildMock />);
  });
});
