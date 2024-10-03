// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import { ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { ISessionContext } from '../../../../experiences/guest-experience/context-providers/session/session.context';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { useSessionContext } from '../../../../experiences/guest-experience/context-providers/session/use-session-context.hook';
import { defaultSessionState } from '../../../../experiences/guest-experience/state/session/session.state';
import { ISignUpContent } from '../../../../models/cms-content/sign-up.ui-content';
import { getChildren } from '../../../../testing/test.helper';
import { List } from '../../../primitives/list';
import { IllustratedListItem } from '../../list-items/illustrated/illustrated.list-item';
import { BenefitsList } from './benefits.list';
import { benefitsListStyles } from './benefits.list.styles';

jest.mock('../../list-items/illustrated/illustrated.list-item', () => ({
  IllustratedListItem: () => <div />,
}));

jest.mock(
  '../../../../experiences/guest-experience/context-providers/session/use-session-context.hook'
);
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock(
  '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const uiContentMock: Partial<ISignUpContent> = {
  pbmBenefit1: 'pbm-benefit-1-mock',
  pbmBenefit2: 'pbm-benefit-2-mock',
  pbmBenefit3: 'pbm-benefit-3-mock',
};

describe('BenefitsList', () => {
  beforeEach(() => {
    const sesssionContextMock: ISessionContext = {
      sessionDispatch: jest.fn(),
      sessionState: defaultSessionState,
    };
    useSessionContextMock.mockReturnValue(sesssionContextMock);
    useContentMock.mockReturnValue({
      content: uiContentMock,
      isContentLoading: false,
    });
  });
  it('renders as list', () => {
    const customViewStyle: ViewStyle = { width: 1 };
    const testRenderer = renderer.create(
      <BenefitsList viewStyle={customViewStyle} />
    );

    const list = testRenderer.root.children[0] as ReactTestInstance;

    expect(list.type).toEqual(List);
    expect(list.props.style).toEqual(customViewStyle);
    expect(getChildren(list).length).toEqual(3);
  });

  it('renders "Shop and compare" item', () => {
    const testRenderer = renderer.create(<BenefitsList />);

    const list = testRenderer.root.findByType(List);
    const shopAndCompareItem = getChildren(list)[0];

    expect(shopAndCompareItem.type).toEqual(IllustratedListItem);
    expect(shopAndCompareItem.props.description).toEqual(
      uiContentMock.pbmBenefit1
    );
    expect(shopAndCompareItem.props.imageName).toEqual('pillCartIcon');
    expect(shopAndCompareItem.props.imageStyle).toEqual(
      benefitsListStyles.itemImageStyle
    );
    expect(shopAndCompareItem.props.isSkeleton).toEqual(false);
  });

  it('renders "Know your expenses" item', () => {
    const testRenderer = renderer.create(<BenefitsList />);

    const list = testRenderer.root.findByType(List);
    const knowYourExpensesItem = getChildren(list)[1];

    expect(knowYourExpensesItem.type).toEqual(IllustratedListItem);
    expect(knowYourExpensesItem.props.description).toEqual(
      uiContentMock.pbmBenefit2
    );
    expect(knowYourExpensesItem.props.imageName).toEqual('dollarMagnifier');
    expect(knowYourExpensesItem.props.imageStyle).toEqual(
      benefitsListStyles.itemImageStyle
    );
    expect(knowYourExpensesItem.props.viewStyle).toEqual(
      benefitsListStyles.middleItemViewStyle
    );
    expect(knowYourExpensesItem.props.isSkeleton).toEqual(false);
  });

  it('renders "Own your prescriptions" item', () => {
    const testRenderer = renderer.create(<BenefitsList />);

    const list = testRenderer.root.findByType(List);
    const ownYourPrescriptionsItem = getChildren(list)[2];

    expect(ownYourPrescriptionsItem.type).toEqual(IllustratedListItem);
    expect(ownYourPrescriptionsItem.props.description).toEqual(
      uiContentMock.pbmBenefit3
    );
    expect(ownYourPrescriptionsItem.props.imageName).toEqual('pillHandIcon');
    expect(ownYourPrescriptionsItem.props.imageStyle).toEqual(
      benefitsListStyles.itemImageStyle
    );
    expect(ownYourPrescriptionsItem.props.isSkeleton).toEqual(false);
  });
});
