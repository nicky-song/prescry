// Copyright 2020 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import { IServiceTypeState } from '../../../experiences/guest-experience/store/service-type/service-type.reducer';
import {
  IDependentInformation,
  IMemberAddress,
} from '../../../models/api-request-body/create-booking.request-body';
import { IDependentProfile } from '../../../models/member-profile/member-profile-info';
import { PrimaryTextInput } from '../../inputs/primary-text/primary-text.input';
import { Label } from '../../text/label/label';
import { AppointmentAddress } from '../appointment-address/appointment-address';
import { DependentPicker } from '../dependent/dependent-picker/dependent-picker';
import { DatePicker } from '../pickers/date/date.picker';
import {
  CreateAppointmentFormAboutDependent,
  ICreateAppointmentFormAboutDependentProps,
} from './create-appointment-form-about-dependent';
import { createAppointmentFormContent } from './create-appointment-form.content';
import { createAppointmentFormStyles } from './create-appointment-form.styles';

jest.mock('../../../utils/validators/date.validator', () => ({
  split: jest.fn(),
  isDateOfBirthValid: jest.fn().mockReturnValue(true),
}));

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

jest.mock('../../checkbox/primary-checkbox/primary-checkbox', () => ({
  PrimaryCheckBox: () => <div />,
}));

jest.mock('../../inputs/primary-text/primary-text.input', () => ({
  PrimaryTextInput: () => <div />,
}));

jest.mock('../dependent/dependent-picker/dependent-picker', () => ({
  DependentPicker: () => <div />,
}));

jest.mock('../pickers/date/date.picker', () => ({
  DatePicker: () => <div />,
}));

const mockAboutDependentDescription = `If this appointment is for a person between 3 and 17 years old, they must be accompanied by a parent or guardian. Further, you represent that you have the legal authority under applicable law to schedule the appointment and to receive the results on your phone on behalf of that person.
\nIf this appointment is for adults 18 years of age or older, you represent that you have the legal authority under applicable law to schedule the appointment and to receive the results on your phone on behalf of that person.`;

const minimumAgeMock = 18;
const serviceTypeInfoMock: IServiceTypeState = {
  type: undefined,
  serviceNameMyRx: undefined,
  aboutDependentDescriptionMyRx: mockAboutDependentDescription,
  minimumAge: minimumAgeMock,
};

const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

const setDependentAddress = jest.fn();
const setIdentifier = jest.fn();
const setSameAddress = jest.fn();
const setFirstName = jest.fn();
const setLastName = jest.fn();
const setDateOfBirth = jest.fn();
const setNewDependentInfo = jest.fn();

interface IStateMock {
  dependentAddress: IMemberAddress;
  identifier: string;
  sameAddress: boolean;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  newDependentInfo: IDependentInformation;
}

const initialAddress: IMemberAddress = {
  address1: '',
  city: '',
  state: '',
  zip: '',
  county: '',
};

const defaultStateMock: IStateMock = {
  dependentAddress: initialAddress,
  identifier: '',
  sameAddress: false,
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  newDependentInfo: {} as IDependentInformation,
};

const createAppointmentFormAboutDependentProps = {
  onSameAddress: jest.fn(),
  onDependentInfoChange: jest.fn(),
  availableDependents: [
    {
      email: '',
      firstName: 'TEST',
      identifier: '6000b2fa965fa7b37c00a7b3',
      isLimited: false,
      isPrimary: false,
      lastName: 'TEST',
      phoneNumber: '',
      primaryMemberFamilyId: 'CA7F7K',
      primaryMemberPersonCode: '03',
      primaryMemberRxId: 'CA7F7K03',
      age: 4,
      masterId: 'master-id1',
    } as IDependentProfile,
    {
      email: '',
      firstName: 'ADULT',
      identifier: '60013af2965fa7b37c00a7b4',
      isLimited: false,
      isPrimary: false,
      lastName: '>18',
      phoneNumber: '',
      primaryMemberFamilyId: 'CA7F7K',
      primaryMemberPersonCode: '05',
      primaryMemberRxId: 'CA7F7K05',
      age: 20,
      masterId: 'master-id2',
    },
    {
      email: '',
      firstName: 'ADULT',
      identifier: '60130fb83068eb8cecfb055d',
      isLimited: false,
      isPrimary: false,
      lastName: '>13<18',
      phoneNumber: '',
      primaryMemberFamilyId: 'CA7F7K',
      primaryMemberPersonCode: '03',
      primaryMemberRxId: 'CA7F7K03',
      age: 13,
      masterId: 'master-id3',
    },
    {
      email: '',
      firstName: 'CHILD',
      identifier: '60131183057357ba4a28b4dd',
      isLimited: false,
      isPrimary: false,
      lastName: '>3',
      phoneNumber: '',
      primaryMemberFamilyId: 'CA7F7K',
      primaryMemberPersonCode: '03',
      primaryMemberRxId: 'CA7F7K03',
      age: 4,
      masterId: 'master-id4',
    },
  ],
  dependentInfo: {} as IDependentInformation,
  serviceType: 'COVID-19 Antigen Testing',
  aboutDependentDescriptionMyRx: mockAboutDependentDescription,
  serviceTypeInfo: serviceTypeInfoMock,
} as ICreateAppointmentFormAboutDependentProps;

