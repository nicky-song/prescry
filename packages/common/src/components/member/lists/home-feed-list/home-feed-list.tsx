// Copyright 2020 Prescryptive Health, Inc.

import React, { useEffect } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { ScheduleTestFeedItemConnected } from './feed-items/schedule-test-feed-item/schedule-test-feed-item.connected';
import { AddMembershipFeedItem } from './feed-items/add-membership-feed-item/add-membership-feed-item';
import {
  IFeedContext,
  IFeedItem,
} from '../../../../models/api-response/feed-response';
import { useInterval } from '../../../../hooks/use-interval/use-interval.hook';
import { ServiceTypes } from '../../../../models/provider-location';
import { CustomFeedItemConnected } from './feed-items/custom-feed-item/custom-feed-item.connected';
import { StaticFeedItem } from './feed-items/static-feed-item/static-feed-item';
import { IStaticFeedContextServiceItem } from '../../../../models/static-feed';
import { SmartPriceFeedItem } from './feed-items/smart-price-feed-item/smart-price-feed-item';
import { homeFeedListStyle } from './home-feed-list.style';
import { MedicineCabinetFeedItem } from './feed-items/medicine-cabinet-feed-item/medicine-cabinet-feed-item';
import { PastProceduresFeedItem } from './feed-items/test-results-feed-item/past-procedures-feed-item';
import { AppointmentsFeedItem } from './feed-items/appointments-feed-item/appointments-feed-item';
import { RootStackNavigationProp } from '../../../../experiences/guest-experience/navigation/stack-navigators/root/root.stack-navigator';
import { useNavigation } from '@react-navigation/native';
import { IGetFeedAsyncActionArgs } from '../../../../experiences/guest-experience/store/feed/async-actions/get-feed.async-action';
export interface IHomeFeedListOwnProps {
  isScreenCurrent: boolean;
}

export interface IHomeFeedListStateProps {
  feedItems: IFeedItem[];
  dataRefreshIntervalMilliseconds: number;
}

export interface IHomeFeedListDispatchProps {
  getFeedDataLoadingAsyncAction: (navigation: RootStackNavigationProp) => void;
  getFeedAsyncAction: (args: IGetFeedAsyncActionArgs) => void;
}

export type IHomeFeedListProps = IHomeFeedListStateProps &
  IHomeFeedListDispatchProps &
  IHomeFeedListOwnProps;

export interface IServiceProps {
  serviceType?: string;
  services?: IStaticFeedContextServiceItem[];
}

export interface IHomeFeedProps {
  key?: number;
  context?: IFeedContext;
  code?: string;
  title?: string;
  description?: string;
  viewStyle: StyleProp<ViewStyle>;
  testID?: string;
}

interface IFeedComponent {
  component: (props: IHomeFeedProps & IServiceProps) => React.ReactElement;
  isStatic?: boolean;
  serviceType?: string;
}

const availableFeedItemsMap = new Map<string, IFeedComponent>([
  [
    'scheduleTest',
    {
      component: (props: IHomeFeedProps & IServiceProps) => (
        <ScheduleTestFeedItemConnected {...props} />
      ),
      serviceType: ServiceTypes.antigen,
    },
  ],
  [
    'scheduleTestPCR',
    {
      component: (props: IHomeFeedProps & IServiceProps) => (
        <ScheduleTestFeedItemConnected {...props} />
      ),
      serviceType: ServiceTypes.pcr,
    },
  ],
  [
    'medicareAbbottAntigen',
    {
      component: (props: IHomeFeedProps & IServiceProps) => (
        <ScheduleTestFeedItemConnected {...props} />
      ),
      serviceType: ServiceTypes.medicareAbbottAntigen,
    },
  ],
  [
    'medicaidAbbottAntigen',
    {
      component: (props: IHomeFeedProps & IServiceProps) => (
        <ScheduleTestFeedItemConnected {...props} />
      ),
      serviceType: ServiceTypes.medicaidAbbottAntigen,
    },
  ],
  [
    'abbottAntigen',
    {
      component: (props: IHomeFeedProps & IServiceProps) => (
        <ScheduleTestFeedItemConnected {...props} />
      ),
      serviceType: ServiceTypes.abbottAntigen,
    },
  ],
  [
    'cashIdCard',
    {
      component: (props: IHomeFeedProps) => <SmartPriceFeedItem {...props} />,
    },
  ],
  [
    'testResults',
    {
      component: (props: IHomeFeedProps) => (
        <PastProceduresFeedItem {...props} />
      ),
    },
  ],
  [
    'addMembership',
    {
      component: (props: IHomeFeedProps) => (
        <AddMembershipFeedItem {...props} />
      ),
    },
  ],
  [
    'appointments',
    {
      component: (props: IHomeFeedProps) => <AppointmentsFeedItem {...props} />,
    },
  ],
  [
    'scheduleCovidVaccine',
    {
      component: (props: IHomeFeedProps & IServiceProps) => (
        <ScheduleTestFeedItemConnected {...props} />
      ),
      serviceType: ServiceTypes.c19Vaccine,
    },
  ],
  [
    'medicineCabinet',
    {
      component: (props: IHomeFeedProps) => (
        <MedicineCabinetFeedItem {...props} />
      ),
    },
  ],
]);

