// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { RequestHeaders } from '@phx/common/src/experiences/guest-experience/api/api-request-headers';
import { featureSwitchesMiddleware } from './feature-switches.middleware';
import * as getRequiredResponseLocal from '../utils/request/request-app-locals.helper';
import * as featuresHelper from '@phx/common/src/utils/features.helper';
import { IFeaturesState } from '@phx/common/src/experiences/guest-experience/guest-experience-features';

const applyQuerySwitchesSpy = jest.spyOn(featuresHelper, 'applyQuerySwitches');

const nextFunction = jest.fn();

const getRequiredResponseLocalSpy = jest.spyOn(
  getRequiredResponseLocal,
  'getRequiredResponseLocal'
);
describe('featureSwitchesMiddleware', () => {
  describe('should populate responseMock.locals.features if any IPerson isTestMembership', () => {
    const expected: IFeaturesState = {
      usegrouptypecash: true,
    } as IFeaturesState;

    const expectedData = '1112223333';
    const requestMock = {
      headers: {
        [RequestHeaders.switches]: 'f=usegrouptypecash:1',
      },
      originalUrl: '/api/members',
    } as Request;
    const responseMock = {
      locals: {
        device: {
          data: expectedData,
        },
        account: {},
        features: {},
      },
    } as unknown as Response;

    const testRunner = async (request: Request) => {
      getRequiredResponseLocalSpy
        .mockReset()
        .mockReturnValueOnce(responseMock.locals.account);

      applyQuerySwitchesSpy.mockReset().mockImplementation((f) => {
        f.usegrouptypecash = true;
      });
      await featureSwitchesMiddleware()(
        request,
        responseMock,
        nextFunction.mockReset()
      );
    };

    it('should return expected features', async () => {
      await testRunner(requestMock);
      expect(responseMock.locals.features).toMatchObject(expected);
    });

    it('should call getRequiredResponseLocal twice', async () => {
      await testRunner(requestMock);
      expect(getRequiredResponseLocalSpy).toHaveBeenNthCalledWith(
        1,
        responseMock,
        'account'
      );
    });

    it('should call nextFunction', async () => {
      await testRunner(requestMock);
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('should not populate responseMock.locals.features if any IPerson is not isTestMembership and has no account featuresDefault or featuresAllowed and no features in always allowed list', () => {
    const expected: IFeaturesState = {} as IFeaturesState;

    const data = '1112223333';

    const requestMock = {
      headers: {
        [RequestHeaders.switches]: 'f=usegrouptypecash:1',
      },
      originalUrl: '/api/members',
    } as Request;
    const responseMock = {
      locals: {
        device: {
          data,
        },
        account: {
          featuresDefault: '',
          featuresAllowed: undefined,
        },
      },
    } as unknown as Response;

    const testRunner = async (request: Request) => {
      getRequiredResponseLocalSpy
        .mockReset()
        .mockReturnValueOnce(responseMock.locals.account);
      applyQuerySwitchesSpy
        .mockReset()
        .mockImplementation((f) => (f.usegrouptypecash = !f.usegrouptypecash));
      await featureSwitchesMiddleware()(
        request,
        responseMock,
        nextFunction.mockReset()
      );
    };

    it('should have returned expected features', async () => {
      await testRunner(requestMock);
      expect(responseMock.locals.features).toMatchObject(expected);
    });

    it('should have called getRequiredResponseLocal', async () => {
      await testRunner(requestMock);
      expect(getRequiredResponseLocalSpy).toHaveBeenNthCalledWith(
        1,
        responseMock,
        'account'
      );
    });

    it('should have called nextFunction', async () => {
      await testRunner(requestMock);
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('should populate features based on test member status and account feature settings', () => {
    const headers = {
      [RequestHeaders.switches]: '' as string | undefined,
    };
    const person = {
      isTestMembership: false,
    };
    const locals = {
      device: {
        data: '1112223333',
      },
      account: {
        featuresDefault: undefined as string | undefined,
        featuresAllowed: undefined as string | undefined,
      },
      features: {},
    };

    const requestMock = {
      headers,
      originalUrl: '/api/members',
    } as Request;
    const responseMock = {
      locals,
    } as unknown as Response;

    const testRunner = async (request: Request) => {
      getRequiredResponseLocalSpy
        .mockReset()
        .mockReturnValueOnce(responseMock.locals.account);
      applyQuerySwitchesSpy
        .mockReset()
        .mockImplementation((f) => (f.usegrouptypecash = !f.usegrouptypecash));
      await featureSwitchesMiddleware()(
        request,
        responseMock,
        nextFunction.mockReset()
      );
    };

    const query = 'f=usegrouptypecash:1';
    it('should apply header switches if isTestMembership', async () => {
      responseMock.locals = {
        ...locals,
        account: {
          ...locals.account,
          featuresDefault: undefined,
          featuresAllowed: undefined,
        },
        features: undefined,
      };
      person.isTestMembership = true;
      headers[RequestHeaders.switches] = query;
      const expected: IFeaturesState = {
        usegrouptypecash: true,
      } as IFeaturesState;
      await testRunner(requestMock);
      expect(applyQuerySwitchesSpy).toHaveBeenCalledTimes(1);
      expect(applyQuerySwitchesSpy).toHaveBeenNthCalledWith(
        1,
        responseMock.locals.features,
        headers[RequestHeaders.switches]
      );
      expect(responseMock.locals.features).toMatchObject(expected);
    });

    it('should apply account.featuresDefault', async () => {
      responseMock.locals = {
        ...locals,
        account: {
          ...locals.account,
          featuresDefault: 'usegrouptypecash:1',
          featuresAllowed: undefined,
        },
        features: undefined,
      };
      person.isTestMembership = false;
      headers[RequestHeaders.switches] = undefined;
      await testRunner(requestMock);
      expect(applyQuerySwitchesSpy).toHaveBeenCalledTimes(1);
      expect(applyQuerySwitchesSpy).toHaveBeenNthCalledWith(
        1,
        responseMock.locals.features,
        `f=${responseMock.locals.account.featuresDefault}`
      );
      expect(responseMock.locals.features).toMatchObject({
        usegrouptypecash: true,
      });
    });
  });

  describe('should add always allowed features even if user is not a test user and account does not has any feature settings', () => {
    const headers = {
      [RequestHeaders.switches]: '' as string | undefined,
    };
    const person = {
      isTestMembership: false,
    };
    const locals = {
      device: {
        data: '1112223333',
      },
      account: {
        featuresDefault: undefined as string | undefined,
        featuresAllowed: undefined as string | undefined,
      },
      features: {},
    };

    const requestMock = {
      headers,
      originalUrl: '/api/members',
    } as Request;
    const responseMock = {
      locals,
    } as unknown as Response;

    const testRunner = async (request: Request) => {
      getRequiredResponseLocalSpy
        .mockReset()
        .mockReturnValueOnce(responseMock.locals.account);
      applyQuerySwitchesSpy
        .mockReset()
        .mockImplementation((f) => (f.usegrouptypesie = !f.usegrouptypesie));
      await featureSwitchesMiddleware()(
        request,
        responseMock,
        nextFunction.mockReset()
      );
    };

    const query = 'f=usegrouptypecash:1,usegrouptypesie:1';
    it('should apply header switches if matches featuresAllowed', async () => {
      responseMock.locals = {
        ...locals,

        features: undefined,
      };
      person.isTestMembership = false;
      headers[RequestHeaders.switches] = query;
      const expected: IFeaturesState = {
        usegrouptypesie: true,
      } as IFeaturesState;
      await testRunner(requestMock);
      expect(applyQuerySwitchesSpy).toHaveBeenCalledTimes(1);
      expect(applyQuerySwitchesSpy).toHaveBeenNthCalledWith(
        1,
        responseMock.locals.features,
        headers[RequestHeaders.switches]
      );
      expect(responseMock.locals.features).toMatchObject(expected);
    });

    it('should apply account.featuresDefault first, and then any allowed switches', async () => {
      jest.clearAllMocks();
      responseMock.locals = {
        ...locals,
        account: {
          ...locals.account,
          featuresDefault: 'usevaccine:1',
          featuresAllowed: 'usepharmacy',
        },
        features: undefined,
      };
      person.isTestMembership = false;
      headers[RequestHeaders.switches] = 'usevaccine:1,usegrouptypecash:1';
      await testRunner(requestMock);
      expect(applyQuerySwitchesSpy).toHaveBeenCalledTimes(2);
      expect(applyQuerySwitchesSpy).toHaveBeenNthCalledWith(
        1,
        responseMock.locals.features,
        `f=${responseMock.locals.account.featuresDefault}`
      );
      expect(responseMock.locals.features).toMatchObject({
        usegrouptypecash: false,
      });
    });
  });
});
