// Copyright 2018 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { AccountDefinition } from '../definitions/account';
import { AddressDefinition } from '../definitions/address';
import { AnswerFlowDefinition } from '../definitions/answer-flow.definition';
import { AppointmentDefinition } from '../definitions/appointment.definition';
import { AppointmentInfoDefinition } from '../definitions/appointment-info.definition';
import { AppointmentEventDefinition } from '../definitions/appointment-event.definition';
import { CheckoutSessionDefinition } from '../definitions/checkout-session.definition';
import { ClaimInformationDefinition } from '../definitions/claim-information.definition';
import { ContactInfoDefinition } from '../definitions/contact-info';
import { EventIdentifierDefinition } from '../definitions/event-identifier.definition';
import { FillOptionsDefinition } from '../definitions/fill-options';
import { HourDefinition } from '../definitions/hour';
import { ImmunizationDosesDefinition } from '../definitions/immunization-doses.definition';
import { ImmunizationRecordDefinition } from '../definitions/immunization-record.definition';
import { ImmunizationRecordEventDefinition } from '../definitions/immunization-record-event.definition';
import { ImmunizationVaccineCodesDefinition } from '../definitions/immunization-vaccine-codes.definition';
import { MedicationDefinition } from '../definitions/medication';
import { MessageEnvelopeDefinition } from '../definitions/message-envelope';
import { PatientDefinition } from '../definitions/patient';
import { PatientTestResultDefinition } from '../definitions/patient-test-result.defintion';
import { PatientTestResultEventDefinition } from '../definitions/patient-test-result-event.definition';
import { PendingPrescriptionDefinition } from '../definitions/pending-prescription';
import { PendingPrescriptionsListDefinition } from '../definitions/pending-prescriptions-list';
import { PersonDefinition } from '../definitions/person';
import { PharmacyOfferDefinition } from '../definitions/pharmacy-offer';
import { PrescriptionDefinition } from '../definitions/prescription';
import { RecommendationDefinition } from '../definitions/recommendation';
import { RecommendationRuleDefinition } from '../definitions/recommendation-rule';
import { QuestionAnswerDefinition } from '../definitions/question-answer.definition';
import { StaticFeedAudienceDefinition } from '../definitions/static-feed-audience.definition';
import { StaticFeedContextDefinition } from '../definitions/static-feed-context.definition';
import { StaticFeedContextServiceListDefinition } from '../definitions/static-feed-context-service-list.definition';
import { StaticFeedDefinition } from '../definitions/static-feed.definition';
import { StaticQuestionnaireDefinition } from '../definitions/static-questionnaire.definition';
import { TelemetryIdsDefination } from '../definitions/telemetry-id';
import { TimeDefinition } from '../definitions/time';
import { WaitListDefinition } from '../definitions/wait-list.definition';
import { WaitListPharmacyInvitationDefinition } from '../definitions/wait-list-pharmacy-invitation.definition';
import { PrescriptionPriceDefinition } from '../definitions/prescription-price.definition';
import { PrescriptionPriceEventDefinition } from '../definitions/prescription-price-event.definition';
import { CouponDetailsDefinition } from '../definitions/coupon-details.definition';
import { CouponDetailsLogoDefinition } from '../definitions/coupon-details-logo.definition';
import { StaticFeedContextServiceListSubTextDefinition } from '../definitions/static-feed-context-service-list-subtext.definition';
export interface ISchemas {
  AccountSchema: Schema;
  AddressSchema: Schema;
  AnswerFlowSchema: Schema;
  AppointmentEventSchema: Schema;
  ContactInfoSchema: Schema;
  FillOptionsSchema: Schema;
  HourSchema: Schema;
  ImmunizationRecordEventSchema: Schema;
  MedicationSchema: Schema;
  MessageEnvelopeSchema: Schema;
  PatientSchema: Schema;
  PatientTestResultEventSchema: Schema;
  PendingPrescriptionSchema: Schema;
  PendingPrescriptionsListSchema: Schema;
  PharmacyOfferSchema: Schema;
  PrescriptionSchema: Schema;
  RecommendationSchema: Schema;
  RecommendationRuleSchema: Schema;
  PersonSchema: Schema;
  StaticFeedSchema: Schema;
  StaticQuestionnaireSchema: Schema;
  TimeSchema: Schema;
  WaitListSchema: Schema;
  prescriptionPriceEventSchema: Schema;
  CouponDetailsLogoSchema: Schema;
  CouponDetailsSchema: Schema;
}

