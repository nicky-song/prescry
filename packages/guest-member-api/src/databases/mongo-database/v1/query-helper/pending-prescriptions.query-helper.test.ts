// Copyright 2020 Prescryptive Health, Inc.

import { IDatabase } from '../setup/setup-database';
import {
  getPendingPrescriptionsByIdentifier,
  getAllPendingPrescriptionsByIdentifierFromMessageEnvelope,
} from './pending-prescriptions.query-helper';

const findOneMock = jest.fn();
const findMock = jest.fn();

const databaseMock = {
  Models: {
    PendingPrescriptionsListModel: {
      findOne: findOneMock,
    },
    MessageEnvelopeModel: {
      find: findMock,
    },
  },
} as unknown as IDatabase;

describe('getPendingPrescriptionsByIdentifier', () => {
  const identifier = 'id-1';

  it('should call findOne() with required params', async () => {
    await getPendingPrescriptionsByIdentifier(identifier, databaseMock);
    expect(findOneMock).toHaveBeenCalledWith(
      {
        identifier,
      },
      'identifier prescriptions events'
    );
  });
});

describe('getAllPendingPrescriptionsByIdentifierFromMessageEnvelope', () => {
  const identifier = 'id-1';

  it('should call find() with required params', async () => {
    await getAllPendingPrescriptionsByIdentifierFromMessageEnvelope(
      identifier,
      databaseMock
    );
    expect(findMock).toHaveBeenCalledWith(
      {
        'pendingPrescriptionList.identifier': identifier,
      },
      'identifier pendingPrescriptionList notificationTarget'
    );
  });
});
