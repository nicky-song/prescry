// Copyright 2023 Prescryptive Health, Inc.

import { Db, MongoClient } from 'mongodb';

export class RxAssistanceDbContext {
  private _client: MongoClient;
  private _connectionStringUri: string;
  private _db: Db;

  constructor(connectionStringUri: string, dbName: string) {
    this._connectionStringUri = connectionStringUri;
    this._client = new MongoClient(this._connectionStringUri);
    this._db = this._client.db(dbName);
  }

  async connect() {
    await this._client.connect();
  }

  async close() {
    await this._client.close();
  }

  get messageEnvelopeCollection() {
    return this._db.collection('MessageEnvelope');
  }
}
