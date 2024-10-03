// Copyright 2020 Prescryptive Health, Inc.

import {
  setServiceTypeAction,
  ISetServiceTypeActionType,
} from './set-service-type.action';
import { ServiceTypes } from '../../../../../models/provider-location';

it('returns action', () => {
  const type = ServiceTypes.antigen as unknown as ISetServiceTypeActionType;

  const action = setServiceTypeAction(type);
  expect(action.type).toEqual('SET_SERVICE_TYPE');
  expect(action.payload).toEqual(type);
});
