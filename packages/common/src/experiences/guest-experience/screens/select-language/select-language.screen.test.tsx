// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import {
  expectToHaveBeenCalledOnceOnlyWith,
  getChildren,
} from '../../../../testing/test.helper';
import { ISessionContext } from '../../../../experiences/guest-experience/context-providers/session/session.context';
import { useSessionContext } from '../../../../experiences/guest-experience/context-providers/session/use-session-context.hook';
import { setCurrentLanguageDispatch } from '../../../../experiences/guest-experience/state/session/dispatch/set-current-language.dispatch';
import {
  defaultSessionState,
  ISessionState,
} from '../../../../experiences/guest-experience/state/session/session.state';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { Language, LanguageCode } from '../../../../models/language';
import { SelectLanguageScreen } from './select-language.screen';
import { selectLanguageScreenStyles as styles } from './select-language.screen.styles';
import { ProtectedView } from '../../../../components/containers/protected-view/protected-view';
import {
  IRadioButtonOption,
  RadioButtonToggle,
} from '../../../../components/member/radio-button-toggle/radio-button-toggle';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { IContentWithIsLoading } from '../../../../models/cms-content/content-with-isloading.model';
import { ISelectLanguageScreenContent } from './select-language.screen.content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { IMembershipContext } from '../../context-providers/membership/membership.context';
import { useMembershipContext } from '../../context-providers/membership/use-membership-context.hook';
import { defaultMembershipState } from '../../state/membership/membership.state';
import { updateURLWithFeatureFlagsAndLanguage } from '../../../../experiences/guest-experience/store/navigation/update-url-with-feature-flags-and-language';
import { languageCodeAsyncAction } from '../../store/language-code/async-actions/language-code.async-action';
import { SetLanguageErrorNotification } from '../../../../components/notifications/set-language-error/set-language-error.notification';
import { useFlags } from 'launchdarkly-react-client-sdk';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../../../experiences/guest-experience/context-providers/session/use-session-context.hook'
);
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock(
  '../../../../experiences/guest-experience/state/session/dispatch/set-current-language.dispatch'
);
const setCurrentLanguageDispatchMock = setCurrentLanguageDispatch as jest.Mock;

jest.mock(
  '../../../../experiences/guest-experience/store/navigation/update-url-with-feature-flags-and-language'
);
const updateUrlMock = updateURLWithFeatureFlagsAndLanguage as jest.Mock;

jest.mock('../../store/language-code/async-actions/language-code.async-action');
const languageCodeAsyncActionMock = languageCodeAsyncAction as jest.Mock;

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
  useRef: jest.fn(),
}));
const useEffectMock = useEffect as jest.Mock;
const useStateMock = useState as jest.Mock;

const sessionDispatchMock = jest.fn();
const membershipDispatchMock = jest.fn();
const fetchCMSContentMock = jest.fn();
const setSelectedLanguageMock = jest.fn();
const setPrevSelectedLanguageMock = jest.fn();
const setIsAsyncActionErrorMock = jest.fn();

const englishLangCodeMock: LanguageCode = 'en';
const englishLangMock: Language = 'English';
const englishValueMock = 0;
const spanishLangCodeMock: LanguageCode = 'es';
const spanishLangMock: Language = 'Spanish';
const spanishValueMock = 1;
const vietnameseLangCodeMock: LanguageCode = 'vi';
const vietnameseLangMock: Language = 'Vietnamese';
const vietnameseValueMock = 2;

const defaultOptionsMock: IRadioButtonOption[] = [
  {
    label: 'English',
    value: 0,
  },
  {
    label: 'Español',
    subLabel: 'Spanish',
    value: 1,
  },
];

const allLangOptionsMock: IRadioButtonOption[] = [
  {
    label: 'English',
    value: 0,
  },
  {
    label: 'Español',
    subLabel: 'Spanish',
    value: 1,
  },
  {
    label: 'tiếng Việt',
    subLabel: 'Vietnamese',
    value: 2,
  },
];

function sessionContextReset(
  isUserAuthenticated = true,
  currentLanguage = englishLangMock
): void {
  const sessionStateMock: ISessionState = {
    ...defaultSessionState,
    isUserAuthenticated,
    currentLanguage,
  };

  const sessionContextMock: ISessionContext = {
    sessionState: sessionStateMock,
    sessionDispatch: sessionDispatchMock,
  };

  useSessionContextMock.mockReset();
  useSessionContextMock.mockReturnValue(sessionContextMock);
}

