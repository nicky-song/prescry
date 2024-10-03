// Copyright 2023 Prescryptive Health, Inc.

import { RxAssistanceDbContext } from './rx-assistance-db-context';

export class MessageEnvelopeRepository {
  private _context: RxAssistanceDbContext;
  constructor(context: RxAssistanceDbContext) {
    this._context = context;
  }

  findByReferenceNumber(phoneNumber: string, referenceNumber: string) {
    const query = {
      notificationTarget: phoneNumber,
      'pendingPrescriptionList.prescriptions.prescription.referenceNumber':
        referenceNumber,
    };
    return this._context.messageEnvelopeCollection.findOne(query);
  }
}
