import { createPlatform } from './createPlatform';
import { ILocations, IRxAssistantConfig } from '../common/config.interfaces';
import { Output } from '@pulumi/pulumi';

export interface IRxAssistantPlatformOutput {
  platform: IRxAssistantConfig;
  locations: {
    [key in ILocations]: {
      clusterId: string;
    };
  };
  resourceGroupId: string;
}

export const RxAssistantPlatform: Promise<
  Output<IRxAssistantPlatformOutput>
> = createPlatform().then(p =>
  p.clusterA.cluster.id.apply(a_clusterId =>
    p.clusterB.cluster.id.apply(b_clusterId =>
      p.resourceGroup.id.apply(resourceGroupId => ({
        platform: p.config,
        locations: {
          a: {
            clusterId: a_clusterId,
          },
          b: {
            clusterId: b_clusterId,
          },
        },
        resourceGroupId,
      }))
    )
  )
);
