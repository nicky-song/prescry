// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { PrescriptionTagList } from './prescription-tag-list';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { TagList } from '../../lists/tag/tag.list';
import { prescriptionTagListStyles } from './prescription-tag-list.styles';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';

jest.mock('../../lists/tag/tag.list', () => ({
  TagList: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const viewStyleMock = {};

const savingsAmountMock = 7.77;

const planSavesTagLabelMock = 'plan-saves-tag-label-mock';
const memberSavesTagLabelMock = 'member-saves-tag-label-mock';
const combinationTagLabelMock = 'combination-tag-label-mock';

describe('PrescriptionTagList', () => {
  beforeEach(() => {
    useContentMock.mockReturnValue({
      content: {
        planSavesTagLabel: planSavesTagLabelMock,
        memberSavesTagLabel: memberSavesTagLabelMock,
        combinationTagLabel: combinationTagLabelMock,
      },
      isContentLoading: false,
    });
  });

  it('renders as undefined when all props (except viewStyle) are undefined', () => {
    const testRenderer = renderer.create(
      <PrescriptionTagList
        memberSaves={0}
        planSaves={0}
        viewStyle={viewStyleMock}
      />
    );

    const tagList = testRenderer.root.children[0] as ReactTestInstance;

    expect(tagList).toBeUndefined();
  });

  it('renders as TagList with expected viewStyle and tagList', () => {
    const testRenderer = renderer.create(
      <PrescriptionTagList
        memberSaves={7}
        planSaves={0}
        viewStyle={viewStyleMock}
      />
    );

    const tagList = testRenderer.root.children[0] as ReactTestInstance;

    expect(tagList.type).toEqual(TagList);
    expect(tagList.props.viewStyle).toEqual(viewStyleMock);
    expect(tagList.props.tags).toBeDefined();
  });

  it('renders with Plan Saves Tag with Plan Saves $... text when planSaves', () => {
    const testRenderer = renderer.create(
      <PrescriptionTagList memberSaves={0} planSaves={savingsAmountMock} />
    );

    const tagList = testRenderer.root.children[0] as ReactTestInstance;

    expect(tagList.type).toEqual(TagList);
    expect(tagList.props.tags).toEqual([expect.any(Object)]);

    const planSavesTagProps = tagList.props.tags[0];

    expect(planSavesTagProps.label).toEqual(
      `${planSavesTagLabelMock} ${MoneyFormatter.format(
        savingsAmountMock,
        true
      )}`
    );
    expect(planSavesTagProps.labelTextStyle).toEqual(
      prescriptionTagListStyles.planSavesTagTextStyle
    );
    expect(planSavesTagProps.isSkeleton).toEqual(false);
    expect(planSavesTagProps.viewStyle).toEqual(
      prescriptionTagListStyles.planSavesTagViewStyle
    );
  });

  it('renders with Member Saves Tag with Save $... text when memberSaves', () => {
    const testRenderer = renderer.create(
      <PrescriptionTagList memberSaves={savingsAmountMock} planSaves={0} />
    );

    const tagList = testRenderer.root.children[0] as ReactTestInstance;

    expect(tagList.type).toEqual(TagList);
    expect(tagList.props.tags).toEqual([expect.any(Object)]);

    const memberSavesTagProps = tagList.props.tags[0];

    expect(memberSavesTagProps.label).toEqual(
      `${memberSavesTagLabelMock} ${MoneyFormatter.format(
        savingsAmountMock,
        true
      )}`
    );
    expect(memberSavesTagProps.labelTextStyle).toEqual(
      prescriptionTagListStyles.memberSavesTagTextStyle
    );
    expect(memberSavesTagProps.isSkeleton).toEqual(false);
    expect(memberSavesTagProps.viewStyle).toEqual(
      prescriptionTagListStyles.memberSavesTagViewStyle
    );
  });

  it('does not render tags if savings amount is < $1', () => {
    const testRenderer = renderer.create(
      <PrescriptionTagList memberSaves={0.99} planSaves={0} />
    );

    const tagList = testRenderer.root.children[0] as ReactTestInstance;

    expect(tagList.type).toEqual(TagList);
    expect(tagList.props.tags).toEqual([]);
  });

  it('renders savingsAmount with no decimals if integer', () => {
    const testRenderer = renderer.create(
      <PrescriptionTagList memberSaves={0} planSaves={1} />
    );

    const tagList = testRenderer.root.children[0] as ReactTestInstance;

    expect(tagList.type).toEqual(TagList);
    expect(tagList.props.tags).toEqual([expect.any(Object)]);

    const planSavesTagProps = tagList.props.tags[0];

    expect(planSavesTagProps.label).toEqual(`${planSavesTagLabelMock} $${1}`);
    expect(planSavesTagProps.labelTextStyle).toEqual(
      prescriptionTagListStyles.planSavesTagTextStyle
    );
    expect(planSavesTagProps.isSkeleton).toEqual(false);
    expect(planSavesTagProps.viewStyle).toEqual(
      prescriptionTagListStyles.planSavesTagViewStyle
    );
  });
});
