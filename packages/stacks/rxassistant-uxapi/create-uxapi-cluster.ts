import {
  Service,
  Namespace,
  SecretList,
  Secret,
  ConfigMap,
} from '@pulumi/kubernetes/core/v1';
import { core, meta } from '@pulumi/kubernetes/types/input';
import {
  IRxAssistantConfig,
  IUxCluster,
  IUxApiTagPairs,
} from '../common/config.interfaces';
import { PublicIp } from '@pulumi/azure/network';
import { Deployment } from '@pulumi/kubernetes/apps/v1';
import { LoadBalancer } from '@pulumi/azure/lb';
import { Provider } from '@pulumi/tls';
import {
  IUxApiSetup,
  IUxApiTags,
  IUxApiSecrets,
  IUxApiConfigs,
} from './config.interfaces';
import { Output, Input, Resource } from '@pulumi/pulumi';
import {
  GetRegistryResult,
  KubernetesCluster,
} from '@pulumi/azure/containerservice';
import { IRxAssistantPlatformOutput } from '../rxassistant-platform';
import { IClusterInfo } from '.';

export async function createUxApiCluster(
  config: IUxApiSetup & IRxAssistantPlatformOutput,
  registry: GetRegistryResult,
  clusterInfo: IClusterInfo
  // config: IRxAssistantConfig,
  // uxConfig: IUxApiSetup,
  // resourceSuffix: string,
  // nodeResourceGroup: Output<string>,
  // provider: Provider,
  // registry: GetRegistryResult,
  // location: string
): Promise<IUxCluster> {
  const resourceSuffix = `${clusterInfo.locationConfig.name}-${config.platform.resourceSuffix}`;
  const image = `${registry.loginServer}/${config.image}`;

  const publicIp = await uxApiAksPublicIp(
    config.publicIpName,
    resourceSuffix,
    clusterInfo.cluster.nodeResourceGroup,
    clusterInfo.locationConfig.location,
    config.tags
  );
  // const loadbalancer = await uxApiAksLoadBalancer(
  //   config.publicIpName,
  //   publicIp,
  //   resourceSuffix,
  //   clusterInfo.cluster.nodeResourceGroup,
  //   config.tags,
  //   [publicIp]
  // );
  const namespace = await uxApiAksNamespace(
    clusterInfo.locationConfig.location,
    clusterInfo.provider,
    config.tags.namespace
  );

  const secrets = await uxApiAksSecret(
    namespace,
    config.secrets,
    resourceSuffix,
    config.tags,
    clusterInfo.provider,
    [namespace]
  );

  const configMaps = await uxApiAksConfigMap(
    namespace,
    config.configs,
    resourceSuffix,
    config.tags,
    clusterInfo.provider,
    [namespace]
  );

  const deployment = await uxApiAksDeployment(
    namespace,
    resourceSuffix,
    clusterInfo.provider,
    image,
    secrets.map(s => s.var),
    configMaps.map(c => c.var),
    // config.secrets,
    // config.configs,
    config.tags,
    [
      ...secrets.map(s => s.secret),
      ...configMaps.map(c => c.configMap),
      namespace,
    ]
  );

  const service = await uxApiAksService(
    publicIp,
    namespace,
    resourceSuffix,
    clusterInfo.provider,
    config.tags.port,
    config.tags,
    [publicIp, namespace]
  );

  return {
    config: config.platform,
    deployment,
    image,
    publicIp,
    service,
  };
}

export async function uxApiAksPublicIp(
  publicIpName: string,
  resourceSuffix: string,
  nodeResourceGroup: Output<string>,
  location: string,
  tags: IUxApiTagPairs
) {
  const ipName = `${publicIpName}-${resourceSuffix}`;
  const staticAppIp = new PublicIp(ipName, {
    resourceGroupName: nodeResourceGroup,
    allocationMethod: 'Static',
    tags,
  });
  return staticAppIp;
}

// export async function uxApiAksLoadBalancer(
//   publicIpName: string,
//   publicIp: PublicIp,
//   resourceSuffix: string,
//   nodeResourceGroup: Output<string>,
//   tags: IUxApiTagPairs,
//   dependsOn: Resource[]
// ) {
//   const lb = new LoadBalancer(
//     `loadbalancer-${publicIpName}-${resourceSuffix}`,
//     {
//       frontendIpConfigurations: [
//         {
//           publicIpAddressId: publicIp.id,
//           name: `frontend-loadbalancer-${publicIpName}-${resourceSuffix}`,
//         },
//       ],
//       resourceGroupName: nodeResourceGroup,
//       tags,
//     },
//     {
//       dependsOn,
//     }
//   );
//   return lb;
// }

export function uxApiAksNamespace(
  location: string,
  provider: Provider,
  namespaceTag: string | Output<string>
) {
  const namespace = new Namespace(`${namespaceTag}-${location}`, undefined, {
    provider,
  });
  return namespace;
}

