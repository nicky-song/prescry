// Copyright 2018 Prescryptive Health, Inc.

import { Schema } from 'mongoose';
import { IAccount } from '@phx/common/src/models/account';
import { IAddress } from '@phx/common/src/models/address';
import {
  IAnswerFlow,
  IStaticQuestionnaire,
} from '@phx/common/src/models/static-questionnaire';
import { IAppointmentEvent } from '../../../../models/appointment-event';

import { IContactInfo } from '@phx/common/src/models/contact-info';
import { IHour, IHours } from '@phx/common/src/models/date-time/hours';
import { IImmunizationRecord } from '../../../../models/immunization-record';
import { IMedication } from '@phx/common/src/models/medication';
import { IMessageEnvelope } from '@phx/common/src/models/message-envelope';
import { IPatient } from '@phx/common/src/models/patient';
import { IPendingPrescription } from '@phx/common/src/models/pending-prescription';
import { IPerson } from '@phx/common/src/models/person';
import { IPharmacyOffer } from '@phx/common/src/models/pharmacy-offer';
import {
  IPrescription,
  IPrescriptionFillOptions,
} from '@phx/common/src/models/prescription';

import {
  IRecommendation,
  IRecommendationRule,
} from '@phx/common/src/models/recommendation';
import {
  IStaticFeed,
  IStaticFeedContext,
  IStaticFeedContextServiceItem,
  IStaticFeedContextServiceItemSubText,
} from '@phx/common/src/models/static-feed';
import { ITelemetryIds } from '@phx/common/src/models/telemetry-id';
import { IPharmacyInvitation, IWaitList } from '../../../../models/wait-list';

import { AccountDefinition } from '../definitions/account';
import { AddressDefinition } from '../definitions/address';
import { AnswerFlowDefinition } from '../definitions/answer-flow.definition';
import { AppointmentDefinition } from '../definitions/appointment.definition';
import { AppointmentInfoDefinition } from '../definitions/appointment-info.definition';
import { AppointmentEventDefinition } from '../definitions/appointment-event.definition';
import { CheckoutSessionDefinition } from '../definitions/checkout-session.definition';
import { ContactInfoDefinition } from '../definitions/contact-info';
import { EventIdentifierDefinition } from '../definitions/event-identifier.definition';
import { FillOptionsDefinition } from '../definitions/fill-options';
import { HourDefinition } from '../definitions/hour';
import { ImmunizationRecordEventDefinition } from '../definitions/immunization-record-event.definition';
import { MedicationDefinition } from '../definitions/medication';
import { MessageEnvelopeDefinition } from '../definitions/message-envelope';
import { PatientDefinition } from '../definitions/patient';
import {
  IPatientTestResultEvent,
  PatientTestResultEventDefinition,
} from '../definitions/patient-test-result-event.definition';
import { PendingPrescriptionDefinition } from '../definitions/pending-prescription';
import { PendingPrescriptionsListDefinition } from '../definitions/pending-prescriptions-list';
import { PersonDefinition } from '../definitions/person';
import { PharmacyOfferDefinition } from '../definitions/pharmacy-offer';
import { PrescriptionDefinition } from '../definitions/prescription';
import { RecommendationDefinition } from '../definitions/recommendation';
import { RecommendationRuleDefinition } from '../definitions/recommendation-rule';
import { QuestionAnswerDefinition } from '../definitions/question-answer.definition';
import { StaticFeedContextDefinition } from '../definitions/static-feed-context.definition';
import { StaticFeedContextServiceListDefinition } from '../definitions/static-feed-context-service-list.definition';
import { StaticFeedContextServiceListSubTextDefinition } from '../definitions/static-feed-context-service-list-subtext.definition';
import { StaticFeedDefinition } from '../definitions/static-feed.definition';
import { StaticQuestionnaireDefinition } from '../definitions/static-questionnaire.definition';
import { TimeDefinition } from '../definitions/time';
import { WaitListDefinition } from '../definitions/wait-list.definition';
import { WaitListPharmacyInvitationDefinition } from '../definitions/wait-list-pharmacy-invitation.definition';

