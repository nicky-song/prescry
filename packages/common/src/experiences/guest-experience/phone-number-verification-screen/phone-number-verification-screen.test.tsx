// Copyright 2018 Prescryptive Health, Inc.

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { ReactElement, useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { Heading } from '../../../components/member/heading/heading';
import { PhoneNumberVerificationContainer } from '../../../components/member/phone-number-verification/phone-number-verification-container';
import { IBasicPageProps } from '../../../components/pages/basic-page';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { ISignInContent } from '../../../models/cms-content/sign-in.ui-content';
import { ICreateAccount } from '../../../models/create-account';
import { Workflow } from '../../../models/workflow';
import { getChildren } from '../../../testing/test.helper';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { ICreateAccountAsyncActionArgs } from '../store/phone-number-verification/async-actions/create-account.async-action';
import {
  ISendOneTimePasswordAsyncActionArgs,
  IVerificationCodeActionParams,
} from '../store/phone-number-verification/phone-number-verification-reducer.actions';
import {
  IPhoneNumberVerificationScreenProps,
  PhoneNumberVerificationScreen,
} from './phone-number-verification-screen';
import { phoneNumberVerificationScreenStyle } from './phone-number-verification-screen.styles';

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../../components/member/phone-number-verification/phone-number-verification-container',
  () => ({
    PhoneNumberVerificationContainer: () => <div />,
  })
);

jest.mock('../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('@react-navigation/native');
const useRouteMock = useRoute as jest.Mock;
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));

const useStateMock = useState as jest.Mock;

const uiContentMock: Partial<ISignInContent> = {
  verifyButtonLabel: 'verify-button-label',
  phoneVerificationHeaderText: 'phone-verification-header-text',
};

const resendCodeMock = jest.fn();
const verifyCodeMock = jest.fn();
const resetPhoneNumberVerification = jest.fn();
const createAccountMock = jest.fn();
const phoneNumberMock = '1234567890';

const verificationCodeMock = 'verification-code-mock';
const setVerificationCodeMock = jest.fn();

const mockPhoneNumberVerificationScreenProps: IPhoneNumberVerificationScreenProps =
  {
    isIncorrectCode: false,
    isOneTimePasswordSent: false,
    resendCode: resendCodeMock,
    resetVerification: resetPhoneNumberVerification,
    verifyCode: verifyCodeMock,
    createAccount: createAccountMock,
  };

const accountMock: ICreateAccount = {
  firstName: 'Johnny',
  lastName: 'AppleSeed',
  email: 'test@test.com',
  dateOfBirth: 'January-01-2010',
  phoneNumber: '+1PHONE',
  isTermAccepted: true,
};

