// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { useSessionContext } from '../..//context-providers/session/use-session-context.hook';
import { useMembershipContext } from '../../context-providers/membership/use-membership-context.hook';
import { useReduxContext } from '../../context-providers/redux/use-redux-context.hook';
import { setCurrentLanguageDispatch } from '../../state/session/dispatch/set-current-language.dispatch';
import { languageCodeAsyncAction } from '../../store/language-code/async-actions/language-code.async-action';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { ProtectedView } from '../../../../components/containers/protected-view/protected-view';
import {
  IRadioButtonOption,
  RadioButtonToggleHandle,
  RadioButtonToggle,
} from '../../../../components/member/radio-button-toggle/radio-button-toggle';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { SelectLanguageNavigationProp } from '../../navigation/stack-navigators/root/root.stack-navigator';

import {
  ISelectLanguageScreenContent,
  selectLanguageOptions,
} from './select-language.screen.content';
import { selectLanguageScreenStyles as styles } from './select-language.screen.styles';
import {
  Language,
  LanguageCode,
  LanguageCodeMap,
  defaultLanguage as appDefaultLanguage,
  defaultLanguageCode as appDefaultLanguageCode,
} from '../../../../models/language';
import { getContentLanguage } from '../../../../utils/translation/get-content-language.helper';
import { updateURLWithFeatureFlagsAndLanguage } from '../../../../experiences/guest-experience/store/navigation/update-url-with-feature-flags-and-language';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { SetLanguageErrorNotification } from '../../../../components/notifications/set-language-error/set-language-error.notification';
import { setLanguageCodeDispatch as setMemberLanguageCodeDispatch } from '../../state/membership/dispatch/set-language-code.dispatch';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { IFeaturesState } from '../../../../experiences/guest-experience/guest-experience-features';

export const SelectLanguageScreen = (): ReactElement => {
  const navigation = useNavigation<SelectLanguageNavigationProp>();

  const { content, isContentLoading, fetchCMSContent } =
    useContent<ISelectLanguageScreenContent>(
      CmsGroupKey.selectLanguage,
      2,
      undefined,
      true
    );

  const { sessionState, sessionDispatch } = useSessionContext();
  const { useVietnamese } = useFlags<IFeaturesState>();

  const { membershipState: memberProfile, membershipDispatch } =
    useMembershipContext();

  const userDefaultLanguage = sessionState.isUserAuthenticated
    ? memberProfile.account.languageCode
      ? getContentLanguage(memberProfile.account.languageCode)
      : sessionState.currentLanguage
    : sessionState.currentLanguage;

  const [selectedLanguage, setSelectedLanguage] = useState(userDefaultLanguage);
  const [prevSelectedLanguage, setPrevSelectedLanguage] =
    useState(userDefaultLanguage);
  const initialLanguage = useRef(userDefaultLanguage);

  const options: IRadioButtonOption[] = [];
  selectLanguageOptions
    .filter((lang) => (useVietnamese ? lang : lang[0] !== 'Vietnamese'))
    .forEach((lang, index) => {
      const subLabel = lang[0] === appDefaultLanguage ? undefined : lang[0];

      options.push({
        label: lang[1],
        subLabel,
        value: index,
      });
    });

  const defaultSelectedOption = options.find((x) => {
    return x.subLabel === userDefaultLanguage;
  });
  const defaultSelectedOptionValue = defaultSelectedOption
    ? defaultSelectedOption.value
    : 0;

  const selectOption = (optionValue: number) => {
    const selectedOption = options.find((x) => x.value === optionValue);
    let lang: Language;

    if (selectedOption) {
      lang = selectedOption.subLabel
        ? (selectedOption.subLabel as Language)
        : appDefaultLanguage;
    } else {
      lang = userDefaultLanguage;
    }

    setPrevSelectedLanguage(selectedLanguage);
    setSelectedLanguage(lang);
  };

  const { dispatch: reduxDispatch, getState: reduxGetState } =
    useReduxContext();

  const [isAsyncActionError, setIsAsyncActionError] = useState(false);

  const setAuthMemberLanguage = async (languageCode: LanguageCode) => {
    return await languageCodeAsyncAction({
      languageCode,
      navigation,
      membershipDispatch,
      reduxDispatch,
      reduxGetState,
      showSpinner: true,
    });
  };

  const setCurrentLanguage = (selectedLanguage: Language) => {
    setCurrentLanguageDispatch(sessionDispatch, selectedLanguage);
    void fetchCMSContent(selectedLanguage);
  };

  useEffect(() => {
    if (selectedLanguage === prevSelectedLanguage) {
      return;
    }

    const languageCode =
      LanguageCodeMap.get(selectedLanguage) || appDefaultLanguageCode;
    updateURLWithFeatureFlagsAndLanguage(location.pathname, languageCode, true);

    if (sessionState.isUserAuthenticated) {
      setAuthMemberLanguage(languageCode).then((result) => {
        if (result) {
          setCurrentLanguage(selectedLanguage);
        } else {
          revertSelectOption();
          setIsAsyncActionError(true);
        }
      });
    } else {
      setCurrentLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  const radioButtonsToggleRef = useRef<RadioButtonToggleHandle>(null);

  const revertSelectOption = () => {
    setSelectedLanguage(prevSelectedLanguage);

    const languageCode =
      LanguageCodeMap.get(prevSelectedLanguage) || appDefaultLanguageCode;
    updateURLWithFeatureFlagsAndLanguage(location.pathname, languageCode, true);
    setMemberLanguageCodeDispatch(membershipDispatch, languageCode);

    const prevSelectedOption = options.find((x) => {
      return x.subLabel === prevSelectedLanguage;
    });
    const prevSelectedOptionValue = prevSelectedOption
      ? prevSelectedOption.value
      : 0;

    radioButtonsToggleRef.current?.selectOption(prevSelectedOptionValue);
  };

  const pageContent = (
    <ProtectedView>
      {options.length ? (
        <RadioButtonToggle
          onOptionSelected={selectOption}
          options={options}
          defaultSelectedOption={defaultSelectedOptionValue}
          viewStyle={styles.radioButtonToggleViewStyle}
          checkBoxContainerViewStyle={styles.checkBoxContainerViewStyle}
          buttonViewStyle={styles.radioButtonViewStyle}
          buttonTopTextStyle={styles.radioButtonTopTextStyle}
          buttonBottomTextStyle={styles.radioButtonBottomTextStyle}
          ref={radioButtonsToggleRef}
        />
      ) : null}
    </ProtectedView>
  );

  const body = (
    <BodyContentContainer
      title={content.selectLanguageTitle}
      testID='selectLanguageScreen'
      isSkeleton={isContentLoading || !content.selectLanguageTitle}
      translateTitle={false}
    >
      {pageContent}
    </BodyContentContainer>
  );

  const onNavigateBack = () => {
    if (sessionState.currentLanguage === initialLanguage.current) {
      navigation.goBack();
    } else {
      window.location.reload();
    }
  };

  const onNotificationClose = () => {
    setIsAsyncActionError(false);
  };

  const notification = isAsyncActionError ? (
    <SetLanguageErrorNotification onClose={onNotificationClose} />
  ) : undefined;

  return (
    <BasicPageConnected
      body={body}
      navigateBack={onNavigateBack}
      showProfileAvatar={true}
      notification={notification}
    />
  );
};
