// Copyright 2020 Prescryptive Health, Inc.

import React, { BaseSyntheticEvent, useState } from 'react';
import { View, Text } from 'react-native';
import renderer from 'react-test-renderer';
import MaskedInput from 'react-text-mask';
import { JoinWaitlistScreenContent } from '../../../experiences/guest-experience/join-waitlist-screen/join-waitlist-screen.content';
import { joinWaitlistScreenStyle } from '../../../experiences/guest-experience/join-waitlist-screen/join-waitlist-screen.style';
import { DependentPicker } from '../dependent/dependent-picker/dependent-picker';
import {
  IOtherPersonInfoProps,
  OtherPersonInfo,
} from './create-other-person-info-component';
import { ServiceTypes } from '../../../models/provider-location';
import { IServiceTypeState } from '../../../experiences/guest-experience/store/service-type/service-type.reducer';
import { DatePicker } from '../pickers/date/date.picker';
import { PrimaryTextInput } from '../../inputs/primary-text/primary-text.input';
import {
  IDependentProfile,
  RxGroupTypesEnum,
} from '../../../models/member-profile/member-profile-info';

jest.mock('../../../utils/validators/date.validator', () => ({
  split: jest.fn(),
  isDateOfBirthValid: jest.fn().mockReturnValue(true),
}));

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('react-text-mask');
jest.mock('../dependent/dependent-picker/dependent-picker', () => {
  return {
    DependentPicker: () => {
      return <></>;
    },
  };
});
jest.mock('../pickers/date/date.picker', () => {
  return {
    DatePicker: () => {
      return <></>;
    },
  };
});
jest.mock('../../text/markdown-text/markdown-text', () => {
  return {
    MarkdownText: () => {
      return <></>;
    },
  };
});

jest.mock('../../inputs/primary-text/primary-text.input', () => ({
  PrimaryTextInput: () => <div />,
}));

const serviceTypeMock: IServiceTypeState = {
  type: ServiceTypes.c19VaccineDose1,
  serviceNameMyRx: undefined,
  minimumAge: 18,
};

const otherPersonInfoProps = {
  onOtherPersonSelected: jest.fn(),
  onFirstNameChange: jest.fn(),
  onLastNameChange: jest.fn(),
  onDateOfBirthChange: jest.fn(),
  onPhoneNumberChange: jest.fn(),
  currentInfo: {
    firstName: 'first',
    lastName: 'last',
    dateOfBirth: '2000-01-002',
    phoneNumber: '1234567890',
    serviceType: 'COVID-19 Antigen Testing',
    availableWaitlistMembers: [
      {
        email: '',
        firstName: 'TEST',
        identifier: '6000b2fa965fa7b37c00a7b3',
        isLimited: false,
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: 'TEST',
        phoneNumber: '',
        primaryMemberFamilyId: 'CA7F7K',
        primaryMemberPersonCode: '03',
        primaryMemberRxId: 'CA7F7K03',
        age: 4,
        rxGroupType: RxGroupTypesEnum.CASH,
        rxSubGroup: '',
      } as IDependentProfile,
      {
        email: '',
        firstName: 'ADULT',
        identifier: '60013af2965fa7b37c00a7b4',
        isLimited: false,
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: '>18',
        phoneNumber: '',
        primaryMemberFamilyId: 'CA7F7K',
        primaryMemberPersonCode: '05',
        primaryMemberRxId: 'CA7F7K05',
        age: 20,
        rxGroupType: RxGroupTypesEnum.CASH,
        rxSubGroup: '',
      } as IDependentProfile,
      {
        email: '',
        firstName: 'ADULT',
        identifier: '60130fb83068eb8cecfb055d',
        isLimited: false,
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: '>13<18',
        phoneNumber: '',
        primaryMemberFamilyId: 'CA7F7K',
        primaryMemberPersonCode: '03',
        primaryMemberRxId: 'CA7F7K03',
        age: 13,
        rxGroupType: RxGroupTypesEnum.CASH,
        rxSubGroup: '',
      } as IDependentProfile,
      {
        email: '',
        firstName: 'CHILD',
        identifier: '60131183057357ba4a28b4dd',
        isLimited: false,
        isPhoneNumberVerified: false,
        isPrimary: false,
        lastName: '>3',
        phoneNumber: '',
        primaryMemberFamilyId: 'CA7F7K',
        primaryMemberPersonCode: '03',
        primaryMemberRxId: 'CA7F7K03',
        age: 4,
        rxGroupType: RxGroupTypesEnum.CASH,
        rxSubGroup: '',
      } as IDependentProfile,
    ],
  },
  serviceType: serviceTypeMock,
} as IOtherPersonInfoProps;

