// Copyright 2018 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { PinScreenContainer } from '../../../components/member/pin-screen-container/pin-screen-container';
import { IBasicPageProps } from '../../../components/pages/basic-page';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { PrimaryTextBox } from '../../../components/text/primary-text-box/primary-text-box';
import { Workflow } from '../../../models/workflow';
import { getChildren } from '../../../testing/test.helper';
import {
  VerifyPinScreen,
  IVerifyPinScreenActionProps,
  IVerifyPinScreenRouteProps,
  IVerifyPinScreenProps,
} from './verify-pin-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IAddUpdatePinAsyncActionArgs } from '../store/secure-pin/secure-pin-reducer.actions';
import { ICreatePinScreenRouteProps } from '../create-pin-screen/create-pin-screen';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { ISignUpContent } from '../../../models/cms-content/sign-up.ui-content';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));

const useStateMock = useState as jest.Mock;

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const uiContentMock: Partial<ISignUpContent> = {
  updatePinErrorMessage: 'update-pin-error-message-mock',
  confirmPinErrorMessage: 'confirm-pin-error-message-mock',
  confirmPinScreenInfo: 'confirm-pin-screen-info-mock',
  confirmPinHeader: 'confirm-pin-header-mock',
  verifyPinLabel: 'verify-pin-label-mock',
  nextButtonLabel: 'next-button-label-mock',
};

const mockAddUpdatePinAction = jest.fn();

const verifyPinScreenProps: IVerifyPinScreenProps &
  IVerifyPinScreenActionProps = {
  addUpdatePinAction: mockAddUpdatePinAction,
  hasErrorOccurred: false,
};

