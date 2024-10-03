// Copyright 2018 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BaseButton } from '../../../components/buttons/base/base.button';
import {
  EditMemberProfileScreen,
  IEditMemberProfileScreenActionProps,
  IEditMemberProfileScreenProps,
} from './edit-member-profile-screen';
import { editMemberProfileScreenContent } from './edit-member-profile-screen.content';
import {
  IDependentProfile,
  RxGroupTypesEnum,
} from '../../../models/member-profile/member-profile-info';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { FontAwesomeIcon } from '../../../components/icons/font-awesome/font-awesome.icon';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useMembershipContext } from '../context-providers/membership/use-membership-context.hook';
import { IMembershipContext } from '../context-providers/membership/membership.context';
import { defaultMembershipState } from '../state/membership/membership.state';
import { getHighestPriorityProfile } from '../../../utils/profile.helper';
import { getChildren } from '../../../testing/test.helper';
import { IEditMemberProfileState } from '../store/edit-member-profile/edit-member-profile-reducer';
import { IconButton } from '../../../components/buttons/icon/icon.button';
import { BasePicker } from '../../../components/member/pickers/base/base.picker';
import { editMemberProfileScreenStyle } from './edit-member-profile-screen.styles';
import { BaseText } from '../../../components/text/base-text/base-text';
import { ProtectedBaseText } from '../../../components/text/protected-base-text/protected-base-text';
import { ProtectedView } from '../../../components/containers/protected-view/protected-view';

jest.mock('../../../components/member/pickers/base/base.picker', () => ({
  BasePicker: () => <div />,
}));

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../../../components/icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock('../../../utils/profile.helper');
const getHighestPriorityProfileMock = getHighestPriorityProfile as jest.Mock;

jest.mock(
  '../../../components/containers/protected-view/protected-view',
  () => ({
    ProtectedView: () => <div />,
  })
);

const adultMembers = [
  {
    firstName: 'first-name-1',
    identifier: 'identifier-1',
    lastName: 'last-name-1',
    rxGroupType: RxGroupTypesEnum.SIE,
  },
  {
    firstName: 'first-name-2',
    identifier: 'identifier-2',
    lastName: 'last-name-2',
    rxGroupType: RxGroupTypesEnum.SIE,
  },
] as IDependentProfile[];

const editMemberProfileScreenProps: IEditMemberProfileScreenProps = {
  isAdult: true,
  memberInfo: {
    email: 'abc@xyz.com',
    firstName: 'fake-first-name',
    isPrimary: true,
    lastName: 'fake-last-name',
    phoneNumber: '1234567890',
    primaryMemberFamilyId: 'fake-family-id',
    primaryMemberPersonCode: 'fake-person-code',
    primaryMemberRxId: 'fake-rx-id',
    rxGroupType: RxGroupTypesEnum.SIE,
    rxSubGroup: 'HMA01',
    identifier: 'fake-identifier',
    dateOfBirth: '2000-01-01',
  },
};

const mockSaveMemberContactInfo = jest.fn();
const mockSetErrorMessage = jest.fn();

const editMemberProfileScreenActionProps: IEditMemberProfileScreenActionProps =
  {
    saveMemberContactInfo: mockSaveMemberContactInfo,
    setErrorMessage: mockSetErrorMessage,
  };

