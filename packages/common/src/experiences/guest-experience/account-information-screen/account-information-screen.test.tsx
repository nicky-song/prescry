// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { useMembershipContext } from '../context-providers/membership/use-membership-context.hook';
import { AccountInformationScreen } from './account-information-screen';
import { accountInformationScreenStyles } from './account-information-screen.styles';
import { accountInformationScreenContent } from './account-information-screen.content';
import { IMembershipState } from '../state/membership/membership.state';
import { StringFormatter } from '../../../utils/formatters/string.formatter';
import { MemberNameFormatter } from '../../../utils/formatters/member-name-formatter';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../context-providers/redux/redux.context';
import { PrimaryTextInput } from '../../../components/inputs/primary-text/primary-text.input';
import { BaseButton } from '../../../components/buttons/base/base.button';
import { SecondaryButton } from '../../../components/buttons/secondary/secondary.button';
import { Heading } from '../../../components/member/heading/heading';
import { Label } from '../../../components/text/label/label';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { getChildren } from '../../../testing/test.helper';
import { IconButton } from '../../../components/buttons/icon/icon.button';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import { updateRecoveryEmailDataLoadingAsyncAction } from '../store/member-list-info/async-actions/update-recovery-email-data-loading.async-action';
import dateFormatter from '../../../utils/formatters/date.formatter';
import { formatPhoneNumber } from '../../../utils/formatters/phone-number.formatter';
import { ProtectedBaseText } from '../../../components/text/protected-base-text/protected-base-text';
import { ILimitedPatient } from '../../../models/patient-profile/limited-patient';
import { IPatientProfileResponse } from '../../../models/patient-profile/patient-profile';
import { RxGroupTypesEnum } from '../../../models/member-profile/member-profile-info';
import { getPatientInfoByRxGroupType } from '../../../utils/patient.helper';

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('@react-navigation/native');
const navigationMock = useNavigation as jest.Mock;

jest.mock('../../../components/buttons/icon/icon.button', () => ({
  IconButton: () => <div />,
}));

jest.mock(
  '../store/member-list-info/async-actions/update-recovery-email-data-loading.async-action'
);
const updateRecoveryEmailDataLoadingAsyncActionMock =
  updateRecoveryEmailDataLoadingAsyncAction as jest.Mock;

jest.mock('../../../utils/patient.helper');
const getPatientInfoByRxGroupTypeMock =
  getPatientInfoByRxGroupType as jest.Mock;

const patientMock = {
  firstName: 'firstName',
  lastName: 'lastName',
  dateOfBirth: '2000-01-01',
  phoneNumber: '9999999999',
  recoveryEmail: 'recovery-email-mock',
} as ILimitedPatient;

const patientResponseMock = {
  rxGroupType: RxGroupTypesEnum.CASH,
  primary: patientMock,
} as IPatientProfileResponse;

const mockMembershipState: IMembershipState = {
  account: {
    phoneNumber: '9999999999',
    firstName: 'firstName',
    lastName: 'lastName',
    favoritedPharmacies: [],
    recoveryEmail: 'recovery-email-mock',
    dateOfBirth: '2000-01-01',
  },
  profileList: [],
  favoritingStatus: 'none',
};

interface IStateCalls {
  isEditEmail: [boolean, jest.Mock];
  oldEmailAddress: [string | undefined, jest.Mock];
  newEmailAddress: [string | undefined, jest.Mock];
  errorMessage: [string | undefined, jest.Mock];
}

