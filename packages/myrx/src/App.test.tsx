// Copyright 2022 Prescryptive Health, Inc.

// eslint-disable-next-line filename-rules/match
import React, { useEffect, useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  OpenSans_300Light,
  OpenSans_300Light_Italic,
  OpenSans_400Regular,
  OpenSans_400Regular_Italic,
  OpenSans_500Medium,
  OpenSans_500Medium_Italic,
  OpenSans_600SemiBold,
  OpenSans_600SemiBold_Italic,
  OpenSans_700Bold,
  OpenSans_700Bold_Italic,
} from '@expo-google-fonts/open-sans';
import AppLoading from 'expo-app-loading';
import App from './App';
import { initializeFeatureSwitches } from './features/initialize-feature-switches';
import { initializeLocalStorage } from './settings/settings-config';
import {
  initializeTelemetry,
  reactTelemetryPlugin,
} from './telemetry/initialize-telemetry';
import { ITestContainer } from '@phx/common/src/testing/test.container';
import {
  expectToHaveBeenCalledOnceOnlyWith,
  getChildren,
} from '@phx/common/src/testing/test.helper';
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { MediaQueryContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/media-query/media-query.context-provider';
import { Provider } from 'react-redux';
import { ReduxContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/redux/redux.context-provider';
import { ContainerHierarchy } from '@phx/common/src/components/containers/container-hierarchy/container-hierarchy';
import { Navigation } from '@phx/common/src/experiences/guest-experience/navigation/navigation';
import { SessionContextProviderConnected } from '@phx/common/src/experiences/guest-experience/context-providers/session/session.context-provider.connected';
import { MembershipContextProviderConnected } from '@phx/common/src/experiences/guest-experience/context-providers/membership/membership.context-provider.connected';
import { MedicineCabinetContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/medicine-cabinet/medicine-cabinet.context-provider';
import { AppointmentsListContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/appointments-list/appointments-list.context-provider';
import { buildGuestExperienceStore } from '@phx/common/src/experiences/guest-experience/store/store';
import {
  GuestExperienceConfig,
  IGuestExperienceConfig,
} from '@phx/common/src/experiences/guest-experience/guest-experience-config';
import { initializeConfig } from './config/initialize-config';
import { initializeRetryPolicy } from './retry-policy/initialize-retry-policy';
import { initializePayments } from './payments/initialize-payments';
import {
  initializeImageAssets,
  initializeObjectAssets,
} from '@phx/common/src/utils/assets.helper';
import {
  LocalFileSourcesMap,
  LocalStaticFileSourcesMap,
} from './assets/local-assets';
import { initializeIcons } from './icons/initialize-icons';
import { FeaturesContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/features/features.context-provider';
import { ConfigContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/config/config.context-provider';
import { GuestExperienceFeatures } from '@phx/common/src/experiences/guest-experience/guest-experience-features';
import { DrugSearchContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/drug-search/drug-search.context-provider';
import { AccountAndFamilyContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/account-and-family/account-and-family.context-provider';
import { LoadingOverlayConnected } from '@phx/common/src/components/overlays/loading/loading.overlay.connected';
import { LoadingContextProviderConnected } from '@phx/common/src/experiences/guest-experience/context-providers/loading/loading.context-provider.connected';
import { ClaimAlertContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/claim-alert/claim-alert.context-provider';
import * as ld from 'launchdarkly-react-client-sdk';
import { identifyAnonymousUser } from './launch-darkly/identify-anonymous-user';
import { ShoppingContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/shopping/shopping.context-provider';
import { InstallContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/install/install.context-provider';
import * as serviceWorkerRegistration from './service-worker/service-worker-registration';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;

jest.mock('@expo-google-fonts/poppins');
const useFontsMock = useFonts as jest.Mock;

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = ld.useFlags as jest.Mock;
const useLDClientMock = ld.useLDClient as jest.Mock;

jest.mock('./config/initialize-config');
const initializeConfigMock = initializeConfig as jest.Mock;

jest.mock('./features/initialize-feature-switches');
const initializeFeatureSwitchesMock = initializeFeatureSwitches as jest.Mock;

jest.mock('@phx/common/src/utils/assets.helper');
const initializeImageAssetsMock = initializeImageAssets as jest.Mock;
const initializeObjectAssetsMock = initializeObjectAssets as jest.Mock;

jest.mock('./icons/initialize-icons');
const initializeIconsMock = initializeIcons as jest.Mock;

jest.mock('./settings/settings-config');
const initializeLocalStorageMock = initializeLocalStorage as jest.Mock;

jest.mock('./telemetry/initialize-telemetry', () => ({
  initializeTelemetry: jest.fn(),
  reactTelemetryPlugin: jest.fn(),
}));
const initializeTelemetryMock = initializeTelemetry as jest.Mock;

jest.mock('./retry-policy/initialize-retry-policy');
const initializeRetryPolicyMock = initializeRetryPolicy as jest.Mock;

jest.mock('./payments/initialize-payments');
const initializePaymentsMock = initializePayments as jest.Mock;

jest.mock('./launch-darkly/identify-anonymous-user');
const identifyAnonymousUserMock = identifyAnonymousUser as jest.Mock;

jest.mock('./service-worker/service-worker-registration', () => ({
  register: jest.fn(),
  unregister: jest.fn(),
}));
const registerMock = serviceWorkerRegistration.register as jest.Mock;
const unregisterMock = serviceWorkerRegistration.unregister as jest.Mock;

jest.mock('@microsoft/applicationinsights-react-js', () => ({
  ...jest.requireActual<Record<string, unknown>>(
    '@microsoft/applicationinsights-react-js'
  ),
  AppInsightsContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

jest.mock(
  '@phx/common/src/experiences/guest-experience/context-providers/media-query/media-query.context-provider',
  () => ({
    MediaQueryContextProvider: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock('react-redux', () => ({
  Provider: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock(
  '@phx/common/src/experiences/guest-experience/context-providers/redux/redux.context-provider',
  () => ({
    ReduxContextProvider: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '@phx/common/src/experiences/guest-experience/context-providers/drug-search/drug-search.context-provider',
  () => ({
    DrugSearchContextProvider: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '@phx/common/src/experiences/guest-experience/context-providers/account-and-family/account-and-family.context-provider',
  () => ({
    AccountAndFamilyContextProvider: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '@phx/common/src/components/containers/container-hierarchy/container-hierarchy',
  () => ({
    ContainerHierarchy: ({ children }: ITestContainer) => <div>{children}</div>,
  })
);

jest.mock(
  '@phx/common/src/experiences/guest-experience/context-providers/config/config.context-provider',
  () => ({
    ConfigContextProvider: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '@phx/common/src/experiences/guest-experience/context-providers/features/features.context-provider',
  () => ({
    FeaturesContextProvider: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '@phx/common/src/experiences/guest-experience/context-providers/install/install.context-provider',
  () => ({
    InstallContextProvider: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '@phx/common/src/experiences/guest-experience/context-providers/session/session.context-provider.connected',
  () => ({
    SessionContextProviderConnected: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '@phx/common/src/experiences/guest-experience/context-providers/membership/membership.context-provider.connected',
  () => ({
    MembershipContextProviderConnected: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '@phx/common/src/experiences/guest-experience/context-providers/medicine-cabinet/medicine-cabinet.context-provider',
  () => ({
    MedicineCabinetContextProvider: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '@phx/common/src/experiences/guest-experience/context-providers/appointments-list/appointments-list.context-provider',
  () => ({
    AppointmentsListContextProvider: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '@phx/common/src/experiences/guest-experience/navigation/navigation',
  () => ({
    Navigation: () => <div />,
  })
);

jest.mock(
  '@phx/common/src/components/overlays/loading/loading.overlay.connected',
  () => ({
    LoadingOverlayConnected: () => <div />,
  })
);

jest.mock('@phx/common/src/experiences/guest-experience/store/store');
const buildGuestExperienceStoreMock = buildGuestExperienceStore as jest.Mock;

jest.mock(
  '@phx/common/src/experiences/guest-experience/context-providers/loading/loading.context-provider.connected',
  () => ({
    LoadingContextProviderConnected: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '@phx/common/src/experiences/guest-experience/context-providers/claim-alert/claim-alert.context-provider',
  () => ({
    ClaimAlertContextProvider: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

jest.mock(
  '@phx/common/src/experiences/guest-experience/context-providers/shopping/shopping.context-provider',
  () => ({
    ShoppingContextProvider: ({ children }: ITestContainer) => (
      <div>{children}</div>
    ),
  })
);

describe('App', () => {
  const defaultStoreMock = {
    getState: jest.fn(),
    dispatch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useFontsMock.mockReturnValue([true]);
    useStateMock.mockReturnValue([defaultStoreMock, jest.fn()]);

    useFlagsMock.mockReturnValue({});
    useLDClientMock.mockReturnValue({});

    useEffectMock.mockReset();
  });

  it('loads fonts', () => {
    renderer.create(<App />);

    expect(useFontsMock).toHaveBeenCalledTimes(1);
    expect(useFontsMock).toHaveBeenCalledWith({
      Poppins_400Regular,
      Poppins_500Medium,
      Poppins_600SemiBold,
      Poppins_700Bold,
      OpenSans_300Light,
      OpenSans_300Light_Italic,
      OpenSans_400Regular,
      OpenSans_400Regular_Italic,
      OpenSans_500Medium,
      OpenSans_500Medium_Italic,
      OpenSans_600SemiBold,
      OpenSans_600SemiBold_Italic,
      OpenSans_700Bold,
      OpenSans_700Bold_Italic,
    });
  });

  it('performs initializations', async () => {
    const setStoreMock = jest.fn();
    useStateMock.mockReturnValue([defaultStoreMock, setStoreMock]);

    const flagsMock = { flags: 1 };
    useFlagsMock.mockReturnValue(flagsMock);

    const ldClientMock = jest.fn();
    useLDClientMock.mockReturnValue(ldClientMock);

    const storeMock = 'store';
    buildGuestExperienceStoreMock.mockReturnValue(storeMock);

    const configMock: Partial<IGuestExperienceConfig> = {
      telemetry: {
        instrumentationKey: 'instrumentation-key',
        serviceName: 'service-name',
      },
      apis: GuestExperienceConfig.apis,
      payments: {
        experienceBaseUrl: 'base-url',
        publicKey: 'public-key',
        testPublicKey: 'test-public-key',
      },
    };
    initializeConfigMock.mockReturnValue(configMock);

    renderer.create(<App />);

    expect(useEffectMock).toHaveBeenCalledTimes(2);

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
      flagsMock,
    ]);
    expect(useEffectMock).toHaveBeenNthCalledWith(2, expect.any(Function), []);

    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();

    expectToHaveBeenCalledOnceOnlyWith(initializeConfigMock);
    expectToHaveBeenCalledOnceOnlyWith(initializeLocalStorageMock);
    expectToHaveBeenCalledOnceOnlyWith(
      initializeFeatureSwitchesMock,
      configMock,
      flagsMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      initializeImageAssetsMock,
      LocalFileSourcesMap
    );
    expectToHaveBeenCalledOnceOnlyWith(
      initializeObjectAssetsMock,
      LocalStaticFileSourcesMap
    );
    expectToHaveBeenCalledOnceOnlyWith(initializeIconsMock);
    expectToHaveBeenCalledOnceOnlyWith(
      initializeTelemetryMock,
      configMock.telemetry
    );
    expectToHaveBeenCalledOnceOnlyWith(
      initializeRetryPolicyMock,
      GuestExperienceConfig.apis.guestExperienceApi
    );
    expectToHaveBeenCalledOnceOnlyWith(
      initializePaymentsMock,
      configMock.payments
    );
    expectToHaveBeenCalledOnceOnlyWith(identifyAnonymousUserMock, ldClientMock);

    expect(setStoreMock).toHaveBeenCalledWith(storeMock);
  });

  it('calls 2nd useEffect as expected', () => {
    const setStoreMock = jest.fn();
    useStateMock.mockReturnValue([defaultStoreMock, setStoreMock]);

    const flagsMock = { flags: 1 };
    useFlagsMock.mockReturnValue(flagsMock);

    const ldClientMock = jest.fn();
    useLDClientMock.mockReturnValue(ldClientMock);

    const storeMock = 'store';
    buildGuestExperienceStoreMock.mockReturnValue(storeMock);

    const configMock: Partial<IGuestExperienceConfig> = {
      telemetry: {
        instrumentationKey: 'instrumentation-key',
        serviceName: 'service-name',
      },
      apis: GuestExperienceConfig.apis,
      payments: {
        experienceBaseUrl: 'base-url',
        publicKey: 'public-key',
        testPublicKey: 'test-public-key',
      },
    };
    initializeConfigMock.mockReturnValue(configMock);

    renderer.create(<App />);

    const effectHandlerTwo = useEffectMock.mock.calls[1][0];
    const resultTwo = effectHandlerTwo();

    expect(registerMock).toHaveBeenCalledTimes(1);

    resultTwo();

    expect(unregisterMock).toHaveBeenCalledTimes(1);
  });

  it('Use v2 endpoint if useblockchain feature flag is given', async () => {
    const setStoreMock = jest.fn();
    useStateMock.mockReturnValue([defaultStoreMock, setStoreMock]);
    const featureHelper = jest.requireActual(
      '@phx/common/src/experiences/guest-experience/guest-experience-features'
    );
    const flagsMock = { flags: 1 };
    jest.spyOn(ld, 'useFlags').mockReturnValue(flagsMock);

    featureHelper.GuestExperienceFeatures = {
      ...GuestExperienceFeatures,
      useblockchain: true,
    };
    const storeMock = 'store';
    buildGuestExperienceStoreMock.mockReturnValue(storeMock);

    const configMock: Partial<IGuestExperienceConfig> = {
      telemetry: {
        instrumentationKey: 'instrumentation-key',
        serviceName: 'service-name',
      },
      apis: GuestExperienceConfig.apis,
      payments: {
        experienceBaseUrl: 'base-url',
        publicKey: 'public-key',
        testPublicKey: 'test-public-key',
      },
    };
    initializeConfigMock.mockReturnValue(configMock);

    renderer.create(<App />);

    expect(useEffectMock).toHaveBeenCalledTimes(2);
    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
      flagsMock,
    ]);

    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();

    expect(initializeConfigMock).toHaveBeenCalledWith();
    expect(initializeLocalStorageMock).toHaveBeenCalledWith();
    expect(initializeFeatureSwitchesMock).toHaveBeenCalledWith(
      configMock,
      flagsMock
    );
    expect(initializeImageAssetsMock).toHaveBeenCalledWith(LocalFileSourcesMap);
    expect(initializeObjectAssetsMock).toHaveBeenCalledWith(
      LocalStaticFileSourcesMap
    );
    expect(initializeIconsMock).toHaveBeenCalledWith();
    expect(initializeTelemetryMock).toHaveBeenCalledWith(configMock.telemetry);
    expect(initializeRetryPolicyMock).toHaveBeenCalledWith(
      GuestExperienceConfig.apis.guestExperienceApi
    );
    expect(initializePaymentsMock).toHaveBeenCalledWith(configMock.payments);

    expect(setStoreMock).toHaveBeenCalledWith(storeMock);
    expect(GuestExperienceConfig.apis.guestExperienceApi.env.version).toBe(
      `v2`
    );
  });

  it('logs error if initializations fail', async () => {
    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => true);

    const errorMessageMock = 'local-storage-failure';
    initializeLocalStorageMock.mockImplementation(() => {
      throw Error(errorMessageMock);
    });

    renderer.create(<App />);

    expect(useEffectMock).toHaveBeenCalledTimes(2);
    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
      {},
    ]);

    const effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();

    expect(consoleErrorMock).toHaveBeenCalledWith(
      `Initialization failed -- ${errorMessageMock}`
    );
    consoleErrorMock.mockReset();
  });

  it('returns AppLoading if fonts not loaded', () => {
    useFontsMock.mockReturnValue([false]);
    useStateMock.mockReturnValue([defaultStoreMock, jest.fn()]);

    const testRenderer = renderer.create(<App />);

    const appLoading = testRenderer.root.children[0] as ReactTestInstance;
    expect(appLoading.type).toEqual(AppLoading);
  });

  it('returns AppLoading if store not initialized', () => {
    useFontsMock.mockReturnValue([true]);
    useStateMock.mockReturnValue([undefined, jest.fn()]);

    const testRenderer = renderer.create(<App />);

    const appLoading = testRenderer.root.children[0] as ReactTestInstance;
    expect(appLoading.type).toEqual(AppLoading);
  });

  it('renders in AppInsights context provider', () => {
    useFontsMock.mockReturnValue([true]);

    const testRenderer = renderer.create(<App />);

    const appInsightsContextProvider = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(appInsightsContextProvider.type).toEqual(
      AppInsightsContext.Provider
    );
    expect(appInsightsContextProvider.props.value).toEqual(
      reactTelemetryPlugin
    );
    expect(getChildren(appInsightsContextProvider).length).toEqual(1);
  });

  it('renders Media Query context provider', () => {
    useFontsMock.mockReturnValue([true]);

    const testRenderer = renderer.create(<App />);

    const appInsightsContextProvider = testRenderer.root.findByType(
      AppInsightsContext.Provider
    );
    const mediaQueryContextProvider = getChildren(
      appInsightsContextProvider
    )[0];

    expect(mediaQueryContextProvider.type).toEqual(MediaQueryContextProvider);
    expect(getChildren(mediaQueryContextProvider).length).toEqual(1);
  });

  it('renders Redux provider', () => {
    useFontsMock.mockReturnValue([true]);
    useStateMock.mockReturnValue([defaultStoreMock, jest.fn()]);

    const testRenderer = renderer.create(<App />);

    const mediaQueryContextProvider = testRenderer.root.findByType(
      MediaQueryContextProvider
    );
    const reduxProvider = getChildren(mediaQueryContextProvider)[0];

    expect(reduxProvider.type).toEqual(Provider);
    expect(reduxProvider.props.store).toEqual(defaultStoreMock);
    expect(getChildren(reduxProvider).length).toEqual(1);
  });

  it('renders Redux context provider', () => {
    useFontsMock.mockReturnValue([true]);

    const getStateMock = jest.fn();
    const dispatchMock = jest.fn();
    const storeMock = {
      ...defaultStoreMock,
      getState: getStateMock,
      dispatch: dispatchMock,
    };
    useStateMock.mockReturnValue([storeMock, jest.fn()]);

    const testRenderer = renderer.create(<App />);

    const reduxProvider = testRenderer.root.findByType(Provider);
    const reduxContextProvider = getChildren(reduxProvider)[0];

    expect(reduxContextProvider.type).toEqual(ReduxContextProvider);
    expect(reduxContextProvider.props.getState).toEqual(getStateMock);
    expect(reduxContextProvider.props.dispatch).toEqual(dispatchMock);
    expect(getChildren(reduxContextProvider).length).toEqual(1);
  });

  it('renders container hierarchy', () => {
    useFontsMock.mockReturnValue([true]);

    const testRenderer = renderer.create(<App />);

    const reduxContextProvider =
      testRenderer.root.findByType(ReduxContextProvider);
    const containerHierarchy = getChildren(reduxContextProvider)[0];

    expect(containerHierarchy.type).toEqual(ContainerHierarchy);
    expect(containerHierarchy.props.containerList).toEqual([
      ConfigContextProvider,
      FeaturesContextProvider,
      InstallContextProvider,
      SessionContextProviderConnected,
      MembershipContextProviderConnected,
      MedicineCabinetContextProvider,
      AppointmentsListContextProvider,
      DrugSearchContextProvider,
      AccountAndFamilyContextProvider,
      LoadingContextProviderConnected,
      ClaimAlertContextProvider,
      ShoppingContextProvider,
    ]);
    expect(getChildren(containerHierarchy).length).toEqual(2);
  });

  it('renders Navigation component', () => {
    useFontsMock.mockReturnValue([true]);

    const testRenderer = renderer.create(<App />);

    const containerHierarchy = testRenderer.root.findByType(ContainerHierarchy);
    const navigation = getChildren(containerHierarchy)[0];

    expect(navigation.type).toEqual(Navigation);
  });

  it('renders LoadingOverlay component', () => {
    useFontsMock.mockReturnValue([true]);

    const testRenderer = renderer.create(<App />);

    const containerHierarchy = testRenderer.root.findByType(ContainerHierarchy);
    const loadingOverlay = getChildren(containerHierarchy)[1];

    expect(loadingOverlay.type).toEqual(LoadingOverlayConnected);
  });

  it('it updates flags when ', async () => {
    const flagsMock1 = { flags: 1 };
    const flagsMock2 = { flags: 2 };

    initializeLocalStorageMock.mockReset();

    useFlagsMock.mockReturnValueOnce(flagsMock1);
    const configMock: Partial<IGuestExperienceConfig> = {
      telemetry: {
        instrumentationKey: 'instrumentation-key',
        serviceName: 'service-name',
      },
      apis: GuestExperienceConfig.apis,
      payments: {
        experienceBaseUrl: 'base-url',
        publicKey: 'public-key',
        testPublicKey: 'test-public-key',
      },
    };
    initializeConfigMock.mockReturnValue(configMock);
    let testRenderer: renderer.ReactTestRenderer;
    renderer.act(() => {
      testRenderer = renderer.create(<App />);
    });
    let effectHandler = useEffectMock.mock.calls[0][0];
    await effectHandler();
    expectToHaveBeenCalledOnceOnlyWith(
      initializeFeatureSwitchesMock,
      configMock,
      flagsMock1
    );
    useFlagsMock.mockReturnValueOnce(flagsMock2);
    renderer.act(() => {
      testRenderer.update(<App />);
    });

    effectHandler = useEffectMock.mock.calls[2][0];
    await effectHandler();
    expect(initializeFeatureSwitchesMock).toHaveBeenCalledTimes(2);
    expect(initializeFeatureSwitchesMock).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      flagsMock2
    );
  });
});
