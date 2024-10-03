// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { View, ViewStyle } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { IClaim } from '../../../../models/claim';
import { getChildren } from '../../../../testing/test.helper';
import dateFormatter from '../../../../utils/formatters/date.formatter';
import { MoneyFormatter } from '../../../../utils/formatters/money-formatter';
import { ExpandableCard } from '../../../cards/expandable/expandable.card';
import { PrescriptionPriceContainer } from '../../../containers/prescription-price/prescription-price.container';
import { ValueText } from '../../../text/value/value.text';
import { BaseText } from '../../../text/base-text/base-text';
import { ConfirmedAmountText } from '../../../text/confirmed-amount/confirmed-amount.text';
import { DrugDetailsText } from '../../../text/drug-details/drug-details.text';
import { ClaimHistoryCard } from './claim-history.card';
import { claimHistoryCardStyles } from './claim-history.card.styles';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IClaimHistoryCardContent } from './claim-history.card.content';
import { IContentWithIsLoading } from '../../../../models/cms-content/content-with-isloading.model';
import { formatPhoneNumber } from '../../../../utils/formatters/phone-number.formatter';

jest.mock('../../../cards/expandable/expandable.card', () => ({
  ExpandableCard: () => <div />,
}));

jest.mock('../../../text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock('../../../text/drug-details/drug-details.text', () => ({
  DrugDetailsText: () => <div />,
}));

