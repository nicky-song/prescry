// Copyright 2018 Prescryptive Health, Inc.

import { IContactInfo } from '../contact-info';
import { IMedication } from '../medication';
import { IPharmacyOffer } from '../pharmacy-offer';
import { IPrescriptionFillOptions } from '../prescription';

export interface IRecommendationOffer {
  fillOptions: IPrescriptionFillOptions;
  medication: IMedication;
  offer: IPharmacyOffer;
  pharmacy: IContactInfo;
}
