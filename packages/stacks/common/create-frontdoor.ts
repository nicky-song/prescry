import { frontdoor } from '@pulumi/azure/types/output';
import { Frontdoor } from '@pulumi/azure/frontdoor';
import { ResourceGroup } from '@pulumi/azure/core';
import { IRxAssistantConfig, IUxCluster } from './config.interfaces';

export async function createFrontDoor(
  config: IRxAssistantConfig,
  uxapis: IUxCluster[],
  resourceGroup: ResourceGroup
) {
  const suffix = `${config.locations.a.location}-${config.stack}`;
  const frontdoorName = `frontdoor-${suffix}`;
  const healthProbeName = `healthprobe-${frontdoorName}`;
  const loadBalancingName = `loadbalancing-${frontdoorName}`;
  const backendPoolName = `backendpool-${frontdoorName}`;
  const hostName = `fd-uxapi-${config.stack}.azurefd.net`;
  const frontendEndpointsName = `frontendpoint-${frontdoorName}`;
  const routingRuleName = `route-${frontdoorName}`;

  const backends: frontdoor.FrontdoorBackendPoolBackend[] = [];

  const backendPool: frontdoor.FrontdoorBackendPool = {
    backends,
    healthProbeName,
    loadBalancingName,
    name: backendPoolName,
  } as frontdoor.FrontdoorBackendPool;

  await Promise.all(
    uxapis.map(uxapi => {
      const result = uxapi.publicIp.ipAddress.apply(address => {
        const done = new Promise<void>((resolve: () => void) => {
          const b: frontdoor.FrontdoorBackendPoolBackend = {
            address,
            hostHeader: address,
            enabled: true,
            httpPort: 80,
            httpsPort: 443,
          };
          backendPool.backends.push(b);
          resolve();
        });
        return done;
      });
      return result;
    })
  );

  return new Frontdoor(frontdoorName, {
    backendPools: [backendPool],
    backendPoolHealthProbes: [
      {
        name: healthProbeName,
        intervalInSeconds: 255,
      },
    ],
    backendPoolLoadBalancings: [
      {
        name: loadBalancingName,
      },
    ],
    enforceBackendPoolsCertificateNameCheck: false,
    frontendEndpoints: [
      {
        customHttpsProvisioningEnabled: false,
        hostName,
        name: frontendEndpointsName,
      },
    ],
    location: config.locations.a.location,
    resourceGroupName: resourceGroup.name,
    routingRules: [
      {
        acceptedProtocols: ['Https'],
        forwardingConfiguration: {
          backendPoolName: backendPoolName,
          forwardingProtocol: 'MatchRequest',
        },
        frontendEndpoints: [frontendEndpointsName],
        name: routingRuleName,
        patternsToMatches: ['/api/*'],
      },
    ],
    tags: config.tags,
  });
}
