// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { getMembersHandler } from './handlers/get-members.handler';
import { MembersController } from './members.controller';
import { addMembershipHandler } from './handlers/add-membership.handler';
import { verifyMembershipHandler } from './handlers/verify-membership.handler';
import { configurationMock } from '../../mock-data/configuration.mock';
import { databaseMock } from '../../mock-data/database.mock';

jest.mock('./handlers/get-members.handler');
const getMembersHandlerMock = getMembersHandler as jest.Mock;

jest.mock('./handlers/add-membership.handler');
const addMembershipHandlerMock = addMembershipHandler as jest.Mock;

jest.mock('./handlers/verify-membership.handler');
const verifyMembershipHandlerMock = verifyMembershipHandler as jest.Mock;

describe('MembersController', () => {
  const routerResponseMock = {} as Response;
  const requestMock = {} as Request;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create controller object with route methods', () => {
    const membersController = new MembersController(
      configurationMock,
      databaseMock,
    );
    expect(membersController.getMembers).toBeDefined();
    expect(membersController.addMembership).toBeDefined();
  });

  it('should call addMembershipHandler handler for addMembership Route', async () => {
    const routeHandler = new MembersController(
      configurationMock,
      databaseMock,
    ).addMembership;
    await routeHandler(requestMock, routerResponseMock);
    expect(addMembershipHandlerMock).toBeCalledTimes(1);

    expect(addMembershipHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
  });
  it('should call getMembersHandler handler for getMembers Route', async () => {
    const routeHandler = new MembersController(
      configurationMock,
      databaseMock,
    ).getMembers;
    await routeHandler(requestMock, routerResponseMock);
    expect(getMembersHandlerMock).toBeCalledTimes(1);

    expect(getMembersHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
  });
  it('should call verifyMembershipHandler handler for verifyMembership Route (version %p)', async () => {
    const routeHandler = new MembersController(
      configurationMock,
      databaseMock,
    ).verifyMembership;
    await routeHandler(requestMock, routerResponseMock);

    expect(verifyMembershipHandlerMock).toBeCalledTimes(1);

    expect(verifyMembershipHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      databaseMock,
      configurationMock,
    );
  });
});
