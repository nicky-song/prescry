// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { HtmlView } from './html-view';
import { ScrollView, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { getChildren } from '../../../testing/test.helper';

describe('HTMLView', () => {
  it('renders as View', () => {
    const viewStyleMock = {
      margin: '1px',
    };
    const maxHeightMock = '10px';
    const testIDMock = 'html-view-test-id';
    const testRenderer = renderer.create(
      <HtmlView
        htmlContent=''
        viewStyle={viewStyleMock}
        maxHeight={maxHeightMock}
        testID={testIDMock}
      />
    );

    const view = testRenderer.root.children[0] as ReactTestInstance;
    const numOfViews = testRenderer.root.children.length;
    const numOfScrollViews = getChildren(view).length;

    expect(view.type).toEqual(View);
    expect(view.props.testID).toEqual(testIDMock);
    expect(numOfViews).toBe(1);
    expect(numOfScrollViews).toBe(1);
    expect(view.props.style).toEqual([
      viewStyleMock,
      { maxHeight: maxHeightMock },
    ]);
  }),
    it('renders as ScrollView', () => {
      const testIDMock = 'html-view-test-id';
      const testRenderer = renderer.create(
        <HtmlView htmlContent='' testID={testIDMock} />
      );

      const scrollView = testRenderer.root.findByType(ScrollView);
      const numOfHtmlViews = getChildren(scrollView).length;

      expect(scrollView.type).toEqual(ScrollView);
      expect(numOfHtmlViews).toBe(1);
    }),
    it('renders as HTMLView', () => {
      const htmlContentMock = '<div>test div</div>';
      const jsonHtmlCssMock = '{"a": {"color": "#FF3366"}}';
      const testRenderer = renderer.create(
        <HtmlView htmlContent={htmlContentMock} jsonHtmlCss={jsonHtmlCssMock} />
      );

      const scrollView = testRenderer.root.findByType(ScrollView);
      const htmlView = getChildren(scrollView)[0];

      expect(htmlView.type).toEqual(HTMLView);
      expect(htmlView.props.value).toEqual(htmlContentMock);
      expect(htmlView.props.stylesheet).toEqual(JSON.parse(jsonHtmlCssMock));
    });
});