import { SchemaDefinition } from 'mongoose';
import { setupSchemas } from './setup-schemas';
import { IPrescriptionPriceEvent } from '../../../../models/prescription-price-event';
import { PrescriptionPriceEventDefinition } from '../definitions/prescription-price-event.definition';
import {
  ICouponDetails,
  ICouponDetailsLogo,
} from '@phx/common/src/models/coupon-details/coupon-details';
import { CouponDetailsLogoDefinition } from '../definitions/coupon-details-logo.definition';
import { CouponDetailsDefinition } from '../definitions/coupon-details.definition';

jest.mock('../definitions/contact-info', () => ({
  ContactInfoDefinition: jest.fn(),
}));
jest.mock('../definitions/fill-options', () => ({
  FillOptionsDefinition: jest.fn(),
}));
jest.mock('../definitions/pharmacy-offer', () => ({
  PharmacyOfferDefinition: jest.fn(),
}));
jest.mock('../definitions/medication', () => ({
  MedicationDefinition: jest.fn(),
}));
jest.mock('../definitions/prescription', () => ({
  PrescriptionDefinition: jest.fn(),
}));
jest.mock('../definitions/pending-prescription', () => ({
  PendingPrescriptionDefinition: jest.fn(),
}));
jest.mock('../definitions/pending-prescriptions-list', () => ({
  PendingPrescriptionsListDefinition: jest.fn(),
}));
jest.mock('../definitions/patient', () => ({
  PatientDefinition: jest.fn(),
}));
jest.mock('../definitions/recommendation', () => ({
  RecommendationDefinition: jest.fn(),
}));
jest.mock('../definitions/recommendation-rule', () => ({
  RecommendationRuleDefinition: jest.fn(),
}));
jest.mock('../definitions/person', () => ({
  PersonDefinition: jest.fn(),
}));
jest.mock('../definitions/message-envelope', () => ({
  MessageEnvelopeDefinition: jest.fn(),
}));
jest.mock('../definitions/address', () => ({
  AddressDefinition: jest.fn(),
}));
jest.mock('../definitions/time', () => ({
  TimeDefinition: jest.fn(),
}));
jest.mock('../definitions/hour', () => ({
  HourDefinition: jest.fn(),
}));
jest.mock('../definitions/account', () => ({
  AccountDefinition: jest.fn(),
}));
jest.mock('../definitions/patient-test-result-event.definition');
jest.mock('../definitions/answer-flow.definition');
jest.mock('../definitions/static-feed.definition');
jest.mock('../definitions/static-questionnaire.definition');
jest.mock('../definitions/appointment.definition');
jest.mock('../definitions/appointment-info.definition');
jest.mock('../definitions/appointment-event.definition');
jest.mock('../definitions/checkout-session.definition');
jest.mock('../definitions/question-answer.definition');
jest.mock('../definitions/event-identifier.definition');
jest.mock('../definitions/immunization-record-event.definition');
jest.mock('../definitions/wait-list.definition');
jest.mock('../definitions/wait-list-pharmacy-invitation.definition');
jest.mock('../definitions/static-feed-context.definition');
jest.mock('../definitions/static-feed-context-service-list.definition');
jest.mock('../definitions/static-feed-context-service-list-subtext.definition');
jest.mock('../definitions/immunization-vaccine-codes.definition');
jest.mock('../definitions/prescription-price-event.definition');
jest.mock('../definitions/coupon-details-logo.definition');
jest.mock('../definitions/coupon-details.definition');

jest.mock('mongoose', () => ({
  Schema: jest.fn(),
}));

const schemaConstructorMock = Schema as unknown as jest.Mock;
schemaConstructorMock.prototype.set = jest.fn();

const AccountDefinitionMock = AccountDefinition as jest.Mock;
const AddressDefinitionMock = AddressDefinition as jest.Mock;
const HourDefinitionMock = HourDefinition as jest.Mock;
const TimeDefinitionMock = TimeDefinition as jest.Mock;
const ContactInfoDefinitionMock = ContactInfoDefinition as jest.Mock;
const FillOptionsDefinitionMock = FillOptionsDefinition as jest.Mock;
const PharmacyOfferDefinitionMock = PharmacyOfferDefinition as jest.Mock;
const MedicationDefinitionMock = MedicationDefinition as jest.Mock;
const PatientDefinitionMock = PatientDefinition as jest.Mock;
const PrescriptionDefinitionMock = PrescriptionDefinition as jest.Mock;
const PendingPrescriptionDefinitionMock =
  PendingPrescriptionDefinition as jest.Mock;
