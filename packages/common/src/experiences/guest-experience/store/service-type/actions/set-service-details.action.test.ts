// Copyright 2021 Prescryptive Health, Inc.

import {
  setServiceDetailsAction,
  ISetServiceDetailsActionType,
} from './set-service-details.action';
import { ServiceTypes } from '../../../../../models/provider-location';

it('returns action', () => {
  const type = ServiceTypes.antigen as unknown as ISetServiceDetailsActionType;

  const action = setServiceDetailsAction(type);
  expect(action.type).toEqual('SET_SERVICE_DETAILS');
  expect(action.payload).toEqual(type);
});
