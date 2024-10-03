// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { getPrescriptionInfoHandler } from './handlers/get-prescription-info.handler';
import { PrescriptionController } from './prescription.controller';
import { sendPrescriptionHandler } from './handlers/send-prescription.handler';
import { transferPrescriptionHandler } from './handlers/transfer-prescription.handler';
import { verifyPrescriptionInfoHandler } from './handlers/verify-prescription-info.handler';
import { getPrescriptionUserStatusHandler } from './handlers/get-prescription-user-status.handler';
import { searchPharmacyHandler } from './handlers/search-pharmacy.handler';
import { getPrescriptionsByPatientIdHandler } from './handlers/get-prescriptions-by-patient-id.handler';
import { databaseMock } from '../../mock-data/database.mock';
import { configurationMock } from '../../mock-data/configuration.mock';
import { twilioMock } from '../../mock-data/twilio.mock';
import { verifyPatientInfoHandler } from './handlers/verify-patient-info.handler';

jest.mock('./handlers/get-prescriptions-by-patient-id.handler');
const getPrescriptionsByPatientIdHandlerMock =
  getPrescriptionsByPatientIdHandler as jest.Mock;

jest.mock('./handlers/get-prescription-info.handler');
const getPrescriptionInfoHandlerMock = getPrescriptionInfoHandler as jest.Mock;

jest.mock('./handlers/search-pharmacy.handler');
const searchPharmacyHandlerMock = searchPharmacyHandler as jest.Mock;

jest.mock('./handlers/send-prescription.handler');
const sendPrescriptionHandlerMock = sendPrescriptionHandler as jest.Mock;

jest.mock('./handlers/transfer-prescription.handler');
const transferPrescriptionHandlerMock =
  transferPrescriptionHandler as jest.Mock;

jest.mock('./handlers/get-prescription-user-status.handler');
const getPrescriptionUserStatusHandlerMock =
  getPrescriptionUserStatusHandler as jest.Mock;

jest.mock('./handlers/verify-prescription-info.handler');
const verifyPrescriptionInfoHandlerMock =
  verifyPrescriptionInfoHandler as jest.Mock;

jest.mock('./handlers/verify-patient-info.handler');
const verifyPatientInfoHandlerMock = verifyPatientInfoHandler as jest.Mock;

const routerResponseMock = {} as Response;
const requestMock = {} as Request;

describe('PrescriptionInfoController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create controller object with route methods', () => {
    const prescriptionController = new PrescriptionController(
      configurationMock,
      databaseMock,
      twilioMock
    );
    expect(prescriptionController.getMedicineCabinet).toBeDefined();
    expect(prescriptionController.getPrescriptionInfo).toBeDefined();
    expect(prescriptionController.searchPharmacy).toBeDefined();
    expect(prescriptionController.sendPrescription).toBeDefined();
    expect(prescriptionController.transferPrescription).toBeDefined();
    expect(prescriptionController.verifyPrescriptionInfo).toBeDefined();
    expect(prescriptionController.verifyPatientInfo).toBeDefined();
  });

  it('should call getPrescriptionsByPatientIdHandlerMock handler for getPrescriptionInfo Route', async () => {
    const routeHandler = new PrescriptionController(
      configurationMock,
      databaseMock,
      twilioMock
    ).getMedicineCabinet;
    await routeHandler(requestMock, routerResponseMock);
    expect(getPrescriptionsByPatientIdHandlerMock).toBeCalledTimes(1);

    expect(getPrescriptionsByPatientIdHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });

  it('calls verifyPatientInfoHandler for verifyPatientInfoHandler route', async () => {
    const routeHandler = new PrescriptionController(
      configurationMock,
      databaseMock,
      twilioMock
    ).verifyPatientInfo;
    await routeHandler(requestMock, routerResponseMock);

    expect(verifyPatientInfoHandlerMock).toBeCalledTimes(1);
    expect(verifyPatientInfoHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });

  it('calls verifyPrescriptionInfoHandler for verifyPrescriptionInfoHandler route (version %p)', async () => {
    const routeHandler = new PrescriptionController(
      configurationMock,
      databaseMock,
      twilioMock
    ).verifyPrescriptionInfo;
    await routeHandler(requestMock, routerResponseMock);

    expect(verifyPrescriptionInfoHandlerMock).toBeCalledTimes(1);
    expect(verifyPrescriptionInfoHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock,
      twilioMock,
      databaseMock
    );
  });

  it('should call getPrescriptionInfoHandler handler for getPrescriptionInfo Route', async () => {
    const routeHandler = new PrescriptionController(
      configurationMock,
      databaseMock,
      twilioMock
    ).getPrescriptionInfo;
    await routeHandler(requestMock, routerResponseMock);
    expect(getPrescriptionInfoHandlerMock).toBeCalledTimes(1);

    expect(getPrescriptionInfoHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock,
      databaseMock
    );
  });

  it('should call searchPharmacyHandler handler for searchPharmacy Route', async () => {
    const routeHandler = new PrescriptionController(
      configurationMock,
      databaseMock,
      twilioMock
    ).searchPharmacy;
    await routeHandler(requestMock, routerResponseMock);
    expect(searchPharmacyHandlerMock).toBeCalledTimes(1);

    expect(searchPharmacyHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });

  it('should call sendPrescriptionHandler for sendPrescription Route', async () => {
    const routeHandler = new PrescriptionController(
      configurationMock,
      databaseMock,
      twilioMock
    ).sendPrescription;
    await routeHandler(requestMock, routerResponseMock);
    expect(sendPrescriptionHandlerMock).toBeCalledTimes(1);

    expect(sendPrescriptionHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock,
      twilioMock
    );
  });

  it('should call transferPrescriptionHandler for transferPrescription Route', async () => {
    const routeHandler = new PrescriptionController(
      configurationMock,
      databaseMock,
      twilioMock
    ).transferPrescription;
    await routeHandler(requestMock, routerResponseMock);
    expect(transferPrescriptionHandlerMock).toBeCalledTimes(1);

    expect(transferPrescriptionHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock,
      twilioMock
    );
  });

  it('should call getPrescriptionUserStatusHandler handler for user status check Route', async () => {
    const routeHandler = new PrescriptionController(
      configurationMock,
      databaseMock,
      twilioMock
    ).getPrescriptionUserStatus;
    await routeHandler(requestMock, routerResponseMock);
    expect(getPrescriptionUserStatusHandlerMock).toBeCalledTimes(1);

    expect(getPrescriptionUserStatusHandlerMock).toHaveBeenCalledWith(
      requestMock,
      routerResponseMock,
      configurationMock
    );
  });
});