const PendingPrescriptionsListDefinitionMock =
  PendingPrescriptionsListDefinition as jest.Mock;
const RecommendationDefinitionMock = RecommendationDefinition as jest.Mock;
const RecommendationRuleDefinitionMock =
  RecommendationRuleDefinition as jest.Mock;
const PersonDefinitionMock = PersonDefinition as jest.Mock;
const MessageEnvelopeDefinitionMock = MessageEnvelopeDefinition as jest.Mock;
const answerFlowDefinitionMock = AnswerFlowDefinition as jest.Mock;
const patientTestResultEventDefinitionMock =
  PatientTestResultEventDefinition as jest.Mock;
const staticFeedDefinitionMock = StaticFeedDefinition as jest.Mock;
const staticQuestionnaireDefinitionMock =
  StaticQuestionnaireDefinition as jest.Mock;
const appointmentDefinitionMock = AppointmentDefinition as jest.Mock;
const appointmentInfoDefinitionMock = AppointmentInfoDefinition as jest.Mock;
const appointmentEventDefinitionMock = AppointmentEventDefinition as jest.Mock;
const checkoutSessionDefinitionMock = CheckoutSessionDefinition as jest.Mock;
const serviceQuestionAnswerDefinitionMock =
  QuestionAnswerDefinition as jest.Mock;
const eventIdentifierDefinitionMock = EventIdentifierDefinition as jest.Mock;
const immunizationRecordEventDefinitionMock =
  ImmunizationRecordEventDefinition as jest.Mock;
const waitListDefinitionMock = WaitListDefinition as jest.Mock;
const waitListPharmacyInvitationDefinitionMock =
  WaitListPharmacyInvitationDefinition as jest.Mock;
const staticFeedContextDefinitionMock =
  StaticFeedContextDefinition as jest.Mock;
const staticFeedContextServiceListDefinitionMock =
  StaticFeedContextServiceListDefinition as jest.Mock;
const staticFeedContextServiceListSubTextDefinitionMock =
  StaticFeedContextServiceListSubTextDefinition as jest.Mock;
const prescriptionPriceEventDefinitionMock =
  PrescriptionPriceEventDefinition as jest.Mock;
const couponDetailsLogoMock = CouponDetailsLogoDefinition as jest.Mock;
const couponDetailsMock = CouponDetailsDefinition as jest.Mock;

const schemaAccountDefinitionMock = {} as Schema;
const schemaAddressDefinitionMock = {} as Schema;
const schemaTimeDefinitionMock = {} as Schema;
const schemaHourDefinitionMock = {} as Schema;
const schemaContactInfoDefinitionMock = {} as Schema;
const schemaPharmacyOfferDefinitionMock = {} as Schema;
const schemaMedicationDefinitionMock = {} as Schema;
const schemaPrescriptionDefinitionMock = {} as Schema;
const schemaPendingPrescriptionDefinitionMock = {} as Schema;
const schemaPendingPrescriptionsListDefinitionMock = {} as Schema;
const schemaRecommendationDefinitionMock = {} as Schema;
const schemaRecommendationRuleDefinitionMock = {} as Schema;
const schemaPersonDefinitionMock = {} as Schema;
const schemaMessageEnvelopeDefinitionMock = {} as Schema;
const schemaAnswerFlowMock = {} as Schema;
const schemaPatientTestResultMock = {} as Schema;
const schemaStaticFeedMock = {} as Schema;
const schemaStaticQuestionnaireMock = {} as Schema;
const schemaAppointmentEventMock = {} as Schema;
const schemaImmunizationRecordEventMock = {} as Schema;
const schemaPrescriptionPriceEventMock = {} as Schema;
const schemaCouponDetailsLogoMock = {} as Schema;
const schemaCouponDetailsMock = {} as Schema;

