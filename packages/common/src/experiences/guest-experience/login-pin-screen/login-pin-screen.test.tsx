// Copyright 2021 Prescryptive Health, Inc.

import React, { useState, useEffect } from 'react';
import {
  ILoginPinScreenActionProps,
  ILoginPinScreenProps,
  ILoginPinScreenRouteProps,
  LoginPinScreen,
} from './login-pin-screen';
import renderer from 'react-test-renderer';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { PrimaryTextBox } from '../../../components/text/primary-text-box/primary-text-box';
import { loginPinScreenStyles } from './login-pin-screen.style';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { Workflow } from '../../../models/workflow';
import { LinkButton } from '../../../components/buttons/link/link.button';
import { PinScreenContainer } from '../../../components/member/pin-screen-container/pin-screen-container';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { navigateToResetPinAction } from '../store/secure-pin/secure-pin-reducer.actions';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { ISignInContent } from '../../../models/cms-content/sign-in.ui-content';
import { updateURLWithFeatureFlagsAndLanguage } from '../store/navigation/update-url-with-feature-flags-and-language';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;
jest.mock(
  '../../../components/member/pin-keypad-container/pin-keypad-container',
  () => ({
    PinKeypadContainer: () => <div />,
  })
);

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../../../components/buttons/base/base.button', () => ({
  BaseButton: () => <div />,
}));

jest.mock('../store/navigation/update-url-with-feature-flags-and-language');
const updateURLWithFeatureFlagsAndLanguageMock =
  updateURLWithFeatureFlagsAndLanguage as jest.Mock;

jest.mock('../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const uiContentMock: Partial<ISignInContent> = {
  accountLockedWarningText: 'account-locked-warning-text-mock',
  maxPinVerifyError1: 'max-pin-verify-error-1-mock',
  maxPinVerifyError2: 'max-pin-verify-error-2-mock',
  maxPinVerifyError3: 'max-pin-verify-error-3-mock',
  maxPinVerifyError4: 'max-pin-verify-error-4-mock',
  nextButtonLabel: 'next-button-label-mock',
  loginButtonText: 'login-button-text-mock',
  updatePinHeader: 'update-pin-header-mock',
  loginPinScreenHeader: 'login-pin-screen-header-mock',
  forgotPin: 'forgot-pin-mock',
};

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../store/secure-pin/secure-pin-reducer.actions');
const navigateToResetPinActionMock = navigateToResetPinAction as jest.Mock;

const mockVerifyPin = jest.fn();
const mockClearAccountToken = jest.fn();

const defaultProps: ILoginPinScreenProps & ILoginPinScreenActionProps = {
  hasPinMismatched: false,
  verifyPin: mockVerifyPin,
  recoveryEmailExists: false,
  clearAccountToken: mockClearAccountToken,
};

