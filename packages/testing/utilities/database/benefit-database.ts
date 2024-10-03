// Copyright 2018 Prescryptive Health, Inc.

import { Db, Document, OptionalId } from 'mongodb';

const PERSON_COVERAGE_COLLECTION_NAME = 'PersonCoverage';
const PERSON_COLLECTION_NAME = 'Person';

class BenefitDatabase {
  private db: Db;
  constructor(db: Db) {
    this.db = db;
  }

  createPersonCoverage(personCoverage: OptionalId<Document>) {
    const collection = this.db.collection(PERSON_COVERAGE_COLLECTION_NAME);
    return collection.insertOne(personCoverage);
  }

  createPerson(person: OptionalId<Document>) {
    const collection = this.db.collection(PERSON_COLLECTION_NAME);
    return collection.insertOne(person);
  }
}

export default BenefitDatabase;
