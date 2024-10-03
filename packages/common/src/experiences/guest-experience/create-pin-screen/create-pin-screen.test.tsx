// Copyright 2018 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { PinScreenContainer } from '../../../components/member/pin-screen-container/pin-screen-container';
import { IBasicPageProps } from '../../../components/pages/basic-page';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { PrimaryTextBox } from '../../../components/text/primary-text-box/primary-text-box';
import { Workflow } from '../../../models/workflow';
import { getChildren } from '../../../testing/test.helper';
import {
  CreatePinScreen,
  ICreatePinScreenActionProps,
  ICreatePinScreenRouteProps,
} from './create-pin-screen';
import { createPinScreenStyles } from './create-pin-screen.style';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { IVerifyPinScreenRouteProps } from '../verify-pin-screen/verify-pin-screen';
import { ISignUpContent } from '../../../models/cms-content/sign-up.ui-content';
import { useContent } from '../context-providers/session/ui-content-hooks/use-content';
import { BaseButton } from '../../../components/buttons/base/base.button';

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

const mockSetPinAction = jest.fn();
const mockNavigateToBackAction = jest.fn();

const createPinScreenProps: ICreatePinScreenRouteProps &
  ICreatePinScreenActionProps = {
  setPinAction: mockSetPinAction,
  navigateToBack: mockNavigateToBackAction,
};

const useRouteParamsMock: ICreatePinScreenRouteProps = {};

const uiContentMock: Partial<ISignUpContent> = {
  createPinScreenInfo: 'create-pin-screen-info-mock',
  updatePinErrorMessage: 'update-pin-error-message-mock',
  nextButtonLabel: 'next-button-label-mock',
  createPinHeader: 'create-pin-header-mock',
};

