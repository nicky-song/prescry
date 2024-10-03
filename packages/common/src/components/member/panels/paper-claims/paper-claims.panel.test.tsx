// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle, View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../../testing/test.helper';
import { ProtectedView } from '../../../containers/protected-view/protected-view';
import { BaseText } from '../../../text/base-text/base-text';
import { PaperClaimsPanel } from './paper-claims.panel';
import { paperClaimsPanelContent } from './paper-claims.panel.content';
import { paperClaimsPanelStyles } from './paper-claims.panel.styles';

describe('PaperClaimsPanel', () => {
  it('renders in View container', () => {
    const customViewStyle: ViewStyle = {
      width: 1,
    };
    const testRenderer = renderer.create(
      <PaperClaimsPanel viewStyle={customViewStyle} />
    );

    const container = testRenderer.root.children[0] as ReactTestInstance;

    expect(container.type).toEqual(View);
    expect(container.props.testID).toEqual('PaperClaimsPanel');
    expect(container.props.style).toEqual(customViewStyle);
    expect(getChildren(container).length).toEqual(2);
  });

  it('renders title', () => {
    const testRenderer = renderer.create(<PaperClaimsPanel />);

    const container = testRenderer.root.findByProps({
      testID: 'PaperClaimsPanel',
    });
    const title = getChildren(container)[0];

    expect(title.type).toEqual(BaseText);
    expect(title.props.children).toEqual(paperClaimsPanelContent.title);
  });

  it('renders address container', () => {
    const testRenderer = renderer.create(<PaperClaimsPanel />);

    const container = testRenderer.root.findByProps({
      testID: 'PaperClaimsPanel',
    });
    const addressContainer = getChildren(container)[1];

    expect(addressContainer.type).toEqual(ProtectedView);
    expect(addressContainer.props.testID).toEqual('address');
    expect(addressContainer.props.style).toEqual(
      paperClaimsPanelStyles.addressViewStyle
    );
    expect(getChildren(addressContainer).length).toEqual(4);
  });

  it('renders address components', () => {
    const testRenderer = renderer.create(<PaperClaimsPanel />);

    const addressContainer = testRenderer.root.findByProps({
      testID: 'address',
    });

    const addressContent = [
      paperClaimsPanelContent.phx,
      paperClaimsPanelContent.attention,
      paperClaimsPanelContent.postalBox,
      paperClaimsPanelContent.cityStateZip,
    ];

    addressContent.forEach((content, index) => {
      const addressComponent = getChildren(addressContainer)[index];

      expect(addressComponent.type).toEqual(BaseText);
      expect(addressComponent.props.style).toEqual(
        paperClaimsPanelStyles.addressTextStyle
      );
      expect(addressComponent.props.children).toEqual(content);
    });
  });
});
