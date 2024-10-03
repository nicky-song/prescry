// Copyright 2018 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { InlineLink } from '../../../../../components/member/links/inline/inline.link';
import { PhoneNumberLoginContainer } from '../../../../../components/member/phone-number-login-container/phone-number-login-container';
import { TermsConditionsAndPrivacyCheckbox } from '../../../../../components/member/checkboxes/terms-conditions-and-privacy/terms-conditions-and-privacy.checkbox';
import { IBasicPageProps } from '../../../../../components/pages/basic-page';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { Workflow } from '../../../../../models/workflow';
import { getChildren } from '../../../../../testing/test.helper';
import {
  IPhoneNumberLoginScreenActionProps,
  IPhoneNumberLoginScreenProps,
  PhoneNumberLoginScreen,
} from './phone-number-login.screen';
import { phoneNumberLoginScreenStyles } from './phone-number-login.screen.styles';
import { setIsUnauthExperienceDispatch } from '../../../state/session/dispatch/set-is-unauth-experience.dispatch';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { PopupModal } from '../../../../../components/modal/popup-modal/popup-modal';
import { IPhoneVerificationActionParams } from '../../../store/phone-number-login/phone-number-login.reducer.action';
import { ISignInContent } from '../../../../../models/cms-content/sign-in.ui-content';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../../../../components/modal/popup-modal/popup-modal', () => ({
  PopupModal: () => <div />,
}));

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../../../../components/member/phone-number-login-container/phone-number-login-container',
  () => ({
    PhoneNumberLoginContainer: () => <div />,
  })
);

jest.mock(
  '../../../../../components/member/checkboxes/terms-conditions-and-privacy/terms-conditions-and-privacy.checkbox',
  () => ({
    TermsConditionsAndPrivacyCheckbox: () => <div />,
  })
);

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../../../state/session/dispatch/set-is-unauth-experience.dispatch');
const setIsUnauthExperienceDispatchMock =
  setIsUnauthExperienceDispatch as jest.Mock;

