// Copyright 2021 Prescryptive Health, Inc.

import { IMemberAddress } from '../../../../models/api-request-body/create-booking.request-body';
import { IAppointmentScreenState } from '../appointment.screen.state';
import { IAppointmentScreenAction } from './appointment.screen.action';

export type ISetMemberAddressAction = IAppointmentScreenAction<
  'SET_MEMBER_ADDRESS'
>;

export const setMemberAddressAction = (
  memberAddress?: IMemberAddress
): ISetMemberAddressAction => {
  const payload: Partial<IAppointmentScreenState> = {
    memberAddress,
  };

  return {
    type: 'SET_MEMBER_ADDRESS',
    payload,
  };
};
