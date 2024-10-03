// Copyright 2018 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { rootStackNavigationMock } from '../../../experiences/guest-experience/navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { LinkButton } from '../../buttons/link/link.button';
import { BaseText } from '../../text/base-text/base-text';
import { Heading } from '../heading/heading';
import {
  ISupportErrorScreenContainerActionProps,
  ISupportErrorScreenContainerProps,
  SupportErrorScreenContainer,
} from './support-error.container';
import { supportErrorContainerContent } from './support-error.container.content';
import { supportErrorContainerStyles } from './support-error.container.styles';

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

const props: ISupportErrorScreenContainerProps &
  ISupportErrorScreenContainerActionProps = {
  reloadPageAction: jest.fn(),
};

describe('SupportErrorScreenContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigationMock.mockReturnValue({});
  });

  it('renders in Fragment container with expected properties', () => {
    const testRenderer = renderer.create(
      <SupportErrorScreenContainer {...props} />
    );

    const fragment = testRenderer.root.children;

    expect(fragment.length).toEqual(3);
  });

  it('renders title', () => {
    const testRenderer = renderer.create(
      <SupportErrorScreenContainer {...props} />
    );

    const fragment = testRenderer.root.children as ReactTestInstance[];
    const heading = fragment[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.textStyle).toEqual(
      supportErrorContainerStyles.headingTextStyle
    );
    expect(heading.props.children).toEqual(supportErrorContainerContent.title);
  });

  it.each([[undefined], ['error']])(
    'renders error message (error message: %p)',
    (errorMessageMock: undefined | string) => {
      const testRenderer = renderer.create(
        <SupportErrorScreenContainer
          {...props}
          errorMessage={errorMessageMock}
        />
      );

      const fragment = testRenderer.root.children as ReactTestInstance[];
      const errorContent = fragment[1];

      expect(errorContent.type).toEqual(BaseText);

      const expectedErrorMessage =
        errorMessageMock ?? supportErrorContainerContent.defaultError;
      expect(errorContent.props.children).toEqual(expectedErrorMessage);
    }
  );

  it('renders reload link', () => {
    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    const reloadPageActionMock = jest.fn();

    const testRenderer = renderer.create(
      <SupportErrorScreenContainer
        {...props}
        reloadPageAction={reloadPageActionMock}
      />
    );

    const fragment = testRenderer.root.children as ReactTestInstance[];
    const linkButton = fragment[2];

    expect(linkButton.type).toEqual(LinkButton);
    expect(linkButton.props.linkText).toEqual(
      supportErrorContainerContent.reloadLinkText
    );
    expect(linkButton.props.viewStyle).toEqual(
      supportErrorContainerStyles.reloadLinkViewStyle
    );
    expect(linkButton.props.onPress).toEqual(expect.any(Function));

    linkButton.props.onPress();

    expect(reloadPageActionMock).toHaveBeenCalledWith(rootStackNavigationMock);
  });
});
