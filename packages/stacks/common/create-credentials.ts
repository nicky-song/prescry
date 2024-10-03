import { IRxAssistantConfig, ITagPairs } from './config.interfaces';
import {
  Application,
  ServicePrincipal,
  ServicePrincipalPassword,
} from '@pulumi/azuread';
import { RandomPassword } from '@pulumi/random';
import { PrivateKey } from '@pulumi/tls';
import { Output } from '@pulumi/pulumi';
import { Assignment } from '@pulumi/azure/role';
import { GetRegistryResult } from '@pulumi/azure/containerservice';
import { ResourceGroup } from '@pulumi/azure/core';

export interface ICredentials {
  app: Application;
  acrPullRoleAssignment: Assignment;
  acrReaderRoleAssignment: Assignment;
  servicePrincipal: ServicePrincipal;
  servicePrincipalPassword: ServicePrincipalPassword;
  password: string | Output<string>;
  sshPublicKey: string | Output<string>;
}

export function createCredentials(
  name: string,
  registry: GetRegistryResult,
  tags: ITagPairs
): ICredentials {
  const password = new RandomPassword(`password${name}`, {
    length: 20,
    special: true,
  }).result;
  const sshPublicKey = new PrivateKey(`privatekeyrsa4096${name}`, {
    algorithm: `RSA`,
    rsaBits: 4096,
  }).publicKeyOpenssh;

  // Create the AD service principal for the K8s cluster.
  const app = new Application(`app-${name}`);

  const servicePrincipal = new ServicePrincipal(
    `serviceprincipal-application-${name}`,
    {
      applicationId: app.applicationId,
      tags: Object.values(tags),
    }
  );

  const servicePrincipalPassword = new ServicePrincipalPassword(
    `password-serviceprincipal-application-${name}`,
    {
      servicePrincipalId: servicePrincipal.id,
      value: password,
      endDate: `2099-01-01T00:00:00Z`,
    }
  );

  const acrPullRoleAssignment = new Assignment(
    `assignment-acrpull-${registry.name}`,
    {
      principalId: servicePrincipal.id,
      roleDefinitionName: 'AcrPull',
      scope: registry.id,
      skipServicePrincipalAadCheck: true,
    }
  );

  const acrReaderRoleAssignment = new Assignment(
    `assignment-reader-${registry.name}`,
    {
      principalId: servicePrincipal.id,
      roleDefinitionName: 'Reader',
      scope: registry.id,
      skipServicePrincipalAadCheck: true,
    }
  );

  return {
    app,
    acrPullRoleAssignment,
    acrReaderRoleAssignment,
    servicePrincipal,
    servicePrincipalPassword,
    password,
    sshPublicKey,
  };
}
