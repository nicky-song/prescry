#!/bin/bash

AKS_RESOURCE_GROUP="rg-k8s-svc1-westus-test"
AKS_CLUSTER_NAME="k8s-svc1-westus-test"
ACR_RESOURCE_GROUP="rg-test-infra"
ACR_NAME="phxtest"
ACR_FULLNAME="phxtest.azurecr.io"

SERVICE_PRINCIPAL_NAME="sp-azurecr-k8s-svc1-westus-test"
EMAIL="davids@prescryptive.com"


# Get the id of the service principal configured for AKS
CLIENT_ID=$(az aks show --resource-group $AKS_RESOURCE_GROUP --name $AKS_CLUSTER_NAME --query "servicePrincipalProfile.clientId" --output tsv)

# Get the ACR registry resource id
ACR_ID=$(az acr show --name $ACR_NAME --resource-group $ACR_RESOURCE_GROUP --query "id" --output tsv)

# Create role assignment
az role assignment create --assignee $CLIENT_ID --role acrpull --scope $ACR_ID


# Populate the ACR login server and resource id.
ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
ACR_REGISTRY_ID=$(az acr show --name $ACR_NAME --query id --output tsv)

# Create acrpull role assignment with a scope of the ACR resource.
SP_PASSWD=$(az ad sp create-for-rbac --name http://$SERVICE_PRINCIPAL_NAME --role acrpull --scopes $ACR_REGISTRY_ID --query password --output tsv)

# Get the service principal client id.
CLIENT_ID=$(az ad sp show --id http://$SERVICE_PRINCIPAL_NAME --query appId --output tsv)

# Output used when creating Kubernetes secret.
echo "Service principal ID: $CLIENT_ID"
echo "Service principal password: $SP_PASSWD"

echo "kubectl create secret docker-registry acr-auth --docker-server $ACR_FULLNAME --docker-username $CLIENT_ID --docker-password $SP_PASSWD --docker-email $EMAIL"
kubectl create secret docker-registry acr-auth --docker-server "$ACR_FULLNAME" --docker-username "$CLIENT_ID" --docker-password "SP_PASSWD" --docker-email "$EMAIL"
