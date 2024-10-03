// Copyright 2022 Prescryptive Health, Inc.

import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { Request } from 'express';
import { publishCommonBusinessEventMessage } from '../../utils/service-bus/common-business-event.helper';
import { EventController } from './event.controller';

jest.mock('../../utils/service-bus/common-business-event.helper');
const publishCommonBusinessEventMessageMock =
  publishCommonBusinessEventMessage as jest.Mock;

jest.mock('@phx/common/src/utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;

describe('EventController', () => {
  const requestMock = {
    body: {
      idType: 'smartContractId',
      id: 'prescription-id',
      tags: [
        'dRx',
        'supportDashboard',
        'myPrescryptive',
        'prescriberFeedbackLoop',
      ],
      subject: 'Patient viewed NewRx in Medicine Cabinet.',
      messageData: 'patient-info',
    },
  } as Request;

  beforeEach(() => {
    publishCommonBusinessEventMessageMock.mockReset();
    getNewDateMock.mockReturnValue({ toISOString: () => 'test-date' });
  });

  it('should call publishCommonBusinessEventMessage for sendNotificationEvent Route', async () => {
    const routeHandler = new EventController().sendEvent;
    await routeHandler(requestMock);
    expect(publishCommonBusinessEventMessageMock).toBeCalledTimes(1);

    expect(publishCommonBusinessEventMessageMock).toHaveBeenCalledWith({
      idType: 'smartContractId',
      id: 'prescription-id',
      messageOrigin: 'myPHX',
      tags: [
        'dRx',
        'supportDashboard',
        'myPrescryptive',
        'prescriberFeedbackLoop',
      ],
      type: 'notification',
      subject: 'Patient viewed NewRx in Medicine Cabinet.',
      messageData: 'patient-info',
      eventDateTime: 'test-date',
    });
  });

  it('should call event with default type as notification if  type not was not provided ', async () => {
    const errorRequestMock = { ...requestMock };
    errorRequestMock.body.tags = ['dRx', 'supportDashboard'];
    errorRequestMock.body.subject = 'notification-subject';

    const routeHandler = new EventController().sendEvent;
    await routeHandler(requestMock);
    expect(publishCommonBusinessEventMessageMock).toBeCalledTimes(1);

    expect(publishCommonBusinessEventMessageMock).toHaveBeenCalledWith({
      idType: 'smartContractId',
      id: 'prescription-id',
      messageOrigin: 'myPHX',
      tags: ['dRx', 'supportDashboard'],
      type: 'notification',
      subject: 'notification-subject',
      messageData: 'patient-info',
      eventDateTime: 'test-date',
    });
  });

  it('should call publishCommonBusinessEventMessage for sendErrorEvent Route', async () => {
    const errorRequestMock = { ...requestMock };
    errorRequestMock.body.tags = ['dRx', 'supportDashboard'];
    errorRequestMock.body.type = 'error';
    errorRequestMock.body.subject = 'error-subject';

    const routeHandler = new EventController().sendEvent;
    await routeHandler(requestMock);
    expect(publishCommonBusinessEventMessageMock).toBeCalledTimes(1);

    expect(publishCommonBusinessEventMessageMock).toHaveBeenCalledWith({
      idType: 'smartContractId',
      id: 'prescription-id',
      messageOrigin: 'myPHX',
      tags: ['dRx', 'supportDashboard'],
      type: 'error',
      subject: 'error-subject',
      messageData: 'patient-info',
      eventDateTime: 'test-date',
    });
  });
});