export function setupSchemas(): ISchemas {
  const AddressSchema = new Schema(AddressDefinition());
  const TimeSchema = new Schema(TimeDefinition());
  const HourSchema = new Schema(HourDefinition(TimeSchema));
  const ContactInfoSchema = new Schema(
    ContactInfoDefinition(AddressSchema, HourSchema)
  );
  const FillOptionsSchema = new Schema(FillOptionsDefinition());
  const MedicationSchema = new Schema(MedicationDefinition());
  const PharmacyOfferSchema = new Schema(PharmacyOfferDefinition());

  PharmacyOfferSchema.set('toJSON', {
    getters: true,
    transform: (_doc, ret) => {
      if (ret.price.planCoveragePays) {
        ret.price.planCoveragePays = ret.price.planCoveragePays.toString();
      }

      if (ret.price.memberPaysOffer) {
        ret.price.memberPaysOffer = ret.price.memberPaysOffer.toString();
      }

      if (ret.price.memberPaysTotal) {
        ret.price.memberPaysTotal = ret.price.memberPaysTotal.toString();
      } else {
        ret.price.memberPaysTotal = ret.price.memberPaysOffer;
      }

      if (ret.sort.price) {
        ret.sort.price = ret.sort.price.toString();
      }

      delete ret.__v;
      return ret;
    },
  });

  const PatientSchema = new Schema(PatientDefinition());
  const PrescriptionSchema = new Schema(
    PrescriptionDefinition(ContactInfoSchema, FillOptionsSchema)
  );
  const RecommendationRuleSchema = new Schema(
    RecommendationRuleDefinition(MedicationSchema)
  );
  const RecommendationSchema = new Schema(
    RecommendationDefinition(RecommendationRuleSchema)
  );

  const PendingPrescriptionSchema = new Schema(
    PendingPrescriptionDefinition(
      ContactInfoSchema,
      MedicationSchema,
      PharmacyOfferSchema,
      PrescriptionSchema,
      RecommendationSchema
    )
  );
  const TelemetryIdsSchema = new Schema(TelemetryIdsDefination());
  const PendingPrescriptionsListSchema = new Schema(
    PendingPrescriptionsListDefinition(
      PendingPrescriptionSchema,
      TelemetryIdsSchema
    ),
    { collection: 'PendingPrescriptionLists' }
  );

  const PersonSchema = new Schema(PersonDefinition(), { collection: 'Person' });

  const MessageEnvelopeSchema = new Schema(
    MessageEnvelopeDefinition(PendingPrescriptionsListSchema),
    {
      collection: 'MessageEnvelope',
    }
  );

  const AccountSchema = new Schema(AccountDefinition(), {
    collection: 'Account',
  });
  const patientTestResultSchema = new Schema(PatientTestResultDefinition());
  const eventIdentifierSchema = new Schema(EventIdentifierDefinition());

  const PatientTestResultEventSchema = new Schema(
    PatientTestResultEventDefinition(
      patientTestResultSchema,
      eventIdentifierSchema
    ),
    {
      collection: 'HealthRecordEvent',
    }
  );
  const StaticFeedContextServiceListSubTextSchema = new Schema(
    StaticFeedContextServiceListSubTextDefinition()
  );
  const StaticFeedContextServiceListSchema = new Schema(
    StaticFeedContextServiceListDefinition(
      StaticFeedContextServiceListSubTextSchema
    )
  );
  const StaticFeedAudienceSchema = new Schema(StaticFeedAudienceDefinition());
  const StaticFeedContextSchema = new Schema(
    StaticFeedContextDefinition(StaticFeedContextServiceListSchema)
  );
  const StaticFeedSchema = new Schema(
    StaticFeedDefinition(StaticFeedAudienceSchema, StaticFeedContextSchema),
    {
      collection: 'StaticFeed',
    }
  );
  const AnswerFlowSchema = new Schema(AnswerFlowDefinition());
  const StaticQuestionnaireSchema = new Schema(
    StaticQuestionnaireDefinition(AnswerFlowSchema),
    {
      collection: 'StaticQuestionnaire',
    }
  );

  const immunizationVaccineCodeSchema = new Schema(
    ImmunizationVaccineCodesDefinition()
  );

  const appointmentInfoSchema = new Schema(AppointmentInfoDefinition());
  const serviceQuestionAnswerSchema = new Schema(QuestionAnswerDefinition());
  const checkoutSessionSchema = new Schema(CheckoutSessionDefinition());

  const claimInformationSchema = new Schema(ClaimInformationDefinition());

  const appointmentSchema = new Schema(
    AppointmentDefinition(
      appointmentInfoSchema,
      serviceQuestionAnswerSchema,
      checkoutSessionSchema,
      claimInformationSchema
    )
  );
  const eventIdentifierAppointmentSchema = new Schema(
    EventIdentifierDefinition()
  );

  const AppointmentEventSchema = new Schema(
    AppointmentEventDefinition(
      appointmentSchema,
      eventIdentifierAppointmentSchema
    ),
    {
      collection: 'HealthRecordEvent',
    }
  );

  const immunizationDosesSchema = new Schema(ImmunizationDosesDefinition());

  const immunizationRecordSchema = new Schema(
    ImmunizationRecordDefinition(
      immunizationDosesSchema,
      immunizationVaccineCodeSchema
    )
  );

  const ImmunizationRecordEventSchema = new Schema(
    ImmunizationRecordEventDefinition(
      immunizationRecordSchema,
      eventIdentifierAppointmentSchema
    ),
    {
      collection: 'HealthRecordEvent',
    }
  );

  const pharmacyInvitationSchema = new Schema(
    WaitListPharmacyInvitationDefinition()
  );
  const WaitListSchema = new Schema(
    WaitListDefinition(pharmacyInvitationSchema),
    {
      collection: 'Waitlist',
    }
  );

  const eventIdentifierPrescriptionPriceSchema = new Schema(
    EventIdentifierDefinition()
  );
  const CouponDetailsLogoSchema = new Schema(CouponDetailsLogoDefinition());
  const CouponDetailsSchema = new Schema(
    CouponDetailsDefinition(CouponDetailsLogoSchema)
  );
  const prescriptionPriceSchema = new Schema(
    PrescriptionPriceDefinition(CouponDetailsSchema)
  );
  const prescriptionPriceEventSchema = new Schema(
    PrescriptionPriceEventDefinition(
      prescriptionPriceSchema,
      eventIdentifierPrescriptionPriceSchema
    ),
    {
      collection: 'HealthRecordEvent',
    }
  );
  return {
    AccountSchema,
    AddressSchema,
    AnswerFlowSchema,
    AppointmentEventSchema,
    ContactInfoSchema,
    FillOptionsSchema,
    HourSchema,
    ImmunizationRecordEventSchema,
    MedicationSchema,
    MessageEnvelopeSchema,
    PatientSchema,
    PatientTestResultEventSchema,
    PendingPrescriptionSchema,
    PendingPrescriptionsListSchema,
    PharmacyOfferSchema,
    PrescriptionSchema,
    RecommendationSchema,
    RecommendationRuleSchema,
    PersonSchema,
    StaticFeedSchema,
    StaticQuestionnaireSchema,
    TimeSchema,
    WaitListSchema,
    prescriptionPriceEventSchema,
    CouponDetailsLogoSchema,
    CouponDetailsSchema,
  };
}
