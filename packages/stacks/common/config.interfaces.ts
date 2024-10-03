import {
  KubernetesCluster,
  GetRegistryResult,
} from '@pulumi/azure/containerservice';
import { Output } from '@pulumi/pulumi';
import { VirtualNetwork, Subnet, PublicIp } from '@pulumi/azure/network';
import { Assignment } from '@pulumi/azure/role';
import { Deployment } from '@pulumi/kubernetes/apps/v1';
import { LoadBalancer } from '@pulumi/azure/lb';
import { Service } from '@pulumi/kubernetes/core/v1';
import { Provider } from '@pulumi/kubernetes';
import { ResourceGroup } from '@pulumi/azure/core';

export type ITags = 'app' | 'epic' | 'environment';

export type IUxApiTags =
  | ITags
  | 'app'
  | 'component'
  | 'deployment'
  | 'port'
  | 'namespace'
  | 'service';

export type ITagPairs = { [key in ITags]: string | Output<string> };
export type IUxApiTagPairs = { [key in IUxApiTags]: string | Output<string> };

export type ILocations = 'a' | 'b';

export interface IUxApiSecrets {
  APPINSIGHTS_INSTRUMENTATION_KEY: Output<string> | string;
  DATABASE_CONNECTION: Output<string> | string;
  JWT_TOKEN_SECRET_KEY: Output<string> | string;
  SERVICE_BUS_CONNECTION_STRING: Output<string> | string;
  TWILIO_ACCOUNT_SID: Output<string> | string;
  TWILIO_AUTH_TOKEN: Output<string> | string;
  TWILIO_VERIFICATION_SERVICE_ID: Output<string> | string;
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

export interface IAksCommonConfig {
  nodeCount: number;
  nodeSize: string;
  version: string;
  registryName: string;
  registryResourceGroupName: string;
}

export interface IAksConfig extends IAksCommonConfig {
  name: string;
  location: IRxAssistantLocation;
}

export interface IRxAssistantCluster {
  acrRole: Assignment;
  network: INetwork;
  cluster: KubernetesCluster;
  config: IAksConfig;
  provider: Provider;
}

export interface IRxAssistantLocation {
  location: string;
  name: string;
  resourceSuffix: string;
}

export interface IRxAssistantConfig {
  aks: IAksCommonConfig;
  locations: { [key in ILocations]: IRxAssistantLocation };
  resourceSuffix: string;
  stack: string;
  tags: ITagPairs;
}

export interface INetwork {
  subnet: Subnet;
  subnetRole: Assignment;
  vnet: VirtualNetwork;
}

export interface IUxCluster {
  config: IRxAssistantConfig;
  deployment: Deployment;
  image: string;
  publicIp: PublicIp;
  service: Service;
}