function stateReset({
  isEditEmail = [false, jest.fn()],
  oldEmailAddress = ['old@email.com', jest.fn()],
  newEmailAddress = ['new@email.com', jest.fn()],
  errorMessage = [undefined, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(isEditEmail);
  useStateMock.mockReturnValueOnce(oldEmailAddress);
  useStateMock.mockReturnValueOnce(newEmailAddress);
  useStateMock.mockReturnValueOnce(errorMessage);
}

describe('AccountInformationScreen ', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useMembershipContextMock.mockReturnValue({
      membershipState: mockMembershipState,
      membershipDispatch: jest.fn(),
    });
    const reduxContextMock: IReduxContext = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    navigationMock.mockReturnValue(rootStackNavigationMock);
    stateReset({});
  });

  it('renders as basic page', () => {
    const reduxDispatchMock = jest.fn();
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const testRenderer = renderer.create(<AccountInformationScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.showProfileAvatar).toEqual(true);
    expect(basicPage.props.hideNavigationMenuButton).toEqual(false);
    expect(basicPage.props.translateContent).toEqual(true);

    const navigateBack = basicPage.props.navigateBack;
    navigateBack();

    expect(rootStackNavigationMock.goBack).toHaveBeenCalledTimes(1);
  });

  it.each([[false], [true]])(
    'should render body container as expected (isBlockchain %p)',
    (isBlockchainMock: boolean) => {
      const mockName = StringFormatter.trimAndConvertToNameCase(
        MemberNameFormatter.formatName(
          mockMembershipState.account.firstName,
          mockMembershipState.account.lastName
        )
      );

      useMembershipContextMock.mockReturnValue({
        membershipState: {
          ...mockMembershipState,
          patientList: isBlockchainMock ? [patientResponseMock] : undefined,
        },
        membershipDispatch: jest.fn(),
      });

      if (isBlockchainMock) {
        getPatientInfoByRxGroupTypeMock.mockReturnValueOnce(patientMock);
      }

      const testRenderer = renderer.create(<AccountInformationScreen />);
      const basicPageConnected =
        testRenderer.root.findByType(BasicPageConnected);
      const pageProps = basicPageConnected.props;
      const body = pageProps.body;
      const name = body.props.children[0];
      const section1Container = body.props.children[1];
      const personalInfoContainer = section1Container.props.children;

      const emailFieldContainer = personalInfoContainer.props.children[0];
      const emailLabel = emailFieldContainer.props.children[0].props.children;
      const emailContent = emailLabel.props.children;

      const editEmailButtonContainer = emailFieldContainer.props.children[1];
      const editEmailButton = editEmailButtonContainer.props.children;

      const dobContainer = personalInfoContainer.props.children[1];
      const mobileContainer = personalInfoContainer.props.children[2];

      const section2Container = body.props.children[2];

      expect(body.type).toEqual(BodyContentContainer);
      expect(body.props.title).toEqual(
        accountInformationScreenContent.headerText
      );

      expect(name.type).toEqual(Heading);
      expect(name.props.children).toEqual(mockName);
      expect(name.props.level).toEqual(2);
      expect(name.props.translateContent).toEqual(false);

      expect(section1Container.props.style).toEqual(
        accountInformationScreenStyles.sectionViewStyle
      );

      expect(personalInfoContainer.props.style).toEqual(
        accountInformationScreenStyles.bottomSpacing
      );

      expect(emailFieldContainer.props.style).toEqual(
        accountInformationScreenStyles.editableItemViewStyle
      );

      expect(emailLabel.type).toEqual(Label);

      expect(emailContent.type).toEqual(ProtectedBaseText);
      expect(emailContent.props.children).toEqual(
        mockMembershipState.account.recoveryEmail
      );

      expect(editEmailButtonContainer.props.style).toEqual(
        accountInformationScreenStyles.buttonContainer
      );
      expect(editEmailButton.type).toEqual(IconButton);
      expect(editEmailButton.props.testID).toEqual('editEmailButtonIcon');
      expect(editEmailButton.props.iconName).toEqual('edit');
      expect(editEmailButton.props.viewStyle).toEqual(
        accountInformationScreenStyles.editButtonViewStyle
      );
      expect(editEmailButton.props.iconTextStyle).toEqual(
        accountInformationScreenStyles.editButtonTextStyle
      );
      expect(editEmailButton.props.accessibilityLabel).toEqual(
        accountInformationScreenContent.editEmailButtonIconAccessibilityLabel
      );

      expect(dobContainer.props.style).toEqual(
        accountInformationScreenStyles.itemViewStyle
      );
      expect(dobContainer.props.children.type).toEqual(Label);
      expect(dobContainer.props.children.props.label).toEqual(
        accountInformationScreenContent.dateOfBirthLabel
      );
      const protectedTextDateOfBirth =
        dobContainer.props.children.props.children;
      expect(protectedTextDateOfBirth.type).toEqual(ProtectedBaseText);
      expect(protectedTextDateOfBirth.props.children).toEqual(
        dateFormatter.formatToMMDDYYYY(
          dateFormatter.convertDateOfBirthToDate(
            mockMembershipState.account.dateOfBirth
          )
        )
      );

      expect(mobileContainer.props.style).toEqual(
        accountInformationScreenStyles.itemViewStyle
      );
      expect(mobileContainer.props.children.type).toEqual(Label);
      expect(mobileContainer.props.children.props.label).toEqual(
        accountInformationScreenContent.mobileLabel
      );
      const protectedTextMobilePhoneNumber =
        mobileContainer.props.children.props.children;
      expect(protectedTextMobilePhoneNumber.type).toEqual(ProtectedBaseText);
      expect(protectedTextMobilePhoneNumber.props.children).toEqual(
        formatPhoneNumber(mockMembershipState.account.phoneNumber)
      );

      expect(section2Container.props.style).toEqual(
        accountInformationScreenStyles.lastSectionViewStyle
      );

      if (isBlockchainMock) {
        expect(getPatientInfoByRxGroupTypeMock).toHaveBeenCalledWith(
          [patientResponseMock],
          RxGroupTypesEnum.CASH
        );
      }
    }
  );

  it('should render PrimaryTextInput when editing email', () => {
    stateReset({ isEditEmail: [true, jest.fn()] });

    useMembershipContextMock.mockReturnValue({
      membershipState: mockMembershipState,
      membershipDispatch: jest.fn(),
    });

    const testRenderer = renderer.create(<AccountInformationScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const section1Container = body.props.children[1];
    const personalInfoContainer = section1Container.props.children;
    const emailFieldContainer = personalInfoContainer.props.children[0];
    const emailInput = emailFieldContainer.props.children;

    const section2Container = body.props.children[2];
    const editPinButton =
      section2Container.props.children[1].props.children[0].props.children[1];
    const editPinButtonIcon = editPinButton.props.children;

    expect(section1Container.props.style).toEqual(
      accountInformationScreenStyles.sectionViewStyle
    );

    expect(personalInfoContainer.props.style).toEqual(
      accountInformationScreenStyles.bottomSpacing
    );

    expect(emailFieldContainer.props.style).toEqual(
      accountInformationScreenStyles.itemViewStyle
    );

    expect(emailInput.type).toEqual(PrimaryTextInput);
    expect(emailInput.props.textContentType).toEqual('emailAddress');

    expect(section2Container.props.style).toEqual(
      accountInformationScreenStyles.lastSectionViewStyle
    );

    expect(editPinButton.props.style).toEqual(
      accountInformationScreenStyles.buttonContainer
    );
    expect(editPinButtonIcon.type).toEqual(IconButton);
    expect(editPinButtonIcon.props.testID).toEqual('editPinButtonIcon');
    expect(editPinButtonIcon.props.iconName).toEqual('edit');
    expect(editPinButtonIcon.props.viewStyle).toEqual(
      accountInformationScreenStyles.editButtonViewStyle
    );
    expect(editPinButtonIcon.props.iconTextStyle).toEqual(
      accountInformationScreenStyles.editButtonTextStyle
    );
    expect(editPinButtonIcon.props.accessibilityLabel).toEqual(
      accountInformationScreenContent.editPinButtonIconAccessibilityLabel
    );

    expect(emailFieldContainer.props.testID).toEqual('accountInfoEditEmail');
  });

  it('should render Save and Cancel buttons when editing email', () => {
    stateReset({ isEditEmail: [true, jest.fn()] });

    useMembershipContextMock.mockReturnValue({
      membershipState: mockMembershipState,
      membershipDispatch: jest.fn(),
    });

    const testRenderer = renderer.create(<AccountInformationScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;

    const section2Container = body.props.children[2];
    const topSpacing = section2Container.props.children[1];
    const buttonContainer = topSpacing.props.children[1];
    const saveButton = buttonContainer.props.children[0];
    const cancelButton = buttonContainer.props.children[1];

    expect(buttonContainer.props.style).toEqual(
      accountInformationScreenStyles.saveButtonsViewStyle
    );
    expect(saveButton.type).toEqual(BaseButton);
    expect(saveButton.props.testID).toEqual(
      'accountInformationScreenBaseButtonSave'
    );
    expect(cancelButton.type).toEqual(SecondaryButton);
    expect(cancelButton.props.testID).toEqual(
      'accountInformationScreenSecondaryButtonCancel'
    );
  });

  it('should call update email dispatch when saving email', () => {
    stateReset({ isEditEmail: [true, jest.fn()] });

    useMembershipContextMock.mockReturnValue({
      membershipState: mockMembershipState,
      membershipDispatch: jest.fn(),
    });

    const testRenderer = renderer.create(<AccountInformationScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;

    const section2Container = body.props.children[2];
    const topSpacing = section2Container.props.children[1];
    const buttonContainer = topSpacing.props.children[1];
    const saveButton = buttonContainer.props.children[0];

    saveButton.props.onPress();

    expect(updateRecoveryEmailDataLoadingAsyncActionMock).toBeCalledWith(
      {
        email: 'new@email.com',
        oldEmail: 'old@email.com',
      },
      rootStackNavigationMock
    );
  });

  it('should navigate to login pin screen on reset pin press', () => {
    useMembershipContextMock.mockReturnValue({
      membershipState: mockMembershipState,
      membershipDispatch: jest.fn(),
    });

    const testRenderer = renderer.create(<AccountInformationScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const section2Container = body.props.children[2];
    const editPinButtonContainer =
      section2Container.props.children[1].props.children[0].props.children[1];
    const editPinButton = getChildren(editPinButtonContainer)[0];

    editPinButton.props.onPress();

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith('LoginPin', {
      isUpdatePin: true,
    });
  });
});