describe('LoginPinScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStateMock.mockReturnValue(['', jest.fn()]);
    useNavigationMock.mockReturnValue({});
    useRouteMock.mockReturnValue({ params: {} });
    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });
  });

  it('should create component with default props', () => {
    const pinComponent = renderer.create(<LoginPinScreen {...defaultProps} />);
    const props = pinComponent.root.props;

    const basicPage = pinComponent.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const pinScreenContainer = bodyRenderer.root.findByType(PinScreenContainer);
    const pinScreenContainerProps = pinScreenContainer.props;

    expect(pinScreenContainerProps.enteredPin).toEqual('');
    expect(pinScreenContainer.props.testID).toBe('loginPinScreenContainer');

    expect(pinComponent).toBeDefined();
    expect(props.errorCode).toBe(defaultProps.leftAttempts);
    expect(props.verifyPin).toBe(mockVerifyPin);
    expect(basicPage.props.translateContent).toEqual(true);
  });

  it.each([[undefined], [false], [true]])(
    'sets navigate back (isUpdatePin: %p)',
    (isUpdatePinMock: boolean | undefined) => {
      useNavigationMock.mockReturnValue(rootStackNavigationMock);

      const routePropsMock: ILoginPinScreenRouteProps = {
        isUpdatePin: isUpdatePinMock,
      };
      useRouteMock.mockReturnValue({ params: routePropsMock });

      const testRenderer = renderer.create(
        <LoginPinScreen {...defaultProps} />
      );
      const basicPage = testRenderer.root.findByType(BasicPageConnected);

      if (isUpdatePinMock) {
        expect(basicPage.props.navigateBack).toEqual(
          rootStackNavigationMock.goBack
        );
      } else {
        expect(basicPage.props.navigateBack).toBeUndefined();
      }
    }
  );

  it('should have a BasicPage with body', () => {
    const pinComponent = renderer.create(<LoginPinScreen {...defaultProps} />);
    const basicPage = pinComponent.root.findByType(BasicPageConnected);
    const basicPageProps = basicPage.props;

    expect(basicPageProps.body).toBeDefined();
    expect(basicPageProps.headerViewStyle).toBeDefined();
  });

  it('should have PrimaryTextBox for screen title and screen info', () => {
    const testRenderer = renderer.create(<LoginPinScreen {...defaultProps} />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const primaryTextBoxes = bodyRenderer.root.findAllByType(PrimaryTextBox);

    expect(primaryTextBoxes.length).toBe(1);
    expect(primaryTextBoxes[0].props.caption).toEqual(
      uiContentMock.loginPinScreenHeader
    );
    expect(primaryTextBoxes[0].props.textBoxStyle).toEqual(
      loginPinScreenStyles.pinLabelTextStyle
    );
  });

  it('should have disabled login BaseButton with default styles if PIN is not valid', () => {
    const testRenderer = renderer.create(<LoginPinScreen {...defaultProps} />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);
    const baseButton = bodyRenderer.root.findByType(BaseButton);

    expect(baseButton).toBeDefined();
    const baseButtonProps = baseButton.props;
    expect(baseButtonProps.disabled).toBeTruthy();
    expect(baseButtonProps.children).toEqual(uiContentMock.loginButtonText);
    expect(baseButtonProps.isSkeleton).toEqual(false);
    expect(baseButtonProps.testID).toEqual('loginPinScreenLoginButton');
  });

  it('should have login BaseButton enabled with default styles if PIN is valid and should call verifyPIN on click', () => {
    const testRenderer = renderer.create(<LoginPinScreen {...defaultProps} />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const baseButton = bodyRenderer.root.findByType(BaseButton);
    const baseButtonProps = baseButton.props;
    expect(baseButtonProps.disabled).toBeTruthy();
  });

  it('should have verify PIN error message if there is a error code', () => {
    const updatedProps: ILoginPinScreenProps & ILoginPinScreenActionProps = {
      ...defaultProps,
      hasPinMismatched: true,
    };
    const testRenderer = renderer.create(<LoginPinScreen {...updatedProps} />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);
    const errorPrimaryTextBox =
      bodyRenderer.root.findAllByType(PrimaryTextBox)[1];

    expect(errorPrimaryTextBox.props.caption).toEqual(
      uiContentMock.maxPinVerifyError1
    );
  });

  it('should have a error message when pin is not matched', () => {
    const testRenderer = renderer.create(
      <LoginPinScreen {...defaultProps} hasPinMismatched={true} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);
    const primaryTextBox =
      bodyRenderer.root.findAllByType(PrimaryTextBox)[1].props;
    expect(primaryTextBox.caption).toBe(uiContentMock.maxPinVerifyError1);
  });

  it('should have a error message when pin is not matched and user has less than 5 attempts', () => {
    const testRenderer = renderer.create(
      <LoginPinScreen
        {...defaultProps}
        hasPinMismatched={true}
        leftAttempts={2}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);
    const primaryTextBox =
      bodyRenderer.root.findAllByType(PrimaryTextBox)[1].props;
    const errorMessage = `${uiContentMock.maxPinVerifyError1} 2 ${uiContentMock.maxPinVerifyError3} ${uiContentMock.maxPinVerifyError4}`;

    expect(primaryTextBox.caption).toBe(errorMessage);
  });

  it('should have a error message when pin is not matched and user has left no attempts, login button should be hidden', () => {
    const testRenderer = renderer.create(
      <LoginPinScreen
        {...defaultProps}
        hasPinMismatched={true}
        leftAttempts={0}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);
    const primaryTextBox =
      bodyRenderer.root.findAllByType(PrimaryTextBox)[1].props;
    expect(primaryTextBox.caption).toBe(uiContentMock.accountLockedWarningText);
    expect(
      testRenderer.root.findByType(BasicPageConnected).props.footer
    ).toBeUndefined();
  });

  it('should call verifyPin and reset pin state if update PIN or error when onLoginClick is called ', async () => {
    useStateMock.mockReturnValueOnce(['1234', jest.fn()]);
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const newProps = { ...defaultProps, hasPinMismatched: true };
    const testRenderer = renderer.create(<LoginPinScreen {...newProps} />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const baseButton = bodyRenderer.root.findByType(BaseButton);
    const baseButtonProps = baseButton.props;

    await baseButtonProps.onPress();

    expect(newProps.verifyPin).toHaveBeenCalledTimes(1);
    expect(newProps.verifyPin).toHaveBeenCalledWith({
      pin: '1234',
      navigation: rootStackNavigationMock,
      pinScreenParams: { isUpdatePin: false, workflow: undefined },
    });
  });

  it('should call verifyPin and pass workflow prop on loginClick ', async () => {
    useStateMock.mockReturnValueOnce(['1234', jest.fn()]);
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const routePropsMock: ILoginPinScreenRouteProps = {
      workflow: 'prescriptionTransfer' as Workflow,
    };
    useRouteMock.mockReturnValue({ params: routePropsMock });

    const testRenderer = renderer.create(<LoginPinScreen {...defaultProps} />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const baseButton = bodyRenderer.root.findByType(BaseButton);
    const baseButtonProps = baseButton.props;

    await baseButtonProps.onPress();

    expect(defaultProps.verifyPin).toHaveBeenCalledTimes(1);
    expect(defaultProps.verifyPin).toHaveBeenCalledWith({
      pin: '1234',
      navigation: rootStackNavigationMock,
      pinScreenParams: {
        isUpdatePin: false,
        workflow: 'prescriptionTransfer',
      },
    });
  });

  it('should show "forgot your pin" if recovery email exists', () => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const newProps = { ...defaultProps, recoveryEmailExists: true };
    const testRenderer = renderer.create(<LoginPinScreen {...newProps} />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const forgotPinTextLink = bodyRenderer.root.findByProps({
      testID: 'forgotPinText',
    });

    expect(forgotPinTextLink.type).toEqual(LinkButton);
    expect(forgotPinTextLink.props.viewStyle).toEqual(
      loginPinScreenStyles.forgotPinViewStyle
    );
    expect(forgotPinTextLink.props.linkText).toEqual(uiContentMock.forgotPin);
    expect(forgotPinTextLink.props.onPress).toEqual(expect.any(Function));

    forgotPinTextLink.props.onPress();

    expect(navigateToResetPinActionMock).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
  });

  it('should NOT show "forgot your pin" if recovery email doesnt exist', () => {
    const testRenderer = renderer.create(<LoginPinScreen {...defaultProps} />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);
    const bodyView = bodyRenderer.root.findByProps({
      testID: 'pinLogin',
    });
    expect(bodyView.props.children[2]).toBeUndefined();
  });

  it('should NOT show "forgot your pin" in update pin screen even if recovery email exists', () => {
    const newProps: ILoginPinScreenActionProps & ILoginPinScreenProps = {
      ...defaultProps,
      recoveryEmailExists: true,
    };

    const routePropsMock: ILoginPinScreenRouteProps = {
      isUpdatePin: true,
    };
    useRouteMock.mockReturnValue({ params: routePropsMock });

    const testRenderer = renderer.create(<LoginPinScreen {...newProps} />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);
    const bodyView = bodyRenderer.root.findByProps({
      testID: 'pinLogin',
    });
    expect(bodyView.props.children[2]).toBeUndefined();
  });

  it.each([[undefined], [false], [true]])(
    'clears account token based on value of isSignOut param (isSignOut: %p)',
    (isSignOutMock: boolean | undefined) => {
      const routePropsMock: ILoginPinScreenRouteProps = {
        isSignOut: isSignOutMock,
      };
      useRouteMock.mockReturnValue({ params: routePropsMock });

      useStateMock.mockReturnValueOnce(['1234', jest.fn()]);
      const clearAccountTokenMock = jest.fn();
      renderer.create(
        <LoginPinScreen
          {...defaultProps}
          clearAccountToken={clearAccountTokenMock}
        />
      );
      const effectHandler = useEffectMock.mock.calls[0][0];
      effectHandler();
      expect(useEffectMock).toHaveBeenCalled();

      if (isSignOutMock) {
        expect(updateURLWithFeatureFlagsAndLanguageMock).toHaveBeenCalled();
        expect(clearAccountTokenMock).toHaveBeenCalled();
      } else {
        expect(updateURLWithFeatureFlagsAndLanguageMock).not.toHaveBeenCalled();
        expect(clearAccountTokenMock).not.toHaveBeenCalledWith();
      }
    }
  );
});
