// Copyright 2022 Prescryptive Health, Inc.

import {
  GuestExperienceConfig,
  IGuestExperienceConfig,
} from '@phx/common/src/experiences/guest-experience/guest-experience-config';
import { loadConfig, getMetaEnvironmentVariable } from './config.helper';

const guestExperienceConfigMap = new Map<string, string>([
  ['host', 'GUESTMEMBEREXPERIENCE_HOST'],
  ['port', 'GUESTMEMBEREXPERIENCE_PORT'],
]);

const contentManagementConfigMap = new Map<string, string>([
  ['host', 'CONTENT_MANAGEMENT_HOST'],
]);

const domainDataConfigMap = new Map<string, string>([
  ['host', 'DOMAIN_DATA_HOST'],
]);

const telemetryConfigMap = new Map<string, string>([
  ['instrumentationKey', 'APPINSIGHTS_INSTRUMENTATION_KEY'],
  ['serviceName', 'APPINSIGHTS_SERVICE_NAME_WEB'],
]);

const paymentsConfigMap = new Map<string, string>([
  ['publicKey', 'PAYMENTS_KEY_PUBLIC'],
  ['testPublicKey', 'PAYMENTS_KEY_PUBLIC_TEST'],
]);

export function initializeConfig(
  defaultConfig: IGuestExperienceConfig = GuestExperienceConfig
) {
  loadConfig(defaultConfig.payments, paymentsConfigMap);
  loadConfig(defaultConfig.telemetry, telemetryConfigMap);
  loadConfig(
    defaultConfig.apis.guestExperienceApi.env,
    guestExperienceConfigMap
  );
  defaultConfig.apis.guestExperienceApi.switches = location.search;

  loadConfig(
    defaultConfig.apis.contentManagementApi.env,
    contentManagementConfigMap
  );

  loadConfig(defaultConfig.apis.domainDataApi.env, domainDataConfigMap);

  defaultConfig.telemetry.serviceName = 'rxassistant-web';
  defaultConfig.payments.experienceBaseUrl = location.origin;
  defaultConfig.memberPortalUrl = getMetaEnvironmentVariable(
    'MEMBER_PORTAL_URL',
    defaultConfig.memberPortalUrl,
    document
  );

  defaultConfig.supportEmail = getMetaEnvironmentVariable(
    'SUPPORT_EMAIL',
    defaultConfig.supportEmail,
    document
  );

  defaultConfig.memberSupportEmail = getMetaEnvironmentVariable(
    'MEMBER_SUPPORT_EMAIL',
    defaultConfig.memberSupportEmail,
    document
  );

  defaultConfig.cancelAppointmentWindowHours = getMetaEnvironmentVariable(
    'CANCEL_APPOINTMENT_WINDOW_HOURS',
    defaultConfig.cancelAppointmentWindowHours,
    document
  );

  defaultConfig.cmsRefreshInterval = Number(
    getMetaEnvironmentVariable(
      'CMS_REFRESH_INTERVAL',
      defaultConfig.cmsRefreshInterval.toString(),
      document
    )
  );

  defaultConfig.childMemberAgeLimit = Number(
    getMetaEnvironmentVariable(
      'CHILD_MEMBER_AGE_LIMIT',
      defaultConfig.childMemberAgeLimit.toString(),
      document
    )
  );

  defaultConfig.domainDataSearchKeyPublic = getMetaEnvironmentVariable(
    'DOMAIN_DATA_SUBSCRIPTION_KEY_PUBLIC',
    defaultConfig.domainDataSearchKeyPublic,
    document
  );

  defaultConfig.talkativeJavascriptUrl = getMetaEnvironmentVariable(
    'TALKATIVE_JAVASCRIPT_URL',
    defaultConfig.talkativeJavascriptUrl,
    document
  );

  defaultConfig.transPerfectJavascriptUrl = getMetaEnvironmentVariable(
    'TRANSPERFECT_JAVASCRIPT_URL',
    defaultConfig.transPerfectJavascriptUrl,
    document
  );

  defaultConfig.transPerfectKey = getMetaEnvironmentVariable(
    'TRANSPERFECT_KEY',
    defaultConfig.transPerfectKey,
    document
  );

  GuestExperienceConfig.apis = defaultConfig.apis;
  GuestExperienceConfig.telemetry = defaultConfig.telemetry;
  GuestExperienceConfig.payments = defaultConfig.payments;
  GuestExperienceConfig.location = location;

  return GuestExperienceConfig;
}
