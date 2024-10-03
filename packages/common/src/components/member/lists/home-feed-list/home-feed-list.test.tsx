// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { SmartPriceFeedItem } from './feed-items/smart-price-feed-item/smart-price-feed-item';
import { ScheduleTestFeedItemConnected } from './feed-items/schedule-test-feed-item/schedule-test-feed-item.connected';
import { PastProceduresFeedItem } from './feed-items/test-results-feed-item/past-procedures-feed-item';
import { CustomFeedItemConnected } from './feed-items/custom-feed-item/custom-feed-item.connected';
import { HomeFeedList, IHomeFeedProps } from './home-feed-list';
import { AppointmentsFeedItem } from './feed-items/appointments-feed-item/appointments-feed-item';
import {
  IFeedContext,
  IFeedItem,
} from '../../../../models/api-response/feed-response';
import { IStaticFeedContextServiceItem } from '../../../../models/static-feed';
import { homeFeedListStyle } from './home-feed-list.style';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../../experiences/guest-experience/navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { AddMembershipFeedItem } from './feed-items/add-membership-feed-item/add-membership-feed-item';
import { useInterval } from '../../../../hooks/use-interval/use-interval.hook';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock(
  './feed-items/schedule-test-feed-item/schedule-test-feed-item.connected',
  () => ({ ScheduleTestFeedItemConnected: () => <div /> })
);

jest.mock(
  './feed-items/medicine-cabinet-feed-item/medicine-cabinet-feed-item',
  () => ({ MedicineCabinetFeedItem: () => <div /> })
);

jest.mock('./feed-items/smart-price-feed-item/smart-price-feed-item', () => ({
  SmartPriceFeedItem: () => <div />,
}));

jest.mock(
  './feed-items/add-membership-feed-item/add-membership-feed-item',
  () => ({
    AddMembershipFeedItem: () => <div />,
  })
);

jest.mock('./feed-items/custom-feed-item/custom-feed-item.connected', () => ({
  CustomFeedItemConnected: () => <div />,
}));

jest.mock('./feed-items/appointments-feed-item/appointments-feed-item', () => ({
  AppointmentsFeedItem: () => <div />,
}));

jest.mock('../../../../hooks/use-interval/use-interval.hook');
const useIntervalMock = useInterval as jest.Mock;

