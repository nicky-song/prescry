import { getStack } from '@pulumi/pulumi/runtime';

import { Config as PulumiConfig } from '@pulumi/pulumi';
import {
  IRxAssistantLocation,
  ILocations,
  IRxAssistantConfig,
  ITags,
  IUxApiSecrets,
} from './config.interfaces';
import { Locations } from '@pulumi/azure';

const config = new PulumiConfig();

function getSecret(key: keyof IUxApiSecrets) {
  return config.require(key);
}

const locationA = config.get('location:a') || Locations.EastUS2;
const locationB = config.get('location:b') || Locations.CentralUS;
const stack = getStack();

const resourceGroupName = `rg-${stack}`;
const locationASuffix = `${locationA}-${stack}`;
const locationBSuffix = `${locationB}-${stack}`;

const tags: { [key in ITags]: string } = {
  app: 'app-rxassistant',
  epic: 'epic-rxassistant',
  environment: stack,
};

const registryName = config.require('registry-name');
const registryResourceGroupName = config.require('registry-resource-group');

export const locations: { [key in ILocations]: IRxAssistantLocation } = {
  a: {
    location: locationA,
    name: 'a',
    resourceSuffix: locationASuffix,
  },
  b: {
    location: locationB,
    name: 'b',
    resourceSuffix: locationBSuffix,
  },
};

export const PlatformConfig: IRxAssistantConfig = {
  aks: {
    nodeCount: 2,
    nodeSize: 'Standard_D2_v2',
    registryName,
    registryResourceGroupName,
    version: '1.14.7',
  },
  locations,
  resourceSuffix: resourceGroupName,
  stack,
  tags,
};

export function getPlatformConfig(
  override?: Partial<IRxAssistantConfig>,
  tags?: Partial<{ [key in ITags]: string }>
): IRxAssistantConfig {
  const aks = (override && override.aks) || {};
  const overrideTags = {
    ...tags,
    ...((override && override.tags) || {}),
  };
  const config: IRxAssistantConfig = {
    ...PlatformConfig,
    ...override,
    aks: {
      ...PlatformConfig.aks,
      ...aks,
    },
    tags: {
      ...PlatformConfig.tags,
      ...overrideTags,
    },
  };
  return config;
}