describe('VerifyPinScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStateMock.mockReturnValue(['', jest.fn()]);
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({ params: { isUpdatePin: true } });
    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });
  });

  it('should render PrimaryTextBox with props', () => {
    const verifyPinScreenParamsMock: IVerifyPinScreenRouteProps = {
      isUpdatePin: false,
    };
    useRouteMock.mockReturnValueOnce({ params: verifyPinScreenParamsMock });
    const testRenderer = renderer.create(
      <VerifyPinScreen {...verifyPinScreenProps} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    expect(body.type).toEqual(View);
    expect(body.props.testID).toEqual('updatePin');

    const bodyContainerChildren = getChildren(body);
    expect(bodyContainerChildren.length).toEqual(4);

    const pinLabelTextBox = bodyContainerChildren[0];
    expect(pinLabelTextBox.type).toEqual(PrimaryTextBox);
    expect(pinLabelTextBox.props.caption).toBe(uiContentMock.verifyPinLabel);

    const subHeaderTextBox = bodyContainerChildren[1];
    expect(subHeaderTextBox.type).toEqual(PrimaryTextBox);
    expect(subHeaderTextBox.props.caption).toBe(
      uiContentMock.confirmPinScreenInfo
    );
  });

  it('should not have subheader and have changed Header if isUpdatePin is true', () => {
    const testRenderer = renderer.create(
      <VerifyPinScreen {...verifyPinScreenProps} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyContainerChildren = getChildren(body);

    const pinLabelTextBox = bodyContainerChildren[0];
    expect(pinLabelTextBox.props.caption).toBe(uiContentMock.confirmPinHeader);

    const subHeaderTextBox = bodyContainerChildren[1];
    expect(subHeaderTextBox).toBeNull();
  });

  it('should render error message when error has occurred', () => {
    const testRenderer = renderer.create(
      <VerifyPinScreen {...verifyPinScreenProps} hasErrorOccurred={true} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyContainerChildren = getChildren(body);

    const pinScreenContainer = bodyContainerChildren[2];
    expect(pinScreenContainer.type).toEqual(PinScreenContainer);
    expect(pinScreenContainer.props.errorMessage).toEqual(
      uiContentMock.confirmPinErrorMessage
    );

    const footer = bodyContainerChildren[3];

    expect(footer.type).toEqual(BaseButton);
    expect(footer.props.isSkeleton).toEqual(false);
    expect(footer.props.children).toEqual(uiContentMock.nextButtonLabel);
    expect(footer.props.testID).toEqual('verifyPinNextButton');
  });

  it('should render uiContentMock.updateErrorMessage when errorCode is 2009', () => {
    const testRenderer = renderer.create(
      <VerifyPinScreen {...verifyPinScreenProps} errorCode={2009} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyContainerChildren = getChildren(body);

    const pinScreenContainer = bodyContainerChildren[2];
    expect(pinScreenContainer.type).toEqual(PinScreenContainer);
    expect(pinScreenContainer.props.errorMessage).toEqual(
      uiContentMock.updatePinErrorMessage
    );
  });

  it('should render PinScreenContainer with props', () => {
    const testRenderer = renderer.create(
      <VerifyPinScreen {...verifyPinScreenProps} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyContainerChildren = getChildren(body);
    const pinScreenContainer = bodyContainerChildren[2];

    expect(pinScreenContainer.type).toEqual(PinScreenContainer);
    expect(pinScreenContainer.props.onPinChange).toEqual(expect.any(Function));
    expect(pinScreenContainer.props.enteredPin).toEqual('');
    expect(pinScreenContainer.props.testID).toEqual('verifyPinScreenContainer');
  });

  it('should render PinScreenContainer with error message when error occurs and error code is 2009', () => {
    const testRenderer = renderer.create(
      <VerifyPinScreen
        {...{
          ...verifyPinScreenProps,
          errorCode: 2009,
          hasErrorOccurred: true,
        }}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyContainerChildren = getChildren(body);
    const pinScreenContainer = bodyContainerChildren[2];

    expect(pinScreenContainer.props.errorMessage).toBe(
      uiContentMock.updatePinErrorMessage
    );
  });

  it('should render PinScreenContainer with error message when error occurs and error code is not 2009', () => {
    const testRenderer = renderer.create(
      <VerifyPinScreen {...verifyPinScreenProps} hasErrorOccurred={true} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyContainerChildren = getChildren(body);
    const pinScreenContainer = bodyContainerChildren[2];

    expect(pinScreenContainer.props.errorMessage).toBe(
      uiContentMock.confirmPinErrorMessage
    );
  });

  it('should render BasicPage with props', () => {
    const verifyPinScreen = renderer.create(
      <VerifyPinScreen {...verifyPinScreenProps} />
    );
    const basicPage = verifyPinScreen.root.findByType(BasicPageConnected)
      .props as IBasicPageProps;
    expect(basicPage.body).toBeDefined();
    expect(basicPage.footer).toBeUndefined();
    expect(basicPage.translateContent).toEqual(true);
  });

  it('should have a undefined pin by default in state and onPinChange should change pin in state', () => {
    const mockSetVerificationPin = jest.fn();
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce(['', mockSetVerificationPin]);
    const testRenderer = renderer.create(
      <VerifyPinScreen {...verifyPinScreenProps} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyContainerChildren = getChildren(body);

    const pinScreenContainer = bodyContainerChildren[2];
    expect(pinScreenContainer.type).toEqual(PinScreenContainer);
    expect(pinScreenContainer.props.enteredPin).toBe('');
    pinScreenContainer.props.onPinChange('1234');
    expect(mockSetVerificationPin).toHaveBeenCalledWith('1234');
  });

  it('should call setPinToBeVerifiedAction,resetState and addUpdatePinAction when onNextClick is called ', () => {
    const mockSetVerificationPin = jest.fn();
    useStateMock.mockReturnValueOnce(['1234', mockSetVerificationPin]);
    useRouteMock.mockReturnValueOnce({ params: { isUpdatePin: true } });
    const testRenderer = renderer.create(
      <VerifyPinScreen {...verifyPinScreenProps} errorCode={1234} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyContainerChildren = getChildren(body);

    const button = bodyContainerChildren[3];

    button.props.onPress();

    expect(verifyPinScreenProps.addUpdatePinAction).toHaveBeenCalledTimes(1);
    const expectedPinScreenParams: ICreatePinScreenRouteProps = {
      isUpdatePin: true,
      workflow: undefined,
      currentPin: undefined,
    };
    const expectedAddUpdatePinAsyncActionArgs: IAddUpdatePinAsyncActionArgs = {
      pin: '1234',
      pinScreenParams: expectedPinScreenParams,
      navigation: rootStackNavigationMock,
    };
    expect(verifyPinScreenProps.addUpdatePinAction).toHaveBeenNthCalledWith(
      1,
      expectedAddUpdatePinAsyncActionArgs
    );
  });

  it('sets workflow prop correctly', () => {
    const workflow = 'prescriptionTransfer' as Workflow;
    const verifyPinScreenPropsWithWorkflow = {
      ...verifyPinScreenProps,
      workflow,
    };
    const verifyPinScreen = renderer.create(
      <VerifyPinScreen {...verifyPinScreenPropsWithWorkflow} />
    );
    expect(verifyPinScreen.root.props.workflow).toEqual(workflow);
  });
});
