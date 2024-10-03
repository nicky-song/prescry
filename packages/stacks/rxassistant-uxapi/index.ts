import { StackReference, getStack, Output, Config } from '@pulumi/pulumi';
import { createUxApiCluster } from './create-uxapi-cluster';
import { getPlatformConfig } from '../common/config';
import { getUxConfig } from './config';
import { Provider } from '@pulumi/kubernetes';
import { IRxAssistantPlatformOutput } from '../rxassistant-platform';
import { KubernetesCluster, getRegistry } from '@pulumi/azure/containerservice';
import { IRxAssistantLocation } from '../common/config.interfaces';

export interface IClusterInfo {
  cluster: KubernetesCluster;
  provider: Provider;
  locationConfig: IRxAssistantLocation;
}

function getClusterInfo(
  suffix: string,
  clusterId: string,
  locationConfig: IRxAssistantLocation
): IClusterInfo {
  const cluster = KubernetesCluster.get(`cluster-${suffix}`, clusterId);
  return {
    cluster,
    provider: new Provider(`provider-cluster-${suffix}`, {
      kubeconfig: cluster.kubeConfigRaw,
    }),
    locationConfig,
  };
}

async function init() {
  const c = getUxConfig();

  const registry = getRegistry({
    name: c.platform.aks.registryName,
    resourceGroupName: c.platform.aks.registryResourceGroupName,
  });

  const a = createUxApiCluster(
    c,
    registry,
    getClusterInfo('a', c.locations.a.clusterId, c.platform.locations.a)
  );

  const b = createUxApiCluster(
    c,
    registry,
    getClusterInfo('b', c.locations.b.clusterId, c.platform.locations.b)
  );

  return {
    uxApi: {
      a,
      b,
    },
    ...c,
  };
}

// Export the connection string for the storage account
export const result = init();