jest.mock(
  '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

describe('ClaimHistoryCard', () => {
  const filledOnDateMock = new Date();
  const defaultClaimMock: Partial<IClaim> = {
    drugName: 'drug-name',
    billing: {
      memberPays: 100,
      deductibleApplied: 50,
    },
    pharmacy: {
      name: 'pharmacy-name',
      ncpdp: 'ncpdp',
      phoneNumber: '5098397030',
    },
    filledOn: filledOnDateMock,
  };

  const claimMockWithNoFilledOn: Partial<IClaim> = {
    drugName: 'drug-name',
    billing: {
      memberPays: 100,
      deductibleApplied: 50,
    },
    pharmacy: {
      name: 'pharmacy-name',
      ncpdp: 'ncpdp',
      phoneNumber: 'pharmacy-phone-number',
    },
  };
  const defaultContentMock: Partial<IClaimHistoryCardContent> = {};

  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({ content: defaultContentMock });
  });

  it('gets content', () => {
    renderer.create(<ClaimHistoryCard claim={defaultClaimMock as IClaim} />);

    expect(useContentMock).toHaveBeenCalledTimes(1);
    expect(useContentMock).toHaveBeenNthCalledWith(
      1,
      CmsGroupKey.claimHistoryCard,
      2
    );
  });

  it.each([
    [undefined, 'claimHistoryCard'],
    ['test-id', 'test-id'],
  ])(
    'renders as ExpandableCard with test ID %p',
    (testIdMock: undefined | string, expectedTestId: string) => {
      const viewStyleMock: ViewStyle = { width: 1 };

      const hideLineMock = true;

      const testRenderer = renderer.create(
        <ClaimHistoryCard
          viewStyle={viewStyleMock}
          testID={testIdMock}
          claim={defaultClaimMock as IClaim}
          hideLine={hideLineMock}
        />
      );

      const card = testRenderer.root.children[0] as ReactTestInstance;

      expect(card.type).toEqual(ExpandableCard);
      expect(card.props.viewStyle).toEqual(viewStyleMock);
      expect(card.props.collapsedTitle).toEqual(defaultClaimMock.drugName);
      expect(card.props.collapsedContent).toBeDefined();
      expect(card.props.expandedContent).toBeDefined();
      expect(card.props.testID).toEqual(expectedTestId);
      expect(card.props.hideLine).toEqual(hideLineMock);
    }
  );

  it.each([
    [undefined, 'claimHistoryCardCollapsedContent'],
    ['testId', 'testIdCollapsedContent'],
  ])(
    'renders collapsed content container for testID %p',
    (testIdMock: undefined | string, expectedTestId: string) => {
      const testRenderer = renderer.create(
        <ClaimHistoryCard
          testID={testIdMock}
          claim={defaultClaimMock as IClaim}
        />
      );

      const card = testRenderer.root.findByType(ExpandableCard);
      const collapsedContent = card.props.collapsedContent;

      expect(collapsedContent.type).toEqual(View);
      expect(collapsedContent.props.testID).toEqual(expectedTestId);
      expect(getChildren(collapsedContent).length).toEqual(3);
    }
  );

  it('renders collapsed content drug details', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.collapsedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardCollapsedContent',
    });
    const drugDetails = getChildren(contentContainer)[0];

    expect(drugDetails.type).toEqual(DrugDetailsText);
    expect(drugDetails.props.formCode).toEqual(defaultClaimMock.formCode);
    expect(drugDetails.props.quantity).toEqual(defaultClaimMock.quantity);
    expect(drugDetails.props.strength).toEqual(defaultClaimMock.strength);
    expect(drugDetails.props.supply).toEqual(defaultClaimMock.daysSupply);
  });

  it('renders collapsed content date container', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.collapsedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardCollapsedContent',
    });
    const dateContainer = getChildren(contentContainer)[1];

    expect(dateContainer.type).toEqual(View);
    expect(dateContainer.props.style).toEqual([
      claimHistoryCardStyles.rowContainerViewStyle,
      claimHistoryCardStyles.collapseFilledOnDateViewStyle,
    ]);
    expect(getChildren(dateContainer).length).toEqual(2);
  });

  it('renders collapsed content fill date label', () => {
    const isContentLoadingMock = true;
    const contentMock: Partial<IClaimHistoryCardContent> = {
      dateFilledLabel: 'filled-date-label',
    };
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryCardContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.collapsedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardCollapsedContent',
    });
    const dateContainer = getChildren(contentContainer)[1];
    const filledDateLabel = getChildren(dateContainer)[0];

    expect(filledDateLabel.type).toEqual(BaseText);
    expect(filledDateLabel.props.children).toEqual(contentMock.dateFilledLabel);
  });

  it('renders collapsed content fill date', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.collapsedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardCollapsedContent',
    });
    const dateContainer = getChildren(contentContainer)[1];
    const filledDate = getChildren(dateContainer)[1];
    expect(filledDate.type).toEqual(ValueText);
    expect(filledDate.props.children).toEqual(
      dateFormatter.formatToMMDDYYYY(new Date(filledOnDateMock))
    );
  });

  it('renders collapsed content member pays container', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.collapsedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardCollapsedContent',
    });
    const memberPaysContainer = getChildren(contentContainer)[2];

    expect(memberPaysContainer.type).toEqual(PrescriptionPriceContainer);
    expect(getChildren(memberPaysContainer).length).toEqual(2);
  });

  it('renders collapsed content you paid label', () => {
    const isContentLoadingMock = true;
    const contentMock: Partial<IClaimHistoryCardContent> = {
      youPaidLabel: 'you-paid-label',
    };
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryCardContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.collapsedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardCollapsedContent',
    });
    const memberPaysContainer = getChildren(contentContainer)[2];
    const youPaidLabel = getChildren(memberPaysContainer)[0];

    expect(youPaidLabel.type).toEqual(BaseText);
    expect(youPaidLabel.props.children).toEqual(contentMock.youPaidLabel);
  });

  it('renders collapsed content member pays amount', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.collapsedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardCollapsedContent',
    });
    const priceContainer = getChildren(contentContainer)[2];
    const confirmedAmount = getChildren(priceContainer)[1];
    expect(confirmedAmount.type).toEqual(ConfirmedAmountText);
    expect(confirmedAmount.props.children).toEqual(
      MoneyFormatter.format(defaultClaimMock.billing?.memberPays)
    );
  });

  it.each([
    [undefined, 'claimHistoryCardExpandedContent'],
    ['testId', 'testIdExpandedContent'],
  ])(
    'renders expanded content container for testID %p',
    (testIdMock: undefined | string, expectedTestId: string) => {
      const testRenderer = renderer.create(
        <ClaimHistoryCard
          testID={testIdMock}
          claim={defaultClaimMock as IClaim}
        />
      );

      const card = testRenderer.root.findByType(ExpandableCard);
      const expandedContent = card.props.expandedContent;

      expect(expandedContent.type).toEqual(View);
      expect(expandedContent.props.testID).toEqual(expectedTestId);
      expect(getChildren(expandedContent).length).toEqual(6);
    }
  );

  it('renders expanded content drug details', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const drugDetails = getChildren(contentContainer)[0];

    expect(drugDetails.type).toEqual(DrugDetailsText);
    expect(drugDetails.props.formCode).toEqual(defaultClaimMock.formCode);
    expect(drugDetails.props.quantity).toEqual(defaultClaimMock.quantity);
    expect(drugDetails.props.strength).toEqual(defaultClaimMock.strength);
    expect(drugDetails.props.supply).toEqual(defaultClaimMock.daysSupply);
  });

  it('renders expanded content date container', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const dateContainer = getChildren(contentContainer)[1];

    expect(dateContainer.type).toEqual(View);
    expect(dateContainer.props.style).toEqual(
      claimHistoryCardStyles.rowContainerViewStyle
    );
    expect(getChildren(dateContainer).length).toEqual(2);
  });

  it('renders expanded content fill date label', () => {
    const isContentLoadingMock = true;
    const contentMock: Partial<IClaimHistoryCardContent> = {
      dateFilledLabel: 'filled-date-label',
    };
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryCardContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const dateContainer = getChildren(contentContainer)[1];
    const filledDateLabel = getChildren(dateContainer)[0];

    expect(filledDateLabel.type).toEqual(BaseText);
    expect(filledDateLabel.props.children).toEqual(contentMock.dateFilledLabel);
  });

  it('renders expanded content fill date', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);
    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const dateContainer = getChildren(contentContainer)[1];
    const filledDate = getChildren(dateContainer)[1];
    expect(filledDate.type).toEqual(ValueText);
    expect(filledDate.props.children).toEqual(
      dateFormatter.formatToMMDDYYYY(new Date(filledOnDateMock))
    );
  });
  it('renders expanded content pharmacy container', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const pharmacyContainer = getChildren(contentContainer)[2];

    expect(pharmacyContainer.type).toEqual(View);
    expect(pharmacyContainer.props.style).toEqual(
      claimHistoryCardStyles.colContainerViewStyle
    );
    expect(getChildren(pharmacyContainer).length).toEqual(3);
  });
  it('renders expanded content pharmacy label', () => {
    const isContentLoadingMock = true;
    const contentMock: Partial<IClaimHistoryCardContent> = {
      pharmacy: 'pharmacy',
    };
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryCardContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const pharmacyContainer = getChildren(contentContainer)[2];
    const pharmacyLabel = getChildren(pharmacyContainer)[0];

    expect(pharmacyLabel.type).toEqual(BaseText);
    expect(pharmacyLabel.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(pharmacyLabel.props.children).toEqual(contentMock.pharmacy);
  });

  it('renders expanded content pharmacy name', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const pharmacyContainer = getChildren(contentContainer)[2];
    const pharmacyName = getChildren(pharmacyContainer)[1];

    expect(pharmacyName.type).toEqual(ValueText);
    expect(pharmacyName.props.translateContent).toEqual(false);
    expect(pharmacyName.props.children).toEqual(
      defaultClaimMock.pharmacy?.name
    );
  });

  it('renders expanded content pharmacy phone number', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const pharmacyNumberContainer = getChildren(contentContainer)[2];
    const pharmacyNumber = getChildren(pharmacyNumberContainer)[2];
    const formattedPhoneNumber = formatPhoneNumber(
      defaultClaimMock.pharmacy?.phoneNumber ?? ''
    );
    expect(pharmacyNumber.type).toEqual(ValueText);
    expect(pharmacyNumber.props.children).toEqual(formattedPhoneNumber);
  });

  it.each([[undefined], ['order-number']])(
    'renders expanded content order number container (order number: %p)',
    (orderNumberMock: string | undefined) => {
      const claimMock: Partial<IClaim> = {
        ...defaultClaimMock,
        orderNumber: orderNumberMock,
      };

      const testRenderer = renderer.create(
        <ClaimHistoryCard claim={claimMock as IClaim} />
      );

      const card = testRenderer.root.findByType(ExpandableCard);
      const contentRenderer = renderer.create(card.props.expandedContent);

      const contentContainer = contentRenderer.root.findByProps({
        testID: 'claimHistoryCardExpandedContent',
      });
      const orderNumberContainer = getChildren(contentContainer)[3];

      if (orderNumberMock) {
        expect(orderNumberContainer.type).toEqual(View);
        expect(orderNumberContainer.props.style).toEqual(
          claimHistoryCardStyles.colContainerViewStyle
        );
        expect(getChildren(orderNumberContainer).length).toEqual(2);
      } else {
        expect(orderNumberContainer).toBeNull();
      }
    }
  );

  it('renders expanded content order number label', () => {
    const isContentLoadingMock = true;
    const contentMock: Partial<IClaimHistoryCardContent> = {
      orderNumber: 'order-number',
    };
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryCardContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const claimMock: Partial<IClaim> = {
      ...defaultClaimMock,
      orderNumber: 'order-number',
    };

    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={claimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const orderNumberContainer = getChildren(contentContainer)[3];
    const orderNumberLabel = getChildren(orderNumberContainer)[0];

    expect(orderNumberLabel.type).toEqual(BaseText);
    expect(orderNumberLabel.props.isSkeleton).toEqual(isContentLoadingMock);
    expect(orderNumberLabel.props.children).toEqual(contentMock.orderNumber);
  });

  it('renders expanded content order number', () => {
    const claimMock: Partial<IClaim> = {
      ...defaultClaimMock,
      orderNumber: 'order-number',
    };

    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={claimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const orderNumberContainer = getChildren(contentContainer)[3];
    const orderNumber = getChildren(orderNumberContainer)[1];

    expect(orderNumber.type).toEqual(ValueText);
    expect(orderNumber.props.children).toEqual(claimMock.orderNumber);
  });

  it('renders expanded content applied deductible container', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const applicedDeductibleContainer = getChildren(contentContainer)[4];

    expect(applicedDeductibleContainer.type).toEqual(View);
    expect(applicedDeductibleContainer.props.style).toEqual(
      claimHistoryCardStyles.colContainerViewStyle
    );
    expect(getChildren(applicedDeductibleContainer).length).toEqual(2);
  });

  it('renders expanded content applied deductible label', () => {
    const isContentLoadingMock = true;
    const contentMock: Partial<IClaimHistoryCardContent> = {
      deductibleApplied: 'deductible-applied',
    };
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryCardContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const appliedDeductibleContainer = getChildren(contentContainer)[4];
    const appliedDeductibleLabel = getChildren(appliedDeductibleContainer)[0];

    expect(appliedDeductibleLabel.type).toEqual(BaseText);
    expect(appliedDeductibleLabel.props.isSkeleton).toEqual(
      isContentLoadingMock
    );
    expect(appliedDeductibleLabel.props.children).toEqual(
      contentMock.deductibleApplied
    );
  });

  it('renders expanded content applied deductible', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const appliedDeductibleContainer = getChildren(contentContainer)[4];
    const appliedDeductible = getChildren(appliedDeductibleContainer)[1];

    expect(appliedDeductible.type).toEqual(ValueText);
    expect(appliedDeductible.props.children).toEqual(
      MoneyFormatter.format(defaultClaimMock.billing?.deductibleApplied)
    );
  });

  it('renders expanded content member pays container', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const memberPaysContainer = getChildren(contentContainer)[5];

    expect(memberPaysContainer.type).toEqual(PrescriptionPriceContainer);
    expect(memberPaysContainer.props.viewStyle).toEqual(
      claimHistoryCardStyles.expandedPriceViewStyle
    );
    expect(getChildren(memberPaysContainer).length).toEqual(2);
  });

  it('renders expanded content you paid label', () => {
    const isContentLoadingMock = true;
    const contentMock: Partial<IClaimHistoryCardContent> = {
      youPaidLabel: 'you-paid-label',
    };
    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryCardContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: contentMock,
    };
    useContentMock.mockReturnValueOnce(contentWithIsLoadingMock);
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const memberPaysContainer = getChildren(contentContainer)[5];
    const youPaidLabel = getChildren(memberPaysContainer)[0];
    expect(youPaidLabel.type).toEqual(BaseText);
    expect(youPaidLabel.props.children).toEqual(contentMock.youPaidLabel);
  });

  it('renders expanded content member pays amount', () => {
    const isContentLoadingMock = true;

    const contentWithIsLoadingMock: Partial<
      IContentWithIsLoading<Partial<IClaimHistoryCardContent>>
    > = {
      isContentLoading: isContentLoadingMock,
      content: defaultContentMock,
    };
    useContentMock.mockReturnValue(contentWithIsLoadingMock);

    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={defaultClaimMock as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const memberPaysContainer = getChildren(contentContainer)[5];
    const memberPays = getChildren(memberPaysContainer)[1];

    expect(memberPays.type).toEqual(ConfirmedAmountText);
    expect(memberPays.props.isSkeleton).toEqual(isContentLoadingMock);

    expect(memberPays.props.children).toEqual(
      MoneyFormatter.format(defaultClaimMock.billing?.memberPays)
    );
  });

  it('renders collapsed content with no fill date', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={claimMockWithNoFilledOn as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.collapsedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardCollapsedContent',
    });
    const dateContainer = getChildren(contentContainer)[1];
    const fillDate = getChildren(dateContainer)[1];

    expect(fillDate.type).toEqual(ValueText);
    expect(fillDate.props.children).toEqual('');
  });

  it('renders expanded content with no fill date', () => {
    const testRenderer = renderer.create(
      <ClaimHistoryCard claim={claimMockWithNoFilledOn as IClaim} />
    );

    const card = testRenderer.root.findByType(ExpandableCard);
    const contentRenderer = renderer.create(card.props.expandedContent);

    const contentContainer = contentRenderer.root.findByProps({
      testID: 'claimHistoryCardExpandedContent',
    });
    const dateContainer = getChildren(contentContainer)[1];
    const fillDate = getChildren(dateContainer)[1];

    expect(fillDate.type).toEqual(ValueText);
    expect(fillDate.props.children).toEqual('');
  });
});
