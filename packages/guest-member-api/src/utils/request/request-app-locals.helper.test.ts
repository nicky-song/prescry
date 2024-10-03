// Copyright 2020 Prescryptive Health, Inc.

import { Response } from 'express';
import {
  getResponseLocal,
  getRequiredResponseLocal,
} from './request-app-locals.helper';

import { ErrorRequestInitialization } from '@phx/common/src/errors/error-request-initialization';

describe('get-app-locals', () => {
  it('should return the app local when it is truthy', () => {
    const response = {
      locals: {
        device: {
          data: '+11231231234',
        },
      },
    } as unknown as Response;
    const device = getRequiredResponseLocal(response, 'device');

    expect(device).not.toBeFalsy();
    expect(device.data).toEqual(response.locals.device.data);
  });

  it('should throw exception if property doesnt exist or is null', () => {
    const response = {
      locals: {},
    } as unknown as Response;

    expect(() => getRequiredResponseLocal(response, 'device')).toThrowError(
      new ErrorRequestInitialization('device')
    );
  });
});

describe('getResponseLocal', () => {
  it('should return the app local when it is truthy', () => {
    const response = {
      locals: {
        personInfo: {
          primaryMemberRxId: 'Pxxxxx',
        },
      },
    } as unknown as Response;
    const personInfo = getResponseLocal(response, 'personInfo');

    expect(personInfo).not.toBeFalsy();
    expect(personInfo).toEqual({
      primaryMemberRxId: response.locals.personInfo.primaryMemberRxId,
    });
  });

  it('should return undefined if property doesnt exist or is null', () => {
    const response = {
      locals: {},
    } as unknown as Response;

    expect(getResponseLocal(response, 'device')).toEqual(undefined);
  });
});
