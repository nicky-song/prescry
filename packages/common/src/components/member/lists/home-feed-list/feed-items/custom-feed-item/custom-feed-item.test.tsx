// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { CustomFeedItem, ICustomFeedItemDataProps } from './custom-feed-item';
import { TitleDescriptionCardItem } from '../../../../items/title-description-card-item/title-description-card-item';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../../../../experiences/guest-experience/navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock(
  '../../../../items/title-description-card-item/title-description-card-item',
  () => ({
    TitleDescriptionCardItem: () => <div />,
  })
);

describe('CustomFeedItem', () => {
  beforeEach(() => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);
  });

  it('renders in HomeFeedItem with expected properties(serviceType)', () => {
    const viewStyle: ViewStyle = {
      backgroundColor: 'black',
    };
    const navigateActionMock = jest.fn();

    const props: ICustomFeedItemDataProps = {
      viewStyle,
      context: {
        defaultContext: {
          title: 'title',
          description: 'description',
          serviceType: 'some service type',
        },
      },
    };

    const testRenderer = renderer.create(
      <CustomFeedItem {...props} navigateAction={navigateActionMock} />
    );

    const homeFeedItem = testRenderer.root.findByType(TitleDescriptionCardItem);
    expect(homeFeedItem.props.context.defaultContext.title).toEqual('title');
    expect(homeFeedItem.props.context.defaultContext.description).toEqual(
      'description'
    );
    expect(homeFeedItem.props.context.defaultContext.serviceType).toEqual(
      'some service type'
    );
    expect(homeFeedItem.props.onPress).toEqual(expect.any(Function));

    expect(homeFeedItem.props.context.defaultContext.services).toBeUndefined();
  });

  it('renders in HomeFeedItem with expected properties(services)', () => {
    const viewStyle: ViewStyle = {
      backgroundColor: 'black',
    };
    const navigateAction = jest.fn();

    const props: ICustomFeedItemDataProps = {
      viewStyle,
      context: {
        defaultContext: {
          title: 'title',
          description: 'description',
          services: [
            {
              title: 'Book a COVID vaccine appointment',
              description: 'For NY state residents',
              enabled: true,
              subText: [
                {
                  language: 'English',
                  markDownText: 'subtext-english-markdown-text-1-mock',
                },
                {
                  language: 'Spanish',
                  markDownText: 'subtext-spanish-markdown-text-1-mock',
                },
              ],
              minAge: 18,
              serviceType: 'C19Vaccine',
            },
          ],
        },
      },
    };

    const testRenderer = renderer.create(
      <CustomFeedItem {...props} navigateAction={navigateAction} />
    );

    const homeFeedItem = testRenderer.root.findByType(TitleDescriptionCardItem);
    expect(homeFeedItem.props.context.defaultContext.title).toEqual('title');
    expect(homeFeedItem.props.context.defaultContext.description).toEqual(
      'description'
    );
    expect(homeFeedItem.props.context.defaultContext.services).toEqual([
      {
        description: 'For NY state residents',
        enabled: true,
        subText: [
          {
            language: 'English',
            markDownText: 'subtext-english-markdown-text-1-mock',
          },
          {
            language: 'Spanish',
            markDownText: 'subtext-spanish-markdown-text-1-mock',
          },
        ],
        minAge: 18,
        serviceType: 'C19Vaccine',
        title: 'Book a COVID vaccine appointment',
      },
    ]);
    expect(homeFeedItem.props.onPress).toEqual(expect.any(Function));
    expect(
      homeFeedItem.props.context.defaultContext.serviceType
    ).toBeUndefined();
  });

  it.todo('handles feed item press');
});
