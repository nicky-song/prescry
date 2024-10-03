// Copyright 2021 Prescryptive Health, Inc.

import { IMemberAddress } from '../../../../models/api-request-body/create-booking.request-body';
import { setMemberAddressAction } from '../actions/set-member-address.action';
import { AppointmentScreenDispatch } from './appointment.screen.dispatch';

export const setMemberAddressDispatch = (
  dispatch: AppointmentScreenDispatch,
  address?: IMemberAddress
) => dispatch(setMemberAddressAction(address));
