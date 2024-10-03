// Copyright 2018 Prescryptive Health, Inc.

import { model } from 'mongoose';
import { ISchemas } from './setup-schemas';
import { setupModels } from './setup-models';

jest.mock('mongoose', () => ({
  model: jest.fn(),
}));

const modelMock = model as jest.Mock;

const schemasMock = {
  AccountSchema: {},
  AppointmentEventSchema: {},
  AddressSchema: {},
  AnswerFlowSchema: {},
  ContactInfoSchema: {},
  HourSchema: {},
  MedicationSchema: {},
  MessageEnvelopeSchema: {},
  PatientTestResultEventSchema: {},
  PendingPrescriptionSchema: {},
  PendingPrescriptionsListSchema: {},
  PersonSchema: {},
  PharmacyOfferSchema: {},
  PrescriptionSchema: {},
  RecommendationRuleSchema: {},
  RecommendationSchema: {},
  StaticFeedSchema: {},
  StaticQuestionnaireSchema: {},
  TimeSchema: {},
  ImmunizationRecordEventSchema: {},
  WaitListSchema: {},
  prescriptionPriceEventSchema: {},
} as ISchemas;

beforeEach(() => {
  modelMock.mockReset();
});

describe('setupModels()', () => {
  it('sets up ContactInfoModel from the contact info schema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'ContactInfo',
      schemasMock.ContactInfoSchema
    );
    expect(result).toMatchObject({ ContactInfoModel: model });
  });

  it('sets up MedicationModel from the contact info schema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'Medication',
      schemasMock.MedicationSchema
    );
    expect(result).toMatchObject({ MedicationModel: model });
  });

  it('sets up PendingPrescriptionModel from the contact info schema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'PendingPrescription',
      schemasMock.PendingPrescriptionSchema
    );
    expect(result).toMatchObject({ PendingPrescriptionModel: model });
  });

  it('sets up PendingPrescriptionsListModel from the contact info schema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'PendingPrescriptionsList',
      schemasMock.PendingPrescriptionsListSchema
    );
    expect(result).toMatchObject({ PendingPrescriptionModel: model });
  });

  it('sets up PharmacyOfferModel from the contact info schema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'PharmacyOffer',
      schemasMock.PharmacyOfferSchema
    );
    expect(result).toMatchObject({ PharmacyOfferModel: model });
  });

  it('sets up PrescriptionModel from the contact info schema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'Prescription',
      schemasMock.PrescriptionSchema
    );
    expect(result).toMatchObject({ PrescriptionModel: model });
  });

  it('sets up RecommendationModel from the contact info schema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'Recommendation',
      schemasMock.RecommendationSchema
    );
    expect(result).toMatchObject({ RecommendationModel: model });
  });

  it('sets up RecommendationRuleModel from the contact info schema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'RecommendationRule',
      schemasMock.RecommendationRuleSchema
    );
    expect(result).toMatchObject({ RecommendationRuleModel: model });
  });

  it('sets up PersonModel from the person schema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith('Person', schemasMock.PersonSchema);
    expect(result).toMatchObject({ PersonModel: model });
  });

  it('sets up MessageEnvelopeModel from the message-envelope schema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'MessageEnvelope',
      schemasMock.MessageEnvelopeSchema
    );
    expect(result).toMatchObject({ MessageEnvelopeModel: model });
  });

  it('sets up AddressModel from the address schema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith('Address', schemasMock.AddressSchema);
    expect(result).toMatchObject({ AddressModel: model });
  });

  it('sets up TimeModel from the time schema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith('Time', schemasMock.TimeSchema);
    expect(result).toMatchObject({ TimeModel: model });
  });

  it('sets up HourModel from the hour schema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith('Hour', schemasMock.HourSchema);
    expect(result).toMatchObject({ HourModel: model });
  });

  it('sets up AccountModel from the account schema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith('Account', schemasMock.AccountSchema);
    expect(result).toMatchObject({ AccountModel: model });
  });
  it('sets up StaticFeedModel from the StaticFeedSchema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'StaticFeed',
      schemasMock.StaticFeedSchema
    );
    expect(result).toMatchObject({ StaticFeedModel: model });
  });

  it('sets up AnswerFlowModel from the AnswerFlowSchema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'AnswerFlow',
      schemasMock.AnswerFlowSchema
    );
    expect(result).toMatchObject({ AnswerFlowModel: model });
  });
  it('sets up StaticQuestionnaireModel from the StaticQuestionnaireSchema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'StaticQuestionnaire',
      schemasMock.StaticQuestionnaireSchema
    );
    expect(result).toMatchObject({ StaticQuestionnaireModel: model });
  });
  it('sets up PatientTestResultEventModel from the PatientTestResultEventSchema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'PatientTestResultEvent',
      schemasMock.PatientTestResultEventSchema,
      'HealthRecordEvent'
    );
    expect(result).toMatchObject({ PatientTestResultEventModel: model });
  });
  it('sets up AppointmentEventModel from the AppointmentEventSchema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'AppointmentEvent',
      schemasMock.AppointmentEventSchema,
      'HealthRecordEvent'
    );
    expect(result).toMatchObject({ AppointmentEventModel: model });
  });

  it('sets up ImmunizationRecordEventModel from the ImmunizationRecordEventSchema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'ImmunizationRecordEvent',
      schemasMock.ImmunizationRecordEventSchema,
      'HealthRecordEvent'
    );
    expect(result).toMatchObject({ PatientTestResultEventModel: model });
  });

  it('sets up WaitListModel from the WaitListSchema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith('Waitlist', schemasMock.WaitListSchema);
    expect(result).toMatchObject({ WaitListModel: model });
  });

  it('sets up PrescriptionPriceEventModel from the PrescriptionSchema', () => {
    modelMock.mockReturnValue(model);
    const result = setupModels(schemasMock);
    expect(modelMock).toBeCalledWith(
      'PrescriptionPriceEvent',
      schemasMock.PrescriptionSchema,
      'HealthRecordEvent'
    );
    expect(result).toMatchObject({ PrescriptionPriceEventModel: model });
  });
});
