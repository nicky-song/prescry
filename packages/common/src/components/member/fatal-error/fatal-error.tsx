// Copyright 2018 Prescryptive Health, Inc.

import React from 'react';
import {
  StatusBar,
  View,
} from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { IFatalErrorContent } from './fatal-error.content';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { BaseText } from '../../text/base-text/base-text';
import { ImageAsset } from '../../image-asset/image-asset';
import { FatalErrorStyles as styles } from './fatal-error.styles';
import { ProtectedView } from '../../containers/protected-view/protected-view';
import { InlineLink } from '../links/inline/inline.link';
import { goToUrl } from '../../../utils/link.helper';
import { MarkdownText } from '../../text/markdown-text/markdown-text';

export interface IFatalErrorProps {
  errorMessage: string;
  supportEmail: string;
}

export const FatalError: React.SFC<IFatalErrorProps> = (props) => {

  const {
    content: fatalErrorContent,
    isContentLoading
  } = useContent<IFatalErrorContent>(
    CmsGroupKey.fatalError,
    2
  );

  StatusBar.setHidden(true);

  const customErrorMessage = props.errorMessage
    .replace(/<b>/g, '**')
    .replace(/<\/b>/g, '**');

  const onPressEmail = async () => {
    await goToUrl(`mailto:${props.supportEmail}`);
  };
  
  const errorBody = props.errorMessage
    ? (
      <MarkdownText
        textStyle={styles.fatalErrorTextStyle}
        markdownTextStyle={styles.customErrorTextStyle}
        testID='FatalError_CustomErrorMessage'
      >
        {customErrorMessage}
      </MarkdownText>
    )
    : (
      <>
        <BaseText
          style={styles.fatalErrorTextStyle}
          isSkeleton={isContentLoading}
          testID='FatalError_DefaultErrorMessage'
        >
          {fatalErrorContent.errorContact}
        </BaseText>
        <ProtectedView>
          <InlineLink
            textStyle={styles.linkTextStyle}
            onPress={onPressEmail}
          >
            {props.supportEmail}
          </InlineLink>
        </ProtectedView>
      </>
    );
  
  return (
    <View style={styles.fatalErrorViewStyle}>
      <ImageAsset
        name='headerMyPrescryptiveLogo'
        style={styles.fatalErrorImageStyle}
      />
      <BaseText
        style={[styles.fatalErrorTextStyle, styles.subTitleTextStyle]}
        isSkeleton={isContentLoading}
      >
        {fatalErrorContent.loadingError}
      </BaseText>
      {errorBody}
    </View>
  );
};
