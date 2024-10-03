// Copyright 2018 Prescryptive Health, Inc.

import { Db, Document, OptionalId } from 'mongodb';
import { PersonDocument } from '../../types';

const ACCOUNT_COLLECTION_NAME = 'Account';
const PERSON_COLLECTION_NAME = 'Person';
const HEALTH_RECORD_EVENT_COLLECTION_NAME = 'HealthRecordEvent';
const SERVICES_COLLECTION_NAME = 'Services';
const MESSAGE_ENVELOPE_COLLECTION_NAME = 'MessageEnvelope';

class RxAssistantDatabase {
  private db: Db;
  constructor(db: Db) {
    this.db = db;
  }

  findAccountByPhoneNumber(phoneNumber: string) {
    const collection = this.db.collection(ACCOUNT_COLLECTION_NAME);
    return collection.find({ phoneNumber });
  }

  findPersonByPhoneNumber(phoneNumber: string) {
    const collection = this.db.collection(PERSON_COLLECTION_NAME);
    return collection.find<PersonDocument>({ phoneNumber });
  }

  findPersonByActivationPhoneNumber(activationPhoneNumber: string) {
    const collection = this.db.collection(PERSON_COLLECTION_NAME);
    return collection.find<PersonDocument>({ activationPhoneNumber });
  }

  findPersonByPhoneNumberAndRxGroupType(
    phoneNumber: string,
    rxGroupType: string
  ) {
    const collection = this.db.collection(PERSON_COLLECTION_NAME);
    return collection.findOne({
      phoneNumber,
      rxGroupType,
    });
  }

  async deletePersonByPhoneNumber(phoneNumber: string) {
    const collection = this.db.collection(PERSON_COLLECTION_NAME);
    const result = await collection.deleteMany({ phoneNumber });
    if (result.deletedCount < 1) {
      throw new Error(`Failed to delete person by phone number ${phoneNumber}`);
    }
  }

  async deletePersonByActivationPhoneNumber(activationPhoneNumber: string) {
    const collection = this.db.collection(PERSON_COLLECTION_NAME);
    const result = await collection.deleteMany({ activationPhoneNumber });
    return result.deletedCount;
  }

  async deleteAccountByPhoneNumber(phoneNumber: string) {
    const collection = this.db.collection(ACCOUNT_COLLECTION_NAME);
    const result = await collection.deleteMany({ phoneNumber });
    if (result.deletedCount < 1) {
      throw new Error(
        `Failed to delete account by phone number ${phoneNumber}`
      );
    }
  }

  createPerson(person: OptionalId<Document>) {
    const collection = this.db.collection(PERSON_COLLECTION_NAME);
    return collection.insertOne(person);
  }

  findAppointmentByOrderNumber(orderNumber: string) {
    const collection = this.db.collection(HEALTH_RECORD_EVENT_COLLECTION_NAME);
    return collection.findOne({
      eventType: 'appointment/confirmation',
      'eventData.orderNumber': orderNumber,
    });
  }

  getServicesByType(serviceType: string) {
    const collection = this.db.collection(SERVICES_COLLECTION_NAME);
    return collection.findOne({
      serviceType,
    });
  }
  createAccount(account: OptionalId<Document>) {
    const collection = this.db.collection(ACCOUNT_COLLECTION_NAME);
    return collection.insertOne(account);
  }
}

export default RxAssistantDatabase;
