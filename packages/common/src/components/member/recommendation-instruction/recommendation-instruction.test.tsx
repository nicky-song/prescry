// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import renderer from 'react-test-renderer';
import { IReduxContext } from '../../../experiences/guest-experience/context-providers/redux/redux.context';
import { useReduxContext } from '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook';
import { ISessionContext } from '../../../experiences/guest-experience/context-providers/session/session.context';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { useSessionContext } from '../../../experiences/guest-experience/context-providers/session/use-session-context.hook';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { defaultSessionState } from '../../../experiences/guest-experience/state/session/session.state';
import { IOrderConfirmationScreenContent } from '../../../experiences/guest-experience/screens/order-confirmation-screen/order-confirmation.screen.content';
import { IUIContentGroup } from '../../../models/ui-content';
import { BaseText } from '../../text/base-text/base-text';
import { LineSeparator } from '../line-separator/line-separator';
import {
  IRecommendationInstructionProps,
  RecommendationInstruction,
} from './recommendation-instruction';
import { recommendationInstructionStyles } from './recommendation-instruction.style';
import { PrescriberDetails } from '../prescriber-details/prescriber-details';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useEffect: jest.fn(),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/redux/use-redux-context.hook'
);
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/use-session-context.hook'
);
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
  [
    CmsGroupKey.orderConfirmation,
    {
      content: [
        {
          fieldKey: 'order-confirmation-title-text',
          language: 'English',
          type: 'text',
          value: 'order-confirmation-title-text-mock',
        },
      ],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
]);

const contentMock: Partial<IOrderConfirmationScreenContent> = {
  orderConfirmationTitleText: 'order-confirmation-title-text-mock',
  orderConfirmationConfirmationText:
    'order-confirmation-confirmation-text-mock',
  orderConfirmationEligibilityText: 'order-confirmation-eligibility-text-mock',
  prescriberInfoTitle: 'Prescriber info',
};

const offerDetailsInstructionConstants = {
  callToActionText: 'callToActionText',
  doctorContactNumber: '1-888-888-8888',
  doctorName: 'Dr. John Snow',
  explanationText: 'explanationText',
};

const offerDetailsInstructionProps: IRecommendationInstructionProps = {
  callToActionText: offerDetailsInstructionConstants.callToActionText,
  callToDoctor: jest.fn(),
  doctorContactNumber: offerDetailsInstructionConstants.doctorContactNumber,
  doctorName: offerDetailsInstructionConstants.doctorName,
  explanationText: offerDetailsInstructionConstants.explanationText,
};

interface IStateCalls {
  isContentLoading: [boolean, jest.Mock];
}

function stateReset({
  isContentLoading = [false, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(isContentLoading);
}

const reduxDispatchMock = jest.fn();
const reduxGetStateMock = jest.fn();
const sessionDispatchMock = jest.fn();

describe('RecommendationInstruction', () => {
  beforeEach(() => {
    stateReset({});

    const reduxContextMock: IReduxContext = {
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const sessionContextMock: ISessionContext = {
      sessionDispatch: sessionDispatchMock,
      sessionState: {
        ...defaultSessionState,
        uiCMSContentMap: cmsContentMapMock,
      },
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });
  });
  it('should have explanationText', () => {
    const offerDetailsInstruction = renderer.create(
      <RecommendationInstruction {...offerDetailsInstructionProps} />
    );
    const callToActionTextComponent =
      offerDetailsInstruction.root.findAllByType(BaseText)[0];
    expect(callToActionTextComponent.props.style).toBe(
      recommendationInstructionStyles.explanationText
    );
    expect(callToActionTextComponent.props.children).toBe(
      offerDetailsInstructionProps.explanationText
    );
  });

  it('should pass props to PrescriberDetails component when given', () => {
    const offerDetailsInstruction = renderer.create(
      <RecommendationInstruction {...offerDetailsInstructionProps} />
    );
    const prescriberDetailsComponent =
      offerDetailsInstruction.root.findByType(PrescriberDetails);
    expect(prescriberDetailsComponent.props.doctorContactNumber).toEqual(
      offerDetailsInstructionProps.doctorContactNumber
    );
    expect(prescriberDetailsComponent.props.doctorName).toEqual(
      offerDetailsInstructionProps.doctorName
    );
    expect(prescriberDetailsComponent.props.callToDoctor).toEqual(
      offerDetailsInstructionProps.callToDoctor
    );
  });

  it('should not render PrescriberDetails when doctor contact not provided', () => {
    const offerDetailsInstruction = renderer.create(
      <RecommendationInstruction
        {...offerDetailsInstructionProps}
        {...{ doctorContactNumber: undefined }}
      />
    );
    const prescriberDetailsComponent =
      offerDetailsInstruction.root.findAllByType(PrescriberDetails);
    expect(prescriberDetailsComponent.length).toBe(0);
  });

  it('should not render PrescriberDetails when doctor name not provided', () => {
    const offerDetailsInstruction = renderer.create(
      <RecommendationInstruction
        {...offerDetailsInstructionProps}
        {...{ doctorName: undefined }}
      />
    );
    const prescriberDetailsComponent =
      offerDetailsInstruction.root.findAllByType(PrescriberDetails);
    expect(prescriberDetailsComponent.length).toBe(0);
  });

  it('should not render PrescriberDetails when call to doctor function not provided', () => {
    const offerDetailsInstruction = renderer.create(
      <RecommendationInstruction
        {...offerDetailsInstructionProps}
        {...{ callToDoctor: undefined }}
      />
    );
    const prescriberDetailsComponent =
      offerDetailsInstruction.root.findAllByType(PrescriberDetails);
    expect(prescriberDetailsComponent.length).toBe(0);
  });

  it('should render LineSeparator component', () => {
    const container = renderer.create(
      <RecommendationInstruction {...offerDetailsInstructionProps} />
    );
    const lineSeparator = container.root.findAllByType(LineSeparator);
    expect(lineSeparator.length).toEqual(1);
    expect(lineSeparator[0].props.viewStyle).toEqual(
      recommendationInstructionStyles.lineSeparatorViewStyle
    );
  });
});
