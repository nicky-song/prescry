// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IOrderConfirmationScreenContent } from '../../../experiences/guest-experience/screens/order-confirmation-screen/order-confirmation.screen.content';
import { RecommendationAlternativesScreenConstants } from '../../../theming/constants';
import { BaseButton, IBaseButtonProps } from '../../buttons/base/base.button';
import { ProtectedBaseText } from '../../text/protected-base-text/protected-base-text';
import { Heading, IHeadingProps } from '../heading/heading';
import {
  PrescriberDetails,
  IPrescriberDetailsProps,
  IPrescriberDetailsActionProps,
} from './prescriber-details';

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);

const useContentMock = useContent as jest.Mock;

jest.mock('../../primitives/skeleton-bone', () => ({
  SkeletonBone: () => <div />,
}));

const contentMock: Partial<IOrderConfirmationScreenContent> = {
  orderConfirmationTitleText: 'order-confirmation-title-text-mock',
  orderConfirmationConfirmationText:
    'order-confirmation-confirmation-text-mock',
  orderConfirmationEligibilityText: 'order-confirmation-eligibility-text-mock',
  prescriberInfoTitle: 'Prescriber info',
};

const recommendationDoctorContactDetailsProps: IPrescriberDetailsProps = {
  doctorContactNumber:
    RecommendationAlternativesScreenConstants.doctorContactNumber,
  doctorName: RecommendationAlternativesScreenConstants.doctorName,
};

const recommendationDoctorContactDetailsActionProps: IPrescriberDetailsActionProps =
  {
    callToDoctor: jest.fn(),
  };

describe('PrescriberDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: false,
    });
  });

  it('should render heading with the correct content', () => {
    const recommendationDoctorContactDetails = renderer.create(
      <PrescriberDetails
        {...recommendationDoctorContactDetailsProps}
        {...recommendationDoctorContactDetailsActionProps}
      />
    );
    const props = recommendationDoctorContactDetails.root.findAllByType(
      Heading
    )[0].props as IHeadingProps;
    expect(props.children).toBe(contentMock.prescriberInfoTitle);
  });

  it('should have doctor contact name', () => {
    const recommendationDoctorContactDetails = renderer.create(
      <PrescriberDetails
        {...recommendationDoctorContactDetailsProps}
        {...recommendationDoctorContactDetailsActionProps}
      />
    );
    const doctorNameText = recommendationDoctorContactDetails.root.findAllByType(
      ProtectedBaseText
    )[0];

    expect(doctorNameText.props.isSkeleton).toEqual(false);
    expect(doctorNameText.props.skeletonWidth).toEqual('medium');
    expect(doctorNameText.props.children).toBe(
      recommendationDoctorContactDetailsProps.doctorName
    );
  });

  it('should have doctor contact number', () => {
    const recommendationDoctorContactDetails = renderer.create(
      <PrescriberDetails
        {...recommendationDoctorContactDetailsProps}
        {...recommendationDoctorContactDetailsActionProps}
      />
    );
    const props =
      recommendationDoctorContactDetails.root.findAllByType(BaseButton)[0].props
        .children;
    expect(props).toBe(
      recommendationDoctorContactDetailsProps.doctorContactNumber
    );
  });

  it('should call callToDoctor on Button Press', () => {
    const recommendationDoctorContactDetails = renderer.create(
      <PrescriberDetails
        {...recommendationDoctorContactDetailsProps}
        {...recommendationDoctorContactDetailsActionProps}
      />
    );
    recommendationDoctorContactDetails.root
      .findByType(BaseButton)
      .props.onPress();

    expect(
      recommendationDoctorContactDetailsActionProps.callToDoctor
    ).toHaveBeenCalled();
  });

  it('renders skeletons when isSkeleton is true', () => {
    useContentMock.mockReturnValue({
      content: contentMock,
      isContentLoading: true,
    });
    const recommendationDoctorContactDetails = renderer.create(
      <PrescriberDetails
        {...recommendationDoctorContactDetailsProps}
        {...recommendationDoctorContactDetailsActionProps}
      />
    );
    const heading = recommendationDoctorContactDetails.root.findAllByType(
      Heading
    )[0].props as IHeadingProps;
    expect(heading.isSkeleton).toEqual(true);
    expect(heading.skeletonWidth).toEqual('long');

    const doctorNameText = recommendationDoctorContactDetails.root.findAllByType(
      ProtectedBaseText
    )[0];
    const doctorNameTextProps = doctorNameText.props;

    expect(doctorNameTextProps.isSkeleton).toEqual(true);
    expect(doctorNameTextProps.skeletonWidth).toEqual('medium');

    const button = recommendationDoctorContactDetails.root.findByType(
      BaseButton
    ).props as IBaseButtonProps;

    expect(button.isSkeleton).toEqual(true);
  });
});
