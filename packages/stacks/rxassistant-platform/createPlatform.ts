import { locations, getPlatformConfig } from '../common/config';
import { createCluster } from '../common/create-clusters';
import { createCredentials } from '../common/create-credentials';
import { ResourceGroup } from '@pulumi/azure/core';
import { IAksConfig } from '../common/config.interfaces';
import { getRegistry } from '@pulumi/azure/containerservice';

export async function createPlatform() {
  const config = await getPlatformConfig();
  const rgName = `rg-k8s-${config.stack}`;

  const resourceGroup = new ResourceGroup(rgName, {
    location: locations.a.location,
    tags: config.tags,
  });

  const clusterConfigA: IAksConfig = {
    ...config.aks,
    location: locations.a,
    name: `k8s-${locations.a.name}-${config.stack}`,
  };

  const clusterConfigB: IAksConfig = {
    ...config.aks,
    location: locations.b,
    name: `k8s-${locations.b.name}-${config.stack}`,
  };

  const registry = getRegistry({
    name: config.aks.registryName,
    resourceGroupName: config.aks.registryResourceGroupName,
  });

  const credentials = createCredentials(config.stack, registry, config.tags);
  const clusterA = await createCluster(
    config,
    clusterConfigA,
    credentials,
    resourceGroup
  );
  const clusterB = await createCluster(
    config,
    clusterConfigB,
    credentials,
    resourceGroup
  );

  return {
    clusterA,
    clusterB,
    clusterConfigA: clusterConfigA,
    clusterConfigB: clusterConfigB,
    credentials,
    config,
    resourceGroup,
  };
}
