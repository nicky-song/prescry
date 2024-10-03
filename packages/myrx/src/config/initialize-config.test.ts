// Copyright 2022 Prescryptive Health, Inc.

import {
  GuestExperienceConfig,
  IGuestExperienceConfig,
} from '@phx/common/src/experiences/guest-experience/guest-experience-config';
import { initializeConfig } from './initialize-config';
import { getMetaEnvironmentVariable, loadConfig } from './config.helper';

jest.mock('./config.helper');
const getMetaEnvironmentVariableMock = getMetaEnvironmentVariable as jest.Mock;
const loadConfigMock = loadConfig as jest.Mock;

describe('initializeConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getMetaEnvironmentVariableMock.mockReset();
  });

  it('initializes values in GuestExperienceConfig', () => {
    initializeConfig();

    expect(GuestExperienceConfig.telemetry.serviceName).toBe('rxassistant-web');
  });

  it('loads member portal URL', () => {
    const defaultPortalUrl = 'https://somewhere.com/path';
    const configMock = {
      ...GuestExperienceConfig,
      memberPortalUrl: defaultPortalUrl,
    };

    const configuredPortalUrl = 'https://somewhere.com/differentpath';
    getMetaEnvironmentVariableMock.mockReturnValue(configuredPortalUrl);

    initializeConfig(configMock);

    expect(getMetaEnvironmentVariableMock).toHaveBeenCalledWith(
      'MEMBER_PORTAL_URL',
      defaultPortalUrl,
      document
    );
    expect(configMock.memberPortalUrl).toEqual(configuredPortalUrl);
  });

  it('loads support email', () => {
    const defaultSupportEmail = 'support@somewhere.com';
    const configMock = {
      ...GuestExperienceConfig,
      supportEmail: defaultSupportEmail,
    };
    const configuredSupportEmail = 'support2@somewhere.com';
    getMetaEnvironmentVariableMock.mockReturnValue(configuredSupportEmail);

    initializeConfig(configMock);

    expect(getMetaEnvironmentVariableMock).toHaveBeenCalledWith(
      'SUPPORT_EMAIL',
      defaultSupportEmail,
      document
    );
    expect(configMock.supportEmail).toEqual(configuredSupportEmail);
  });

  it('loads member support email', () => {
    const defaultMemeberSupportEmail = 'member@somewhere.com';
    const configMock = {
      ...GuestExperienceConfig,
      memberSupportEmail: defaultMemeberSupportEmail,
    };

    const configuredMemberSupportEmail = 'member2@somewhere.com';
    getMetaEnvironmentVariableMock.mockReturnValue(
      configuredMemberSupportEmail
    );

    initializeConfig(configMock);

    expect(getMetaEnvironmentVariableMock).toHaveBeenCalledWith(
      'MEMBER_SUPPORT_EMAIL',
      defaultMemeberSupportEmail,
      document
    );
  });

  it('loads cancellation window hours', () => {
    const defaultCancelAppointmentWindowHours = '6';
    const configMock = {
      ...GuestExperienceConfig,
      cancelAppointmentWindowHours: '6',
    };
    const configuredCancelAppointmentWindowHours = '3';
    getMetaEnvironmentVariableMock.mockReturnValue(
      configuredCancelAppointmentWindowHours
    );

    initializeConfig(configMock);

    expect(getMetaEnvironmentVariableMock).toHaveBeenCalledWith(
      'CANCEL_APPOINTMENT_WINDOW_HOURS',
      defaultCancelAppointmentWindowHours,
      document
    );
  });

  it('loads child member age limit', () => {
    const defaultChildMemberAgeLimit = 13;
    const configMock = {
      ...GuestExperienceConfig,
      childMemberAgeLimit: 13,
    };
    const configuredChildMemberAgeLimit = 13;
    getMetaEnvironmentVariableMock.mockReturnValue(
      configuredChildMemberAgeLimit
    );

    initializeConfig(configMock);

    expect(getMetaEnvironmentVariableMock).toHaveBeenCalledWith(
      'CHILD_MEMBER_AGE_LIMIT',
      defaultChildMemberAgeLimit.toString(),
      document
    );
  });

  it('loads cms refresh interval', () => {
    const defaultCMSRefresh = 1800000;
    const configMock = {
      ...GuestExperienceConfig,
      cmsRefreshInterval: 1800000,
    };
    const configuredCMSRefresh = 1000;
    getMetaEnvironmentVariableMock.mockReturnValue(configuredCMSRefresh);

    initializeConfig(configMock);

    expect(getMetaEnvironmentVariableMock).toHaveBeenCalledWith(
      'CMS_REFRESH_INTERVAL',
      defaultCMSRefresh.toString(),
      document
    );
  });

  it('loads domain data api subscription key', () => {
    const configMock: Partial<IGuestExperienceConfig> = {
      ...GuestExperienceConfig,
      domainDataSearchKeyPublic: 'key1',
    };
    const mockKey = 'test-key';
    getMetaEnvironmentVariableMock.mockReturnValue(mockKey);

    initializeConfig(configMock as IGuestExperienceConfig);

    expect(getMetaEnvironmentVariableMock).toHaveBeenCalledWith(
      'DOMAIN_DATA_SUBSCRIPTION_KEY_PUBLIC',
      'key1',
      document
    );
  });

  it('assigns location', () => {
    initializeConfig();
    expect(GuestExperienceConfig.location).toEqual(location);
  });

  it('adds location.query as switches to GuestExperienceConfig.apis.guestExperienceApi.switches', () => {
    const searchMock = '?search';
    jest.spyOn(global, 'location', 'get').mockReturnValue({
      search: searchMock,
    } as unknown as Location);

    initializeConfig();
    expect(GuestExperienceConfig.apis.guestExperienceApi.switches).toEqual(
      searchMock
    );
  });

  it('adds experienceBaseUrl to payments', () => {
    const originMock = 'origin';
    jest.spyOn(global, 'location', 'get').mockReturnValue({
      origin: originMock,
    } as unknown as Location);

    initializeConfig();
    expect(GuestExperienceConfig.payments.experienceBaseUrl).toEqual(
      originMock
    );
  });

  it('makes load config calls', () => {
    initializeConfig();
    expect(loadConfigMock).toHaveBeenCalledTimes(5);
  });

  it('loads payments config', () => {
    const expectedConfigMap = new Map<string, string>([
      ['publicKey', 'PAYMENTS_KEY_PUBLIC'],
      ['testPublicKey', 'PAYMENTS_KEY_PUBLIC_TEST'],
    ]);

    const configMock = { ...GuestExperienceConfig };
    initializeConfig(configMock);

    expect(loadConfigMock).toHaveBeenNthCalledWith(
      1,
      configMock.payments,
      expectedConfigMap
    );
  });

  it('loads telemetry config', () => {
    const expectedConfigMap = new Map<string, string>([
      ['instrumentationKey', 'APPINSIGHTS_INSTRUMENTATION_KEY'],
      ['serviceName', 'APPINSIGHTS_SERVICE_NAME_WEB'],
    ]);

    const configMock = { ...GuestExperienceConfig };
    initializeConfig(configMock);

    expect(loadConfigMock).toHaveBeenNthCalledWith(
      2,
      configMock.telemetry,
      expectedConfigMap
    );
  });

  it('loads guest experience api config', () => {
    const expectedConfigMap = new Map<string, string>([
      ['host', 'GUESTMEMBEREXPERIENCE_HOST'],
      ['port', 'GUESTMEMBEREXPERIENCE_PORT'],
    ]);

    const configMock = { ...GuestExperienceConfig };
    initializeConfig(configMock);

    expect(loadConfigMock).toHaveBeenNthCalledWith(
      3,
      configMock.apis.guestExperienceApi.env,
      expectedConfigMap
    );
  });

  it('loads content management api config', () => {
    const expectedConfigMap = new Map<string, string>([
      ['host', 'CONTENT_MANAGEMENT_HOST'],
    ]);

    const configMock = { ...GuestExperienceConfig };
    initializeConfig(configMock);

    expect(loadConfigMock).toHaveBeenNthCalledWith(
      4,
      configMock.apis.contentManagementApi.env,
      expectedConfigMap
    );
  });

  it('loads domain data api config', () => {
    const expectedConfigMap = new Map<string, string>([
      ['host', 'DOMAIN_DATA_HOST'],
    ]);

    const configMock = { ...GuestExperienceConfig };
    initializeConfig(configMock);

    expect(loadConfigMock).toHaveBeenNthCalledWith(
      5,
      configMock.apis.domainDataApi.env,
      expectedConfigMap
    );
  });

  it('loads talkative javascript url', () => {
    const talkativeJavascriptUrlMock = 'talkative-javascript-url-mock';
    const configMock: Partial<IGuestExperienceConfig> = {
      ...GuestExperienceConfig,
      talkativeJavascriptUrl: talkativeJavascriptUrlMock,
    };
    const mockKey = 'test-key';
    getMetaEnvironmentVariableMock.mockReturnValue(mockKey);

    initializeConfig(configMock as IGuestExperienceConfig);

    expect(getMetaEnvironmentVariableMock).toHaveBeenCalledWith(
      'TALKATIVE_JAVASCRIPT_URL',
      talkativeJavascriptUrlMock,
      document
    );
  });

  it('loads transPerfect javascript url', () => {
    const transPerfectJavascriptUrlMock = 'transperfect-javascript-url-mock';
    const configMock = {
      ...GuestExperienceConfig,
      transPerfectJavascriptUrl: transPerfectJavascriptUrlMock,
    };
    const configuredUrl = 'mock-url';
    getMetaEnvironmentVariableMock.mockReturnValue(configuredUrl);

    initializeConfig(configMock as IGuestExperienceConfig);

    expect(getMetaEnvironmentVariableMock).toHaveBeenNthCalledWith(
      9,
      'TRANSPERFECT_JAVASCRIPT_URL',
      transPerfectJavascriptUrlMock,
      document
    );
  });

  it('loads transPerfect key', () => {
    const transPerfectKeyMock = 'transperfect-key-mock';
    const configMock = {
      ...GuestExperienceConfig,
      transPerfectKey: transPerfectKeyMock,
    };
    const configuredKey = 'mock-key';
    getMetaEnvironmentVariableMock.mockReturnValue(configuredKey);

    initializeConfig(configMock as IGuestExperienceConfig);

    expect(getMetaEnvironmentVariableMock).toHaveBeenNthCalledWith(
      10,
      'TRANSPERFECT_KEY',
      transPerfectKeyMock,
      document
    );
  });
});
