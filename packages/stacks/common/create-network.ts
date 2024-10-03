import { IRxAssistantConfig, INetwork, IAksConfig } from './config.interfaces';
import { ICredentials } from './create-credentials';
import { VirtualNetwork, Subnet } from '@pulumi/azure/network';
import { Assignment } from '@pulumi/azure/role';
import { ResourceGroup } from '@pulumi/azure/core';

export function createNetwork(
  config: IRxAssistantConfig,
  cluster: IAksConfig,
  credentials: ICredentials,
  resourceGroup: ResourceGroup
): INetwork {
  const suffix = `${config.stack}-${cluster.location.resourceSuffix}`;
  const vnet = new VirtualNetwork(
    `vnet-${suffix}`,
    {
      location: cluster.location.location,
      resourceGroupName: resourceGroup.name,
      addressSpaces: ['10.2.0.0/16'],
      tags: config.tags,
    },
    {
      dependsOn: [resourceGroup],
    }
  );

  const subnet = new Subnet(
    `subnet-${suffix}`,
    {
      resourceGroupName: resourceGroup.name,
      addressPrefix: '10.2.1.0/24',
      virtualNetworkName: vnet.name,
    },
    {
      dependsOn: [resourceGroup],
    }
  );

  const subnetRole = new Assignment(`assignment-subnet-${suffix}`, {
    principalId: credentials.servicePrincipal.id,
    roleDefinitionName: 'Network Contributor',
    scope: subnet.id,
  });

  return {
    subnet,
    subnetRole,
    vnet,
  };
}
