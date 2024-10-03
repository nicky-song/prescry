// Copyright 2022 Prescryptive Health, Inc.

import React, { useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { VerifyPatientInfoScreen } from './verify-patient-info.screen';
import {
  verifyPatientInfoScreenStyles as styles,
  verifyPatientInfoScreenStyles,
} from './verify-patient-info.screen.styles';
import { rootStackNavigationMock } from '../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { IVerifyPatientInfoScreenContent } from './verify-patient-info.screen.content';
import { BasicPageConnected } from '../../../../components/pages/basic-page-connected';
import { BodyContentContainer } from '../../../../components/containers/body-content/body-content.container';
import { getChildren } from '../../../../testing/test.helper';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { LineSeparator } from '../../../../components/member/line-separator/line-separator';
import { PrimaryTextInput } from '../../../../components/inputs/primary-text/primary-text.input';
import { DatePicker } from '../../../../components/member/pickers/date/date.picker';
import { PrimaryCheckBox } from '../../../../components/checkbox/primary-checkbox/primary-checkbox';
import { BaseButton } from '../../../../components/buttons/base/base.button';
import { Workflow } from '../../../../models/workflow';
import { ICreateAccountScreenRouteProps } from '../sign-in/create-account/create-account.screen';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

const useStateMock = useState as jest.Mock;

jest.mock('../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../../../components/containers/body-content/body-content.container',
  () => ({
    BodyContentContainer: () => <div />,
  })
);

jest.mock('../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock(
  '../../../../components/member/line-separator/line-separator',
  () => ({
    LineSeparator: () => <div />,
  })
);

jest.mock(
  '../../../../components/inputs/primary-text/primary-text.input',
  () => ({
    PrimaryTextInput: () => <div />,
  })
);

jest.mock('../../../../components/member/pickers/date/date.picker', () => ({
  DatePicker: () => <div />,
}));

jest.mock(
  '../../../../components/checkbox/primary-checkbox/primary-checkbox',
  () => ({
    PrimaryCheckBox: () => <div />,
  })
);

jest.mock('../../../../components/buttons/base/base.button', () => ({
  BaseButton: () => <div />,
}));

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const verifyPatientInfoTitleMock = 'verify-patient-info-title-mock';
const verifyPatientInfoDescriptionMock = 'verify-patient-info-description-mock';
const firstNameLabelMock = 'first-name-label-mock';
const firstNamePlaceholderMock = 'first-name-placeholder-mock';
const lastNameLabelMock = 'last-name-label-mock';
const lastNamePlaceholderMock = 'last-name-placeholder-mock';
const dateOfBirthLabelMock = 'date-of-birth-label-mock';
const authorizationStatementMock = 'authorization-statement-mock';
const footerButtonLabelMock = 'footer-button-label-mock';

const verifyPatientInfoScreenCMSMock: IVerifyPatientInfoScreenContent = {
  verifyPatientInfoTitle: verifyPatientInfoTitleMock,
  verifyPatientInfoDescription: verifyPatientInfoDescriptionMock,
  firstNameLabel: firstNameLabelMock,
  firstNamePlaceholder: firstNamePlaceholderMock,
  lastNameLabel: lastNameLabelMock,
  lastNamePlaceholder: lastNamePlaceholderMock,
  dateOfBirthLabel: dateOfBirthLabelMock,
  authorizationStatement: authorizationStatementMock,
  footerButtonLabel: footerButtonLabelMock,
};

const setFirstNameMock = jest.fn();
const setLastNameMock = jest.fn();
const setDateMock = jest.fn();
const setIsAuthorizedMock = jest.fn();

const workflowMock: Workflow = 'prescriptionInvite';
const prescriptionIdMock = 'prescription-id-mock';
const userExistsMock = true;
const isDependentMock = true;

describe('VerifyPatientInfoScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
    useRouteMock.mockReturnValue({
      params: {
        workflow: workflowMock,
        prescriptionId: prescriptionIdMock,
        userExists: userExistsMock,
        isDependent: isDependentMock,
      },
    });
    useContentMock.mockReturnValue({
      content: verifyPatientInfoScreenCMSMock,
      isContentLoading: false,
    });
    useStateMock
      .mockReturnValueOnce(['', setFirstNameMock])
      .mockReturnValueOnce(['', setLastNameMock])
      .mockReturnValueOnce(['', setDateMock])
      .mockReturnValueOnce([false, setIsAuthorizedMock]);
  });

  it('renders as BasicPageConnected with expected props', () => {
    const testRenderer = renderer.create(<VerifyPatientInfoScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    expect(basicPageConnected.type).toEqual(BasicPageConnected);
    expect(basicPageConnected.props.body.type).toEqual(BodyContentContainer);
    expect(basicPageConnected.props.showProfileAvatar).toEqual(true);
    expect(basicPageConnected.props.hideNavigationMenuButton).toEqual(false);
    expect(basicPageConnected.props.navigateBack).toEqual(
      rootStackNavigationMock.goBack
    );
  });

  it.each([[true], [false]])(
    'renders BodyContentContainer in body with expected props (isContentLoading: %s)',
    (isContentLoading: boolean) => {
      useContentMock.mockReturnValueOnce({
        content: verifyPatientInfoScreenCMSMock,
        isContentLoading,
      });

      const testRenderer = renderer.create(<VerifyPatientInfoScreen />);

      const basicPageConnected = testRenderer.root
        .children[0] as ReactTestInstance;

      const bodyContentContainer = basicPageConnected.props.body;

      expect(bodyContentContainer.type).toEqual(BodyContentContainer);
      expect(bodyContentContainer.props.title).toEqual(
        verifyPatientInfoTitleMock
      );
      expect(bodyContentContainer.props.isSkeleton).toEqual(isContentLoading);

      const bodyContentContainerChildren = getChildren(bodyContentContainer);

      expect(bodyContentContainerChildren.length).toEqual(7);
    }
  );

  it.each([[true], [false]])(
    'renders verifyPatientInfoDescription as BaseText with expected props (isContentLoading: %s)',
    (isContentLoading: boolean) => {
      useContentMock.mockReturnValueOnce({
        content: verifyPatientInfoScreenCMSMock,
        isContentLoading,
      });

      const testRenderer = renderer.create(<VerifyPatientInfoScreen />);

      const basicPageConnected = testRenderer.root
        .children[0] as ReactTestInstance;

      const bodyContentContainer = basicPageConnected.props.body;

      const verifyPatientInfoDescriptionText =
        getChildren(bodyContentContainer)[0];

      expect(verifyPatientInfoDescriptionText.type).toEqual(BaseText);
      expect(verifyPatientInfoDescriptionText.props.isSkeleton).toEqual(
        isContentLoading
      );
      expect(verifyPatientInfoDescriptionText.props.skeletonWidth).toEqual(
        'long'
      );
    }
  );

  it('renders LineSeparators in expected positions with expected props', () => {
    const testRenderer = renderer.create(<VerifyPatientInfoScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const bodyContentContainer = basicPageConnected.props.body;

    const bodyContentContainerChildren = getChildren(bodyContentContainer);

    const firstLineSeparator = bodyContentContainerChildren[1];
    const secondLineSeparator = bodyContentContainerChildren[4];

    expect(firstLineSeparator.type).toEqual(LineSeparator);
    expect(firstLineSeparator.props.viewStyle).toEqual(
      styles.lineSeparatorViewStyle
    );

    expect(secondLineSeparator.type).toEqual(LineSeparator);
    expect(secondLineSeparator.props.viewStyle).toEqual(
      styles.lineSeparatorViewStyle
    );
  });

  it.each([[true], [false]])(
    'renders topInputView with expected props and children (isContentLoading: %s)',
    (isContentLoading: boolean) => {
      useContentMock.mockReturnValueOnce({
        content: verifyPatientInfoScreenCMSMock,
        isContentLoading,
      });

      const testRenderer = renderer.create(<VerifyPatientInfoScreen />);

      const basicPageConnected = testRenderer.root
        .children[0] as ReactTestInstance;

      const bodyContentContainer = basicPageConnected.props.body;

      const bodyContentContainerChildren = getChildren(bodyContentContainer);

      const topInputView = bodyContentContainerChildren[2];

      expect(topInputView.type).toEqual(View);
      expect(topInputView.props.style).toEqual(styles.topInputViewStyle);

      const topInputViewChildren = getChildren(topInputView);

      expect(topInputViewChildren.length).toEqual(2);

      const firstPrimaryTextInput = topInputViewChildren[0];
      const secondPrimaryTextInput = topInputViewChildren[1];

      expect(firstPrimaryTextInput.type).toEqual(PrimaryTextInput);
      expect(firstPrimaryTextInput.props.onChangeText).toEqual(
        expect.any(Function)
      );

      firstPrimaryTextInput.props.onChangeText('first-name-mock');

      expect(setFirstNameMock).toHaveBeenCalledWith('first-name-mock');

      expect(firstPrimaryTextInput.props.label).toEqual(firstNameLabelMock);
      expect(firstPrimaryTextInput.props.viewStyle).toEqual(
        styles.firstInputViewStyle
      );
      expect(firstPrimaryTextInput.props.placeholder).toEqual(
        firstNamePlaceholderMock
      );
      expect(firstPrimaryTextInput.props.isSkeleton).toEqual(isContentLoading);

      expect(secondPrimaryTextInput.type).toEqual(PrimaryTextInput);
      expect(secondPrimaryTextInput.props.onChangeText).toEqual(
        expect.any(Function)
      );

      secondPrimaryTextInput.props.onChangeText('last-name-mock');

      expect(setLastNameMock).toHaveBeenCalledWith('last-name-mock');

      expect(secondPrimaryTextInput.props.label).toEqual(lastNameLabelMock);
      expect(secondPrimaryTextInput.props.viewStyle).toEqual(
        styles.secondInputViewStyle
      );
      expect(secondPrimaryTextInput.props.placeholder).toEqual(
        lastNamePlaceholderMock
      );
      expect(secondPrimaryTextInput.props.isSkeleton).toEqual(isContentLoading);
    }
  );

  it.each([[true], [false]])(
    'renders datePickerView with expected props and children (isContentLoading: %s)',
    (isContentLoading: boolean) => {
      useContentMock.mockReturnValueOnce({
        content: verifyPatientInfoScreenCMSMock,
        isContentLoading,
      });

      const testRenderer = renderer.create(<VerifyPatientInfoScreen />);

      const basicPageConnected = testRenderer.root
        .children[0] as ReactTestInstance;

      const bodyContentContainer = basicPageConnected.props.body;

      const bodyContentContainerChildren = getChildren(bodyContentContainer);

      const datePickerView = bodyContentContainerChildren[3];

      expect(datePickerView.type).toEqual(View);
      expect(datePickerView.props.style).toEqual(styles.datePickerViewStyle);

      const datePickerViewChildren = getChildren(datePickerView);

      expect(datePickerViewChildren.length).toEqual(1);

      const datePicker = datePickerViewChildren[0];

      expect(datePicker.type).toEqual(DatePicker);
      expect(datePicker.props.getSelectedDate).toEqual(expect.any(Function));

      datePicker.props.getSelectedDate('date-mock');

      expect(setDateMock).toHaveBeenCalledWith('date-mock');

      expect(datePicker.props.label).toEqual(dateOfBirthLabelMock);
      expect(datePicker.props.isSkeleton).toEqual(isContentLoading);
    }
  );

  it.each([
    [true, true, true],
    [true, false, true],
    [false, true, true],
    [false, false, true],
    [true, true, undefined],
    [true, true, false],
  ])(
    'renders PrimaryCheckBox with expected props (isContentLoading: %s, isAuthorized: %s, userExist: %s)',
    (
      isContentLoading: boolean,
      isAuthorized: boolean,
      userExistsMock?: boolean
    ) => {
      useStateMock.mockReset();
      useStateMock
        .mockReturnValueOnce(['', setFirstNameMock])
        .mockReturnValueOnce(['', setLastNameMock])
        .mockReturnValueOnce(['', setDateMock])
        .mockReturnValueOnce([isAuthorized, setIsAuthorizedMock]);
      useContentMock.mockReturnValueOnce({
        content: verifyPatientInfoScreenCMSMock,
        isContentLoading,
      });

      useRouteMock.mockReturnValue({
        params: {
          workflow: workflowMock,
          prescriptionId: prescriptionIdMock,
          userExists: userExistsMock,
          isDependent: true,
        },
      });

      const testRenderer = renderer.create(<VerifyPatientInfoScreen />);

      const basicPageConnected = testRenderer.root
        .children[0] as ReactTestInstance;

      const bodyContentContainer = basicPageConnected.props.body;

      const bodyContentContainerChildren = getChildren(bodyContentContainer);

      const primaryCheckBox = bodyContentContainerChildren[5];

      if (userExistsMock) {
        expect(primaryCheckBox.type).toEqual(PrimaryCheckBox);
        expect(primaryCheckBox.props.checkBoxChecked).toEqual(isAuthorized);
        expect(primaryCheckBox.props.checkBoxLabel).toEqual(
          authorizationStatementMock
        );
        expect(primaryCheckBox.props.checkBoxValue).toEqual(
          authorizationStatementMock
        );
        expect(primaryCheckBox.props.checkBoxImageStyle).toEqual(
          verifyPatientInfoScreenStyles.checkboxImageStyle
        );
        expect(primaryCheckBox.props.onPress).toEqual(expect.any(Function));

        primaryCheckBox.props.onPress();

        expect(setIsAuthorizedMock).toHaveBeenCalledWith(!isAuthorized);

        expect(primaryCheckBox.props.checkBoxTextStyle).toEqual(
          styles.authorizationTextStyle
        );
        expect(primaryCheckBox.props.isSkeleton).toEqual(isContentLoading);
      } else {
        expect(primaryCheckBox).toEqual(undefined);
      }
    }
  );

  it.each([
    [true, '', '', '', false],
    [true, '', '', '', true],
    [true, 'first-name', 'last-name', 'date', false],
    [false, 'first-name', 'last-name', 'date', true],
  ])(
    'renders BaseButton as expected (isContentLoading: %s, firstName: %s, lastName: %s, date: %s, isAuthorized: %s)',
    (
      isContentLoading: boolean,
      firstName: string,
      lastName: string,
      date: string,
      isAuthorized: boolean
    ) => {
      useStateMock.mockReset();
      useStateMock
        .mockReturnValueOnce([firstName, setFirstNameMock])
        .mockReturnValueOnce([lastName, setLastNameMock])
        .mockReturnValueOnce([date, setDateMock])
        .mockReturnValueOnce([isAuthorized, setIsAuthorizedMock]);
      useContentMock.mockReturnValueOnce({
        content: verifyPatientInfoScreenCMSMock,
        isContentLoading,
      });

      const testRenderer = renderer.create(<VerifyPatientInfoScreen />);

      const basicPageConnected = testRenderer.root
        .children[0] as ReactTestInstance;

      const bodyContentContainer = basicPageConnected.props.body;

      const bodyContentContainerChildren = getChildren(bodyContentContainer);

      const baseButton = bodyContentContainerChildren[6];

      const isContinueDisabled =
        !firstName || !lastName || !date || !isAuthorized;

      expect(baseButton.type).toEqual(BaseButton);
      expect(baseButton.props.disabled).toEqual(isContinueDisabled);
      expect(baseButton.props.viewStyle).toEqual(styles.buttonViewStyle);
      expect(baseButton.props.isSkeleton).toEqual(isContentLoading);
      expect(baseButton.props.onPress).toEqual(expect.any(Function));
    }
  );

  it('navigates to CreateAccountScreen on Continue button press with expected params', () => {
    const testRenderer = renderer.create(<VerifyPatientInfoScreen />);

    const basicPageConnected = testRenderer.root
      .children[0] as ReactTestInstance;

    const bodyContentContainer = basicPageConnected.props.body;

    const bodyContentContainerChildren = getChildren(bodyContentContainer);

    const baseButton = bodyContentContainerChildren[6];

    baseButton.props.onPress();

    const createAccountScreenParamsMock: ICreateAccountScreenRouteProps = {
      workflow: workflowMock,
      prescriptionId: 'prescription-id-mock',
      isDependent: isDependentMock,
    };

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith('RootStack', {
      screen: 'CreateAccount',
      params: createAccountScreenParamsMock,
    });
  });
});
