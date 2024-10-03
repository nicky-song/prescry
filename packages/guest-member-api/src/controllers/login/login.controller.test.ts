// Copyright 2020 Prescryptive Health, Inc.

import { LoginController } from './login.controller';
import { Request, Response } from 'express';
import { loginHandler } from './handlers/login.handler';
import { configurationMock } from '../../mock-data/configuration.mock';
import { databaseMock } from '../../mock-data/database.mock';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('./handlers/login.handler');
const loginHandlerMock = loginHandler as jest.Mock;

describe('LoginController', () => {
  const mockLoginData = {
    dateOfBirth: '10-05-1980',
    firstName: 'John',
    lastName: 'Doe',
    primaryMemberRxId: 'AFT201704071001',
  };

  const requestMock = {
    body: mockLoginData,
    headers: {
      authorization: 'token',
    },
  } as Request;

  const routerResponseMock = {
    locals: { device: { data: 'mock-phoneNumber' } },
  } as unknown as Response;

  it('should create login controller instance with login route method', async () => {
    const loginController = new LoginController(
      databaseMock,
      configurationMock,
    );

    await loginController.login(requestMock, routerResponseMock);

    expectToHaveBeenCalledOnceOnlyWith(
      loginHandlerMock,
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock
    );
  });
});
