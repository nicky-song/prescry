// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View, Text } from 'react-native';
import { learnMoreBulletStyle as styles } from './learn-more-bullets.style';
import { LearnMoreBullets } from './learn-more-bullets';
import { MarkdownText } from '../../text/markdown-text/markdown-text';

jest.mock('../../image-asset/image-asset');
jest.mock('react-native-markdown-display', () => '');

describe('LearnMoreBullets', () => {
  it('renders in view container', () => {
    const testRenderer = renderer.create(
      <LearnMoreBullets
        title='The title'
        bulletPoints={['a', 'b', 'c']}
        testID='testID'
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;
    expect(container.props.style).toEqual(styles.renderContainer);
    expect(container.props.testID).toEqual('testID');

    const title = container.props.children[0];
    expect(title.type).toEqual(Text);
    expect(title.props.style).toEqual(styles.titleTextStyle);
    expect(title.props.children).toEqual('The title');

    container.props.children.forEach(
      (bulletWrapper: ReactTestInstance[], index: number) => {
        if (index !== 0) {
          const currentText = index === 1 ? 'a' : index === 2 ? 'b' : 'c';
          expect(bulletWrapper[0].type).toEqual(View);
          expect(bulletWrapper[0].props.style).toEqual(styles.pointViewStyle);
          const bullet = bulletWrapper[0].props.children[0];
          expect(bullet.type).toEqual(View);
          expect(bullet.props.style).toEqual(styles.bulletViewStyle);
          const bulletText = bulletWrapper[0].props.children[1];
          expect(bulletText.type).toEqual(Text);
          expect(bulletText.props.style).toEqual(styles.bulletTextStyle);
          expect(bulletText.props.children).toEqual(currentText);
        }
      }
    );
  });

  it('renders a markdown hyperlink in bullet if provided', () => {
    const mockBulletPoint = 'this has a [HERE](https://www.google.com)';
    const testRenderer = renderer.create(
      <LearnMoreBullets
        title='The title'
        bulletPoints={[mockBulletPoint, 'simple text']}
        testID='testID'
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    const markDownBulletContainer = container.props.children[1];
    expect(markDownBulletContainer[0].type).toEqual(View);
    expect(markDownBulletContainer[0].props.style).toEqual(
      styles.pointViewStyle
    );
    expect(markDownBulletContainer[1].type).toEqual(View);
    expect(markDownBulletContainer[1].props.style).toEqual(
      styles.lastPointViewStyle
    );

    const purpleCircle = markDownBulletContainer[0].props.children[0];
    expect(purpleCircle.type).toEqual(View);
    expect(purpleCircle.props.style).toEqual(styles.bulletViewStyle);

    const bulletText = markDownBulletContainer[0].props.children[1];
    expect(bulletText.type).toEqual(Text);

    const markdownBullet = bulletText.props.children;
    expect(markdownBullet.type).toEqual(MarkdownText);
    expect(markdownBullet.props.markdownTextStyle).toEqual(
      styles.markDownLinkTextStyle
    );
    expect(markdownBullet.props.onLinkPress.name).toEqual('linkTo');
    expect(markdownBullet.props.children).toEqual(mockBulletPoint);
  });

  it('renders a simple text bullet', () => {
    const testRenderer = renderer.create(
      <LearnMoreBullets
        title='The title'
        bulletPoints={['simple text']}
        testID='testID'
      />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    const simpleTextBulletContainer = container.props.children[1];
    expect(simpleTextBulletContainer[0].type).toEqual(View);
    expect(simpleTextBulletContainer[0].props.style).toEqual(
      styles.lastPointViewStyle
    );

    const simpleTextPurpleCircle =
      simpleTextBulletContainer[0].props.children[0];
    expect(simpleTextPurpleCircle.type).toEqual(View);
    expect(simpleTextPurpleCircle.props.style).toEqual(styles.bulletViewStyle);

    const simpleBulletText = simpleTextBulletContainer[0].props.children[1];
    expect(simpleBulletText.type).toEqual(Text);
    expect(simpleBulletText.props.children).toEqual('simple text');
  });
});
