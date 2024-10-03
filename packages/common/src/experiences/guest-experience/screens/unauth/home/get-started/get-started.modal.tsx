// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { SendLinkForm } from '../forms/send-link.form';
import { View } from 'react-native';
import { getStartedModalStyles } from './get-started.modal.styles';
import { DialogModal } from '../../../../../../components/modal/dialog-modal/dialog-modal';
import { BaseText } from '../../../../../../components/text/base-text/base-text';
import { formatPhoneNumber } from '../../../../../../utils/formatters/phone-number.formatter';
import { sendRegistrationText } from '../../../../api/api-v1.send-registration-text';
import { GuestExperienceConfig } from '../../../../guest-experience-config';
import {
  guestExperienceCustomEventLogger,
  CustomAppInsightEvents,
} from '../../../../guest-experience-logger.middleware';
import { LineSeparator } from '../../../../../../components/member/line-separator/line-separator';
import { ImageAsset } from '../../../../../../components/image-asset/image-asset';
import { useSessionContext } from '../../../../context-providers/session/use-session-context.hook';
import { InlineLink } from '../../../../../../components/member/links/inline/inline.link';
import { ErrorBadRequest } from '../../../../../../errors/error-bad-request';
import { IFailureResponse } from '../../../../../../models/api-response';
import { goToUrl } from '../../../../../../utils/link.helper';
import { CmsGroupKey } from '../../../../state/cms-content/cms-group-key';
import { IGetStartedModalContent } from '../../../../../../models/cms-content/desktop-modal-ui-content.model';
import { useContent } from '../../../../context-providers/session/ui-content-hooks/use-content';

export interface IGetStartedModalProps {
  show?: boolean;
  onHide?: () => void;
  textSent?: boolean;
  onTextSent?: (textSent: boolean) => void;
  path: string;
}

interface ErrorMessageState {
  errorStatus: boolean;
  errorMessage?: string;
}

export const GetStartedModal = (props: IGetStartedModalProps) => {
  const initialErrorState: ErrorMessageState = { errorStatus: false };
  const [error, setError] = useState(initialErrorState);
  const [phone, setPhone] = useState('');

  const {
    sessionState: { isGettingStartedModalOpen, currentLanguage },
  } = useSessionContext();

  const show = props.show ?? isGettingStartedModalOpen;

  const groupKey = CmsGroupKey.desktopModal;

  const { content, isContentLoading, fetchCMSContent } =
    useContent<IGetStartedModalContent>(groupKey, 2);

  useEffect(() => {
    if (!isContentLoading) {
      fetchCMSContent(currentLanguage);
    }
  }, [currentLanguage]);

  const handleMessageException = (apiError: IFailureResponse) => {
    if (apiError instanceof ErrorBadRequest) {
      setError({
        errorStatus: true,
        errorMessage: content.smsErrorInvalidNumber,
      });
    } else {
      setError({
        errorStatus: true,
        errorMessage: content.smsErrorSeriviceUnavailable,
      });
    }
  };

  const sendLink = async (userNumber: string) => {
    try {
      const response = await sendRegistrationText(
        GuestExperienceConfig.apis.guestExperienceApi,
        userNumber,
        currentLanguage,
        props.path
      );

      if (response.status === 'success') {
        if (props.onTextSent) {
          props.onTextSent(true);
        }
        setPhone(userNumber);
        setError({
          errorStatus: false,
          errorMessage: '',
        });
        guestExperienceCustomEventLogger(
          CustomAppInsightEvents.USER_SENT_CODE,
          {}
        );
      }
    } catch (error) {
      handleMessageException(error as IFailureResponse);
    }
  };

  const handleClose = () => {
    setError({
      errorStatus: false,
      errorMessage: '',
    });
    if (props.onHide) {
      props.onHide();
    }
    if (props.onTextSent) {
      props.onTextSent(false);
    }
  };

  const onSendEmail = async (): Promise<void> => {
    const emailAddress = `mailto:${content.email}`;
    await goToUrl(emailAddress);
  };

  const body = (
    <View>
      {!props.textSent ? (
        <View>
          <BaseText
            style={getStartedModalStyles.paragraphTextStyle}
            isSkeleton={isContentLoading}
            skeletonWidth='long'
          >
            <BaseText
              inheritStyle={true}
              style={getStartedModalStyles.strongTextStyle}
              isSkeleton={isContentLoading}
              skeletonWidth='long'
            >
              {content.enterMobile}
            </BaseText>{' '}
            {content.myrxMobileExperience}
          </BaseText>
          <BaseText
            style={getStartedModalStyles.paragraphTextStyle}
            isSkeleton={isContentLoading}
            skeletonWidth='long'
          >
            {content.yourNumberIsLogin}
          </BaseText>
        </View>
      ) : (
        <View>
          <BaseText
            style={getStartedModalStyles.paragraphTextStyle}
            isSkeleton={isContentLoading}
            skeletonWidth='long'
          >
            {content.sentMessage}{' '}
            <BaseText
              inheritStyle={true}
              style={getStartedModalStyles.strongTextStyle}
              isSkeleton={isContentLoading}
              skeletonWidth='long'
            >
              {formatPhoneNumber(phone)}
            </BaseText>{' '}
            {content.withALink}
          </BaseText>
          <BaseText
            style={getStartedModalStyles.paragraphTextStyle}
            isSkeleton={isContentLoading}
            skeletonWidth='long'
          >
            {content.clickRegistrationProcess}
          </BaseText>
        </View>
      )}
      <SendLinkForm
        onSendRegistrationTextRequest={sendLink}
        textSent={props.textSent}
        viewStyle={getStartedModalStyles.formViewStyle}
        isSkeleton={isContentLoading}
        getLinkLabel={content.getLinkLabel}
        resendLinkLabel={content.resendLinkLabel}
        sendLinkLabel={content.sendLinkLabel}
      />
      <View>
        {error.errorStatus ? (
          <BaseText
            style={getStartedModalStyles.errorStyle}
            isSkeleton={isContentLoading}
            skeletonWidth='long'
          >
            {error.errorMessage}
          </BaseText>
        ) : null}
      </View>
      <BaseText
        style={getStartedModalStyles.haveQuestionsParagraphTextStyle}
        isSkeleton={isContentLoading}
        skeletonWidth='long'
      >
        {content.haveQuestions}{' '}
        <InlineLink onPress={onSendEmail}>{content.email}</InlineLink>
      </BaseText>
    </View>
  );

  const headerText = !props.textSent ? content.getStarted : content.linkSent;
  const header = (
    <BaseText
      testID='getStartedModalLongTitle'
      style={getStartedModalStyles.headingTextStyle}
      isSkeleton={isContentLoading}
      skeletonWidth='long'
    >
      {headerText}
    </BaseText>
  );

  const footer = (
    <View
      style={getStartedModalStyles.footerViewStyle}
      testID='getStartedModalFooter'
    >
      <LineSeparator viewStyle={getStartedModalStyles.lineSeparatorViewStyle} />
      <ImageAsset
        name='poweredByPrescryptivePurple120'
        resizeMode='contain'
        style={getStartedModalStyles.footerImageStyle}
      />
    </View>
  );

  return (
    <DialogModal
      isOpen={show}
      onClose={handleClose}
      header={header}
      body={body}
      footer={footer}
      viewStyle={getStartedModalStyles.pageModalViewStyle}
    />
  );
};
