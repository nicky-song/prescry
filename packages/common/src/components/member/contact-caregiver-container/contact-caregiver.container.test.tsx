// Copyright 2022 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IContactCaregiverContainerContent } from '../../../models/cms-content/contact-caregiver.container.content';
import { BaseText } from '../../text/base-text/base-text';
import { Heading } from '../heading/heading';
import {
  ContactCaregiverScreenContainer,
  ContactCaregiverScreenContainerProps,
} from './contact-caregiver.container';
import { contactCaregiverContainerStyles } from './contact-caregiver.container.styles';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const props: ContactCaregiverScreenContainerProps = {
  supportEmail: 'support@prescryptive.com',
  group_number: 'test',
};

const contactCaregiverContainerContentMock: IContactCaregiverContainerContent =
  {
    title: 'Contact your caregiver',
    titleDescription:
      'You must meet certain age requirements to have a myPrescryptive account. Only your caregiver can manage your prescriptions.',
    subTitle: 'Here is more information about caregivers and dependents',
    subItems: [
      {
        id: 'dependents',
        title: 'Dependents',
        info: 'are people who are not able to take care of themseleves, either because they do not meet the legal age requirements, or because they have a medical condition.',
      },
      {
        id: 'caregivers',
        title: 'Caregivers',
        info: 'help take care of dependents, including managing their healthcare and making medical decisions.',
      },
      {
        id: 'caretip',
        info: 'In the US, the parent or legal guardian is typically the caregiver for a minor dependent, but a court can appoint a guardian if necessary.',
      },
    ],
    helpLinkTitle: 'Prescryptive is ready to help.',
    helpLinkText: 'Contact Us',
    helpLinkInfo: 'if you have any questions',
    providedBy: 'Provided by',
  };

describe('ContactCaregiverScreenContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigationMock.mockReturnValue({});

    useContentMock.mockReturnValue({
      content: contactCaregiverContainerContentMock,
      isContentLoading: false,
    });
  });

  it('renders in Fragment container with expected properties', () => {
    const testRenderer = renderer.create(
      <ContactCaregiverScreenContainer {...props} />
    );

    const fragment = testRenderer.root.children as ReactTestInstance[];

    expect(fragment.length).toEqual(5);
  });

  it('renders title', () => {
    const testRenderer = renderer.create(
      <ContactCaregiverScreenContainer {...props} />
    );

    const fragment = testRenderer.root.children as ReactTestInstance[];
    const heading = fragment[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.textStyle).toEqual(
      contactCaregiverContainerStyles.headingTextStyle
    );
    expect(heading.props.level).toEqual(1);
    expect(heading.props.children).toEqual(
      contactCaregiverContainerContentMock.title
    );
  });

  it('renders description', () => {
    const testRenderer = renderer.create(
      <ContactCaregiverScreenContainer {...props} />
    );

    const fragment = testRenderer.root.children as ReactTestInstance[];
    const heading = fragment[1];

    expect(heading.type).toEqual(BaseText);
    expect(heading.props.size).toEqual('default');
    expect(heading.props.children).toEqual(
      contactCaregiverContainerContentMock.titleDescription
    );
  });

  it('renders list', () => {
    const testRenderer = renderer.create(
      <ContactCaregiverScreenContainer {...props} />
    );

    const fragment = testRenderer.root.children as ReactTestInstance[];
    const list = fragment[3];

    expect(list.props.style).toEqual(
      contactCaregiverContainerStyles.listViewStyle
    );
    expect(getChildren(list).length).toEqual(3);
  });
});
