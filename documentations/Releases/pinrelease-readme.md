# Steps to do before PIN functionality is released

## Redis

A new resource needs to be created for redis.

1. First create a resource group and then a resource under it. Go to
   portal.azure.com and click on "Resource Groups", click on Add and select
   appropriate subscription. The naming convention for resource group is
   **rg-redis-app-region-test** rg: for resource group redis: type of resource
   appname: application that is using the resource region: location of the
   resource test: subscription name

2. Create a new resource under this new resource group naming convention for
   resource is **redis-app-region-test** redis: type of resource appname:
   application that is using the resource region: location of the resource test:
   subscription name

Copy the host and Primary key

## Account Collection

In Cosmos DB, select correct environment for database, under Data Explorer,
select RxAssistant database. Create a new collection name "Account" in this
database. Use phoneNumber as shard key

## Update Pipeline

In dev.azure.com, under pipeline, select correct environment to update. Under
RxAssistant, for "prescryptive-experiences-guestmember-experience" pipeline, add
the 2 new variables REDIS_HOST, REDIS_PASS with the correct values

## Create new topic

In portal.azure.com, under the correct service bus (phx-sb-westus-test is for
test environment), create a new topic topic-account-update

## Update frontdoor to allow v2 version of API

## Update version of API to v2 in UX by setting usepin feature to true
