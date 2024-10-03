// Copyright 2018 Prescryptive Health, Inc.

import { IDatabase } from '../setup/setup-database';

export const getPendingPrescriptionsByIdentifier = (
  identifier: string,
  database: IDatabase
) =>
  database.Models.PendingPrescriptionsListModel.findOne(
    {
      identifier,
    },
    'identifier prescriptions events'
  );

export const getAllPendingPrescriptionsByIdentifierFromMessageEnvelope = (
  identifier: string,
  database: IDatabase
) =>
  database.Models.MessageEnvelopeModel.find(
    {
      'pendingPrescriptionList.identifier': identifier,
    },
    'identifier pendingPrescriptionList notificationTarget'
  );
