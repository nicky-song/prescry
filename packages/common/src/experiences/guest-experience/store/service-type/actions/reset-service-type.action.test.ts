// Copyright 2021 Prescryptive Health, Inc.

import { resetServiceTypeAction } from './reset-service-type.action';

it('returns action', () => {
  const action = resetServiceTypeAction();
  expect(action.type).toEqual('RESET_SERVICE_TYPE');
  expect(action.payload).toEqual(undefined);
});
