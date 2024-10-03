import { getStack } from '@pulumi/pulumi/runtime';

import { Config as PulumiConfig, StackReference, Output } from '@pulumi/pulumi';
import {
  IUxApiSecrets,
  IUxApiConfigs,
  ITags,
  ITagPairs,
} from '../common/config.interfaces';
import { IUxApiSetup } from './config.interfaces';
import { getPlatformConfig } from '../common/config';
import { IRxAssistantPlatformOutput } from '../rxassistant-platform';

const config = new PulumiConfig();

function getSecret(key: keyof IUxApiSecrets) {
  return config.require(key);
}

const secrets: IUxApiSecrets = {
  APPINSIGHTS_INSTRUMENTATION_KEY: getSecret('APPINSIGHTS_INSTRUMENTATION_KEY'),
  DATABASE_CONNECTION: getSecret('DATABASE_CONNECTION'),
  JWT_TOKEN_SECRET_KEY: getSecret('JWT_TOKEN_SECRET_KEY'),
  SERVICE_BUS_CONNECTION_STRING: getSecret('SERVICE_BUS_CONNECTION_STRING'),
  TWILIO_ACCOUNT_SID: getSecret('TWILIO_ACCOUNT_SID'),
  TWILIO_AUTH_TOKEN: getSecret('TWILIO_AUTH_TOKEN'),
  TWILIO_VERIFICATION_SERVICE_ID: getSecret('TWILIO_VERIFICATION_SERVICE_ID'),
};

const configs: IUxApiConfigs = {
  GUESTMEMBEREXPERIENCE_CORS_HOSTS:
    'app.test.prescryptive.io,phxwebci1centraltest-secondary.z19.web.core.windows.net,api.prescryptive.io,fd-uxapi-rxassistant-test.azurefd.net,fd-uxapi-rxassistant.azurefd.net',
  GUESTMEMBEREXPERIENCE_PORT: '80',
  GUESTMEMBEREXPERIENCE_HOST: 'demoapp2.prescryptive.io',
  APPINSIGHTS_SERVICE_NAME_API: 'rxassistant-api',
  APPINSIGHTS_SERVICE_NAME_WEB: 'rxassistant-web',
  JWT_TOKEN_EXPIRES_IN: '36000',
  TOPIC_NAME_UPDATE_PERSON: 'topic-person-update',
  TOPIC_NAME_UPDATE_MEMBER_FEEDBACK: 'topic-member-feedback',
  WINSTON_LOG_FILE_PATH: '/var/log/prescryptive-logs/winston.log',
};

const image = config.require('uxapi-image');

export function getUxConfig(): IUxApiSetup & IRxAssistantPlatformOutput {
  const platform = new StackReference(
    'prescryptive/rxassistant-platform/rxassistant-test'
  );

  const output = platform.requireOutputSync(
    'RxAssistantPlatform'
  ) as IRxAssistantPlatformOutput;

  const setup: IUxApiSetup & IRxAssistantPlatformOutput = {
    configs,
    image,
    publicIpName: 'pip-network-ux-uxapi',
    secrets,
    tags: {
      ...output.platform.tags,
      component: 'component-rxassistant-ux-uxapi',
      deployment: 'deployment-rxassistant-ux-uxapi',
      port: 'port-service-rxassistant-ux-uxapi',
      namespace: 'namespace-rxassistant-ux',
      service: 'service-rxassistant-ux-uxapi',
    },
    ...output,
  };

  return setup;
}