function renderFeedItem(
  feedItem: IFeedItem,
  index: number,
  totalItems: number
): React.ReactNode {
  const viewStyle: StyleProp<ViewStyle> = determineItemViewStyle(
    index,
    totalItems
  );

  const getCustomComponent = (): IFeedComponent => {
    return {
      component: (props: IHomeFeedProps) => <StaticFeedItem {...props} />,
    };
  };

  const getCustomServiceListComponent = (): IFeedComponent => {
    return {
      component: (props: IHomeFeedProps & IServiceProps) => (
        <CustomFeedItemConnected {...props} />
      ),
    };
  };

  const getCustomServiceTypeComponent = (): IFeedComponent => {
    return {
      component: (props: IHomeFeedProps & IServiceProps) => (
        <CustomFeedItemConnected {...props} />
      ),
      serviceType: feedItem.context?.defaultContext?.serviceType,
    };
  };

  const item =
    feedItem.context?.defaultContext?.type === 'static'
      ? getCustomComponent()
      : feedItem.context?.defaultContext?.services
      ? getCustomServiceListComponent()
      : feedItem.context?.defaultContext?.serviceType
      ? getCustomServiceTypeComponent()
      : availableFeedItemsMap.get(feedItem.feedCode);

  if (!item) {
    return null;
  }

  const prop: IHomeFeedProps & IServiceProps = {
    viewStyle,
    context: feedItem.context,
    code: feedItem.feedCode,
    title: feedItem.context?.defaultContext?.title || '',
    description: feedItem.context?.defaultContext?.description || '',
    serviceType: item.serviceType || undefined,
    key: index,
    testID: 'homeFeedItem-' + feedItem.feedCode,
  };
  const Component = item.component;
  return <Component {...prop} />;
}

function determineItemViewStyle(
  index: number,
  items: number
): StyleProp<ViewStyle> {
  const marginTopViewStyle: ViewStyle = index === 0 ? { marginTop: 0 } : {};
  const marginBottomViewStyle = index === items - 1 ? { marginBottom: 0 } : {};

  return [
    homeFeedListStyle.homeFeedListItemViewStyle,
    marginTopViewStyle,
    marginBottomViewStyle,
  ];
}

export const HomeFeedList = (props: IHomeFeedListProps) => {
  const navigation = useNavigation<RootStackNavigationProp>();

  useEffect(() => {
    if (props.feedItems.length === 0) {
      props.getFeedDataLoadingAsyncAction(navigation);
    }
  });

  useInterval<IGetFeedAsyncActionArgs>(
    props.getFeedAsyncAction,
    props.isScreenCurrent,
    props.dataRefreshIntervalMilliseconds,
    { navigation, refreshToken: false }
  );

  const totalitems = props.feedItems.length;
  return (
    <View style={homeFeedListStyle.homeFeedViewStyle} testID='homeFeedList'>
      {props.feedItems.map((item: IFeedItem, index: number) =>
        renderFeedItem(item, index, totalitems)
      )}
    </View>
  );
};