describe('HomeFeedList', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(rootStackNavigationMock);
  });

  it('renders in View with expected properties', () => {
    const viewStyle: ViewStyle = homeFeedListStyle.homeFeedViewStyle;
    const getFeedDataLoadingAsyncAction = jest.fn();
    const getFeedAsyncAction = jest.fn();
    const testRenderer = renderer.create(
      <HomeFeedList
        isScreenCurrent={true}
        feedItems={[]}
        getFeedDataLoadingAsyncAction={getFeedDataLoadingAsyncAction}
        getFeedAsyncAction={getFeedAsyncAction}
        dataRefreshIntervalMilliseconds={1000}
      />
    );
    const view = testRenderer.root.findByType(View);
    expect(view.props.style).toEqual(viewStyle);
  });

  it('renders COVID feed items', () => {
    const feedItems: IFeedItem[] = [
      { feedCode: 'welcomeMessageCovid' },
      { feedCode: 'appointments' },
      { feedCode: 'scheduleTest' },
      { feedCode: 'idCardCovid' },
      { feedCode: 'pastProcedures' },
      { feedCode: 'moreInfoStatic' },
    ];
    const getFeedDataLoadingAsyncAction = jest.fn();
    const getFeedAsyncAction = jest.fn();
    const testRenderer = renderer.create(
      <HomeFeedList
        isScreenCurrent={true}
        feedItems={feedItems}
        getFeedDataLoadingAsyncAction={getFeedDataLoadingAsyncAction}
        getFeedAsyncAction={getFeedAsyncAction}
        dataRefreshIntervalMilliseconds={1000}
      />
    );

    const view = testRenderer.root.findByType(View);
    const feedItemComponents = view.props.children;
    expect(feedItemComponents.length).toEqual(feedItems.length);
    feedItemComponents.forEach(
      (
        feedItemComponent: {
          props: IHomeFeedProps;
          type: () => React.ReactElement;
        },
        index: number
      ) => {
        switch (feedItems[index].feedCode) {
          case 'scheduleTest':
            expect(
              renderer
                .create(feedItemComponent.type())
                .root.findByType(ScheduleTestFeedItemConnected)
            ).toBeDefined();
            expect(feedItemComponent.props.viewStyle).toEqual([
              homeFeedListStyle.homeFeedListItemViewStyle,
              {},
              {},
            ]);
            expect(feedItemComponent.props.testID).toEqual(
              'homeFeedItem-' + feedItems[index].feedCode
            );
            break;
          case 'testResults':
            expect(
              renderer
                .create(feedItemComponent.type())
                .root.findByType(PastProceduresFeedItem)
            ).toBeDefined();
            expect(feedItemComponent.props.viewStyle).toEqual([
              homeFeedListStyle.homeFeedListItemViewStyle,
              {},
              {},
            ]);
            expect(feedItemComponent.props.testID).toEqual(
              'homeFeedItem-' + feedItems[index].feedCode
            );
            break;
          case 'appointments':
            expect(
              renderer
                .create(feedItemComponent.type())
                .root.findByType(AppointmentsFeedItem)
            ).toBeDefined();
            expect(feedItemComponent.props.viewStyle).toEqual([
              homeFeedListStyle.homeFeedListItemViewStyle,
              {},
              {},
            ]);
            expect(feedItemComponent.props.testID).toEqual(
              'homeFeedItem-' + feedItems[index].feedCode
            );
            break;
          case 'scheduleCovidVaccine':
            expect(
              renderer
                .create(feedItemComponent.type())
                .root.findByType(ScheduleTestFeedItemConnected)
            ).toBeDefined();
            expect(feedItemComponent.props.viewStyle).toEqual([
              homeFeedListStyle.homeFeedListItemViewStyle,
              {},
              {},
            ]);
            expect(feedItemComponent.props.testID).toEqual(
              'homeFeedItem-' + feedItems[index].feedCode
            );
            break;
        }
      }
    );
  });

  it('renders non-COVID feed items', () => {
    const feedItems: IFeedItem[] = [
      { feedCode: 'welcomeMessage' },
      { feedCode: 'idCard' },
      { feedCode: 'medicineCabinet' },
      { feedCode: 'memberInfo' },
      { feedCode: 'addMembership' },
      { feedCode: 'cashIdCard' },
    ];

    const getFeedDataLoadingAsyncAction = jest.fn();
    const getFeedAsyncAction = jest.fn();
    const testRenderer = renderer.create(
      <HomeFeedList
        isScreenCurrent={true}
        feedItems={feedItems}
        getFeedDataLoadingAsyncAction={getFeedDataLoadingAsyncAction}
        getFeedAsyncAction={getFeedAsyncAction}
        dataRefreshIntervalMilliseconds={1000}
      />
    );

    const view = testRenderer.root.findByType(View);
    const feedItemComponents = view.props.children;
    expect(feedItemComponents.length).toEqual(feedItems.length);

    feedItemComponents.forEach(
      (
        feedItemComponent: {
          props: IHomeFeedProps;
          type: () => React.ReactElement;
        },
        index: number
      ) => {
        switch (feedItems[index].feedCode) {
          case 'addMembership':
            expect(
              renderer
                .create(feedItemComponent.type())
                .root.findByType(AddMembershipFeedItem)
            ).toBeDefined();
            expect(feedItemComponent.props.viewStyle).toEqual([
              homeFeedListStyle.homeFeedListItemViewStyle,
              {},
              {},
            ]);
            expect(feedItemComponent.props.testID).toEqual(
              'homeFeedItem-' + feedItems[index].feedCode
            );
            break;

          case 'cashIdCard':
            expect(
              renderer
                .create(feedItemComponent.type())
                .root.findByType(SmartPriceFeedItem)
            ).toBeDefined();
            expect(feedItemComponent.props.viewStyle).toEqual([
              homeFeedListStyle.homeFeedListItemViewStyle,
              {},
              { marginBottom: 0 },
            ]);
            expect(feedItemComponent.props.testID).toEqual(
              'homeFeedItem-' + feedItems[index].feedCode
            );
            break;
        }
      }
    );
  });

  it('renders configurable feed items', () => {
    const scheduleVaccineAllContext = {
      defaultContext: {
        title: 'scheduleVaccineAll',
        description: 'Description for schedule Test',
        services: [
          {
            title: 'Rapid COVID-19 Antigen test',
            description: 'For NY state residents',
            minAge: 18,
            serviceType: 'abbott_antigen',
            markDownText:
              '* Tests for current infection\n* Less sensitive\n* Nasal swab\n* Same day result',
            cost: '$65',
            enabled: true,
          } as IStaticFeedContextServiceItem,
        ],
      },
    };
    const serviceTypeContext: IFeedContext = {
      defaultContext: {
        title: 'some title',
        description: 'description about card',
        serviceType: 'test service type',
      },
    };
    const feedItems: IFeedItem[] = [
      { feedCode: 'scheduleVaccineAll', context: scheduleVaccineAllContext },
      { feedCode: 'newServiceTypeCard', context: serviceTypeContext },
    ];

    const getFeedDataLoadingAsyncAction = jest.fn();
    const getFeedAsyncAction = jest.fn();
    const testRenderer = renderer.create(
      <HomeFeedList
        isScreenCurrent={true}
        feedItems={feedItems}
        getFeedDataLoadingAsyncAction={getFeedDataLoadingAsyncAction}
        getFeedAsyncAction={getFeedAsyncAction}
        dataRefreshIntervalMilliseconds={1000}
      />
    );

    const view = testRenderer.root.findByType(View);
    const feedItemComponents = view.props.children;
    expect(feedItemComponents.length).toEqual(feedItems.length);

    feedItemComponents.forEach(
      (
        feedItemComponent: {
          props: IHomeFeedProps;
          type: () => React.ReactElement;
        },
        index: number
      ) => {
        if (feedItems[index].context?.defaultContext?.services) {
          expect(
            renderer
              .create(feedItemComponent.type())
              .root.findByType(CustomFeedItemConnected)
          ).toBeDefined();
          expect(feedItemComponent.props.viewStyle).toEqual([
            homeFeedListStyle.homeFeedListItemViewStyle,
            { marginTop: 0 },
            {},
          ]);
          expect(feedItemComponent.props.testID).toEqual(
            'homeFeedItem-' + feedItems[index].feedCode
          );
        } else if (feedItems[index].context?.defaultContext?.serviceType) {
          expect(
            renderer
              .create(feedItemComponent.type())
              .root.findByType(CustomFeedItemConnected)
          ).toBeDefined();
          expect(feedItemComponent.props.viewStyle).toEqual([
            homeFeedListStyle.homeFeedListItemViewStyle,
            {},
            { marginBottom: 0 },
          ]);
          expect(feedItemComponent.props.testID).toEqual(
            'homeFeedItem-' + feedItems[index].feedCode
          );
        }
      }
    );
  });
  it('set useInterval hook with correct parameter', () => {
    const getFeedDataLoadingAsyncAction = jest.fn();
    const getFeedAsyncAction = jest.fn();
    renderer.create(
      <HomeFeedList
        isScreenCurrent={true}
        feedItems={[]}
        getFeedDataLoadingAsyncAction={getFeedDataLoadingAsyncAction}
        getFeedAsyncAction={getFeedAsyncAction}
        dataRefreshIntervalMilliseconds={1000}
      />
    );

    expect(useIntervalMock).toHaveBeenCalledWith(
      getFeedAsyncAction,
      true,
      1000,
      { navigation: rootStackNavigationMock, refreshToken: false }
    );
  });
});