describe('CreatePinScreen', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useStateMock.mockReturnValue(['', jest.fn()]);
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({ params: useRouteParamsMock });
    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });
  });

  it('should render PrimaryTextBox with props', () => {
    const testRenderer = renderer.create(
      <CreatePinScreen {...createPinScreenProps} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;

    expect(bodyContainer.type).toEqual(View);

    const bodyContainerChildren = getChildren(bodyContainer);
    expect(bodyContainerChildren.length).toEqual(4);

    const pinLabelTextBox = bodyContainerChildren[0];
    expect(pinLabelTextBox.type).toEqual(PrimaryTextBox);
    expect(pinLabelTextBox.props.caption).toEqual(
      uiContentMock.createPinHeader
    );
    expect(pinLabelTextBox.props.textBoxStyle).toEqual(
      createPinScreenStyles.pinLabelText
    );

    const subHeaderTextBox = bodyContainerChildren[1];
    expect(subHeaderTextBox.type).toEqual(PrimaryTextBox);
    expect(subHeaderTextBox.props.caption).toEqual(
      uiContentMock.createPinScreenInfo
    );
    expect(subHeaderTextBox.props.textBoxStyle).toEqual(
      createPinScreenStyles.screenInfoHeadingText
    );
  });

  it('should not have subheader and have changed Header if isUpdatePin is true', () => {
    useRouteMock.mockReturnValueOnce({
      params: { ...useRouteParamsMock, isUpdatePin: true },
    });
    const testRenderer = renderer.create(
      <CreatePinScreen {...createPinScreenProps} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const bodyContainerChildren = getChildren(bodyContainer);
    const pinLabelTextBox = bodyContainerChildren[0];

    expect(pinLabelTextBox.type).toEqual(PrimaryTextBox);
    expect(pinLabelTextBox.props.caption).toEqual(
      uiContentMock.updatePinHeader
    );
    expect(pinLabelTextBox.props.textBoxStyle).toEqual(
      createPinScreenStyles.pinLabelText
    );

    const subHeaderTextBox = bodyContainerChildren[1];
    expect(subHeaderTextBox).toBeNull();
  });

  it('should render PinScreenContainer with props', () => {
    useStateMock.mockReturnValueOnce(['1234', jest.fn()]);
    const testRenderer = renderer.create(
      <CreatePinScreen {...createPinScreenProps} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const bodyContainerChildren = getChildren(bodyContainer);
    const pinScreenContainer = bodyContainerChildren[2];

    expect(pinScreenContainer.type).toEqual(PinScreenContainer);
    expect(pinScreenContainer.props.onPinChange).toEqual(expect.any(Function));
    expect(pinScreenContainer.props.enteredPin).toEqual('1234');
    expect(pinScreenContainer.props.errorMessage).toBeUndefined();
    expect(pinScreenContainer.props.testID).toEqual('createPinScreenContainer');
  });

  it('should render error message when error code is 2009', () => {
    const testRenderer = renderer.create(
      <CreatePinScreen {...{ ...createPinScreenProps, errorCode: 2009 }} />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const bodyContainerChildren = getChildren(bodyContainer);
    const pinScreenContainer = bodyContainerChildren[2];

    expect(pinScreenContainer.props.errorMessage).toEqual(
      uiContentMock.updatePinErrorMessage
    );
  });

  it('should render BasicPage with props', () => {
    const createPinScreen = renderer.create(
      <CreatePinScreen {...createPinScreenProps} />
    );
    const basicPage = createPinScreen.root.findByType(BasicPageConnected)
      .props as IBasicPageProps;
    expect(basicPage.body).toBeDefined();
    expect(basicPage.footer).toBeUndefined();
    expect(basicPage.navigateBack).toBeUndefined();
    expect(basicPage.translateContent).toEqual(true);
  });

  it('should BasicPage have navigateBack prop if isUpdatePin is true', () => {
    useRouteMock.mockReturnValueOnce({
      params: { ...useRouteParamsMock, isUpdatePin: true },
    });
    const createPinScreen = renderer.create(
      <CreatePinScreen {...createPinScreenProps} />
    );
    const basicPage = createPinScreen.root.findByType(BasicPageConnected)
      .props as IBasicPageProps;
    expect(basicPage.navigateBack).toBeDefined();
    if (basicPage.navigateBack) basicPage.navigateBack();
    expect(mockNavigateToBackAction).toBeCalledWith(rootStackNavigationMock);
  });

  it('should render footer as expected', () => {
    const testRenderer = renderer.create(
      <CreatePinScreen {...createPinScreenProps} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const pageBody = basicPage.props.body;
    const footer = pageBody.props.children[3];
    expect(footer.type).toEqual(BaseButton);
    expect(footer.props.disabled).toEqual(true);
    expect(footer.props.viewStyle).toEqual(
      createPinScreenStyles.buttonViewStyle
    );
    expect(footer.props.isSkeleton).toEqual(false);
    expect(footer.props.onPress).toEqual(expect.any(Function));
    expect(footer.props.testID).toEqual('createPinNextButton');
  });

  it('should have a empty pin by default in state and onPinChange should change pin in state', () => {
    const setCreatedPinMock = jest.fn();
    useStateMock.mockReturnValueOnce(['', setCreatedPinMock]);
    const testRenderer = renderer.create(
      <CreatePinScreen {...createPinScreenProps} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const bodyContainer = basicPage.props.body;
    const bodyContainerChildren = getChildren(bodyContainer);
    const pinScreenContainer = bodyContainerChildren[2];
    const onPinChange = pinScreenContainer.props.onPinChange;
    onPinChange('1234');
    expect(setCreatedPinMock).toHaveBeenCalledWith('1234');
  });

  it('should call updatePinAction, navigation.navigate to VerifyPin, and resetState() when onNextClick is called', async () => {
    useStateMock.mockReturnValueOnce(['1235', jest.fn()]);
    useRouteMock.mockReturnValueOnce({
      params: { ...useRouteParamsMock, currentPin: '1234', isUpdatePin: false },
    });
    const testRenderer = renderer.create(
      <CreatePinScreen {...createPinScreenProps} />
    );
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const pageBody = basicPage.props.body;
    const footer = pageBody.props.children[3];
    await footer.props.onPress();
    expect(createPinScreenProps.setPinAction).toHaveBeenCalledWith('1235');
    const expectedPinScreenParams: IVerifyPinScreenRouteProps = {
      isUpdatePin: false,
      currentPin: '1234',
      workflow: undefined,
    };
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'VerifyPin',
      expectedPinScreenParams
    );
  });

  it('should call workflow as props when onNextClick is called', async () => {
    const createdPinMock = '1234';
    const setCreatedPinMock = jest.fn();
    useStateMock.mockReturnValueOnce([createdPinMock, setCreatedPinMock]);
    useRouteMock.mockReturnValueOnce({
      params: { ...useRouteParamsMock, workflow: 'prescriptionTransfer' },
    });
    const newProps = {
      ...createPinScreenProps,
      workflow: 'prescriptionTransfer' as Workflow,
    };
    const testRenderer = renderer.create(<CreatePinScreen {...newProps} />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const pageBody = basicPage.props.body;
    const footer = pageBody.props.children[3];
    await footer.props.onPress();
    expect(createPinScreenProps.setPinAction).toHaveBeenCalledWith('1234');
    const expectedArgs: IVerifyPinScreenRouteProps = {
      workflow: 'prescriptionTransfer',
    };

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'VerifyPin',
      expectedArgs
    );
    expect(setCreatedPinMock).toHaveBeenCalledWith('');
  });

  it('sets workflow prop correctly', () => {
    const workflow = 'prescriptionTransfer' as Workflow;
    const createPinScreenPropsWithWorkflow = {
      ...createPinScreenProps,
      workflow,
    };
    const createPinScreen = renderer.create(
      <CreatePinScreen {...createPinScreenPropsWithWorkflow} />
    );
    expect(createPinScreen.root.props.workflow).toEqual(workflow);
  });
});
