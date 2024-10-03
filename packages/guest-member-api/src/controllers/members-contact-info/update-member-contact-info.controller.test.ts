// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { MemberContactInfoUpdateController } from './update-member-contact-info.controller';
import { updateMemberContactInfoHandler } from './handlers/update-member-contact-info.handler';
import { configurationMock } from '../../mock-data/configuration.mock';

jest.mock('./handlers/update-member-contact-info.handler');
const updateMemberContactInfoHandlerMock =
  updateMemberContactInfoHandler as jest.Mock;

describe('MemberContactInfoUpdateController', () => {
  const mockEmail = 'mock-email';
  const mockNumber = 'mock-phoneNumber';
  const mockIdentifier = 'mock-request-identifier';
  const mockSecondaryMemberIdentifier = 'mock-secondaryMemberIdentifier';

  const requestMock = {
    body: {
      email: mockEmail,
      phoneNumber: mockNumber,
      secondaryMemberIdentifier: mockSecondaryMemberIdentifier,
    },
    params: {
      identifier: mockIdentifier,
    },
  } as unknown as Request;

  const routerResponseMock = {
    locals: {
      personInfo: {
        identifier: 'loggedIn-user-identifier',
        isPrimary: true,
        primaryMemberFamilyId: 'family-id',
      },
    },
  } as unknown as Response;

  it('should create controller object with route method', () => {
    const routeHandler = new MemberContactInfoUpdateController(
      configurationMock
    );
    expect(routeHandler.updateMemberContactInfo).toBeDefined();
  });

  it('should call updateMemberContactInfoHandler handler for updateMemberContactInfo Route', async () => {
    const routeHandler = new MemberContactInfoUpdateController(
      configurationMock
    ).updateMemberContactInfo;
    await routeHandler(requestMock, routerResponseMock);
    expect(updateMemberContactInfoHandlerMock).toBeCalledTimes(1);

    expect(updateMemberContactInfoHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });
});
