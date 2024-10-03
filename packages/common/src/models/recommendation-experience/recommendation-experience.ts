// Copyright 2018 Prescryptive Health, Inc.

import { IPendingPrescription } from '../pending-prescription';
import {
  IRecommendation,
  IRecommendationCarouselContent,
} from '../recommendation';
import {
  IRecommendationInstructionAlternatives,
  IRecommendationInstructionGenerics,
} from './recommendation-instruction';
import { IRecommendationOffer } from './recommendation-offer';

export interface IRecommendationExperience {
  selectedRecommendation?:
    | IRecommendationExperienceGenerics
    | IRecommendationExperienceAlternatives
    | IRecommendationExperienceTransfer
    | IClaimAlertExperienceNotification
    | IClaimAlertExperienceReversal;
  genericSubstitution?: IRecommendationExperienceGenerics;
  alternativeSubstitution?: IRecommendationExperienceAlternatives;
  transfer?: IRecommendationExperienceTransfer;
  notification?: IClaimAlertExperienceNotification;
  reversal?: IClaimAlertExperienceReversal;
}

export interface IRecommendationExperienceCommon<TInstruction> {
  originalOffer: IRecommendationOffer;
  prescription: IPendingPrescription;
  instruction: TInstruction;
  recommendation: IRecommendation;
  carousel: IRecommendationCarouselContent;
}

export interface IRecommendationExperienceAlternatives
  extends IRecommendationExperienceCommon<IRecommendationInstructionAlternatives> {
  recommendedOffers: IRecommendationOffer[];
}

export interface IRecommendationExperienceGenerics
  extends IRecommendationExperienceCommon<IRecommendationInstructionGenerics> {
  recommendedOffer: IRecommendationOffer;
}

export interface IRecommendationExperienceTransfer
  extends IRecommendationExperienceCommon<string> {
  recommendedOffers: IRecommendationOffer[];
  // TODO...
}
export interface IClaimAlertExperienceNotification {
  carousel: IRecommendationCarouselContent;
  recommendation: IRecommendation;
  originalOffer: IRecommendationOffer;
  prescription: IPendingPrescription;
}

export interface IClaimAlertExperienceReversal {
  carousel: IRecommendationCarouselContent;
  recommendation: IRecommendation;
  originalOffer: IRecommendationOffer;
  prescription: IPendingPrescription;
}
