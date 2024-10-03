// Copyright 2021 Prescryptive Health, Inc.

import { publishHealthRecordEventMessage } from '../../../utils/service-bus/health-record-event-helper';

import { publishPrescriptionPriceEvent } from './publish-prescription-price-event';
import {
  IPrescriptionPrice,
  IPrescriptionPriceEvent,
} from '../../../models/prescription-price-event';

jest.mock('../../../utils/service-bus/health-record-event-helper');
const publishHealthRecordEventMessageMock =
  publishHealthRecordEventMessage as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('publishPrescriptionPriceEvent', () => {
  it('should create prescription/price healthrecord event', async () => {
    const dateNowSpyMock = jest
      .spyOn(Date, 'now')
      .mockImplementation(() => 946713600000);
    const princingInfoMock: IPrescriptionPrice = {
      prescriptionId: 'id-1',
      daysSupply: 30,
      pharmacyId: '123',
      fillDate: '2000-01-01T00:00:00.000Z',
      ndc: 'ndc',
      planPays: 1,
      memberPays: 1,
      pharmacyTotalPrice: 2,
      memberId: 'member-id',
      quantity: 60,
      type: 'prescription',
    };
    const healthRecordEventMock = {
      identifiers: [{ type: 'primaryMemberRxId', value: 'member-id' }],
      createdOn: 946713600,
      createdBy: 'rxassistant-api',
      tags: ['member-id'],
      eventType: 'prescription/price',
      eventData: princingInfoMock,
    } as IPrescriptionPriceEvent;

    await publishPrescriptionPriceEvent('member-id', princingInfoMock);
    expect(publishHealthRecordEventMessageMock).toBeCalledWith(
      healthRecordEventMock
    );
    dateNowSpyMock.mockRestore();
  });
});
