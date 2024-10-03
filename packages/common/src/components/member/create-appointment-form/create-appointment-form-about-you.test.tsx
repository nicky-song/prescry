// Copyright 2020 Prescryptive Health, Inc.

import { shallow } from 'enzyme';
import React from 'react';

import { IMemberAddress } from '../../../models/api-request-body/create-booking.request-body';
import { AppointmentAddress } from '../appointment-address/appointment-address';
import {
  CreateAppointmentFormAboutYou,
  ICreateAppointmentFormAboutYouProps,
} from './create-appointment-form-about-you';
import { createAppointmentFormContent } from './create-appointment-form.content';
import { createAppointmentFormStyles } from './create-appointment-form.styles';

const defaultAddress = {
  address1: '',
  city: '',
  county: '',
  state: '',
  zip: '',
} as IMemberAddress;

const createAppointmentFormAboutYouPropsMock = {
  defaultAddress,
  onAddressChange: jest.fn(),
} as ICreateAppointmentFormAboutYouProps;

describe('CreateAppointmentFormAboutYou', () => {
  it('renders as expected', () => {
    const createAppointmentFormAboutYou = shallow(
      <CreateAppointmentFormAboutYou
        {...{ ...createAppointmentFormAboutYouPropsMock }}
      />
    );

    const header = createAppointmentFormAboutYou.props().children[0];
    const appointmentAddress = createAppointmentFormAboutYou.props()
      .children[1];

    expect(header.props.caption).toEqual(
      createAppointmentFormContent.aboutYouCaption
    );
    expect(header.props.textBoxStyle).toEqual(
      createAppointmentFormStyles.aboutYouHeaderTextStyle
    );

    expect(appointmentAddress.type).toEqual(AppointmentAddress);
    expect(appointmentAddress.props.defaultAddress).toEqual(defaultAddress);

    expect(createAppointmentFormAboutYou.props().children.length).toEqual(2);
  });
});
