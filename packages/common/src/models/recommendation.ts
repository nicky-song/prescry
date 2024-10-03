// Copyright 2018 Prescryptive Health, Inc.

import { ImageInstanceNames } from '../theming/assets';
import { BlueScale, GreyScale } from '../theming/theme';
import { IMedication } from './medication';

export type RecommendationType =
  | 'genericSubstitution'
  | 'alternativeSubstitution'
  | 'transfer'
  | 'notification'
  | 'reversal';

export interface IRecommendation {
  identifier: string;
  type: RecommendationType;
  savings: number;
  rule: IRecommendationRule;
}

export interface IRecommendationRule {
  planGroupNumber: string;
  type: RecommendationType;
  description: string;
  medication: IMedication;
  genericSubstitution?: IRecommendationGenericSubstitutionRule;
  alternativeSubstitution?: IRecommendationAlternativesSubstitutionRule;
  notificationMessageTemplate?: string;
  reversalMessageTemplate?: string;
  minimumSavingsAmount?: string;
  minimumPlanSavingsAmount?: string;
}
export interface IRecommendationRuleTo {
  medication: IMedication;
  fillOptions: {
    count: number;
    daysSupply?: number;
    authorizedRefills: number;
    fillNumber: number;
  };
}
export interface IRecommendationGenericSubstitutionRule {
  toMedication: IMedication;
  to: IRecommendationRuleTo;
  savings?: string;
  planSavings?: string;
}
export interface IRecommendationAlternativesSubstitutionRule {
  toMedications: IMedication[];
  to: IRecommendationRuleTo[];
  savings?: string;
  planSavings?: string;
}

export interface IRecommendationCarouselContent {
  bodyContent: string;
  buttonCaption: string;
  buttonColor?: GreyScale.regular | BlueScale.darker;
  buttonTextColor?: GreyScale.lightest | GreyScale.darkest;
  fontColor: string;
  imageName?: ImageInstanceNames;
  priceText: string;
}
