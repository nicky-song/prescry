// Copyright 2018 Prescryptive Health, Inc.

import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ImageSourcePropType, View } from 'react-native';
import { HomeButton } from '../../../components/buttons/home/home.button';
import { BodyContentContainer } from '../../../components/containers/body-content/body-content.container';
import {
  AlternativePrescription,
  IAlternativePrescription,
} from '../../../components/member/alternative-prescription/alternative-prescription';
import { ClaimAlertSavingDetails } from '../../../components/member/claim-alert-saving-details/claim-alert-saving-details';
import { LineSeparator } from '../../../components/member/line-separator/line-separator';
import { MoreAboutDiabetesContainer } from '../../../components/member/more-about-diabetes-container/more-about-diabetes';
import {
  IPharmacyInformationProps,
  PharmacyInformation,
} from '../../../components/member/pharmacy-information/pharmacy-information';
import {
  IRecommendationBottomProps,
  RecommendationBottom,
} from '../../../components/member/recommendation-bottom/recommendation-bottom';
import { RecommendationInstruction } from '../../../components/member/recommendation-instruction/recommendation-instruction';
import {
  IRecommendationTopProps,
  RecommendationTop,
} from '../../../components/member/recommendation-top/recommendation-top';
import { StickyView } from '../../../components/pages/basic-page';
import { BasicPageConnected } from '../../../components/pages/basic-page-connected';
import { IContactInfo } from '../../../models/contact-info';
import { IPharmacyOffer } from '../../../models/pharmacy-offer';
import { ImageInstanceNames } from '../../../theming/assets';
import { callPhoneNumber } from '../../../utils/link.helper';
import { useReduxContext } from '../context-providers/redux/use-redux-context.hook';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../guest-experience-logger.middleware';
import { ClaimAlertStackNavigationProp } from '../navigation/stack-navigators/claim-alert/claim-alert.stack-navigator';
import { navigateHomeScreenNoApiRefreshDispatch } from '../store/navigation/dispatch/navigate-home-screen-no-api-refresh.dispatch';
import { PrescriptionRecommendationType } from '../store/prescriptions/prescriptions-reducer';
import { IClaimsAlertSavingsProps } from './claim-alert-screen.content';
import { claimAlertScreenStyles } from './claim-alert-screen.style';
export interface IClaimAlertCoupon {
  imageName: ImageInstanceNames;
  show: boolean;
}
export interface IClaimAlertInstruction {
  callToActionText: string;
  explanationText: string;
  doctorContactNumber?: string;
  doctorName?: string;
}
export interface IClaimAlertProps {
  pharmacyDetails: IPharmacyInformationProps;
  instruction?: IClaimAlertInstruction;
  offers?: IAlternativePrescription[];
  alertId: string;
  type: PrescriptionRecommendationType;
  alertSavingContent: IClaimsAlertSavingsProps;
}

export interface IDrugInformation {
  drugName: string;
  NDC: string;
  externalLink: string;
  videoImage: string;
  videoLink: string;
}

export interface IOfferRowProps {
  offerId: string;
  pharmacyId: string;
  pharmacyName: string;
  dispenseType: string;
  distanceText?: string;
  price: number;
  shippingPrice: number;
  isOpen?: boolean;
  slug: string;
  body: string;
  image: ImageSourcePropType;
  externalLink: { moreLinkText: string; link: string };
}

export interface IClaimAlertScreenProps {
  offerList: IOfferRowProps[];
  prescription: IRecommendationTopProps & IRecommendationBottomProps;
  drugInformation?: IDrugInformation;
  purchasedOffer?: IPharmacyOffer;
  purchasedPharmacy?: IContactInfo;
  alertProps?: IClaimAlertProps;
  memberProfileName?: string;
}

export type IClaimAlertScreenActionProps = {
  getDrugInformation: (ndc?: string) => void;
};

export const ClaimAlertScreen = ({
  getDrugInformation,
  prescription,
  ...props
}: IClaimAlertScreenProps & IClaimAlertScreenActionProps) => {
  const navigation = useNavigation<ClaimAlertStackNavigationProp>();
  const { getState: reduxGetState } = useReduxContext();

  useEffect(() => {
    getDrugInformation(prescription.medicationId);
  }, [prescription.medicationId, getDrugInformation]);

  guestExperienceCustomEventLogger(
    CustomAppInsightEvents.USER_NAVIGATED_CLAIM_ALERT_SCREEN,
    {
      payloadMessage: prescription.medicationId,
    }
  );
  const alertProps = props.alertProps;
  const claimAlertContent = () => {
    if (alertProps && alertProps.alertSavingContent) {
      return <ClaimAlertSavingDetails {...alertProps.alertSavingContent} />;
    }
    return;
  };
  const stickyIndices: number[] = [];
  const stickyViews: StickyView[] = [];

  const renderOfferRowContent = () => {
    if (alertProps && alertProps.offers) {
      return alertProps.offers.map(
        (alternative: IAlternativePrescription, index: number) => (
          <AlternativePrescription
            key={index}
            {...alternative}
            price={alternative.price}
            planPays={alternative.planPays || '0'}
          />
        )
      );
    }
    return;
  };

  const renderOfferDetailsInstruction = () => {
    if (alertProps && alertProps.instruction) {
      return (
        <RecommendationInstruction
          {...alertProps.instruction}
          callToDoctor={callPhoneNumber}
        />
      );
    }
    return;
  };
  const renderMoreAboutDiabetesContent = () => {
    if (prescription.drugInformation?.videoLink) {
      return <MoreAboutDiabetesContainer {...prescription} />;
    }
    return;
  };
  const renderPharmacyDetailsContent = () => {
    if (alertProps && alertProps.pharmacyDetails) {
      return <PharmacyInformation {...alertProps.pharmacyDetails} {...props} />;
    }
    return;
  };

  const body = (
    <BodyContentContainer viewStyle={claimAlertScreenStyles.bodyViewStyle}>
      <View style={claimAlertScreenStyles.viewContainer}>
        {claimAlertContent()}
        <LineSeparator
          viewStyle={claimAlertScreenStyles.lineSeparatorViewStyle}
        />
      </View>
      {renderOfferRowContent()}
      {renderOfferDetailsInstruction()}
      {renderMoreAboutDiabetesContent()}
      <View style={claimAlertScreenStyles.viewContainer}>
        {renderPharmacyDetailsContent()}
      </View>
      <LineSeparator
        viewStyle={claimAlertScreenStyles.lineSeparatorViewStyle}
      />
    </BodyContentContainer>
  );

  const header = (
    <>
      <RecommendationTop {...prescription} />
      <RecommendationBottom {...prescription} />
    </>
  );
  stickyViews.push({
    view: (
      <View style={claimAlertScreenStyles.headerViewStyle}>
        <RecommendationTop {...prescription} />
      </View>
    ),
  });
  stickyIndices.push(1);

  const onHomeNavigate = () => {
    navigateHomeScreenNoApiRefreshDispatch(reduxGetState, navigation);
  };

  const footer = <HomeButton onPress={onHomeNavigate} />;

  return (
    <BasicPageConnected
      stickyIndices={stickyIndices}
      stickyViews={stickyViews}
      header={header}
      headerViewStyle={claimAlertScreenStyles.headerViewStyle}
      body={body}
      showProfileAvatar={true}
      memberProfileName={props.memberProfileName}
      footer={footer}
      translateContent={true}
    />
  );
};
