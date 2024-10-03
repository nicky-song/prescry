// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../experiences/guest-experience/navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IFatalErrorContent } from './fatal-error.content';
import { FatalError, IFatalErrorProps } from './fatal-error';
import { FatalErrorStyles as styles } from './fatal-error.styles';
import { ImageAsset } from '../../../components/image-asset/image-asset';
import { BaseText } from '../../text/base-text/base-text';
import { InlineLink } from '../links/inline/inline.link';
import { ProtectedView } from '../../containers/protected-view/protected-view';
import { getChildren } from '../../../testing/test.helper';
import { MarkdownText } from '../../text/markdown-text/markdown-text';

jest.mock('react-native-skeleton-content', () => () => <div />);

jest.mock('../../image-asset/image-asset');

jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;

jest.mock('../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content');
const useContentMock = useContent as jest.Mock;

const fatalErrorProps: IFatalErrorProps = {
  errorMessage: 'please access <b>myrx.io</b> from you mobile <b>link</b>',
  supportEmail: 'support@email.com'
};

const customErrorContent: IFatalErrorContent = {
  loadingError: 'loading error',
  errorContact: 'error contact',
};

const isContentLoadingMock = false;

describe('FatalError component', () => {

  beforeEach(() => {
    jest.clearAllMocks();

    useNavigationMock.mockReturnValue(rootStackNavigationMock);

    useContentMock.mockReturnValue({
      content: customErrorContent,
      isContentLoading: isContentLoadingMock,
    });
  });

  it('should have one ImageAsset component with logo image', () => {
    const fatalError = renderer.create(<FatalError {...fatalErrorProps} />);
    const imageAssets = fatalError.root.findAllByType(ImageAsset);

    expect(imageAssets[0].props.name).toBe('headerMyPrescryptiveLogo');
    expect(imageAssets[0].props.style).toBe(styles.fatalErrorImageStyle);
  });

  it('should have loading error text below the logo Image', () => {
    const fatalError = renderer.create(<FatalError {...fatalErrorProps} />);
    const baseText = fatalError.root.findAllByType(BaseText);

    expect(baseText[0].props.children).toBe(customErrorContent.loadingError);
    expect(baseText[0].props.isSkeleton).toBe(isContentLoadingMock);
    expect(baseText[0].props.style).toStrictEqual([
      styles.fatalErrorTextStyle,
      styles.subTitleTextStyle
    ]);
  });

  it('should display custom error text if props.errorMessage is not empty', () => {
    const fatalError = renderer.create(<FatalError {...fatalErrorProps} />);
    
    const customError = fatalError.root.findByProps({
      testID: 'FatalError_CustomErrorMessage'
    });
    const errorText = fatalErrorProps.errorMessage
      .replace(/<b>/g, '**')
      .replace(/<\/b>/g, '**');

    expect(customError.type).toBe(MarkdownText);
    expect(customError.props.children).toBe(errorText);
  });

  it('should display default error text with email link if props.errorMessage is empty', () => {
    const testProps: IFatalErrorProps = {
      ...fatalErrorProps,
      errorMessage: ''
    };
    const fatalError = renderer.create(<FatalError {...testProps} />);
    
    const defaultError = fatalError.root.findByProps({
      testID: 'FatalError_DefaultErrorMessage'
    });

    expect(defaultError.type).toBe(BaseText);
    expect(defaultError.props.children).toBe(customErrorContent.errorContact);
    expect(defaultError.props.isSkeleton).toBe(isContentLoadingMock);

    const errorTextView = fatalError.root.findByType(ProtectedView);
    const emailLink = getChildren(errorTextView)[0];
    
    expect(emailLink.type).toBe(InlineLink);
    expect(emailLink.props.textStyle).toBe(styles.linkTextStyle);
    expect(emailLink.props.onPress).toEqual(expect.any(Function));
    expect(emailLink.props.children).toBe(testProps.supportEmail);
  });

  it('should set isSkeleton to true for error texts if isContentloading is true', () => {
    useContentMock.mockReturnValueOnce({
      content: customErrorContent,
      isContentLoading: true,
    });

    const testProps: IFatalErrorProps = {
      ...fatalErrorProps,
      errorMessage: ''
    };
    const fatalError = renderer.create(<FatalError {...testProps} />);
    const baseText = fatalError.root.findAllByType(BaseText);

    expect(baseText[0].props.isSkeleton).toBe(true);

    const defaultError = fatalError.root.findByProps({
      testID: 'FatalError_DefaultErrorMessage'
    });
    expect(defaultError.props.isSkeleton).toBe(true);
  });
});
