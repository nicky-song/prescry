// Copyright 2018 Prescryptive Health, Inc.

import { IContactInfo } from './contact-info';
import { IMedication } from './medication';
import { IPharmacyOffer } from './pharmacy-offer';
import { IPrescription } from './prescription';
import { IRecommendation } from './recommendation';
import { ITelemetryEvents } from './telemetry-id';

export interface IPendingPrescriptionsList extends ITelemetryEvents {
  identifier: string;
  prescriptions?: IPendingPrescription[];
  type?: string;
}

export interface IPendingPrescription {
  alternatives?: IMedication[];
  bestPrice: string; // no decimal
  confirmation?: IPendingPrescriptionOrderConfirmation;
  identifier: string;
  medication: IMedication;
  medicationId: string;
  offers: IPharmacyOffer[];
  personId?: string;
  pharmacies: IContactInfo[];
  prescription: IPrescription;
  recommendations?: IRecommendation[];
  shouldPushAlternative?: boolean;
}

export interface IPendingPrescriptionOrderConfirmation {
  offerId: string;
  orderNumber: string;
  orderDate: Date;
}