const resultAccount = {} as SchemaDefinition<IAccount>;
const resultAddress = {} as SchemaDefinition<IAddress>;
const resultTime = {} as SchemaDefinition<IHour>;
const resultHour = {} as SchemaDefinition<IHours>;
const resultContactInfo = {} as SchemaDefinition<IContactInfo>;
const resultMedication = {} as SchemaDefinition<IMedication>;
const resultPharmacyOffer = {} as SchemaDefinition<IPharmacyOffer>;
const resultFillOptions = {} as SchemaDefinition<IPrescriptionFillOptions>;
const resultRecommendation = {} as SchemaDefinition<IRecommendation>;
const resultRecommendationRule = {} as SchemaDefinition<IRecommendationRule>;
const resultPatient = {} as SchemaDefinition<IPatient>;
const resultPrescription = {} as SchemaDefinition<IPrescription>;
const resultPerson = {} as SchemaDefinition<IPerson>;
const resultMessageEnvelope = {} as SchemaDefinition<IMessageEnvelope>;
const resultPendingPrescription = {} as SchemaDefinition<IPendingPrescription>;
const resultTelemetryIds = {} as SchemaDefinition<ITelemetryIds>;
const resultAnswerFlow = {} as SchemaDefinition<IAnswerFlow>;
const resultPatientTestResult = {} as SchemaDefinition<IPatientTestResultEvent>;
const resultStaticFeed = {} as SchemaDefinition<IStaticFeed>;
const resultStaticQuestionnaire = {} as SchemaDefinition<IStaticQuestionnaire>;
const resultAppointmentEvent = {} as SchemaDefinition<IAppointmentEvent>;
const resultImmunizationRecord = {} as SchemaDefinition<IImmunizationRecord>;
const resultStaticFeedContext = {} as SchemaDefinition<IStaticFeedContext>;
const resultStaticFeedContextServiceList =
  {} as SchemaDefinition<IStaticFeedContextServiceItem>;
const resultStaticFeedContextServiceListSubText =
  {} as SchemaDefinition<IStaticFeedContextServiceItemSubText>;
const resultPrescriptionPrice = {} as SchemaDefinition<IPrescriptionPriceEvent>;
const resultCouponDetailsLogo = {} as SchemaDefinition<ICouponDetailsLogo>;
const resultCouponDetails = {} as SchemaDefinition<ICouponDetails>;

beforeEach(() => {
  AccountDefinitionMock.mockReset();
  AddressDefinitionMock.mockReset();
  TimeDefinitionMock.mockReset();
  HourDefinitionMock.mockReset();
  ContactInfoDefinitionMock.mockReset();
  FillOptionsDefinitionMock.mockReset();
  PharmacyOfferDefinitionMock.mockReset();
  MedicationDefinitionMock.mockReset();
  PatientDefinitionMock.mockReset();
  PrescriptionDefinitionMock.mockReset();
  PendingPrescriptionDefinitionMock.mockReset();
  PendingPrescriptionsListDefinitionMock.mockReset();
  RecommendationDefinitionMock.mockReset();
  RecommendationRuleDefinitionMock.mockReset();
  PersonDefinitionMock.mockReset();
  MessageEnvelopeDefinitionMock.mockReset();
  answerFlowDefinitionMock.mockReset();
  patientTestResultEventDefinitionMock.mockReset();
  staticFeedDefinitionMock.mockReset();
  staticQuestionnaireDefinitionMock.mockReset();
  appointmentDefinitionMock.mockReset();
  appointmentInfoDefinitionMock.mockReset();
  appointmentEventDefinitionMock.mockReset();
  checkoutSessionDefinitionMock.mockReset();
  serviceQuestionAnswerDefinitionMock.mockReset();
  eventIdentifierDefinitionMock.mockReset();
  immunizationRecordEventDefinitionMock.mockReset();
  waitListDefinitionMock.mockReset();
  waitListPharmacyInvitationDefinitionMock.mockReset();
  staticFeedContextDefinitionMock.mockReset();
  staticFeedContextServiceListDefinitionMock.mockReset();
  staticFeedContextServiceListSubTextDefinitionMock.mockReset();
  prescriptionPriceEventDefinitionMock.mockReset();
  couponDetailsLogoMock.mockReset();
  couponDetailsMock.mockReset();
});