describe('PhoneNumberVerificationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });

    useRouteMock.mockReturnValue({
      params: {
        phoneNumber: phoneNumberMock,
        account: accountMock,
        workflow: workflowMock,
      },
    });

    useStateMock.mockReturnValueOnce([
      verificationCodeMock,
      setVerificationCodeMock,
    ]);
    (rootStackNavigationMock.isFocused as jest.Mock).mockReturnValue(true);
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
  });

  it('renders phoneNumberVerificationScreenContainer', () => {
    const testRenderer = renderer.create(
      <PhoneNumberVerificationScreen
        {...mockPhoneNumberVerificationScreenProps}
      />
    );

    const basicPageContainer = testRenderer.root
      .children[0] as ReactTestInstance;

    const bodyContentContainer =
      basicPageContainer.props.body.props.children[0];

    const onTextInputChangeHandler =
      bodyContentContainer.props.children[1].props.onTextInputChangeHandler;

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);
    const heading = bodyRenderer.root.findByType(Heading);

    expect(heading.props.textStyle).toBe(
      phoneNumberVerificationScreenStyle.headingTextStyle
    );
    expect(heading.props.children).toBe(
      uiContentMock.phoneVerificationHeaderText
    );
    expect(
      bodyRenderer.root.findByType(PhoneNumberVerificationContainer).props
    ).toEqual({
      onTextInputChangeHandler,
      resendCode: expect.any(Function),
      verificationCode: verificationCodeMock,
      verifyCode: expect.any(Function),
      isScreenFocused: true,
      isIncorrectCode: mockPhoneNumberVerificationScreenProps.isIncorrectCode,
      isOneTimePasswordSent:
        mockPhoneNumberVerificationScreenProps.isOneTimePasswordSent,
      resetVerification: expect.any(Function),
    });
  });

  it('has a BasicPage with props', () => {
    useRouteMock.mockReturnValue({
      params: {
        phoneNumber: phoneNumberMock,
        account: undefined,
        workflow: workflowMock,
      },
    });
    const testRenderer = renderer.create(
      <PhoneNumberVerificationScreen
        {...mockPhoneNumberVerificationScreenProps}
      />
    );
    const page = testRenderer.root.findByType(BasicPageConnected);
    const props = page.props as IBasicPageProps;
    expect((props.body as ReactElement).type).toEqual(BodyContentContainer);
    expect((props.body as ReactElement).props.viewStyle).toEqual(
      phoneNumberVerificationScreenStyle.bodyViewStyle
    );

    expect(page.props.navigateBack).toEqual(rootStackNavigationMock.goBack);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const baseButtonProps = bodyRenderer.root.findAllByType(BaseButton);
    baseButtonProps[0].props.onPress();
    expect(mockPhoneNumberVerificationScreenProps.verifyCode).toBeCalled();
    expect(basicPage.props.translateContent).toEqual(true);
  });

  it('renders BaseButton with props and disabled by default', () => {
    const testRenderer = renderer.create(
      <PhoneNumberVerificationScreen
        {...mockPhoneNumberVerificationScreenProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const bodyContainer = bodyRenderer.root.findByType(BodyContentContainer);
    const verifyButton = getChildren(bodyContainer)[1];

    expect(verifyButton.type).toEqual(BaseButton);
    expect(verifyButton.props.children).toBe(uiContentMock.verifyButtonLabel);
    expect(verifyButton.props.disabled).toEqual(true);
    expect(verifyButton.props.onPress).toEqual(expect.any(Function));
    expect(verifyButton.props.testID).toEqual(
      'phoneNumberVerificationVerifyButton'
    );
  });

  it('calls verify otp by default when click on Verify button', () => {
    useRouteMock.mockReturnValue({
      params: {
        phoneNumber: phoneNumberMock,
        account: undefined,
        workflow: undefined,
      },
    });
    const testRenderer = renderer.create(
      <PhoneNumberVerificationScreen
        {...mockPhoneNumberVerificationScreenProps}
      />
    );

    const basicPageContainer = testRenderer.root
      .children[0] as ReactTestInstance;

    const bodyContentContainer =
      basicPageContainer.props.body.props.children[1];

    bodyContentContainer.props.onPress();

    const expectedArgs: IVerificationCodeActionParams = {
      phoneNumber: phoneNumberMock,
      verificationCode: verificationCodeMock,
      workflow: undefined,
      navigation: rootStackNavigationMock,
      prescriptionId: undefined,
    };
    expect(verifyCodeMock).toHaveBeenCalledWith(expectedArgs);
  });

  const workflowMock: Workflow = 'prescriptionTransfer';

  it('should call verify otp with prescriptionId when no account information and click on Verify button', () => {
    const mockPhoneNumberVerificationScreenPropsWithPrescriptionId: IPhoneNumberVerificationScreenProps =
      {
        isIncorrectCode: false,
        isOneTimePasswordSent: false,
        resendCode: resendCodeMock,
        resetVerification: resetPhoneNumberVerification,
        verifyCode: verifyCodeMock,
        createAccount: createAccountMock,
      };

    const prescriptionIdMock = 'test-prescription-id';

    useRouteMock.mockReturnValue({
      params: {
        phoneNumber: phoneNumberMock,
        account: {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          phoneNumber: '',
          email: '',
          isTermAccepted: false,
          prescriptionId: prescriptionIdMock,
        },
        workflow: workflowMock,
      },
    });

    const testRenderer = renderer.create(
      <PhoneNumberVerificationScreen
        {...mockPhoneNumberVerificationScreenPropsWithPrescriptionId}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const verifyButton = bodyRenderer.root.findByType(BaseButton);
    verifyButton.props.onPress();

    expect(verifyCodeMock).toHaveBeenCalledWith({
      phoneNumber: phoneNumberMock,
      verificationCode: verificationCodeMock,
      workflow: workflowMock,
      prescriptionId: prescriptionIdMock,
      navigation: rootStackNavigationMock,
    });
  });

  it('should call verifyCode with workflow props when click on Verify button', () => {
    const workflowMock: Workflow = 'prescriptionTransfer';
    useRouteMock.mockReturnValue({
      params: {
        phoneNumber: phoneNumberMock,
        account: undefined,
        workflow: workflowMock,
      },
    });
    const testRenderer = renderer.create(
      <PhoneNumberVerificationScreen
        {...mockPhoneNumberVerificationScreenProps}
      />
    );

    const basicPageContainer = testRenderer.root
      .children[0] as ReactTestInstance;

    const bodyContentContainer =
      basicPageContainer.props.body.props.children[1];

    bodyContentContainer.props.onPress();

    const expectedArgs: IVerificationCodeActionParams = {
      phoneNumber: phoneNumberMock,
      verificationCode: verificationCodeMock,
      workflow: workflowMock,
      navigation: rootStackNavigationMock,
    };
    expect(verifyCodeMock).toHaveBeenCalledWith(expectedArgs);
  });

  it('calls create account when workflow and account is set on click on Verify button', () => {
    const workflowMock: Workflow = 'prescriptionTransfer';
    const testRenderer = renderer.create(
      <PhoneNumberVerificationScreen
        {...mockPhoneNumberVerificationScreenProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyRenderer = renderer.create(basicPage.props.body);

    const verifyButton = bodyRenderer.root.findByType(BaseButton);
    verifyButton.props.onPress();

    const expectedArgs: ICreateAccountAsyncActionArgs = {
      account: accountMock,
      code: verificationCodeMock,
      workflow: workflowMock,
      navigation: rootStackNavigationMock,
    };
    expect(createAccountMock).toHaveBeenCalledWith(expectedArgs);
    expect(verifyCodeMock).not.toHaveBeenCalled();
  });

  it.each([
    ['', false],
    ['1', false],
    ['12345', false],
    ['123456', true],
    ['1234567', false],
  ])(
    'verifyButton should be enabled only when OTP text length is correct (OTP text: %p)',
    (otpTextMock: string, isEnabledExpected: boolean) => {
      useStateMock.mockReset();
      useStateMock.mockReturnValueOnce([otpTextMock, jest.fn()]);
      const testRenderer = renderer.create(
        <PhoneNumberVerificationScreen
          {...mockPhoneNumberVerificationScreenProps}
        />
      );

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const bodyRenderer = renderer.create(basicPage.props.body);

      const baseButton = bodyRenderer.root.findByType(BaseButton);
      expect(baseButton.props.disabled).toEqual(!isEnabledExpected);
    }
  );
  it('sets workflow prop correctly', () => {
    const workflow: Workflow = 'prescriptionTransfer';
    const mockPhoneNumberVerificationScreenPropsWithWorkflow = {
      ...mockPhoneNumberVerificationScreenProps,
      workflow,
    };
    const phoneNumberVerificationScreen = renderer.create(
      <PhoneNumberVerificationScreen
        {...mockPhoneNumberVerificationScreenPropsWithWorkflow}
      />
    );
    expect(phoneNumberVerificationScreen.root.props.workflow).toEqual(workflow);
  });

  it('should call resendCode with phoneNumber when click on resend link', () => {
    const phoneNumberVerificationScreen = renderer.create(
      <PhoneNumberVerificationScreen
        {...mockPhoneNumberVerificationScreenProps}
      />
    );

    const basicPageContainer = phoneNumberVerificationScreen.root
      .children[0] as ReactTestInstance;

    const bodyContentContainer =
      basicPageContainer.props.body.props.children[0];

    const onResend = bodyContentContainer.props.children[1].props.resendCode;

    onResend();

    const expectedArgs: ISendOneTimePasswordAsyncActionArgs = {
      phoneNumber: phoneNumberMock,
      navigation: rootStackNavigationMock,
    };
    expect(setVerificationCodeMock).toHaveBeenCalledWith('');
    expect(resendCodeMock).toHaveBeenCalledWith(expectedArgs);
  });
});
