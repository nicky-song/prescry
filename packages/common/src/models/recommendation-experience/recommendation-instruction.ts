// Copyright 2018 Prescryptive Health, Inc.

export interface IRecommendationInstructionCommon {
  callToActionText: string;
  explanationText: string;
}

export interface IRecommendationInstructionAlternatives
  extends IRecommendationInstructionCommon {
  doctorContactNumber: string;
  doctorName: string;
}

export type IRecommendationInstructionGenerics =
  IRecommendationInstructionCommon;
