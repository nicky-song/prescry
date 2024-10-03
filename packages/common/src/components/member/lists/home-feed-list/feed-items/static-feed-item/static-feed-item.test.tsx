// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer from 'react-test-renderer';
import { HomeFeedItem } from '../../home-feed-item';
import { IStaticFeedItemDataProps, StaticFeedItem } from './static-feed-item';
import { MarkdownText } from '../../../../../text/markdown-text/markdown-text';
import { stylesheet } from '../../../../../../theming/member/stylesheet';
import { ITestContainer } from '../../../../../../testing/test.container';

jest.mock('../../../../../text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

describe('StaticFeedItem', () => {
  it('renders in HomeFeedItem with expected properties', () => {
    const viewStyle: ViewStyle = {
      backgroundColor: 'blue',
    };

    const content = '[test link](some url)';
    const testIdMock = 'test-id-mock';

    const props: IStaticFeedItemDataProps = {
      viewStyle,
      context: {
        defaultContext: {
          markDownText: '[test link](some url)',
        },
      },
      testID: testIdMock,
    };

    const testRenderer = renderer.create(<StaticFeedItem {...props} />);

    const homeFeedItem = testRenderer.root.findByType(HomeFeedItem);
    expect(homeFeedItem.props.description.type).toEqual(MarkdownText);
    expect(homeFeedItem.props.description.props.children).toEqual(content);
    expect(homeFeedItem.props.description.props.textStyle).toEqual(
      stylesheet.homeFeedStaticItemTextStyle
    );
    expect(homeFeedItem.props.viewStyle).toEqual(viewStyle);
    expect(homeFeedItem.props.isStatic).toEqual(true);
    expect(homeFeedItem.props.testID).toEqual(testIdMock);
  });
});
