// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { getPrescriptionInfoHandler } from './handlers/get-prescription-info.handler';
import { sendPrescriptionHandler } from './handlers/send-prescription.handler';
import { IConfiguration } from '../../configuration';
import { searchPharmacyHandler } from './handlers/search-pharmacy.handler';
import { IDatabase } from '../../databases/mongo-database/v1/setup/setup-database';
import { transferPrescriptionHandler } from './handlers/transfer-prescription.handler';
import { getPrescriptionsByPatientIdHandler } from './handlers/get-prescriptions-by-patient-id.handler';
import { getPrescriptionUserStatusHandler } from './handlers/get-prescription-user-status.handler';
import { Twilio } from 'twilio';
import { verifyPrescriptionInfoHandler } from './handlers/verify-prescription-info.handler';
import { verifyPatientInfoHandler } from './handlers/verify-patient-info.handler';

export class PrescriptionController {
  public configuration: IConfiguration;
  public database: IDatabase;
  public twilioClient: Twilio;

  constructor(
    configuration: IConfiguration,
    database: IDatabase,
    twilioClient: Twilio
  ) {
    this.configuration = configuration;
    this.database = database;
    this.twilioClient = twilioClient;
  }

  public verifyPatientInfo = async (request: Request, response: Response) =>
    await verifyPatientInfoHandler(request, response, this.configuration);

  public verifyPrescriptionInfo = async (
    request: Request,
    response: Response
  ) =>
    await verifyPrescriptionInfoHandler(
      request,
      response,
      this.configuration,
      this.twilioClient,
      this.database
    );

  public getPrescriptionInfo = async (request: Request, response: Response) =>
    await getPrescriptionInfoHandler(
      request,
      response,
      this.configuration,
      this.database
    );
  public getMedicineCabinet = async (request: Request, response: Response) =>
    await getPrescriptionsByPatientIdHandler(
      request,
      response,
      this.configuration
    );

  public searchPharmacy = async (request: Request, response: Response) =>
    await searchPharmacyHandler(request, response, this.configuration);

  public sendPrescription = async (request: Request, response: Response) =>
    await sendPrescriptionHandler(
      request,
      response,
      this.configuration,
      this.twilioClient
    );

  public transferPrescription = async (request: Request, response: Response) =>
    await transferPrescriptionHandler(
      request,
      response,
      this.configuration,
      this.twilioClient
    );

  public getPrescriptionUserStatus = async (
    request: Request,
    response: Response
  ) =>
    await getPrescriptionUserStatusHandler(
      request,
      response,
      this.configuration
    );
}
