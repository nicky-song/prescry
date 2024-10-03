// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { Heading } from '../../../../components/member/heading/heading';
import { SlideUpModal } from '../../../../components/modal/slide-up/slide-up.modal';
import { List } from '../../../../components/primitives/list';
import { ListItem } from '../../../../components/primitives/list-item';
import { BaseText } from '../../../../components/text/base-text/base-text';
import { IContentWithIsLoading } from '../../../../models/cms-content/content-with-isloading.model';
import { ITestContainer } from '../../../../testing/test.container';
import { getChildren } from '../../../../testing/test.helper';
import { useContent } from '../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../state/cms-content/cms-group-key';
import { PrescriptionBenefitPlanLearnMoreModal } from './prescription-benefit-plan-learn-more.modal';
import { IPrescriptionBenefitPlanLearnMoreModal } from './prescription-benefit-plan-learn-more.modal.content';
import { prescriptionBenefitPlanScreenStyles } from './prescription-benefit-plan.screen.styles';

jest.mock('../../context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

jest.mock('../../../../components/modal/slide-up/slide-up.modal', () => ({
  SlideUpModal: ({ children }: ITestContainer) => <div>{children}</div>,
}));

const onPressMock = jest.fn();

describe('PrescriptionBenefitPlanLearnMoreModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const modalContentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IPrescriptionBenefitPlanLearnMoreModal>>
    > = {
      content: {},
      isContentLoading: false,
    };
    useContentMock.mockReturnValue(modalContentWithIsLoadingMock);
  });

  it('gets content', () => {
    renderer.create(
      <PrescriptionBenefitPlanLearnMoreModal
        onPressHandler={onPressMock}
        showModal={false}
      />
    );

    expect(useContentMock).toHaveBeenCalledTimes(1);

    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.prescriptionBenefitPlanLearnMoreModal,
      2
    );
  });

  it('renders slidup modal', () => {
    const contentMock: Partial<IPrescriptionBenefitPlanLearnMoreModal> = {
      heading: 'heading',
    };
    const isVisibleMock = false;
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IPrescriptionBenefitPlanLearnMoreModal>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);
    const testRenderer = renderer.create(
      <PrescriptionBenefitPlanLearnMoreModal
        onPressHandler={onPressMock}
        showModal={isVisibleMock}
      />
    );
    const slideUpModalContainer = testRenderer.root
      .children[0] as ReactTestInstance;
    expect(slideUpModalContainer.type).toEqual(SlideUpModal);
    expect(slideUpModalContainer.props.heading).toEqual(contentMock.heading);
    expect(slideUpModalContainer.props.isVisible).toEqual(isVisibleMock);
    expect(slideUpModalContainer.props.onClosePress).toEqual(
      expect.any(Function)
    );
    expect(slideUpModalContainer.props.isSkeleton).toEqual(
      isContentLoadingMock
    );
  });

  it('renders contents as list', () => {
    const testRenderer = renderer.create(
      <PrescriptionBenefitPlanLearnMoreModal
        onPressHandler={onPressMock}
        showModal={false}
      />
    );
    const slideUpModalContainer = testRenderer.root
      .children[0] as ReactTestInstance;
    expect(slideUpModalContainer.type).toEqual(SlideUpModal);
    const slideUpModal = slideUpModalContainer.children[0] as ReactTestInstance;
    const list = getChildren(slideUpModal)[0];
    expect(list.type).toEqual(List);
    expect(getChildren(list).length).toEqual(2);
    expect(list.props.testID).toEqual(
      'prescriptionBenefitPlanSlideUpModalBody'
    );
  });

  it('renders Deductibles list item', () => {
    const testRenderer = renderer.create(
      <PrescriptionBenefitPlanLearnMoreModal
        onPressHandler={onPressMock}
        showModal={false}
      />
    );
    const slideUpModalContainer = testRenderer.root
      .children[0] as ReactTestInstance;
    expect(slideUpModalContainer.type).toEqual(SlideUpModal);
    const slideUpModal = slideUpModalContainer.children[0] as ReactTestInstance;
    const list = getChildren(slideUpModal)[0];
    const listItem = getChildren(list);
    expect(listItem[0].type).toEqual(ListItem);
    expect(getChildren(listItem[0]).length).toEqual(2);
  });

  it('renders Deductibles heading', () => {
    const contentMock: Partial<IPrescriptionBenefitPlanLearnMoreModal> = {
      deductiblesTitle: 'deductiblesTitle',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IPrescriptionBenefitPlanLearnMoreModal>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);
    const testRenderer = renderer.create(
      <PrescriptionBenefitPlanLearnMoreModal
        onPressHandler={onPressMock}
        showModal={false}
      />
    );
    const slideUpModalContainer = testRenderer.root
      .children[0] as ReactTestInstance;
    expect(slideUpModalContainer.type).toEqual(SlideUpModal);
    const slideUpModal = slideUpModalContainer.children[0] as ReactTestInstance;
    const list = getChildren(slideUpModal)[0];
    const listItem = getChildren(list);
    const heading = getChildren(listItem[0])[0];
    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(3);
    expect(heading.props.children).toEqual(contentMock.deductiblesTitle);
  });

  it('renders Deductibles description', () => {
    const contentMock: Partial<IPrescriptionBenefitPlanLearnMoreModal> = {
      deductiblesDescription: 'deductiblesDescription',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IPrescriptionBenefitPlanLearnMoreModal>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);
    const testRenderer = renderer.create(
      <PrescriptionBenefitPlanLearnMoreModal
        onPressHandler={onPressMock}
        showModal={false}
      />
    );
    const slideUpModalContainer = testRenderer.root
      .children[0] as ReactTestInstance;
    expect(slideUpModalContainer.type).toEqual(SlideUpModal);
    const slideUpModal = slideUpModalContainer.children[0] as ReactTestInstance;
    const list = getChildren(slideUpModal)[0];
    const listItem = getChildren(list);
    const baseText = getChildren(listItem[0])[1];
    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(
      prescriptionBenefitPlanScreenStyles.subTitleFirstTextViewStyle
    );
    expect(baseText.props.children).toEqual(contentMock.deductiblesDescription);
  });

  it('renders Out-of-pocket list list item', () => {
    const testRenderer = renderer.create(
      <PrescriptionBenefitPlanLearnMoreModal
        onPressHandler={onPressMock}
        showModal={false}
      />
    );
    const slideUpModalContainer = testRenderer.root
      .children[0] as ReactTestInstance;
    expect(slideUpModalContainer.type).toEqual(SlideUpModal);
    const slideUpModal = slideUpModalContainer.children[0] as ReactTestInstance;
    const list = getChildren(slideUpModal)[0];
    const listItem = getChildren(list);
    expect(listItem[1].type).toEqual(ListItem);
    expect(getChildren(listItem[1]).length).toEqual(2);
  });

  it('renders Out-of-pocket heading', () => {
    const contentMock: Partial<IPrescriptionBenefitPlanLearnMoreModal> = {
      outOfPocketTitle: 'outOfPocketTitle',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IPrescriptionBenefitPlanLearnMoreModal>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);
    const testRenderer = renderer.create(
      <PrescriptionBenefitPlanLearnMoreModal
        onPressHandler={onPressMock}
        showModal={false}
      />
    );
    const slideUpModalContainer = testRenderer.root
      .children[0] as ReactTestInstance;
    expect(slideUpModalContainer.type).toEqual(SlideUpModal);
    const slideUpModal = slideUpModalContainer.children[0] as ReactTestInstance;
    const list = getChildren(slideUpModal)[0];
    const listItem = getChildren(list);
    const heading = getChildren(listItem[1])[0];
    expect(heading.type).toEqual(Heading);
    expect(heading.props.level).toEqual(3);
    expect(heading.props.children).toEqual(contentMock.outOfPocketTitle);
  });

  it('renders Deductibles description', () => {
    const contentMock: Partial<IPrescriptionBenefitPlanLearnMoreModal> = {
      outOfPocketDescription: 'outOfPocketDescription',
    };
    const isContentLoadingMock = true;
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IPrescriptionBenefitPlanLearnMoreModal>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);
    const testRenderer = renderer.create(
      <PrescriptionBenefitPlanLearnMoreModal
        onPressHandler={onPressMock}
        showModal={false}
      />
    );
    const slideUpModalContainer = testRenderer.root
      .children[0] as ReactTestInstance;
    expect(slideUpModalContainer.type).toEqual(SlideUpModal);
    const slideUpModal = slideUpModalContainer.children[0] as ReactTestInstance;
    const list = getChildren(slideUpModal)[0];
    const listItem = getChildren(list);
    const baseText = getChildren(listItem[1])[1];
    expect(baseText.type).toEqual(BaseText);
    expect(baseText.props.style).toEqual(
      prescriptionBenefitPlanScreenStyles.subTitleSecondTextViewStyle
    );
    expect(baseText.props.children).toEqual(contentMock.outOfPocketDescription);
  });
});
