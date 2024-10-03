// Copyright 2018 Prescryptive Health, Inc.

import { Document, Model, model } from 'mongoose';
import { IAccount } from '@phx/common/src/models/account';
import { IAddress } from '@phx/common/src/models/address';
import { IContactInfo } from '@phx/common/src/models/contact-info';
import { IHour, IHours } from '@phx/common/src/models/date-time/hours';
import { IMedication } from '@phx/common/src/models/medication';
import { IMessageEnvelope } from '@phx/common/src/models/message-envelope';
import {
  IPendingPrescription,
  IPendingPrescriptionsList,
} from '@phx/common/src/models/pending-prescription';
import { IPerson } from '@phx/common/src/models/person';
import { IPharmacyOffer } from '@phx/common/src/models/pharmacy-offer';
import { IPrescription } from '@phx/common/src/models/prescription';
import {
  IRecommendation,
  IRecommendationRule,
} from '@phx/common/src/models/recommendation';
import { IStaticFeed } from '@phx/common/src/models/static-feed';
import {
  IAnswerFlow,
  IStaticQuestionnaire,
} from '@phx/common/src/models/static-questionnaire';
import { ISchemas } from './setup-schemas';
import { IPatientTestResultEvent } from '../definitions/patient-test-result-event.definition';
import { IAppointmentEvent } from '../../../../models/appointment-event';
import { IImmunizationRecordEvent } from '../../../../models/immunization-record';
import { IWaitList } from '../../../../models/wait-list';
import { IPrescriptionPriceEvent } from '../../../../models/prescription-price-event';

export interface IModels {
  AddressModel: Model<IAddress & Document>;
  TimeModel: Model<IHour & Document>;
  HourModel: Model<IHours & Document>;
  ContactInfoModel: Model<IContactInfo & Document>;
  MedicationModel: Model<IMedication & Document>;
  PendingPrescriptionModel: Model<IPendingPrescription & Document>;
  PendingPrescriptionsListModel: Model<IPendingPrescriptionsList & Document>;
  PharmacyOfferModel: Model<IPharmacyOffer & Document>;
  PrescriptionModel: Model<IPrescription & Document>;
  RecommendationModel: Model<IRecommendation & Document>;
  RecommendationRuleModel: Model<IRecommendationRule & Document>;
  PersonModel: Model<IPerson & Document>;
  AccountModel: Model<IAccount & Document>;
  MessageEnvelopeModel: Model<IMessageEnvelope & Document>;
  PatientTestResultEventModel: Model<IPatientTestResultEvent & Document>;
  StaticFeedModel: Model<IStaticFeed & Document>;
  AnswerFlowModel: Model<IAnswerFlow & Document>;
  StaticQuestionnaireModel: Model<IStaticQuestionnaire & Document>;
  AppointmentEventModel: Model<IAppointmentEvent & Document>;
  ImmunizationRecordEventModel: Model<IImmunizationRecordEvent & Document>;
  WaitListModel: Model<IWaitList & Document>;
  PrescriptionPriceEventModel: Model<IPrescriptionPriceEvent & Document>;
}

export function setupModels(schemas: ISchemas): IModels {
  const ContactInfoModel = model<IContactInfo & Document>(
    'ContactInfo',
    schemas.ContactInfoSchema
  );

  const MedicationModel = model<IMedication & Document>(
    'Medication',
    schemas.MedicationSchema
  );

  const PharmacyOfferModel = model<IPharmacyOffer & Document>(
    'PharmacyOffer',
    schemas.PharmacyOfferSchema
  );

  const PrescriptionModel = model<IPrescription & Document>(
    'Prescription',
    schemas.PrescriptionSchema
  );

  const PendingPrescriptionModel = model<IPendingPrescription & Document>(
    'PendingPrescription',
    schemas.PendingPrescriptionSchema
  );

  const PendingPrescriptionsListModel = model<
    IPendingPrescriptionsList & Document
  >('PendingPrescriptionsList', schemas.PendingPrescriptionsListSchema);

  const RecommendationModel = model<IRecommendation & Document>(
    'Recommendation',
    schemas.RecommendationSchema
  );

  const RecommendationRuleModel = model<IRecommendationRule & Document>(
    'RecommendationRule',
    schemas.RecommendationRuleSchema
  );

  const AddressModel = model<IAddress & Document>(
    'Address',
    schemas.AddressSchema
  );
  const TimeModel = model<IHour & Document>('Time', schemas.TimeSchema);
  const HourModel = model<IHours & Document>('Hour', schemas.HourSchema);

  const PersonModel = model<IPerson & Document>('Person', schemas.PersonSchema);

  const MessageEnvelopeModel = model<IMessageEnvelope & Document>(
    'MessageEnvelope',
    schemas.MessageEnvelopeSchema
  );

  const AccountModel = model<IAccount & Document>(
    'Account',
    schemas.AccountSchema
  );
  const PatientTestResultEventModel = model<IPatientTestResultEvent & Document>(
    'PatientTestResultEvent',
    schemas.PatientTestResultEventSchema,
    'HealthRecordEvent'
  );

  const StaticFeedModel = model<IStaticFeed & Document>(
    'StaticFeed',
    schemas.StaticFeedSchema
  );
  const AnswerFlowModel = model<IAnswerFlow & Document>(
    'AnswerFlow',
    schemas.AnswerFlowSchema
  );
  const StaticQuestionnaireModel = model<IStaticQuestionnaire & Document>(
    'StaticQuestionnaire',
    schemas.StaticQuestionnaireSchema
  );
  const AppointmentEventModel = model<IAppointmentEvent & Document>(
    'AppointmentEvent',
    schemas.AppointmentEventSchema,
    'HealthRecordEvent'
  );

  const PrescriptionPriceEventModel = model<IPrescriptionPriceEvent & Document>(
    'PrescriptionPriceEvent',
    schemas.prescriptionPriceEventSchema,
    'HealthRecordEvent'
  );

  const ImmunizationRecordEventModel = model<
    IImmunizationRecordEvent & Document
  >(
    'ImmunizationRecordEvent',
    schemas.ImmunizationRecordEventSchema,
    'HealthRecordEvent'
  );

  const WaitListModel = model<IWaitList & Document>(
    'Waitlist',
    schemas.WaitListSchema
  );
  return {
    AccountModel,
    AddressModel,
    AnswerFlowModel,
    AppointmentEventModel,
    ContactInfoModel,
    HourModel,
    MedicationModel,
    MessageEnvelopeModel,
    PatientTestResultEventModel,
    PendingPrescriptionModel,
    PendingPrescriptionsListModel,
    PersonModel,
    PharmacyOfferModel,
    PrescriptionModel,
    RecommendationModel,
    RecommendationRuleModel,
    StaticFeedModel,
    StaticQuestionnaireModel,
    TimeModel,
    ImmunizationRecordEventModel,
    WaitListModel,
    PrescriptionPriceEventModel,
  };
}