describe('OtherPersonInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stateReset(['', jest.fn()]);
  });

  it('renders person dropdown with consent text', () => {
    stateReset(['newDependent', jest.fn()]);
    const testRenderer = renderer.create(
      <OtherPersonInfo {...otherPersonInfoProps} />
    );
    const personDropdownContainer = testRenderer.root.findByProps({
      style: joinWaitlistScreenStyle.personDropDownContainerStyle,
    });
    const consentContainer = testRenderer.root.findByProps({
      style: joinWaitlistScreenStyle.otherPersonConsentTextStyle,
    });

    expect(personDropdownContainer.type).toEqual(View);
    expect(consentContainer.type).toEqual(Text);
    expect(consentContainer.props.children).toEqual(
      JoinWaitlistScreenContent.otherPersonConsentText
    );
    expect(personDropdownContainer.props.children.length).toEqual(2);
  });
  it('renders other person info container as expected', () => {
    stateReset(['newDependent', jest.fn()]);
    const testRenderer = renderer.create(
      <OtherPersonInfo {...otherPersonInfoProps} />
    );
    const detailsContainer = testRenderer.root.findByProps({
      style: joinWaitlistScreenStyle.otherPersonInfoContainerViewStyle,
    });
    const nameContainer = testRenderer.root.findByProps({
      style: joinWaitlistScreenStyle.locationFormViewStyle,
    });

    expect(detailsContainer.type).toEqual(View);
    expect(nameContainer.type).toEqual(View);
    expect(nameContainer.props.children.length).toEqual(2);
  });

  it('display other person name, DOB and phone number when "new person" is selected in the picker', () => {
    stateReset(['newDependent', jest.fn()]);

    const testRenderer = renderer.create(
      <OtherPersonInfo {...otherPersonInfoProps} />
    );
    const otherPersonDetailsContainer = testRenderer.root.findByProps({
      style: joinWaitlistScreenStyle.otherPersonDetailsContainerStyle,
    });
    const otherPersonNameContainer = testRenderer.root.findByProps({
      style: joinWaitlistScreenStyle.locationFormViewStyle,
    });

    const otherPersonFirstNameContainer =
      otherPersonNameContainer.props.children[0];

    expect(otherPersonFirstNameContainer.props.style).toEqual(
      joinWaitlistScreenStyle.leftItemViewStyle
    );

    const firstNameInput = otherPersonFirstNameContainer.props.children;
    expect(firstNameInput.type).toEqual(PrimaryTextInput);
    expect(firstNameInput.props.label).toEqual(
      JoinWaitlistScreenContent.firstNameText
    );
    expect(firstNameInput.props.isRequired).toEqual(true);
    expect(firstNameInput.props.placeholder).toEqual(
      otherPersonInfoProps.currentInfo.firstName
    );
    expect(firstNameInput.props.onChangeText).toEqual(
      otherPersonInfoProps.onFirstNameChange
    );

    const otherPersonLastNameContainer =
      otherPersonNameContainer.props.children[1];
    expect(otherPersonLastNameContainer.props.style).toEqual(
      joinWaitlistScreenStyle.rightItemViewStyle
    );

    const lastNameInput = otherPersonLastNameContainer.props.children;
    expect(lastNameInput.type).toEqual(PrimaryTextInput);
    expect(lastNameInput.props.label).toEqual(
      JoinWaitlistScreenContent.lastNameText
    );
    expect(lastNameInput.props.isRequired).toEqual(true);
    expect(lastNameInput.props.placeholder).toEqual(
      otherPersonInfoProps.currentInfo.lastName
    );
    expect(lastNameInput.props.onChangeText).toEqual(
      otherPersonInfoProps.onLastNameChange
    );

    const otherPersonPhoneNumberContainer =
      otherPersonDetailsContainer.props.children[1];
    const phoneNumberLabel = otherPersonPhoneNumberContainer.props.children[0];
    const phoneNumberInput = otherPersonPhoneNumberContainer.props.children[1];

    expect(otherPersonPhoneNumberContainer.props.style).toEqual(
      joinWaitlistScreenStyle.fullItemViewStyle
    );
    expect(phoneNumberLabel.props.textStyle).toEqual(
      joinWaitlistScreenStyle.formItemLabelTextStyle
    );
    expect(phoneNumberLabel.props.markdownTextStyle).toEqual(
      joinWaitlistScreenStyle.mandatoryIconTextStyle
    );
    expect(phoneNumberLabel.props.children).toEqual(
      JoinWaitlistScreenContent.phoneNumberText + ' ~~*~~'
    );
    expect(phoneNumberInput.type).toEqual(MaskedInput);

    const otherPersonDateOfBirthContainer =
      otherPersonDetailsContainer.props.children[2];
    expect(otherPersonDateOfBirthContainer.props.style).toEqual(
      joinWaitlistScreenStyle.fullItemViewStyle
    );

    const dateOfBirthInput = otherPersonDateOfBirthContainer.props.children;
    expect(dateOfBirthInput.type).toEqual(DatePicker);
    expect(dateOfBirthInput.props.label).toEqual(
      JoinWaitlistScreenContent.dateOfBirthText
    );
    expect(dateOfBirthInput.props.isRequired).toEqual(true);
    expect(dateOfBirthInput.props.getSelectedDate).toEqual(
      otherPersonInfoProps.onDateOfBirthChange
    );
    expect(dateOfBirthInput.props.defaultValue).toEqual(
      otherPersonInfoProps.currentInfo.dateOfBirth
    );

    const currentYear = new Date().getFullYear();
    const expectedStartYear =
      currentYear - (otherPersonInfoProps.serviceType.minimumAge ?? 0);
    const expectedEndYear = currentYear - 120;
    expect(dateOfBirthInput.props.startYearForDateOfBirth).toEqual(
      expectedStartYear
    );
    expect(dateOfBirthInput.props.endYearForDateOfBirth).toEqual(
      expectedEndYear
    );
  });

  it('Hide other person name, DOB and phone number fields when existing person is selected in the picker', () => {
    stateReset(['60013af2965fa7b37c00a7b4', jest.fn()]);

    const testRenderer = renderer.create(
      <OtherPersonInfo {...otherPersonInfoProps} />
    );
    const otherPersonDetailsContainer = testRenderer.root.children[0];
    const otherPersonNameAndDOBContainer =
      typeof otherPersonDetailsContainer !== 'string'
        ? otherPersonDetailsContainer.props.children[1]
        : undefined;
    expect(otherPersonNameAndDOBContainer).toBe(null);
  });

  it('show all existing dependents above 3yrs in the dependent picker for COVID flow', () => {
    stateReset(['newDependent', jest.fn()]);

    const testRenderer = renderer.create(
      <OtherPersonInfo {...otherPersonInfoProps} />
    );

    const dependentPicker = testRenderer.root.findByType(DependentPicker);
    expect(dependentPicker.props.availableDependents.length).toEqual(1);
  });

  it('show all existing dependents above 18yrs in the dependent picker for VACCINE flow', () => {
    stateReset(['newDependent', jest.fn()]);
    const props = {
      ...otherPersonInfoProps,
      currentInfo: {
        ...otherPersonInfoProps.currentInfo,
        serviceType: ServiceTypes.c19Vaccine,
      },
    } as IOtherPersonInfoProps;

    const testRenderer = renderer.create(<OtherPersonInfo {...props} />);

    const dependentPicker = testRenderer.root.findByType(DependentPicker);
    expect(dependentPicker.props.availableDependents.length).toEqual(1);
  });
  it('does not show otherPersonContainer if identifier is not newDependent', () => {
    stateReset(['60013af2965fa7b37c00a7b4', jest.fn()]);
    const props = {
      ...otherPersonInfoProps,
      currentInfo: {
        ...otherPersonInfoProps.currentInfo,
        serviceType: ServiceTypes.c19Vaccine,
      },
    } as IOtherPersonInfoProps;

    const testRenderer = renderer.create(<OtherPersonInfo {...props} />);
    const outerContainer = testRenderer.root.children[0];
    const otherPersonContainer =
      typeof outerContainer !== 'string'
        ? outerContainer.props.children[1]
        : undefined;
    expect(otherPersonContainer).toEqual(null);
  });

  it('calls passed-in functions as expected', () => {
    stateReset(['newDependent', jest.fn()]);
    const props = {
      ...otherPersonInfoProps,
      currentInfo: {
        ...otherPersonInfoProps.currentInfo,
        serviceType: ServiceTypes.c19Vaccine,
      },
    } as IOtherPersonInfoProps;

    const testRenderer = renderer.create(<OtherPersonInfo {...props} />);
    const otherPersonDetailsContainer = testRenderer.root.findByProps({
      style: joinWaitlistScreenStyle.otherPersonDetailsContainerStyle,
    });
    const otherPersonNameContainer = testRenderer.root.findByProps({
      style: joinWaitlistScreenStyle.locationFormViewStyle,
    });
    const otherPersonFirstNameContainer =
      otherPersonNameContainer.props.children[0];
    const firstNameInput = otherPersonFirstNameContainer.props.children;
    firstNameInput.props.onChangeText('First');

    const otherPersonLastNameContainer =
      otherPersonNameContainer.props.children[1];
    const lastNameInput = otherPersonLastNameContainer.props.children;
    lastNameInput.props.onChangeText('Last');

    const otherPersonPhoneNumberContainer =
      otherPersonDetailsContainer.props.children[1];
    const phoneNumberInput = otherPersonPhoneNumberContainer.props.children[1];

    const dateOfBirthPicker = testRenderer.root.findByType(DatePicker);

    dateOfBirthPicker.props.getSelectedDate('01-01-2000');
    phoneNumberInput.props.onChange({
      target: { value: '5555555555' },
    } as BaseSyntheticEvent);

    expect(props.onFirstNameChange).toHaveBeenCalledWith('First');
    expect(props.onLastNameChange).toHaveBeenCalledWith('Last');
    expect(props.onDateOfBirthChange).toHaveBeenCalledWith('01-01-2000');
    expect(props.onPhoneNumberChange).toHaveBeenCalledWith({
      target: { value: '5555555555' },
    } as BaseSyntheticEvent);
  });

  it('clears passed-in function states as expected', () => {
    stateReset(['newDependent', jest.fn()]);
    const props = {
      ...otherPersonInfoProps,
      currentInfo: {
        ...otherPersonInfoProps.currentInfo,
        serviceType: ServiceTypes.c19Vaccine,
      },
    } as IOtherPersonInfoProps;

    const testRenderer = renderer.create(<OtherPersonInfo {...props} />);
    const dependentPicker = testRenderer.root.findByType(DependentPicker);
    dependentPicker.props.onDependentSelected('newDependent');

    expect(props.onFirstNameChange).toHaveBeenCalledWith('');
    expect(props.onLastNameChange).toHaveBeenCalledWith('');
    expect(props.onDateOfBirthChange).toHaveBeenCalledWith('');
    expect(props.onPhoneNumberChange).toHaveBeenCalledWith({
      target: { value: '' },
    } as BaseSyntheticEvent);
    expect(props.onOtherPersonSelected).toHaveBeenCalledWith('newDependent');
  });

  function stateReset(identifier: [string, jest.Mock]) {
    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce(identifier);
  }
});
