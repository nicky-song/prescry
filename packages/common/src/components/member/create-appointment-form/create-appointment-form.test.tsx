// Copyright 2020 Prescryptive Health, Inc.

import { shallow } from 'enzyme';
import React, { useState } from 'react';
import { IMemberAddress } from '../../../models/api-request-body/create-booking.request-body';
import {
  CreateAppointmentForm,
  ICreateAppointmentFormProps,
} from './create-appointment-form';
import { CreateAppointmentFormAboutYou } from './create-appointment-form-about-you';
import { CreateAppointmentFormMemberType } from './create-appointment-form-member-type';
import { CreateAppointmentFormAboutDependent } from './create-appointment-form-about-dependent';
import { IServiceTypeState } from '../../../experiences/guest-experience/store/service-type/service-type.reducer';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));

jest.mock('./create-appointment-form-about-you', () => ({
  CreateAppointmentFormAboutYou: () => <div />,
}));

jest.mock('./create-appointment-form-member-type', () => ({
  CreateAppointmentFormMemberType: () => <div />,
}));

jest.mock('./create-appointment-form-about-dependent', () => ({
  CreateAppointmentFormAboutDependent: () => <div />,
}));

const mockAboutDependentDescription = `If this appointment is for a person between 3 and 17 years old, they must be accompanied by a parent or guardian. Further, you represent that you have the legal authority under applicable law to schedule the appointment and to receive the results on your phone on behalf of that person.
\nIf this appointment is for adults 18 years of age or older, you represent that you have the legal authority under applicable law to schedule the appointment and to receive the results on your phone on behalf of that person.`;

const guardianAddress = {
  address1: '1010 Cooley LN',
  city: 'Vanderpool',
  county: 'Kerr',
  state: 'TX',
  zip: '78885',
} as IMemberAddress;

const useStateMock = useState as jest.Mock;

const serviceTypeInfoMock: IServiceTypeState = {
  type: undefined,
  serviceNameMyRx: undefined,
};

const createAppointmentFormPropsMock = {
  onMemberTypeSelected: jest.fn(),
  onMemberAddressChange: jest.fn(),
  onDependentInfoChange: jest.fn(),
  showAboutYou: true,
  guardianAddress,
  guardianIsMember: false,
  availableDependents: [],
  serviceType: 'COVID-19 Antigen Testing',
  aboutDependentDescriptionMyRx: mockAboutDependentDescription,
  serviceTypeInfo: serviceTypeInfoMock,
} as ICreateAppointmentFormProps;

describe('CreateAppointmentForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    stateReset(
      [guardianAddress, jest.fn()],
      [-1, jest.fn()],
      [false, jest.fn()]
    );
  });
  it('renders as expected', () => {
    const createAppointmentForm = shallow(
      <CreateAppointmentForm {...{ ...createAppointmentFormPropsMock }} />
    );

    const createAppointmentFormAboutYou =
      createAppointmentForm.props().children[0];

    const createAppointmentFormMemberType =
      createAppointmentForm.props().children[1];

    expect(createAppointmentFormAboutYou.type).toEqual(
      CreateAppointmentFormAboutYou
    );
    expect(createAppointmentFormMemberType.type).toEqual(
      CreateAppointmentFormMemberType
    );
  });
  it('displays "About you" if guardian address is not present in the system/database', () => {
    stateReset(
      [{} as IMemberAddress, jest.fn()],
      [-1, jest.fn()],
      [false, jest.fn()]
    );
    const createAppointmentForm = shallow(
      <CreateAppointmentForm {...createAppointmentFormPropsMock} />
    );

    const createAppointmentFormAboutYou =
      createAppointmentForm.props().children[0];
    const createAppointmentFormMemberType =
      createAppointmentForm.props().children[1];

    expect(createAppointmentFormAboutYou.type).toEqual(
      CreateAppointmentFormAboutYou
    );
    expect(createAppointmentFormMemberType).toBe(null);
  });

  it('displays requestingFor if guardian address is already in the system/database', () => {
    const props = {
      ...createAppointmentFormPropsMock,
      guardianIsMember: true,
      showAboutYou: false,
    };
    stateReset(
      [guardianAddress, jest.fn()],
      [-1, jest.fn()],
      [true, jest.fn()]
    );
    const createAppointmentForm = shallow(<CreateAppointmentForm {...props} />);

    const createAppointmentFormAboutYou =
      createAppointmentForm.props().children[0];
    const createAppointmentFormMemberType =
      createAppointmentForm.props().children[1];

    expect(createAppointmentFormAboutYou).toBe(null);
    expect(createAppointmentFormMemberType.type).toEqual(
      CreateAppointmentFormMemberType
    );
  });

  it('renders "About this appointment" section if "another person" option is chosen', () => {
    stateReset([guardianAddress, jest.fn()], [1, jest.fn()], [true, jest.fn()]);
    const createAppointmentForm = shallow(
      <CreateAppointmentForm {...createAppointmentFormPropsMock} />
    );

    const createAppointmentFormAboutDependent =
      createAppointmentForm.props().children[2];
    expect(createAppointmentFormAboutDependent.type).toEqual(
      CreateAppointmentFormAboutDependent
    );
  });

  function stateReset(
    primaryAddress: [IMemberAddress, jest.Mock],
    memberType: [number, jest.Mock],
    showRequestingFor: [boolean, jest.Mock]
  ) {
    useStateMock.mockReset();

    useStateMock.mockReturnValueOnce(primaryAddress);
    useStateMock.mockReturnValueOnce(memberType);
    useStateMock.mockReturnValueOnce(showRequestingFor);
  }
  it('do not validate address again if its already in the system/database', () => {
    const guardianInvalidAddressInDB = {
      address1: '1010       Cooley LN',
      city: 'Vanderpool',
      state: 'TX',
      zip: '78885',
      county: 'K       ',
    } as IMemberAddress;
    const props = {
      ...createAppointmentFormPropsMock,
      guardianIsMember: true,
      showAboutYou: false,
    };
    stateReset(
      [guardianInvalidAddressInDB, jest.fn()],
      [-1, jest.fn()],
      [true, jest.fn()]
    );
    const createAppointmentForm = shallow(<CreateAppointmentForm {...props} />);

    const createAppointmentFormAboutYou =
      createAppointmentForm.props().children[0];
    const createAppointmentFormMemberType =
      createAppointmentForm.props().children[1];

    expect(createAppointmentFormAboutYou).toBe(null);
    expect(createAppointmentFormMemberType.type).toEqual(
      CreateAppointmentFormMemberType
    );
  });
});
