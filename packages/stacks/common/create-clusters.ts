import {
  IRxAssistantConfig,
  IAksConfig,
  IRxAssistantCluster,
} from './config.interfaces';
import { ICredentials } from './create-credentials';
import { createNetwork } from './create-network';
import { KubernetesCluster } from '@pulumi/azure/containerservice';
import { Provider } from '@pulumi/kubernetes';
import { ResourceGroup } from '@pulumi/azure/core';

export async function createCluster(
  config: IRxAssistantConfig,
  clusterConfig: IAksConfig,
  credentials: ICredentials,
  resourceGroup: ResourceGroup
) {
  const network = createNetwork(
    config,
    clusterConfig,
    credentials,
    resourceGroup
  );
  const name = `k8s-${clusterConfig.location.name}-rxassist`;
  const cluster = new KubernetesCluster(
    name,
    {
      resourceGroupName: resourceGroup.name,
      location: clusterConfig.location.location,
      agentPoolProfiles: [
        {
          name: 'aksagentpool',
          count: config.aks.nodeCount,
          vmSize: config.aks.nodeSize,
          osType: 'Linux',
          osDiskSizeGb: 30,
          vnetSubnetId: network.subnet.id,
        },
      ],
      dnsPrefix: clusterConfig.name,
      linuxProfile: {
        adminUsername: 'aksuser',
        sshKey: {
          keyData: credentials.sshPublicKey,
        },
      },
      servicePrincipal: {
        clientId: credentials.app.applicationId,
        clientSecret: credentials.servicePrincipalPassword.value,
      },
      kubernetesVersion: config.aks.version,
      roleBasedAccessControl: { enabled: true },
      networkProfile: {
        networkPlugin: 'azure',
        dnsServiceIp: '10.2.2.254',
        serviceCidr: '10.2.2.0/24',
        dockerBridgeCidr: '172.17.0.1/16',
      },
      // dnsPrefix: `${config.stack}-kube`,
      tags: config.tags,
    },
    {
      dependsOn: [
        resourceGroup,
        credentials.app,
        credentials.acrPullRoleAssignment,
        credentials.acrReaderRoleAssignment,
        network.subnetRole,
      ],
    }
  );
  // const cluster = new KubernetesCluster(
  //   clusterConfig.name,
  //   {
  //     name: clusterConfig.name,
  //     resourceGroupName: clusterConfig.resourceGroup.name,
  //     linuxProfile: {
  //       adminUsername: 'aksuser',
  //       sshKey: {
  //         keyData: clusterConfig.sshPublicKey,
  //       },
  //     },
  //     servicePrincipal: {
  //       clientId: credentials.servicePrincipal.applicationId,
  //       clientSecret: credentials.servicePrincipalPassword.value,
  //     },
  //     // Per-cluster config arguments
  //     location: clusterConfig.location.location,
  //     agentPoolProfiles: [
  //       {
  //         name: `agentpool`,
  //         count: clusterConfig.nodeCount,
  //         osType: 'Linux',
  //         vmSize: clusterConfig.nodeSize,
  //         osDiskSizeGb: 30,
  //         vnetSubnetId: network.subnet.id,
  //       },
  //     ],
  //     networkProfile: {
  //       loadBalancerSku: 'Standard',
  //       networkPlugin: 'azure',
  //       dnsServiceIp: '10.2.2.254',
  //       serviceCidr: '10.2.2.0/24',
  //       dockerBridgeCidr: '172.17.0.1/16',
  //     },
  //     enablePodSecurityPolicy: false,
  //     roleBasedAccessControl: {
  //       enabled: true,
  //     },
  //     dnsPrefix: `${config.stack}-kube`,
  //     tags: config.tags,
  //   },
  //   {
  //     dependsOn: [
  //       credentials.app,
  //       credentials.acrPullRoleAssignment,
  //       credentials.acrReaderRoleAssignment,
  //       network.subnetRole,
  //     ],
  //   }
  // Expose a K8s provider instance using our custom cluster instance.
  const provider = new Provider(
    `provider-k8s-${clusterConfig.location.resourceSuffix}`,
    {
      kubeconfig: cluster.kubeConfigRaw,
    }
  );

  const output: IRxAssistantCluster = {
    cluster,
    config: clusterConfig,
    network,
    provider,
    acrRole: credentials.acrPullRoleAssignment,
  };
  return output;
}
