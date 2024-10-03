// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IConfiguration } from '../../configuration';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { addMembershipHandler } from './handlers/add-membership.handler';
import { getMembersHandler } from './handlers/get-members.handler';
import { verifyMembershipHandler } from './handlers/verify-membership.handler';

export class MembersController {
  public database: IDatabase;
  public configuration: IConfiguration;

  constructor(
    configuration: IConfiguration,
    database: IDatabase,
  ) {
    this.database = database;
    this.configuration = configuration;
  }

  public getMembers = async (request: Request, response: Response) =>
    await getMembersHandler(
      request,
      response,
      this.database,
      this.configuration
    );

  public addMembership = async (request: Request, response: Response) =>
    await addMembershipHandler(
      request,
      response,
      this.database,
      this.configuration
    );

  public verifyMembership = async (request: Request, response: Response) =>
    await verifyMembershipHandler(
      request,
      response,
      this.database,
      this.configuration
    );
}
