// Copyright 2021 Prescryptive Health, Inc.

import { FeatureSwitch } from '@phx/common/src/experiences/guest-experience/guest-experience-features';
import { IFeedItem } from '@phx/common/src/models/api-response/feed-response';
import { IFeedItemParams } from './get-feed-item-context';
import { getDefaultContextFeedItem } from './get-default-context-feed-item';

export const getFeedItemForContextServiceList = (
  params: IFeedItemParams,
  age: number
): IFeedItem[] => {
  const { feed, dateOfBirth, features } = params;
  if (feed.context && dateOfBirth) {
    if (feed.context.minAge && age < feed.context.minAge) {
      return [];
    }
    const serviceList = feed.context.serviceList || [];
    const filteredServiceList = serviceList.filter((service) => {
      const ageCheck =
        (service.minAge && age >= service.minAge) || !service.minAge;
      const featureCheck =
        (service.featureFlag &&
          features[service.featureFlag as FeatureSwitch]) ||
        !service.featureFlag;
      return ageCheck && featureCheck && service.enabled;
    });
    if (filteredServiceList.length > 0)
      return [getDefaultContextFeedItem(params.feed, filteredServiceList)];
  }
  return [];
};
