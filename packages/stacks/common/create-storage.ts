import {
  IRxAssistantConfig,
  IAksConfig,
  IRxAssistantCluster,
} from './config.interfaces';
import { ICredentials } from './create-credentials';
import { createNetwork } from './create-network';
import { KubernetesCluster } from '@pulumi/azure/containerservice';
import { Provider, core } from '@pulumi/kubernetes';
import { ResourceGroup } from '@pulumi/azure/core';
import { Account as StorageAccount, Blob } from '@pulumi/azure/storage';
import { Endpoint, Profile } from '@pulumi/azure/cdn';
import { StorageStaticWebsite } from './storage-static-website';

export async function createStorageStaticWebsite(
  config: IRxAssistantConfig,
  clusterConfig: IAksConfig,
  credentials: ICredentials,
  resourceGroup: ResourceGroup
) {
  // Create a Storage Account for our static website
  const storageAccount = new StorageAccount(
    `storerxa${clusterConfig.location.name.replace(/-/g, '')}`,
    {
      resourceGroupName: resourceGroup.name,
      accountReplicationType: 'ZRS',
      accountTier: `Standard`,
      accountKind: `StorageV2`,
    }
  );

  // There's currently no way to enable the Static Web Site feature of a storage account via ARM
  // Therefore, we created a custom resource which wraps corresponding Azure CLI commands
  const staticWebsite = new StorageStaticWebsite(`website-static`, {
    accountName: storageAccount.name,
  });

  // Upload the files
  const files = [`index.html`, `404.html`].map(
    name =>
      new Blob(name, {
        name,
        resourceGroupName: resourceGroup.name,
        storageAccountName: storageAccount.name,
        storageContainerName: staticWebsite.webContainerName,
        type: `block`,
        source: `./wwwroot/${name}`,
        contentType: `text/html`,
      })
  );

  // Optionally, we can add a CDN in front of the website
  const cdn = new Profile(`website-cdn`, {
    resourceGroupName: resourceGroup.name,
    sku: `Standard_Microsoft`,
  });

  const endpoint = new Endpoint(`website-cdn-ep`, {
    resourceGroupName: resourceGroup.name,
    profileName: cdn.name,
    originHostHeader: staticWebsite.hostName,
    origins: [
      {
        name: `blobstorage`,
        hostName: staticWebsite.hostName,
      },
    ],
  });

  // CDN endpoint to the website.
  // Allow it some time after the deployment to get ready.
  const cdnUrl = `https://${endpoint.hostName}/`;

  return {
    cdn,
    cdnUrl,
    endpoint: staticWebsite.endpoint,
    files,
  };
}
