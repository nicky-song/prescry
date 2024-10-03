// Copyright 2021 Prescryptive Health, Inc.

// eslint-disable-next-line filename-rules/match
import React, {
  ReactElement,
  ComponentType,
  useEffect,
  useState,
  useRef,
} from 'react';
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
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { MediaQueryContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/media-query/media-query.context-provider';
import { ReduxContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/redux/redux.context-provider';
import { ConfigContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/config/config.context-provider';
import { FeaturesContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/features/features.context-provider';
import { InstallContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/install/install.context-provider';
import { ContainerHierarchy } from '@phx/common/src/components/containers/container-hierarchy/container-hierarchy';
import { SessionContextProviderConnected } from '@phx/common/src/experiences/guest-experience/context-providers/session/session.context-provider.connected';
import { DrugSearchContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/drug-search/drug-search.context-provider';
import { MembershipContextProviderConnected } from '@phx/common/src/experiences/guest-experience/context-providers/membership/membership.context-provider.connected';
import { MedicineCabinetContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/medicine-cabinet/medicine-cabinet.context-provider';
import { LoadingContextProviderConnected } from '@phx/common/src/experiences/guest-experience/context-providers/loading/loading.context-provider.connected';
import { AppointmentsListContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/appointments-list/appointments-list.context-provider';
import { buildGuestExperienceStore } from '@phx/common/src/experiences/guest-experience/store/store';
import { Navigation } from '@phx/common/src/experiences/guest-experience/navigation/navigation';
import { initializeLocalStorage } from './settings/settings-config';
import { initializeFeatureSwitches } from './features/initialize-feature-switches';
import {
  initializeTelemetry,
  reactTelemetryPlugin,
} from './telemetry/initialize-telemetry';
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js';
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
import { GuestExperienceFeatures } from '@phx/common/src/experiences/guest-experience/guest-experience-features';
import { GuestExperienceConfig } from '@phx/common/src/experiences/guest-experience/guest-experience-config';
import { LoadingOverlayConnected } from '@phx/common/src/components/overlays/loading/loading.overlay.connected';
import { AccountAndFamilyContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/account-and-family/account-and-family.context-provider';
import { ClaimAlertContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/claim-alert/claim-alert.context-provider';
import { ShoppingContextProvider } from '@phx/common/src/experiences/guest-experience/context-providers/shopping/shopping.context-provider';
import { useFlags, useLDClient } from 'launchdarkly-react-client-sdk';
import { identifyAnonymousUser } from './launch-darkly/identify-anonymous-user';
import * as serviceWorkerRegistration from './service-worker/service-worker-registration';

export default function App(): ReactElement {
  const ldFlags = useFlags();
  const ldClient = useLDClient();

  const [areFontsLoaded] = useFonts({
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

  const [store, setStore] = useState<Store>();

  const prevLdFlags = useRef(ldFlags);

  useEffect(() => {
    if (ldFlags !== prevLdFlags.current) {
      initializeFeatureSwitches(GuestExperienceConfig, ldFlags);

      if (GuestExperienceFeatures.useblockchain) {
        GuestExperienceConfig.apis.guestExperienceApi.env.version = 'v2';
      }
      prevLdFlags.current = ldFlags;
      return;
    }

    const initializations = async () => {
      try {
        const config = initializeConfig();

        await Promise.all([
          initializeLocalStorage(),
          initializeFeatureSwitches(config, ldFlags),
          initializeImageAssets(LocalFileSourcesMap),
          initializeObjectAssets(LocalStaticFileSourcesMap),
          initializeIcons(),
          initializeTelemetry(config.telemetry),
          initializeRetryPolicy(config.apis.guestExperienceApi),
          initializePayments(config.payments),
          identifyAnonymousUser(ldClient),
        ]);

        setStore(buildGuestExperienceStore());
        if (GuestExperienceFeatures.useblockchain) {
          GuestExperienceConfig.apis.guestExperienceApi.env.version = 'v2';
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Initialization failed -- ${(error as Error).message}`);
      }
    };

    void initializations();
  }, [ldFlags]);

  useEffect(() => {
    serviceWorkerRegistration.register();

    return () => {
      serviceWorkerRegistration.unregister();
    };
  }, []);

  if (!areFontsLoaded || !store) {
    return <AppLoading />;
  }

  const { getState, dispatch } = store;

  return (
    <AppInsightsContext.Provider value={reactTelemetryPlugin}>
      <MediaQueryContextProvider>
        <Provider store={store}>
          <ReduxContextProvider getState={getState} dispatch={dispatch}>
            <ContainerHierarchy
              containerList={[
                ConfigContextProvider,
                FeaturesContextProvider,
                InstallContextProvider,
                SessionContextProviderConnected as ComponentType,
                MembershipContextProviderConnected as ComponentType,
                MedicineCabinetContextProvider,
                AppointmentsListContextProvider,
                DrugSearchContextProvider,
                AccountAndFamilyContextProvider,
                LoadingContextProviderConnected as ComponentType,
                ClaimAlertContextProvider,
                ShoppingContextProvider,
              ]}
            >
              <Navigation />
              <LoadingOverlayConnected />
            </ContainerHierarchy>
          </ReduxContextProvider>
        </Provider>
      </MediaQueryContextProvider>
    </AppInsightsContext.Provider>
  );
}