describe('setupSchemas()', () => {
  it('should construct ContactInfoSchema and return it with the results', () => {
    ContactInfoDefinitionMock.mockReturnValueOnce(resultContactInfo);
    AddressDefinitionMock.mockReturnValueOnce(resultAddress);
    HourDefinitionMock.mockReturnValueOnce(resultHour);
    const result = setupSchemas();
    expect(ContactInfoDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(1, resultContactInfo);
    expect(result).toMatchObject({
      ContactInfoSchema: schemaContactInfoDefinitionMock,
    });
  });

  it('should construct MedicationInfoSchema schema and return it with the results', () => {
    MedicationDefinitionMock.mockReturnValueOnce(resultMedication);
    const result = setupSchemas();
    expect(MedicationDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(1, resultMedication);
    expect(result).toMatchObject({
      MedicationSchema: schemaMedicationDefinitionMock,
    });
  });

  it('should construct PharmacyOfferSchema schema and return it with the results', () => {
    PharmacyOfferDefinitionMock.mockResolvedValue(resultPharmacyOffer);
    const result = setupSchemas();
    expect(PharmacyOfferDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultPharmacyOffer
    );
    expect(result).toMatchObject({
      PharmacyOfferSchema: schemaPharmacyOfferDefinitionMock,
    });
  });

  it('should construct PrescriptionSchema schema and return it with the results', () => {
    PrescriptionDefinitionMock.mockReturnValueOnce(resultPrescription);
    ContactInfoDefinitionMock.mockReturnValueOnce(resultContactInfo);
    FillOptionsDefinitionMock.mockReturnValueOnce(resultFillOptions);
    const result = setupSchemas();
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultPrescription
    );
    expect(PrescriptionDefinitionMock).toHaveBeenNthCalledWith(
      1,
      resultContactInfo,
      resultFillOptions
    );
    expect(result).toMatchObject({
      PrescriptionSchema: schemaPrescriptionDefinitionMock,
    });
  });

  it('should construct RecommendationSchema schema and return it with the results', () => {
    RecommendationDefinitionMock.mockReturnValueOnce(resultRecommendation);
    const result = setupSchemas();
    expect(RecommendationDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultRecommendation
    );
    expect(result).toMatchObject({
      RecommendationSchema: schemaRecommendationDefinitionMock,
    });
  });

  it('should construct RecommendationRuleSchema schema and return it with the results', () => {
    RecommendationRuleDefinitionMock.mockReturnValueOnce(
      resultRecommendationRule
    );
    const result = setupSchemas();
    expect(RecommendationRuleDefinitionMock).toHaveBeenCalledTimes(1);

    expect(schemaConstructorMock).toHaveBeenCalledWith(
      resultRecommendationRule
    );
    expect(RecommendationDefinitionMock).toHaveBeenNthCalledWith(
      1,
      resultRecommendationRule
    );
    expect(result).toMatchObject({
      RecommendationRuleSchema: schemaRecommendationRuleDefinitionMock,
    });
  });

  it('should construct PendingPrescriptionSchema schema and return it with the results', () => {
    ContactInfoDefinitionMock.mockReturnValueOnce(resultContactInfo);
    MedicationDefinitionMock.mockReturnValueOnce(resultMedication);
    PatientDefinitionMock.mockReturnValueOnce(resultPatient);
    PharmacyOfferDefinitionMock.mockReturnValueOnce(resultPharmacyOffer);
    PrescriptionDefinitionMock.mockReturnValueOnce(resultPrescription);
    RecommendationDefinitionMock.mockReturnValueOnce(resultRecommendation);

    PendingPrescriptionDefinitionMock.mockReturnValueOnce(
      resultPendingPrescription
    );

    const result = setupSchemas();
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultPendingPrescription
    );
    expect(PendingPrescriptionDefinitionMock).toHaveBeenNthCalledWith(
      1,
      resultContactInfo,
      resultMedication,
      resultPharmacyOffer,
      resultPrescription,
      resultRecommendation
    );
    expect(result).toMatchObject({
      PendingPrescriptionSchema: schemaPendingPrescriptionDefinitionMock,
    });
  });

  it('should construct PendingPrescriptionsListSchema schema and return it with the results', () => {
    PendingPrescriptionDefinitionMock.mockReturnValueOnce(
      resultPendingPrescription
    );

    const result = setupSchemas();
    expect(PendingPrescriptionsListDefinitionMock).toHaveBeenNthCalledWith(
      1,
      resultPendingPrescription,
      resultTelemetryIds
    );
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultPendingPrescription
    );
    expect(result).toMatchObject({
      PendingPrescriptionsListSchema:
        schemaPendingPrescriptionsListDefinitionMock,
    });
  });

  it('should construct PersonSchema and return it with the results', () => {
    PersonDefinitionMock.mockReturnValueOnce(resultPerson);
    const result = setupSchemas();
    expect(PersonDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(1, resultPerson);
    expect(result).toMatchObject({
      PersonSchema: schemaPersonDefinitionMock,
    });
  });

  it('should construct MessageEnvelopeDefinition and return it with the results', () => {
    MessageEnvelopeDefinitionMock.mockReturnValueOnce(resultMessageEnvelope);
    const result = setupSchemas();
    expect(MessageEnvelopeDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultMessageEnvelope
    );
    expect(result).toMatchObject({
      MessageEnvelopeSchema: schemaMessageEnvelopeDefinitionMock,
    });
  });

  it('should construct AddressSchema and return it with the results', () => {
    AddressDefinitionMock.mockReturnValueOnce(resultAddress);
    const result = setupSchemas();
    expect(AddressDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(1, resultAddress);
    expect(result).toMatchObject({
      AddressSchema: schemaAddressDefinitionMock,
    });
  });
  it('should construct TimeSchema and return it with the results', () => {
    TimeDefinitionMock.mockReturnValueOnce(resultTime);
    const result = setupSchemas();
    expect(TimeDefinitionMock).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      TimeSchema: schemaTimeDefinitionMock,
    });
  });
  it('should construct HourSchema and return it with the results', () => {
    HourDefinitionMock.mockReturnValueOnce(resultHour);
    TimeDefinitionMock.mockReturnValueOnce(resultTime);
    const result = setupSchemas();
    expect(HourDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(1, resultHour);
    expect(result).toMatchObject({
      HourSchema: schemaHourDefinitionMock,
    });
  });

  it('should construct AccountSchema and return it with the results', () => {
    AccountDefinitionMock.mockReturnValueOnce(resultAccount);
    const result = setupSchemas();
    expect(AccountDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(1, resultAccount);
    expect(result).toMatchObject({
      AccountSchema: schemaAccountDefinitionMock,
    });
  });
  it('should construct PatientTestResultSchema and return it with the results', () => {
    patientTestResultEventDefinitionMock.mockReturnValueOnce(
      resultPatientTestResult
    );
    const result = setupSchemas();
    expect(patientTestResultEventDefinitionMock).toHaveBeenCalledTimes(1);
    expect(eventIdentifierDefinitionMock).toHaveBeenCalledTimes(3);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultPatientTestResult
    );
    expect(result).toMatchObject({
      PatientTestResultEventSchema: schemaPatientTestResultMock,
    });
  });

  it('should construct StaticFeedSchema and return it with the results', () => {
    staticFeedContextServiceListSubTextDefinitionMock.mockReturnValueOnce(
      resultStaticFeedContextServiceListSubText
    );
    staticFeedContextServiceListDefinitionMock.mockReturnValueOnce(
      resultStaticFeedContextServiceList
    );
    staticFeedContextDefinitionMock.mockReturnValueOnce(
      resultStaticFeedContext
    );
    staticFeedDefinitionMock.mockReturnValueOnce(resultStaticFeed);
    const result = setupSchemas();
    expect(
      staticFeedContextServiceListSubTextDefinitionMock
    ).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultStaticFeedContextServiceListSubText
    );
    expect(staticFeedContextServiceListDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultStaticFeedContextServiceList
    );
    expect(staticFeedContextDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultStaticFeedContext
    );
    expect(staticFeedDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(1, resultStaticFeed);
    expect(result).toMatchObject({
      StaticFeedSchema: schemaStaticFeedMock,
    });
  });

  it('should construct AnswerFlowSchema and return it with the results', () => {
    answerFlowDefinitionMock.mockReturnValueOnce(resultAnswerFlow);
    const result = setupSchemas();
    expect(answerFlowDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(1, resultAnswerFlow);
    expect(result).toMatchObject({
      AnswerFlowSchema: schemaAnswerFlowMock,
    });
  });
  it('should construct StaticQuestionnaireSchema and return it with the results', () => {
    staticQuestionnaireDefinitionMock.mockReturnValueOnce(
      resultStaticQuestionnaire
    );
    const result = setupSchemas();
    expect(staticQuestionnaireDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultStaticQuestionnaire
    );
    expect(result).toMatchObject({
      StaticQuestionnaireSchema: schemaStaticQuestionnaireMock,
    });
  });

  it('should construct appointmentSchema and return it with the results', () => {
    appointmentDefinitionMock.mockReturnValueOnce({});
    appointmentInfoDefinitionMock.mockReturnValueOnce({});
    checkoutSessionDefinitionMock.mockReturnValueOnce({});
    appointmentEventDefinitionMock.mockReturnValueOnce(resultAppointmentEvent);
    const result = setupSchemas();
    expect(appointmentDefinitionMock).toHaveBeenCalledTimes(1);
    expect(appointmentInfoDefinitionMock).toHaveBeenCalledTimes(1);

    expect(serviceQuestionAnswerDefinitionMock).toHaveBeenCalledTimes(1);
    expect(appointmentEventDefinitionMock).toHaveBeenCalledTimes(1);
    expect(checkoutSessionDefinitionMock).toHaveBeenCalledTimes(1);
    expect(eventIdentifierDefinitionMock).toHaveBeenCalledTimes(3);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultAppointmentEvent
    );
    expect(result).toMatchObject({
      AppointmentEventSchema: schemaAppointmentEventMock,
    });
  });

  it('should construct ImmunizationRecordProcedureSchema and return it with the results', () => {
    immunizationRecordEventDefinitionMock.mockReturnValueOnce(
      resultImmunizationRecord
    );
    const result = setupSchemas();
    expect(immunizationRecordEventDefinitionMock).toHaveBeenCalledTimes(1);
    expect(eventIdentifierDefinitionMock).toHaveBeenCalledTimes(3);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultImmunizationRecord
    );
    expect(result).toMatchObject({
      ImmunizationRecordEventSchema: schemaImmunizationRecordEventMock,
    });
  });

  it('should construct WaitListSchema and return it with the results', () => {
    const schemaWaitListMock = {} as Schema;
    const resultWaitList = {} as SchemaDefinition<IWaitList>;
    const resultInvitation = {} as SchemaDefinition<IPharmacyInvitation>;

    waitListPharmacyInvitationDefinitionMock.mockReturnValueOnce(
      resultInvitation
    );
    waitListDefinitionMock.mockReturnValueOnce(resultWaitList);
    const result = setupSchemas();
    expect(waitListPharmacyInvitationDefinitionMock).toHaveBeenCalledTimes(1);
    expect(waitListDefinitionMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(1, resultInvitation);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(1, resultWaitList);
    expect(result).toMatchObject({
      WaitListSchema: schemaWaitListMock,
    });
  });

  it('should construct prescriptionPriceEventSchema and return it with the results', () => {
    prescriptionPriceEventDefinitionMock.mockReturnValueOnce(
      resultPrescriptionPrice
    );
    const result = setupSchemas();
    expect(prescriptionPriceEventDefinitionMock).toHaveBeenCalledTimes(1);
    expect(eventIdentifierDefinitionMock).toHaveBeenCalledTimes(3);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultPrescriptionPrice
    );
    expect(result).toMatchObject({
      prescriptionPriceEventSchema: schemaPrescriptionPriceEventMock,
    });
  });

  it('should construct CouponDetailsLogoSchema and return it with the results', () => {
    couponDetailsLogoMock.mockReturnValueOnce(resultCouponDetailsLogo);
    const result = setupSchemas();
    expect(couponDetailsLogoMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultCouponDetailsLogo
    );
    expect(result).toMatchObject({
      CouponDetailsLogoSchema: schemaCouponDetailsLogoMock,
    });
  });

  it('should construct CouponDetailsSchema and return it with the results', () => {
    couponDetailsMock.mockReturnValueOnce(resultCouponDetails);
    const result = setupSchemas();
    expect(couponDetailsMock).toHaveBeenCalledTimes(1);
    expect(couponDetailsLogoMock).toHaveBeenCalledTimes(1);
    expect(schemaConstructorMock).toHaveBeenNthCalledWith(
      1,
      resultCouponDetails
    );
    expect(result).toMatchObject({
      CouponDetailsSchema: schemaCouponDetailsMock,
    });
  });
});
