// Copyright 2018 Prescryptive Health, Inc.

import { MongoClient, ObjectId } from 'mongodb';
import BenefitDatabase from './benefit-database';
import RxAssistantDatabase from './rx-assistant-database';

import {
  DATABASE_CONNECTION_STRING,
  DATABASE_NAME,
  BENEFIT_DATABASE_NAME,
} from '../settings';

class DatabaseConnection {
  private client: MongoClient;
  private constructor(client: MongoClient) {
    this.client = client;
  }

  public static connect = async () => {
    const client = new MongoClient(DATABASE_CONNECTION_STRING);
    await client.connect();
    return new DatabaseConnection(client);
  };

  async close() {
    await this.client?.close();
  }

  getBenefit() {
    const db = this.client.db(BENEFIT_DATABASE_NAME);
    return new BenefitDatabase(db);
  }

  getRxAssistant() {
    const db = this.client.db(DATABASE_NAME);
    return new RxAssistantDatabase(db);
  }

  createObjectId() {
    return new ObjectId();
  }
}

export default DatabaseConnection;