jest.mock('../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('../../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock(
  '../../../../../components/containers/body-content/body-content.container'
);

const setPhoneNumberMock = jest.fn();
const setIsTermAcceptedMock = jest.fn();
const setModalToggleMock = jest.fn();
const onSetPhoneNumberActionMock = jest.fn();
const phoneNumberMock = '1234567890';
const mockNavigateToOneTimePasswordVerification = jest.fn();
const sessionDispatchMock = jest.fn();

const mockPhoneNumberLoginProps: IPhoneNumberLoginScreenActionProps &
  IPhoneNumberLoginScreenProps = {
  navigateToOneTimePasswordVerification:
    mockNavigateToOneTimePasswordVerification,
  onSetPhoneNumberAction: onSetPhoneNumberActionMock,
  phoneNumberTypeIsUnsupported: false,
};

const uiContentMock: Partial<ISignInContent> = {
  nextButtonLabel: 'next-button-label-mock',
  notHaveAccountHelpText: 'not-have-account-help-text-mock',
  phoneNumberLoginCreateAccountText:
    'phone-number-login-create-account-text-mock',
  phoneNumberLoginHeader: 'phone-number-login-header-mock',
};

describe('PhoneNumberLoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce(['', setPhoneNumberMock]);
    useStateMock.mockReturnValueOnce([false, setIsTermAcceptedMock]);
    useStateMock.mockReturnValueOnce([false, setModalToggleMock]);

    useSessionContextMock.mockReturnValue({
      sessionDispatch: sessionDispatchMock,
    });
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({ params: {} });
    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });
  });

  it('renders PhoneNumberLoginContainer with expected properties ', () => {
    const testRenderer = renderer.create(
      <PhoneNumberLoginScreen {...mockPhoneNumberLoginProps} />
    );
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPageConnected.props.body;
    const topContentContainer = getChildren(body)[0];

    expect(topContentContainer.type).toEqual(View);

    const topContentChildren = getChildren(topContentContainer);
    expect(topContentChildren.length).toEqual(1);

    const phoneNumberLoginContainer = topContentChildren[0];

    expect(phoneNumberLoginContainer.type).toEqual(PhoneNumberLoginContainer);
    expect(
      phoneNumberLoginContainer.props.navigateToOneTimePasswordVerification
    ).toEqual(mockPhoneNumberLoginProps.navigateToOneTimePasswordVerification);
    expect(phoneNumberLoginContainer.props.onSetPhoneNumberAction).toEqual(
      mockPhoneNumberLoginProps.onSetPhoneNumberAction
    );
    expect(
      phoneNumberLoginContainer.props.phoneNumberTypeIsUnsupported
    ).toEqual(mockPhoneNumberLoginProps.phoneNumberTypeIsUnsupported);
    expect(phoneNumberLoginContainer.props.workflow).not.toBeDefined();
    expect(basicPageConnected.props.translateContent).toEqual(true);
  });

  it.each([[false], [true]])(
    'renders as BasicPageConnected (showModal: %p)',
    (showModalMock: boolean) => {
      useStateMock.mockReset();
      useStateMock.mockReturnValueOnce(['', setPhoneNumberMock]);
      useStateMock.mockReturnValueOnce([false, setIsTermAcceptedMock]);
      useStateMock.mockReturnValueOnce([showModalMock, setModalToggleMock]);

      const phoneNumberLoginScreen = renderer.create(
        <PhoneNumberLoginScreen {...mockPhoneNumberLoginProps} />
      );
      const page = phoneNumberLoginScreen.root.findByType(BasicPageConnected);
      const props = page.props as IBasicPageProps;

      expect(props.hideApplicationHeader).toEqual(false);
      expect(props.body).toBeDefined();
      expect(props.modals).toBeDefined();
    }
  );

  it('renders body in content container', () => {
    const phoneNumberLoginScreen = renderer.create(
      <PhoneNumberLoginScreen {...mockPhoneNumberLoginProps} />
    );
    const page = phoneNumberLoginScreen.root.findByType(BasicPageConnected);
    const bodyContentContainer = page.props.body;

    expect(bodyContentContainer.type).toEqual(BodyContentContainer);
    expect(getChildren(bodyContentContainer).length).toEqual(2);
    expect(bodyContentContainer.props.viewStyle).toEqual(
      phoneNumberLoginScreenStyles.bodyContentContainerViewStyle
    );
    expect(bodyContentContainer.props.title).toEqual(
      uiContentMock.phoneNumberLoginHeader
    );
    expect(bodyContentContainer.props.testID).toEqual(
      'phoneNumberLoginScreenBodyContentContainer'
    );
  });

  it('should load BaseButton with props and disable if length is less then 10', () => {
    const phoneNumberLoginScreen = renderer.create(
      <PhoneNumberLoginScreen {...mockPhoneNumberLoginProps} />
    );
    const page = phoneNumberLoginScreen.root.findByType(BasicPageConnected);
    const body = page.props.body;
    const bottomContentContainer = getChildren(body)[1];
    const baseButton = getChildren(bottomContentContainer)[1];

    expect(baseButton.type).toEqual(BaseButton);
    expect(baseButton.props.disabled).toEqual(true);
    expect(baseButton.props.testID).toEqual(`phoneNumberLoginNextButton`);
    expect(baseButton.props.children).toEqual(uiContentMock.nextButtonLabel);
  });

  it('should enable BaseButton for phone number length >= 10 and terms accepted', () => {
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([phoneNumberMock, setPhoneNumberMock]);
    useStateMock.mockReturnValueOnce([true, setIsTermAcceptedMock]);
    useStateMock.mockReturnValueOnce([false, setModalToggleMock]);
    const phoneNumberLoginScreen = renderer.create(
      <PhoneNumberLoginScreen {...mockPhoneNumberLoginProps} />
    );

    const page = phoneNumberLoginScreen.root.findByType(BasicPageConnected);
    const body = page.props.body;
    const bottomContentContainer = getChildren(body)[1];
    const baseButton = getChildren(bottomContentContainer)[1];

    expect(baseButton.type).toEqual(BaseButton);
    expect(baseButton.props.disabled).toEqual(false);
    expect(baseButton.props.testID).toEqual(`phoneNumberLoginNextButton`);
  });

  it.each([[undefined], [true]])(
    'should call when click on Get Started button when blockchain is %p',
    (isBlockchainMock?: boolean) => {
      useStateMock.mockReset();
      useStateMock.mockReturnValueOnce([phoneNumberMock, setPhoneNumberMock]);
      useStateMock.mockReturnValueOnce([true, setIsTermAcceptedMock]);
      useStateMock.mockReturnValueOnce([false, setModalToggleMock]);

      useRouteMock.mockReturnValue({
        params: {
          isBlockchain: isBlockchainMock,
        },
      });

      const phoneNumberLoginScreen = renderer.create(
        <PhoneNumberLoginScreen {...mockPhoneNumberLoginProps} />
      );

      const page = phoneNumberLoginScreen.root.findByType(BasicPageConnected);
      const body = page.props.body;
      const bottomContentContainer = getChildren(body)[1];
      const baseButton = getChildren(bottomContentContainer)[1];

      baseButton.props.onPress();
      expect(
        mockPhoneNumberLoginProps.navigateToOneTimePasswordVerification
      ).toHaveBeenCalled();
      if (!isBlockchainMock) {
        expect(mockNavigateToOneTimePasswordVerification).toHaveBeenCalledWith({
          phoneNumber: phoneNumberMock,
          workflow: undefined,
          navigation: rootStackNavigationMock,
        });
      } else {
        expect(mockNavigateToOneTimePasswordVerification).toHaveBeenCalledWith({
          phoneNumber: phoneNumberMock,
          workflow: undefined,
          navigation: rootStackNavigationMock,
          isBlockchain: isBlockchainMock,
        });
      }
      expect(onSetPhoneNumberActionMock).toHaveBeenCalledWith(phoneNumberMock);
    }
  );

  it('should call when click on Get Started button in prescriptionInvite flow', () => {
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([phoneNumberMock, setPhoneNumberMock]);
    useStateMock.mockReturnValueOnce([true, setIsTermAcceptedMock]);
    useStateMock.mockReturnValueOnce([false, setModalToggleMock]);

    useRouteMock.mockReturnValue({
      params: {
        workflow: 'prescriptionInvite' as Workflow,
        prescriptionId: 'test-prescription-id',
      },
    });

    const phoneNumberLoginScreen = renderer.create(
      <PhoneNumberLoginScreen {...mockPhoneNumberLoginProps} />
    );

    const page = phoneNumberLoginScreen.root.findByType(BasicPageConnected);
    const body = page.props.body;
    const bottomContentContainer = getChildren(body)[1];
    const baseButton = getChildren(bottomContentContainer)[1];

    baseButton.props.onPress();
    expect(
      mockPhoneNumberLoginProps.navigateToOneTimePasswordVerification
    ).toHaveBeenCalled();
    expect(mockNavigateToOneTimePasswordVerification).toHaveBeenCalledWith({
      phoneNumber: phoneNumberMock,
      workflow: 'prescriptionInvite',
      navigation: rootStackNavigationMock,
      prescriptionId: 'test-prescription-id',
    });
    expect(onSetPhoneNumberActionMock).toHaveBeenCalledWith(phoneNumberMock);
  });

  it('should call when click on Get Started button in prescriptionInvite flow', async () => {
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([phoneNumberMock, setPhoneNumberMock]);
    useStateMock.mockReturnValueOnce([true, setIsTermAcceptedMock]);
    useStateMock.mockReturnValueOnce([false, setModalToggleMock]);

    useRouteMock.mockReturnValue({
      params: {
        workflow: 'prescriptionInvite',
        prescriptionId: 'test-prescription-id',
      },
    });

    const phoneNumberLoginScreen = renderer.create(
      <PhoneNumberLoginScreen {...mockPhoneNumberLoginProps} />
    );

    const page = phoneNumberLoginScreen.root.findByType(BasicPageConnected);
    const body = page.props.body;
    const bottomContentContainer = getChildren(body)[1];
    const baseButton = getChildren(bottomContentContainer)[1];

    await baseButton.props.onPress();
    expect(
      mockPhoneNumberLoginProps.navigateToOneTimePasswordVerification
    ).toHaveBeenCalled();

    const expectedParams: IPhoneVerificationActionParams = {
      phoneNumber: phoneNumberMock,
      workflow: 'prescriptionInvite',
      navigation: rootStackNavigationMock,
      prescriptionId: 'test-prescription-id',
    };
    expect(mockNavigateToOneTimePasswordVerification).toHaveBeenCalledWith(
      expectedParams
    );
    expect(onSetPhoneNumberActionMock).toHaveBeenCalledWith(phoneNumberMock);
  });

  it('renders TermsAndConditionsAndPrivacyPolicy component', () => {
    const phoneNumberLoginScreen = renderer.create(
      <PhoneNumberLoginScreen {...mockPhoneNumberLoginProps} />
    );
    const page = phoneNumberLoginScreen.root.findByType(BasicPageConnected);
    const body = page.props.body;
    const bottomContentContainer = getChildren(body)[1];
    const termsAndConditions = getChildren(bottomContentContainer)[0];

    expect(termsAndConditions.type).toEqual(TermsConditionsAndPrivacyCheckbox);
    expect(termsAndConditions.props.viewStyle).toEqual(
      phoneNumberLoginScreenStyles.termsAndConditionsContainerViewStyle
    );
  });

  it('sets workflow prop correctly', () => {
    const workflow: Workflow = 'prescriptionTransfer';
    const mockPhoneNumberLoginPropsWithWorkflow = {
      ...mockPhoneNumberLoginProps,
      workflow,
    };

    useRouteMock.mockReturnValue({
      params: {
        workflow,
      },
    });

    const phoneNumberLoginScreen = renderer.create(
      <PhoneNumberLoginScreen {...mockPhoneNumberLoginPropsWithWorkflow} />
    );
    expect(phoneNumberLoginScreen.root.props.workflow).toEqual(workflow);
  });

  it.each([undefined, true])(
    'should render newToMyRxView component if workflow is set and navigate to createAccount on link press (isBlockchain: %p)',
    (isBlockchainMock?: boolean) => {
      const workflow: Workflow = 'prescriptionTransfer';
      useRouteMock.mockReturnValue({
        params: {
          workflow,
          isBlockchain: isBlockchainMock,
        },
      });

      const phoneNumberLoginScreen = renderer.create(
        <PhoneNumberLoginScreen {...mockPhoneNumberLoginProps} />
      );
      const page = phoneNumberLoginScreen.root.findByType(BasicPageConnected);
      const body = page.props.body;
      const bottomContentContainer = getChildren(body)[1];

      const newToMyRxView = getChildren(bottomContentContainer)[2];
      expect(getChildren(newToMyRxView).length).toEqual(1);

      const textWrapper = getChildren(newToMyRxView)[0];
      expect(textWrapper.type).toEqual(BaseText);
      expect(textWrapper.props.style).toEqual(
        phoneNumberLoginScreenStyles.smallTextStyle
      );

      const textWrapperChildren = getChildren(textWrapper);
      expect(textWrapperChildren.length).toEqual(3);

      expect(textWrapperChildren[0]).toEqual(
        uiContentMock.notHaveAccountHelpText
      );
      expect(textWrapperChildren[1]).toEqual(' ');

      const link = textWrapperChildren[2];

      expect(link.type).toEqual(InlineLink);
      expect(link.props.inheritStyle).toEqual(true);
      expect(link.props.children).toEqual(
        uiContentMock.phoneNumberLoginCreateAccountText
      );

      const onPress = link.props.onPress;
      onPress();
      expect(rootStackNavigationMock.navigate).toBeCalled();
      expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
        'CreateAccount',
        {
          workflow,
          blockchain: isBlockchainMock,
        }
      );
    }
  );

  it('should call OTP with workflow on click on Get Started button', async () => {
    const workflow: Workflow = 'prescriptionTransfer';

    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([phoneNumberMock, setPhoneNumberMock]);
    useStateMock.mockReturnValueOnce([true, setIsTermAcceptedMock]);
    useStateMock.mockReturnValueOnce([false, setModalToggleMock]);

    useRouteMock.mockReturnValue({
      params: {
        workflow,
      },
    });

    const phoneNumberLoginScreen = renderer.create(
      <PhoneNumberLoginScreen {...mockPhoneNumberLoginProps} />
    );
    const page = phoneNumberLoginScreen.root.findByType(BasicPageConnected);
    const body = page.props.body;
    const bottomContentContainer = getChildren(body)[1];
    const baseButton = getChildren(bottomContentContainer)[1];

    await baseButton.props.onPress();

    expect(mockNavigateToOneTimePasswordVerification).toHaveBeenCalledWith({
      phoneNumber: phoneNumberMock,
      workflow,
      navigation: rootStackNavigationMock,
    });
  });

  it('should call setPhoneNumber on textChange', () => {
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce(['', setPhoneNumberMock]);
    useStateMock.mockReturnValueOnce([true, setIsTermAcceptedMock]);
    useStateMock.mockReturnValueOnce([false, setModalToggleMock]);

    const testRenderer = renderer.create(
      <PhoneNumberLoginScreen {...mockPhoneNumberLoginProps} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const phoneNumberLoginBody = body.props.children[0].props.children;

    phoneNumberLoginBody.props.onTextInputChangeHandler('1234');

    expect(phoneNumberLoginBody.type).toBe(PhoneNumberLoginContainer);
    expect(setPhoneNumberMock).toHaveBeenCalledWith('1234');
  });

  it.each([[undefined], [false], [true]])(
    'handles navigate back (hasNavigateBack: %p)',
    (hasNavigateBackMock: undefined | boolean) => {
      useRouteMock.mockReturnValue({
        params: {
          hasNavigateBack: hasNavigateBackMock,
        },
      });

      const phoneNumberLoginScreen = renderer.create(
        <PhoneNumberLoginScreen
          phoneNumberTypeIsUnsupported={false}
          navigateToOneTimePasswordVerification={jest.fn()}
          onSetPhoneNumberAction={jest.fn()}
        />
      );

      const basicPage =
        phoneNumberLoginScreen.root.findByType(BasicPageConnected);

      const onNavigateBack = basicPage.props.navigateBack;

      if (hasNavigateBackMock) {
        onNavigateBack();
        expect(setIsUnauthExperienceDispatchMock).toHaveBeenCalledWith(
          sessionDispatchMock,
          true
        );
        expect(rootStackNavigationMock.goBack).toHaveBeenCalledWith();
      } else {
        expect(onNavigateBack).toBeUndefined();
      }
    }
  );

  it('Show popup modal when modalContent is passed with showModal true and closes modal when close is presed', () => {
    useRouteMock.mockReturnValue({
      params: {
        modalContent: {
          showModal: true,
          modalTopContent: 'some-text',
        },
      },
    });

    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce(['', setPhoneNumberMock]);
    useStateMock.mockReturnValueOnce([true, setIsTermAcceptedMock]);
    useStateMock.mockReturnValueOnce([true, setModalToggleMock]);
    const testRenderer = renderer.create(
      <PhoneNumberLoginScreen {...mockPhoneNumberLoginProps} />
    );
    expect(useStateMock.mock.calls[2][0]).toBe(true);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const modalRenderer = renderer.create(basicPage.props.modals);

    const popupModal = modalRenderer.root.findByType(PopupModal);
    expect(popupModal.props.isOpen).toBe(true);
    popupModal.props.onPrimaryButtonPress();
    expect(setModalToggleMock).toBeCalledWith(false);
  });

  it('Does not show popup modal when modalContent is not passed', () => {
    useRouteMock.mockReturnValue({
      params: {},
    });

    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce(['', setPhoneNumberMock]);
    useStateMock.mockReturnValueOnce([true, setIsTermAcceptedMock]);
    useStateMock.mockReturnValueOnce([false, setModalToggleMock]);
    const testRenderer = renderer.create(
      <PhoneNumberLoginScreen {...mockPhoneNumberLoginProps} />
    );
    expect(useStateMock.mock.calls[2][0]).toBe(false);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    expect(basicPage.props.modals).toBe(null);
  });
});
