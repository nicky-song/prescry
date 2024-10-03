// Copyright 2020 Prescryptive Health, Inc.

import { IAppointmentAction } from './appointment-action';
import { IServiceInfo } from '../../../../../models/api-response/provider-location-details-response';
import { ILocation } from '../../../../../models/api-response/provider-location-details-response';

export interface ISetSelectedLocationActionType {
  selectedLocation: ILocation;
  selectedService: IServiceInfo;
  minDate: string;
  maxDate: string;
}
export type ISetSelectedLocationAction = IAppointmentAction<
  'APPOINTMENT_SET_SELECTED_LOCATION',
  ISetSelectedLocationActionType
>;

export const setSelectedLocationAction = (
  locationPayload: ISetSelectedLocationActionType
): ISetSelectedLocationAction => ({
  payload: locationPayload,
  type: 'APPOINTMENT_SET_SELECTED_LOCATION',
});