export async function uxApiAksService(
  publicIp: PublicIp,
  namespace: Namespace,
  resourceSuffix: string,
  provider: Provider,
  port: string | Output<string>,
  tags: IUxApiTagPairs,
  dependsOn: Resource[]
) {
  const port80: core.v1.ServicePort = {
    name: `${port}-80`,
    port: 80,
    protocol: 'TCP',
    targetPort: 4300,
  };
  const port443: core.v1.ServicePort = {
    ...port80,
    name: `${tags.port}-443`,
    port: 443,
  };

  const serviceName = `${tags.service}-${resourceSuffix}`;
  const service = new Service(
    serviceName,
    {
      apiVersion: 'v1',
      metadata: {
        // namespace: namespace.metadata.name,
        name: serviceName,
        labels: {
          app: tags.app,
          epic: tags.epic,
          service: tags.service,
        },
      },
      spec: {
        loadBalancerIP: publicIp.ipAddress,
        type: 'LoadBalancer',
        ports: [port80, port443],
        selector: {
          component: tags.component,
        },
      },
    },
    {
      dependsOn,
      provider,
    }
  );

  return service;
}

export function uxApiAksSecret(
  namespace: Namespace,
  secrets: IUxApiSecrets,
  resourceSuffix: string,
  tags: IUxApiTagPairs,
  provider: Provider,
  dependsOn: Resource[]
) {
  //const stringData: { [key: string]: Input<string> } = {};
  const output = Object.keys(secrets).map(k => {
    const stringData = {
      value: secrets[k as keyof IUxApiSecrets],
    };
    const name = `secret-uxapi-${resourceSuffix}-${k
      .toLocaleLowerCase()
      .replace(/\_/g, '-')}`;
    const secret = new Secret(
      name,
      {
        metadata: {
          name,
          // namespace: namespace.metadata.apply(m => m.name),
          labels: tags,
        },
        stringData,
      },
      {
        dependsOn,
        provider,
      }
    );

    return {
      var: {
        name: k,
        valueFrom: {
          secretKeyRef: {
            name,
            key: 'value',
          },
        },
      },
      secret,
    };
  });
  return output;
}

export function uxApiAksConfigMap(
  namespace: Namespace,
  configs: IUxApiConfigs,
  resourceSuffix: string,
  tags: IUxApiTagPairs,
  provider: Provider,
  dependsOn: Resource[]
) {
  //const stringData: { [key: string]: Input<string> } = {};
  const output = Object.keys(configs).map(k => {
    const data = {
      value: configs[k as keyof IUxApiConfigs],
    };
    const name = `configmap-uxapi-${resourceSuffix}-${k
      .toLocaleLowerCase()
      .replace(/\_/g, '-')}`;
    const configMap = new ConfigMap(
      name,
      {
        metadata: {
          name,
          // namespace: namespace.metadata.apply(m => m.name),
          labels: tags,
        },
        data,
      },
      {
        provider,
        dependsOn,
      }
    );

    return {
      var: {
        name: k,
        valueFrom: {
          configMapKeyRef: {
            name,
            key: 'value',
          },
        },
      },
      configMap,
    };
  });

  return output;

  // const data: { [key: string]: Input<string> } = {};
  // Object.keys(configs).forEach(k => {
  //   data[k] = configs[k as keyof IUxApiConfigs];
  // });
  // // console.log(data);

  // const configMap = new ConfigMap(
  //   `configmap-uxapi-${resourceSuffix}`,
  //   {
  //     metadata: {
  //       name: `configmap-uxapi-${resourceSuffix}`,
  //       namespace: namespace.metadata.name,
  //       labels: tags,
  //     },
  //     data,
  //   },
  //   {
  //     dependsOn,
  //   }
  // );

  // return configMap;
}
export function uxApiAksDeployment(
  namespace: Namespace,
  resourceSuffix: string,
  provider: Provider,
  image: string,
  secrets: core.v1.EnvVar[],
  configMaps: core.v1.EnvVar[],
  // originalSecrets: IUxApiSecrets,
  // originalConfigs: IUxApiConfigs,
  tags: IUxApiTagPairs,
  dependsOn: Resource[]
) {
  // const secretEnvs = secrets.map((secret: Secret) => ({
  //   valueFrom: {
  //     secretKeyRef: {
  //       name: secret.metadata.apply(m => m.name),
  //       key: 'value',
  //     },
  //   },
  // }));

  // const secretEnvs = Object.keys(secrets).map(name => ({
  //   name,
  //   valueFrom: {
  //     secretKeyRef: {
  //       name: secret.metadata.apply(m => m.name),
  //       key: name,
  //     },
  //   },
  // }));
  // const configEnvs = configMaps.map(configMap => ({
  //   name: configMap.data.apply(d => Object.keys(d)[0]),
  //   valueFrom: {
  //     configMapKeyRef: {
  //       name: configMap.metadata.apply(m => m.name),
  //       key: 'value',
  //     },
  //   },
  // }));

  const deploymentName = `${tags.deployment}-${resourceSuffix}`;
  const deployment = new Deployment(
    deploymentName,
    {
      apiVersion: 'apps/v1',
      metadata: {
        // namespace: namespace.metadata.name,
        name: deploymentName,
        labels: tags,
      },
      spec: {
        replicas: 2,
        selector: {
          matchLabels: {
            component: tags.component,
          },
        },
        template: {
          metadata: {
            labels: tags,
          },
          spec: {
            containers: [
              {
                name: tags.component,
                image,
                ports: [
                  {
                    name: 'http',
                    containerPort: 4300,
                  },
                ],
                resources: {
                  limits: {
                    cpu: '0.05',
                  },
                },
                env: [...secrets, ...configMaps],
              },
            ],
          },
        },
      },
    },
    {
      dependsOn,
      provider,
    }
  );
  return deployment;
}
