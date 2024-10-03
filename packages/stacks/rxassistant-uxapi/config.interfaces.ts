import { Output, Input } from '@pulumi/pulumi';
import { ITags, IUxApiTagPairs } from '../common/config.interfaces';

export type IUxApiTags =
  | ITags
  | 'app'
  | 'component'
  | 'deployment'
  | 'port'
  | 'namespace'
  | 'service';

export interface IUxApiSecrets {
  APPINSIGHTS_INSTRUMENTATION_KEY: Input<string> | string;
  DATABASE_CONNECTION: Input<string> | string;
  JWT_TOKEN_SECRET_KEY: Input<string> | string;
  SERVICE_BUS_CONNECTION_STRING: Input<string> | string;
  TWILIO_ACCOUNT_SID: Input<string> | string;
  TWILIO_AUTH_TOKEN: Input<string> | string;
  TWILIO_VERIFICATION_SERVICE_ID: Input<string> | string;
}

export interface IUxApiConfigs {
  GUESTMEMBEREXPERIENCE_CORS_HOSTS: string;
  GUESTMEMBEREXPERIENCE_PORT: string;
  GUESTMEMBEREXPERIENCE_HOST: string;
  APPINSIGHTS_SERVICE_NAME_API: string;
  APPINSIGHTS_SERVICE_NAME_WEB: string;
  JWT_TOKEN_EXPIRES_IN: string;
  TOPIC_NAME_UPDATE_PERSON: string;
  TOPIC_NAME_UPDATE_MEMBER_FEEDBACK: string;
  WINSTON_LOG_FILE_PATH: string;
}

export interface IUxApiSetup {
  configs: IUxApiConfigs;
  image: string;
  publicIpName: string;
  secrets: IUxApiSecrets;
  tags: IUxApiTagPairs;
}
