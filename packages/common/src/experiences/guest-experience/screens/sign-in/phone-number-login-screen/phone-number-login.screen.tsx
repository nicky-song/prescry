// Copyright 2018 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import {
  IPhoneNumberLoginContainerProps,
  PhoneNumberLoginContainer,
} from '../../../../../components/member/phone-number-login-container/phone-number-login-container';
import { TermsConditionsAndPrivacyCheckbox } from '../../../../../components/member/checkboxes/terms-conditions-and-privacy/terms-conditions-and-privacy.checkbox';
import { PopupModal } from '../../../../../components/modal/popup-modal/popup-modal';
import { Workflow } from '../../../../../models/workflow';
import { LengthOfPhoneNumber } from '../../../../../theming/constants';
import { phoneNumberLoginScreenStyles } from './phone-number-login.screen.styles';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { IPhoneVerificationActionParams } from '../../../store/phone-number-login/phone-number-login.reducer.action';
import { InlineLink } from '../../../../../components/member/links/inline/inline.link';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { setIsUnauthExperienceDispatch } from '../../../state/session/dispatch/set-is-unauth-experience.dispatch';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  PhoneNumberLoginRouteProp,
  PhoneNumberLoginNavigationProp,
} from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { ICreateAccountScreenRouteProps } from '../create-account/create-account.screen';
import { ISignInContent } from '../../../../../models/cms-content/sign-in.ui-content';
import { useContent } from '../../../context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../state/cms-content/cms-group-key';

export type IPhoneNumberLoginScreenProps = IPhoneNumberLoginContainerProps;

export type PhoneScreenModalContentType = {
  showModal: boolean;
  modalTopContent: string;
};
export interface IPhoneNumberLoginScreenRouteProps {
  workflow?: Workflow;
  hasNavigateBack?: boolean;
  modalContent?: PhoneScreenModalContentType;
  prescriptionId?: string;
  isBlockchain?: boolean;
}
export interface IPhoneNumberLoginScreenActionProps {
  navigateToOneTimePasswordVerification: (
    phoneVerificationActionParams: IPhoneVerificationActionParams
  ) => void;
  onSetPhoneNumberAction: (phoneNumber: string) => void;
}

export const PhoneNumberLoginScreen = ({
  ...props
}: IPhoneNumberLoginScreenProps &
  IPhoneNumberLoginScreenActionProps): React.ReactElement => {
  const navigation = useNavigation<PhoneNumberLoginNavigationProp>();

  const { params } = useRoute<PhoneNumberLoginRouteProp>();
  const {
    workflow,
    hasNavigateBack,
    modalContent,
    prescriptionId,
    isBlockchain,
  } = params;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isTermAccepted, setIsTermAccepted] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(
    modalContent?.showModal ?? false
  );

  const { sessionDispatch } = useSessionContext();

  const groupKey = CmsGroupKey.signIn;
  const { content, isContentLoading } = useContent<ISignInContent>(groupKey, 2);

  const onAcceptTermsPress = (isTermAcceptedCurrent: boolean) => {
    setIsTermAccepted(isTermAcceptedCurrent);
  };

  const toggleModal = (modalToggleCurrent: boolean) => {
    setShowModal(!modalToggleCurrent);
  };

  const onPrimaryButtonPress = () => {
    toggleModal(showModal);
  };

  const onNavigateBack = hasNavigateBack
    ? () => {
        setIsUnauthExperienceDispatch(sessionDispatch, true);
        navigation.goBack();
      }
    : undefined;

  const modal = modalContent?.showModal ? (
    <PopupModal
      content={modalContent.modalTopContent || ''}
      isOpen={showModal}
      toggleModal={onPrimaryButtonPress}
      onPrimaryButtonPress={onPrimaryButtonPress}
    />
  ) : null;

  const onCreateAccountPress = () => {
    if (workflow) {
      navigation.navigate('CreateAccount', {
        workflow,
        blockchain: isBlockchain,
      } as ICreateAccountScreenRouteProps);
    }
  };
  const onTextInputChangeHandler = (phone: string) => {
    setPhoneNumber(phone);
  };
  const navigateToOneTimePasswordVerification = () => {
    props.onSetPhoneNumberAction(phoneNumber);
    props.navigateToOneTimePasswordVerification({
      phoneNumber,
      workflow,
      navigation,
      prescriptionId,
      isBlockchain,
    });
  };

  const isGetStartedButtonEnabled: boolean =
    !!phoneNumber &&
    phoneNumber.length >= LengthOfPhoneNumber &&
    isTermAccepted;

  const topContent = (
    <View>
      <PhoneNumberLoginContainer
        {...props}
        onTextInputChangeHandler={onTextInputChangeHandler}
      />
    </View>
  );

  const bottomContent = (
    <View style={phoneNumberLoginScreenStyles.bottomContentViewStyle}>
      <TermsConditionsAndPrivacyCheckbox
        onPress={onAcceptTermsPress}
        viewStyle={
          phoneNumberLoginScreenStyles.termsAndConditionsContainerViewStyle
        }
      />
      <BaseButton
        disabled={!isGetStartedButtonEnabled}
        onPress={navigateToOneTimePasswordVerification}
        testID='phoneNumberLoginNextButton'
      >
        {content.nextButtonLabel}
      </BaseButton>
      {workflow ? (
        <View style={phoneNumberLoginScreenStyles.notHaveAccountViewStyle}>
          <BaseText
            style={phoneNumberLoginScreenStyles.smallTextStyle}
            isSkeleton={isContentLoading}
          >
            {content.notHaveAccountHelpText}{' '}
            <InlineLink inheritStyle={true} onPress={onCreateAccountPress}>
              {content.phoneNumberLoginCreateAccountText}
            </InlineLink>
          </BaseText>
        </View>
      ) : null}
    </View>
  );

  const body = (
    <BodyContentContainer
      viewStyle={phoneNumberLoginScreenStyles.bodyContentContainerViewStyle}
      title={content.phoneNumberLoginHeader}
      isSkeleton={isContentLoading}
      testID='phoneNumberLoginScreenBodyContentContainer'
    >
      {topContent}
      {bottomContent}
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      hideApplicationHeader={false}
      body={body}
      allowBodyGrow={true}
      modals={modal}
      navigateBack={onNavigateBack}
      translateContent={true}
    />
  );
};
