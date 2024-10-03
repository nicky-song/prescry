// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { Text, View } from 'react-native';
import { MessageContainer } from './message-container';
import { messageContainerStyles } from './message-container.style';
import { MarkdownText } from '../../text/markdown-text/markdown-text';
import { messageContainerContent } from './message-container.content';
import { ITestContainer } from '../../../testing/test.container';

jest.mock('../../text/markdown-text/markdown-text', () => ({
  MarkdownText: ({ children }: ITestContainer) => <div>{children}</div>,
}));

const messageContainerProps = {
  headerText: 'header',
  bodyText: 'body',
};

describe('Message ', () => {
  it('renders correctly when props supplied', () => {
    const messageContainer = renderer.create(
      <MessageContainer {...messageContainerProps} />
    );
    const header = messageContainer.root.findByType(Text);
    const body = messageContainer.root.findByType(MarkdownText);
    const container = messageContainer.root.findByType(View);

    expect(container.props.style).toEqual([
      messageContainerStyles.messageContainerViewStyle,
      undefined,
    ]);
    expect(header.props.children).toEqual(messageContainerProps.headerText);
    expect(header.props.style).toEqual([
      messageContainerStyles.messageContainerTextStyle,
      undefined,
      messageContainerStyles.messageContainerHeaderTextStyle,
    ]);
    expect(body.props.textStyle).toEqual(
      messageContainerStyles.messageContainerTextStyle
    );
    expect(body.props.children).toEqual(messageContainerProps.bodyText);
  });

  it('renders correctly with defaults', () => {
    const messageContainer = renderer.create(<MessageContainer />);
    const header = messageContainer.root.findByType(Text);
    const body = messageContainer.root.findByType(MarkdownText);
    const container = messageContainer.root.findByType(View);

    expect(container.props.style).toEqual([
      messageContainerStyles.messageContainerViewStyle,
      undefined,
    ]);
    expect(header.props.children).toEqual(
      messageContainerContent.defaultHeaderText
    );
    expect(header.props.style).toEqual([
      messageContainerStyles.messageContainerTextStyle,
      undefined,
      messageContainerStyles.messageContainerHeaderTextStyle,
    ]);
    expect(body.props.textStyle).toEqual(
      messageContainerStyles.messageContainerTextStyle
    );
    expect(body.props.children).toEqual(
      messageContainerContent.defaultBodyText
    );
  });
});