describe('CreateAppointmentFormAboutDependent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stateReset(defaultStateMock);
  });

  it('renders container as expected', () => {
    const testRenderer = renderer.create(
      <CreateAppointmentFormAboutDependent
        {...createAppointmentFormAboutDependentProps}
      />
    );
    const container = testRenderer.root.findByProps({
      style: createAppointmentFormStyles.dependentContainerViewStyle,
    });

    expect(container.type).toEqual(View);
    expect(container.props.children.length).toEqual(4);
  });

  it('renders "About this appointment" section as expected', () => {
    const testRenderer = renderer.create(
      <CreateAppointmentFormAboutDependent
        {...createAppointmentFormAboutDependentProps}
      />
    );
    const container = testRenderer.root.findByProps({
      style: createAppointmentFormStyles.dependentContainerViewStyle,
    });

    const header = container.props.children[0];
    expect(header.props.caption).toEqual(
      createAppointmentFormContent.aboutAppointmentText
    );
    expect(header.props.textBoxStyle).toEqual(
      createAppointmentFormStyles.dependentHeaderTextStyle
    );

    const subTitle = container.props.children[1];
    expect(subTitle.props.caption).toEqual(
      serviceTypeInfoMock.aboutDependentDescriptionMyRx
    );
    expect(subTitle.props.textBoxStyle).toEqual(
      createAppointmentFormStyles.dependentHeaderSubTextStyle
    );

    const dependentPickerLabel = container.props.children[2];
    expect(dependentPickerLabel.type).toEqual(Label);
    expect(dependentPickerLabel.props.label).toEqual(
      createAppointmentFormContent.anotherPersonDropdownCaption
    );
    expect(dependentPickerLabel.props.viewStyle).toEqual(
      createAppointmentFormStyles.dependentPickerViewStyle
    );
  });

  it('display dependent name, DOB and address when "new person" is selected in the picker', () => {
    stateReset({ ...defaultStateMock, identifier: 'newDependent' });

    const testRenderer = renderer.create(
      <CreateAppointmentFormAboutDependent
        {...createAppointmentFormAboutDependentProps}
      />
    );

    const container = testRenderer.root.findByProps({
      style: createAppointmentFormStyles.dependentContainerViewStyle,
    });
    const dependentNameAndDOBContainer =
      container.props.children[3].props.children[0].props.children[0];

    const dependentFirstNameContainer =
      dependentNameAndDOBContainer.props.children[0];
    expect(dependentFirstNameContainer.props.style).toEqual(
      createAppointmentFormStyles.dependentNameContainerViewStyle
    );

    const firstNameInput = dependentFirstNameContainer.props.children;
    expect(firstNameInput.type).toEqual(PrimaryTextInput);
    expect(firstNameInput.props.label).toEqual(
      createAppointmentFormContent.firstNameText
    );
    expect(firstNameInput.props.isRequired).toEqual(true);
    expect(firstNameInput.props.viewStyle).toEqual(
      createAppointmentFormStyles.dependentInputViewStyle
    );
    expect(firstNameInput.props.testID).toEqual('dependentFirstName');

    const dependentLastNameContainer =
      dependentNameAndDOBContainer.props.children[1];
    expect(dependentLastNameContainer.props.style).toEqual(
      createAppointmentFormStyles.dependentNameContainerViewStyle
    );

    const lastNameInput = dependentLastNameContainer.props.children;
    expect(lastNameInput.type).toEqual(PrimaryTextInput);
    expect(lastNameInput.props.label).toEqual(
      createAppointmentFormContent.lastNameText
    );
    expect(lastNameInput.props.isRequired).toEqual(true);
    expect(lastNameInput.props.viewStyle).toEqual(
      createAppointmentFormStyles.dependentInputViewStyle
    );
    expect(lastNameInput.props.testID).toEqual('dependentLastName');
  });

  it('renders date of birth picker', () => {
    stateReset({
      ...defaultStateMock,
      identifier: 'newDependent',
    });

    const currentYear = new Date().getFullYear();
    const dependentInfoMock: IDependentInformation = {
      dateOfBirth: '2000-01-02',
    };

    const testRenderer = renderer.create(
      <CreateAppointmentFormAboutDependent
        {...createAppointmentFormAboutDependentProps}
        serviceTypeInfo={serviceTypeInfoMock}
        dependentInfo={dependentInfoMock}
      />
    );

    const dobContainer = testRenderer.root.findByProps({
      testID: 'dependentDOBContainer',
    });
    expect(dobContainer.type).toEqual(View);
    expect(dobContainer.props.style).toEqual(
      createAppointmentFormStyles.dependentDOBContainerViewStyle
    );

    const datePicker = dobContainer.props.children[0];
    expect(datePicker.type).toEqual(DatePicker);
    expect(datePicker.props.label).toEqual(
      createAppointmentFormContent.dateOfBirthText
    );
    expect(datePicker.props.isRequired).toEqual(true);
    expect(datePicker.props.getSelectedDate).toEqual(expect.any(Function));
    expect(datePicker.props.defaultValue).toEqual(
      dependentInfoMock.dateOfBirth
    );
    expect(datePicker.props.startYearForDateOfBirth).toEqual(
      currentYear - minimumAgeMock
    );
    expect(datePicker.props.endYearForDateOfBirth).toEqual(currentYear - 120);
  });

  it('Hide dependent name, DOB and address fields when existing dependent is selected in the picker', () => {
    stateReset(defaultStateMock);

    const testRenderer = renderer.create(
      <CreateAppointmentFormAboutDependent
        {...createAppointmentFormAboutDependentProps}
      />
    );
    const container = testRenderer.root.findByProps({
      style: createAppointmentFormStyles.dependentContainerViewStyle,
    });

    const dependentNameAndDOBContainer = container.props.children[3];
    expect(dependentNameAndDOBContainer).toBe(null);
  });

  it('Sets master id when existing dependent is selected in the picker', () => {
    const identifierMock = '6000b2fa965fa7b37c00a7b3';

    stateReset({ ...defaultStateMock, identifier: identifierMock });

    const testRenderer = renderer.create(
      <CreateAppointmentFormAboutDependent
        {...createAppointmentFormAboutDependentProps}
      />
    );

    expect(useEffectMock).toHaveBeenNthCalledWith(1, expect.any(Function), [
      identifierMock,
    ]);

    const effectHandler = useEffectMock.mock.calls[0][0];
    effectHandler();

    const container = testRenderer.root.findByProps({
      style: createAppointmentFormStyles.dependentContainerViewStyle,
    });

    const dependentNameAndDOBContainer = container.props.children[3];

    const dependentPicker = testRenderer.root.findByType(DependentPicker);

    const onDependentSelected = dependentPicker.props.onDependentSelected;

    onDependentSelected(identifierMock);

    const expectedMasterId = 'master-id1';

    expect(setNewDependentInfo).toHaveBeenCalledWith({
      identifier: identifierMock,
      masterId: expectedMasterId,
    });
    expect(dependentNameAndDOBContainer).toBe(null);
  });

  it('Hide dependent address section when same address checkbox is checked', () => {
    stateReset(defaultStateMock);
    const testRenderer = renderer.create(
      <CreateAppointmentFormAboutDependent
        {...createAppointmentFormAboutDependentProps}
      />
    );
    expect(testRenderer.root.findAllByType(AppointmentAddress).length).toBe(0);
  });

  it('show all existing dependents above 3yrs in the dependent picker for COVID flow', () => {
    stateReset(defaultStateMock);

    const testRenderer = renderer.create(
      <CreateAppointmentFormAboutDependent
        {...createAppointmentFormAboutDependentProps}
      />
    );

    const dependentPicker = testRenderer.root.findByType(DependentPicker);
    expect(dependentPicker.props.availableDependents.length).toEqual(1);
  });

  it('show all existing dependents above 18yrs in the dependent picker for VACCINE flow', () => {
    stateReset(defaultStateMock);

    const props = {
      ...createAppointmentFormAboutDependentProps,
      serviceType: 'C19Vaccine',
    };

    const testRenderer = renderer.create(
      <CreateAppointmentFormAboutDependent {...props} />
    );

    const dependentPicker = testRenderer.root.findByType(DependentPicker);
    expect(dependentPicker.props.availableDependents.length).toEqual(1);
  });

  it('Check if useEffect is called', () => {
    renderer.create(
      <CreateAppointmentFormAboutDependent
        {...createAppointmentFormAboutDependentProps}
      />
    );
    expect(useEffectMock.mock.calls[0][1]).toEqual(['']);
  });

  it.skip('dependent name change triggers handler', () => {
    stateReset({ ...defaultStateMock, identifier: 'newDependent' });

    const testRenderer = renderer.create(
      <CreateAppointmentFormAboutDependent
        {...createAppointmentFormAboutDependentProps}
      />
    );

    const firstNameInput = testRenderer.root.findByProps({
      testID: 'dependentFirstName',
    });

    firstNameInput.props.onChangeText('abcdef');

    // expect(setFirstName).toHaveBeenCalled();
  });

  function stateReset(stateMock: IStateMock) {
    setDependentAddress.mockReset();
    setIdentifier.mockReset();
    setSameAddress.mockReset();
    setFirstName.mockReset();
    setLastName.mockReset();
    setDateOfBirth.mockReset();
    setNewDependentInfo.mockReset();

    useStateMock.mockReset();
    useStateMock
      .mockReturnValueOnce([stateMock.dependentAddress, setDependentAddress])
      .mockReturnValueOnce([stateMock.identifier, setIdentifier])
      .mockReturnValueOnce([stateMock.sameAddress, setSameAddress])
      .mockReturnValueOnce([stateMock.firstName, setFirstName])
      .mockReturnValueOnce([stateMock.lastName, setLastName])
      .mockReturnValueOnce([stateMock.dateOfBirth, setDateOfBirth])
      .mockReturnValueOnce([stateMock.newDependentInfo, setNewDependentInfo]);
  }
});