function membershipContextReset(
  languageCode: LanguageCode = englishLangCodeMock
): void {
  const membershipContextMock: IMembershipContext = {
    membershipDispatch: membershipDispatchMock,
    membershipState: {
      ...defaultMembershipState,
      account: {
        ...defaultMembershipState.account,
        languageCode,
      },
    },
  };

  useMembershipContextMock.mockReset();
  useMembershipContextMock.mockReturnValue(membershipContextMock);
}

function stateReset(
  selectedLanguage: Language = englishLangMock,
  prevSelectedLanguage: Language = englishLangMock,
  isAsyncActionError = false
) {
  const stateMock_1 = [selectedLanguage, setSelectedLanguageMock];
  const stateMock_2 = [prevSelectedLanguage, setPrevSelectedLanguageMock];
  const stateMock_3 = [isAsyncActionError, setIsAsyncActionErrorMock];

  useStateMock.mockReset();
  useStateMock
    .mockReturnValueOnce(stateMock_1)
    .mockReturnValueOnce(stateMock_2)
    .mockReturnValueOnce(stateMock_3);
}

describe('SelectLanguageScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<ISelectLanguageScreenContent>>
    > = {
      content: {},
      isContentLoading: false,
      fetchCMSContent: fetchCMSContentMock,
    };
    useFlagsMock.mockReturnValue({});
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    sessionContextReset();
    membershipContextReset();
    stateReset();
  });

  it('should get content from CMS', () => {
    renderer.create(<SelectLanguageScreen />);

    expectToHaveBeenCalledOnceOnlyWith(
      useContentMock,
      CmsGroupKey.selectLanguage,
      2,
      undefined,
      true
    );
  });

  it('should render as BasicPage', () => {
    const testRenderer = renderer.create(<SelectLanguageScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.body).toBeDefined();
    expect(basicPage.props.navigateBack).toEqual(expect.any(Function));
    expect(basicPage.props.showProfileAvatar).toEqual(true);
  });

  it('should render body container', () => {
    const selectLanguageTitleMock = 'Select language';
    const contentMock: Partial<ISelectLanguageScreenContent> = {
      selectLanguageTitle: selectLanguageTitleMock,
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<ISelectLanguageScreenContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };

    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(<SelectLanguageScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(BodyContentContainer);
    expect(bodyContainer.props.title).toEqual(selectLanguageTitleMock);
    expect(bodyContainer.props.testID).toEqual('selectLanguageScreen');
    expect(bodyContainer.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(bodyContainer.props.translateTitle).toEqual(false);
    expect(getChildren(bodyContainer).length).toEqual(1);
  });

  it('should render skeleton for title if it has no text', () => {
    const emptyTitleMock = '';

    const contentMock: Partial<ISelectLanguageScreenContent> = {
      selectLanguageTitle: emptyTitleMock,
    };
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<ISelectLanguageScreenContent>>
    > = {
      isContentLoading: false,
      content: contentMock,
    };

    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(<SelectLanguageScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.props.title).toEqual(emptyTitleMock);
    expect(bodyContainer.props.isSkeleton).toEqual(true);
    expect(getChildren(bodyContainer).length).toEqual(1);
  });

  it('should render RadioButtonToggle correctly', () => {
    useFlagsMock.mockReturnValue({
      useVietnamese: false,
    });
    const testRenderer = renderer.create(<SelectLanguageScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const radioButtonToggleView = getChildren(bodyContainer)[0];

    expect(radioButtonToggleView.type).toEqual(ProtectedView);

    const radioButtonToggle = getChildren(radioButtonToggleView)[0];

    expect(radioButtonToggle.type).toEqual(RadioButtonToggle);
    expect(radioButtonToggle.props.onOptionSelected).toBeDefined();
    expect(radioButtonToggle.props.options).toEqual(defaultOptionsMock);
    expect(radioButtonToggle.props.defaultSelectedOption).toEqual(
      englishValueMock
    );
    expect(radioButtonToggle.props.viewStyle).toEqual(
      styles.radioButtonToggleViewStyle
    );
    expect(radioButtonToggle.props.checkBoxContainerViewStyle).toEqual(
      styles.checkBoxContainerViewStyle
    );
    expect(radioButtonToggle.props.buttonViewStyle).toEqual(
      styles.radioButtonViewStyle
    );
    expect(radioButtonToggle.props.buttonTopTextStyle).toEqual(
      styles.radioButtonTopTextStyle
    );
    expect(radioButtonToggle.props.buttonBottomTextStyle).toEqual(
      styles.radioButtonBottomTextStyle
    );
  });

  it('should render RadioButtonToggle correctly - if useVietnamese flag is enabled', () => {
    useFlagsMock.mockReturnValue({
      useVietnamese: true,
    });
    const testRenderer = renderer.create(<SelectLanguageScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const radioButtonToggleView = getChildren(bodyContainer)[0];

    expect(radioButtonToggleView.type).toEqual(ProtectedView);

    const radioButtonToggle = getChildren(radioButtonToggleView)[0];

    expect(radioButtonToggle.type).toEqual(RadioButtonToggle);
    expect(radioButtonToggle.props.onOptionSelected).toBeDefined();
    expect(radioButtonToggle.props.options).toEqual(allLangOptionsMock);
    expect(radioButtonToggle.props.defaultSelectedOption).toEqual(
      englishValueMock
    );
    expect(radioButtonToggle.props.viewStyle).toEqual(
      styles.radioButtonToggleViewStyle
    );
    expect(radioButtonToggle.props.checkBoxContainerViewStyle).toEqual(
      styles.checkBoxContainerViewStyle
    );
    expect(radioButtonToggle.props.buttonViewStyle).toEqual(
      styles.radioButtonViewStyle
    );
    expect(radioButtonToggle.props.buttonTopTextStyle).toEqual(
      styles.radioButtonTopTextStyle
    );
    expect(radioButtonToggle.props.buttonBottomTextStyle).toEqual(
      styles.radioButtonBottomTextStyle
    );
  });

  it('should set current language from member profile if user is authenticated', () => {
    membershipContextReset(spanishLangCodeMock);
    stateReset(spanishLangMock, spanishLangMock);

    const testRenderer = renderer.create(<SelectLanguageScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const radioButtonToggleView = getChildren(bodyContainer)[0];
    const radioButtonToggle = getChildren(radioButtonToggleView)[0];

    expect(useStateMock).toHaveBeenNthCalledWith(1, spanishLangMock);
    expect(useStateMock).toHaveBeenNthCalledWith(2, spanishLangMock);
    expect(useStateMock).toHaveBeenNthCalledWith(3, false);

    expectToHaveBeenCalledOnceOnlyWith(useEffectMock, expect.any(Function), [
      spanishLangMock,
    ]);

    expect(radioButtonToggle.props.defaultSelectedOption).toEqual(
      spanishValueMock
    );
  });

  it('should set current language from member profile if user is authenticated- if useVietnamese flag is enabled', () => {
    useFlagsMock.mockReturnValue({
      useVietnamese: true,
    });
    membershipContextReset(vietnameseLangCodeMock);
    stateReset(vietnameseLangMock, vietnameseLangMock);

    const testRenderer = renderer.create(<SelectLanguageScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const radioButtonToggleView = getChildren(bodyContainer)[0];
    const radioButtonToggle = getChildren(radioButtonToggleView)[0];

    expect(useStateMock).toHaveBeenNthCalledWith(1, vietnameseLangMock);
    expect(useStateMock).toHaveBeenNthCalledWith(2, vietnameseLangMock);
    expect(useStateMock).toHaveBeenNthCalledWith(3, false);

    expectToHaveBeenCalledOnceOnlyWith(useEffectMock, expect.any(Function), [
      vietnameseLangMock,
    ]);

    expect(radioButtonToggle.props.defaultSelectedOption).toEqual(
      vietnameseValueMock
    );
  });

  it('should set current language from session state if user is un-authenticated', () => {
    sessionContextReset(false, spanishLangMock);
    stateReset(spanishLangMock, spanishLangMock);

    const testRenderer = renderer.create(<SelectLanguageScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const radioButtonToggleView = getChildren(bodyContainer)[0];
    const radioButtonToggle = getChildren(radioButtonToggleView)[0];

    expect(useStateMock).toHaveBeenNthCalledWith(1, spanishLangMock);
    expect(useStateMock).toHaveBeenNthCalledWith(2, spanishLangMock);
    expect(useStateMock).toHaveBeenNthCalledWith(3, false);

    expectToHaveBeenCalledOnceOnlyWith(useEffectMock, expect.any(Function), [
      spanishLangMock,
    ]);

    expect(radioButtonToggle.props.defaultSelectedOption).toEqual(
      spanishValueMock
    );
  });

  it('should set current language from session state if user is un-authenticated - if useVietnamese flag is enabled', () => {
    useFlagsMock.mockReturnValue({
      useVietnamese: true,
    });
    sessionContextReset(false, vietnameseLangMock);
    stateReset(vietnameseLangMock, vietnameseLangMock);

    const testRenderer = renderer.create(<SelectLanguageScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const radioButtonToggleView = getChildren(bodyContainer)[0];
    const radioButtonToggle = getChildren(radioButtonToggleView)[0];

    expect(useStateMock).toHaveBeenNthCalledWith(1, vietnameseLangMock);
    expect(useStateMock).toHaveBeenNthCalledWith(2, vietnameseLangMock);
    expect(useStateMock).toHaveBeenNthCalledWith(3, false);

    expectToHaveBeenCalledOnceOnlyWith(useEffectMock, expect.any(Function), [
      vietnameseLangMock,
    ]);

    expect(radioButtonToggle.props.defaultSelectedOption).toEqual(
      vietnameseValueMock
    );
  });

  it('should update selectedLanguage and prevSelectedLanguage if user selects another radio button', () => {
    const testRenderer = renderer.create(<SelectLanguageScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const radioButtonToggleView = getChildren(bodyContainer)[0];
    const radioButtonToggle = getChildren(radioButtonToggleView)[0];

    const onOptionSelected = radioButtonToggle.props.onOptionSelected;
    onOptionSelected(spanishValueMock);

    expectToHaveBeenCalledOnceOnlyWith(
      setSelectedLanguageMock,
      spanishLangMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      setPrevSelectedLanguageMock,
      englishLangMock
    );
  });

  it("should update the user's current language if selectedLanguage changes and user is authenticated", () => {
    stateReset(vietnameseLangMock);

    renderer.create(<SelectLanguageScreen />);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    expectToHaveBeenCalledOnceOnlyWith(
      updateUrlMock,
      location.pathname,
      vietnameseLangCodeMock,
      true
    );

    expectToHaveBeenCalledOnceOnlyWith(languageCodeAsyncActionMock, {
      languageCode: vietnameseLangCodeMock,
      navigation: rootStackNavigationMock,
      membershipDispatch: membershipDispatchMock,
      reduxDispatch: expect.any(Function),
      reduxGetState: expect.any(Function),
      showSpinner: true,
    });
  });

  it("should update the user's current language if selectedLanguage changes and user is authenticated and selectedLanguage is Vietnamese", () => {
    stateReset(spanishLangMock);

    renderer.create(<SelectLanguageScreen />);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    expectToHaveBeenCalledOnceOnlyWith(
      updateUrlMock,
      location.pathname,
      spanishLangCodeMock,
      true
    );

    expectToHaveBeenCalledOnceOnlyWith(languageCodeAsyncActionMock, {
      languageCode: spanishLangCodeMock,
      navigation: rootStackNavigationMock,
      membershipDispatch: membershipDispatchMock,
      reduxDispatch: expect.any(Function),
      reduxGetState: expect.any(Function),
      showSpinner: true,
    });
  });

  it('should update the current language if selectedLanguage changes while un-authenticated', () => {
    sessionContextReset(false);
    stateReset(spanishLangMock);

    renderer.create(<SelectLanguageScreen />);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    expectToHaveBeenCalledOnceOnlyWith(
      updateUrlMock,
      location.pathname,
      spanishLangCodeMock,
      true
    );

    expectToHaveBeenCalledOnceOnlyWith(
      setCurrentLanguageDispatchMock,
      sessionDispatchMock,
      spanishLangMock
    );

    expectToHaveBeenCalledOnceOnlyWith(fetchCMSContentMock, spanishLangMock);
  });

  it('should update the current language if selectedLanguage changes while un-authenticated in case of enabled useVietnamese', () => {
    sessionContextReset(false);
    stateReset(vietnameseLangMock);

    renderer.create(<SelectLanguageScreen />);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    expectToHaveBeenCalledOnceOnlyWith(
      updateUrlMock,
      location.pathname,
      vietnameseLangCodeMock,
      true
    );

    expectToHaveBeenCalledOnceOnlyWith(
      setCurrentLanguageDispatchMock,
      sessionDispatchMock,
      vietnameseLangMock
    );

    expectToHaveBeenCalledOnceOnlyWith(fetchCMSContentMock, vietnameseLangMock);
  });

  it('should show error notification on BasicPage if isAsyncActionError is true', () => {
    stateReset(undefined, undefined, true);

    const testRenderer = renderer.create(<SelectLanguageScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.body).toBeDefined();

    const notification = basicPage.props.notification;
    expect(notification.type).toEqual(SetLanguageErrorNotification);
  });
});