describe('EditMemberProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useStateMock.mockReturnValueOnce([false, jest.fn()]);
    useStateMock.mockReturnValueOnce([
      editMemberProfileScreenProps.memberInfo,
      jest.fn(),
    ]);
    useStateMock.mockReturnValueOnce([
      editMemberProfileScreenProps.secondaryUser,
      jest.fn(),
    ]);

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const membershipContextMock: Partial<IMembershipContext> = {
      membershipState: defaultMembershipState,
    };
    useMembershipContextMock.mockReturnValue(membershipContextMock);

    getHighestPriorityProfileMock.mockReturnValue({ adultMembers });
  });

  it('should have BasicPage with Props', () => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const editMemberProfileScreen = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );
    const basicPage =
      editMemberProfileScreen.root.findByType(BasicPageConnected).props;
    expect(basicPage.navigateBack).toBe(rootStackNavigationMock.goBack);
    expect(basicPage.translateContent).toBe(true);
    const header = basicPage.header;
    expect(header.type).toEqual(View);
    expect(header.props.testID).toEqual('headerRxContainer');
    const headerElements = header.props.children;
    const nameBaseText = headerElements[0];
    expect(nameBaseText.type).toEqual(ProtectedBaseText);
    expect(nameBaseText.props.children).toBe('fake-first-name fake-last-name');
    const memberId = headerElements[1];
    const familyIDBaseText = memberId.props.children[1];
    expect(familyIDBaseText.type).toEqual(ProtectedBaseText);
    expect(familyIDBaseText.props.children).toBe('fake-family-id');
  });

  it('should render adult members with expected props', () => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const editMemberProfileScreen = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );
    const basicPage =
      editMemberProfileScreen.root.findByType(BasicPageConnected).props;
    const body = basicPage.body;
    const bodyView = body.props.children[0];
    const adultMembers = bodyView.props.children[6];
    const basePicker = adultMembers.props.children[1];
    expect(adultMembers.type).toEqual(View);
    expect(adultMembers.props.style).toEqual(
      editMemberProfileScreenStyle.basePickerViewStyle
    );
    expect(basePicker.type).toEqual(BasePicker);
    expect(basePicker.props.selectedValue).toEqual('');
  });

  it('should initialize correct state and effect variables', () => {
    renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );

    expect(useStateMock).toHaveBeenCalledTimes(3);
    expect(useStateMock).toHaveBeenNthCalledWith(1, false);
    expect(useStateMock).toHaveBeenNthCalledWith(
      2,
      editMemberProfileScreenProps.memberInfo
    );
    expect(useStateMock).toHaveBeenNthCalledWith(
      3,
      editMemberProfileScreenProps.secondaryUser
    );
  });

  it('should not be editable if isMemberEditFeatureEnable flag is false or undefined', () => {
    const testRenderer = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const textInputList = bodyRenderer.root.findAllByType(TextInput);
    const baseTextList = bodyRenderer.root.findAllByType(BaseText);

    expect(textInputList[0].props.placeholder).toBe('Email');

    const emailAddressView = bodyRenderer.root.findByType(ProtectedView);
    const emailAddressTextInput = getChildren(emailAddressView)[0];

    expect(emailAddressTextInput.props.textContentType).toBe('emailAddress');
    expect(emailAddressTextInput.props.editable).toBeFalsy();

    expect(textInputList[1].props.placeholder).toBe('Mobile #');
    expect(textInputList[1].props.editable).toBeFalsy();

    expect(baseTextList[2].props.children).toBe(
      editMemberProfileScreenContent.mobileNumberDescription
    );
    expect(baseTextList[2].props.style).toBe(
      editMemberProfileScreenStyle.bodyMobileInfoText
    );
    expect(textInputList[2].props.placeholder).toBe(
      editMemberProfileScreenContent.secondaryUserLabel
    );
    expect(textInputList[2].props.editable).toBeFalsy();
  });

  it('should set error message if email or phone number provided is invalid', async () => {
    const testRenderer = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );

    const testIdName = 'saveButton';

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);
    const baseButton = bodyRenderer.root.findAllByType(BaseButton)[1];

    expect(baseButton.props.children).toEqual(
      editMemberProfileScreenContent.saveButtonLabel
    );
    expect(baseButton.props.disabled).toEqual(true);
    expect(baseButton.props.testID).toEqual(testIdName);

    await baseButton.props.onPress();

    expect(
      editMemberProfileScreenActionProps.setErrorMessage
    ).toHaveBeenCalledWith(editMemberProfileScreenContent.errorMessage);
    expect(
      editMemberProfileScreenActionProps.saveMemberContactInfo
    ).not.toHaveBeenCalled();
  });

  it('requests member update on save when contact info changed', () => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const secondaryUserMock: Partial<IDependentProfile> = {
      firstName: 'secondary-first-name',
      lastName: 'secondary=last-name',
    };

    useStateMock.mockReset();

    const isContactInfoEdited = true;
    useStateMock.mockReturnValueOnce([isContactInfoEdited, jest.fn()]);
    useStateMock.mockReturnValueOnce([
      editMemberProfileScreenProps.memberInfo,
      jest.fn(),
    ]);
    useStateMock.mockReturnValueOnce([secondaryUserMock, jest.fn()]);

    const testRenderer = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);
    const baseButton = bodyRenderer.root.findAllByType(BaseButton);

    baseButton[1].props.onPress();

    const expectedArgs: IEditMemberProfileState = {
      memberInfo: editMemberProfileScreenProps.memberInfo,
      secondaryUser: secondaryUserMock as IDependentProfile,
    };

    expect(
      editMemberProfileScreenActionProps.saveMemberContactInfo
    ).toHaveBeenCalledWith(rootStackNavigationMock, expectedArgs);
  });

  it('should disable Save button if email or phone is not present', () => {
    editMemberProfileScreenProps.memberInfo.rxGroupType = RxGroupTypesEnum.SIE;

    const testRenderer = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const baseButton = bodyRenderer.root.findAllByType(BaseButton)[1];
    expect(baseButton.props.disabled).toBeTruthy();
  });

  it('should have Picker component with props & style', () => {
    const testRenderer = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const picker = bodyRenderer.root.findByType(BasePicker);
    expect(picker.props.selectedValue).toEqual('');
    expect(picker.props.onValueChange).toBeDefined();
  });

  it('should have Picker Items equal to adultMemberList', () => {
    const testRenderer = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const picker = bodyRenderer.root.findByType(BasePicker);
    const pickerItems = getChildren(picker);

    expect(pickerItems.length).toEqual(2);

    const noSecondaryPicker = pickerItems[0];
    expect(noSecondaryPicker.props.label).toEqual(
      editMemberProfileScreenContent.noSecondaryLabel
    );
    expect(noSecondaryPicker.props.value).toEqual('');

    const adultPickerItems = pickerItems[1] as unknown as ReactTestInstance[];
    expect(adultPickerItems.length).toEqual(adultMembers.length);

    expect(adultPickerItems[0].props.label).toEqual(
      `${adultMembers[0].firstName} ${adultMembers[0].lastName}`
    );
    expect(adultPickerItems[0].props.value).toEqual(adultMembers[0].identifier);

    expect(adultPickerItems[1].props.label).toEqual(
      `${adultMembers[1].firstName} ${adultMembers[1].lastName}`
    );
    expect(adultPickerItems[1].props.value).toEqual(adultMembers[1].identifier);
  });

  it('should show email & phone number if available', () => {
    const testRenderer = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);
    const emailAddressView = bodyRenderer.root.findByType(ProtectedView);
    const emailAddressTextInput = getChildren(emailAddressView)[0];

    expect(emailAddressTextInput.props.value).toBe(
      editMemberProfileScreenProps.memberInfo.email
    );

    const textList = bodyRenderer.root.findAllByType(BaseText);

    expect(textList[0].props.children).toBe(undefined);
    expect(textList[1].props.children).toBe(
      editMemberProfileScreenProps.memberInfo.phoneNumber
    );
  });

  it('should show pin if isAdult are set to true', () => {
    editMemberProfileScreenProps.isAdult = true;

    const testRenderer = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const textList = bodyRenderer.root.findAllByType(BaseText);
    expect(textList[3].props.children).toBe(editMemberProfileScreenContent.pin);
    expect(textList[4].props.children).toBe(
      editMemberProfileScreenContent.star
    );
  });

  it('should have a edit Icon if usePin and isAdult are set to true', () => {
    editMemberProfileScreenProps.isAdult = true;

    const testRenderer = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);
    const icon = bodyRenderer.root.findAllByType(FontAwesomeIcon)[0];

    expect(icon.props.name).toBe('pen');
    expect(icon.props.solid).toBe(true);
  });

  it('should render button if adult member and SIE rxGroupType', () => {
    editMemberProfileScreenProps.memberInfo.rxGroupType = RxGroupTypesEnum.SIE;

    const testRenderer = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );
    const body = testRenderer.root.findByType(BasicPageConnected).props.body;
    const buttonContainer = body.props.children[1];
    expect(buttonContainer.type).toBe(View);
    expect(buttonContainer.props.children.type).toBe(BaseButton);
  });

  it('should call navigateToEnterPinScreen on click of change Pin button', () => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    editMemberProfileScreenProps.isAdult = true;

    const testRenderer = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const IconButtonList = bodyRenderer.root.findAllByType(IconButton);
    IconButtonList[0].props.onPress();

    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith('LoginPin', {
      isUpdatePin: true,
    });
  });

  it('should not include save button or secondary drop-down when user is cash user', () => {
    editMemberProfileScreenProps.memberInfo.rxGroupType = 'CASH';

    const testRenderer = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const textInputItems = bodyRenderer.root.findAllByType(TextInput);
    expect(textInputItems.length).toEqual(2);
    expect(bodyRenderer.root.findAllByType(BaseButton).length).toEqual(1);
  });

  it('should include save button and secondary drop-down if user is SIE user', () => {
    editMemberProfileScreenProps.memberInfo.rxGroupType = RxGroupTypesEnum.SIE;

    const testRenderer = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const textInputItems = bodyRenderer.root.findAllByType(TextInput);

    expect(textInputItems.length).toEqual(4);

    const baseButton = bodyRenderer.root.findAllByType(BaseButton);
    expect(baseButton.length).toEqual(2);
    expect(baseButton[1].props.children).toEqual(
      editMemberProfileScreenContent.saveButtonLabel
    );
  });

  it('should not include save button or secondary drop-down if user is SIE user but has no dependents', () => {
    editMemberProfileScreenProps.memberInfo.rxGroupType = RxGroupTypesEnum.SIE;

    getHighestPriorityProfileMock.mockReturnValue({ adultMembers: [] });

    const testRenderer = renderer.create(
      <EditMemberProfileScreen
        {...editMemberProfileScreenProps}
        {...editMemberProfileScreenActionProps}
      />
    );

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const textInputItems = bodyRenderer.root.findAllByType(TextInput);
    expect(textInputItems.length).toEqual(2);
    expect(testRenderer.root.findAllByType(BaseButton).length).toEqual(0);
  });
});
