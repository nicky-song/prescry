// Copyright 2022 Prescryptive Health, Inc.

test.todo('Fix memory leak in publish-view-audit-event.test - task 44375');

// import { IViewAudit, IViewAuditEvent } from '../../models/view-audit-event';
// import { Request, Response } from 'express';
// import { UTCDate } from '@phx/common/src/utils/date-time-helper';
// import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
// import { publishHealthRecordEventMessage } from '../../utils/service-bus/health-record-event-helper';
// import { getRequiredResponseLocal } from '../request/request-app-locals.helper';
// import { fetchRequestHeader } from '../request-helper';
// import { getSessionIdFromRequest } from './get-sessionid-from-request';

// import { publishViewAuditEvent } from './publish-view-audit-event';
// import { ApiConstants } from '../../constants/api-constants';

// jest.mock('@phx/common/src/utils/date-time-helper');
// const utcDateMock = UTCDate as jest.Mock;

// jest.mock('@phx/common/src/utils/date-time/get-new-date');
// const getNewDateMock = getNewDate as jest.Mock;
// jest.mock('../../utils/service-bus/health-record-event-helper');
// const publishHealthRecordEventMessageMock =
//   publishHealthRecordEventMessage as jest.Mock;
// jest.mock('../request/request-app-locals.helper');
// const getRequiredResponseLocalMock = getRequiredResponseLocal as jest.Mock;
// jest.mock('../request-helper');
// const fetchRequestHeaderMock = fetchRequestHeader as jest.Mock;
// jest.mock('./get-sessionid-from-request');
// const getSessionIdFromRequestMock = getSessionIdFromRequest as jest.Mock;

// describe('publishViewAuditEvent', () => {
//   const eventType = 'myrx-view/appointment';
//   const sessionId = 'fake-session-id';
//   const utcMockVal = 1590954515;
//   const itemId = 'order-number';
//   const accountId = 'account-id';
//   const originalUrl = '/api/appointment/';
//   const responseMock = {} as Response;
//   beforeEach(() => {
//     jest.clearAllMocks();
//     getSessionIdFromRequestMock.mockReturnValue(sessionId);
//     utcDateMock.mockReturnValue(utcMockVal);
//     getRequiredResponseLocalMock.mockReturnValue(accountId);
//   });
//   it('should create specified audit healthrecord event for success', async () => {
//     const nowMock = new Date();
//     getNewDateMock.mockReturnValue(nowMock);

//     const originUrl = 'https://test.myrx.io';
//     fetchRequestHeaderMock.mockReturnValueOnce(originUrl);

//     const refererUrl = 'https://test.myrx.io/';
//     fetchRequestHeaderMock.mockReturnValueOnce(refererUrl);

//     const browser = 'Mozilla/5.0 (iPhone; CPU iPhone OS)';
//     fetchRequestHeaderMock.mockReturnValueOnce(browser);

//     const remoteAddress = '127.0.0.1';
//     const requestMock = {
//       originalUrl,
//       connection: { remoteAddress },
//     } as Request;

//     const auditViewSuccessEventMock: IViewAudit = {
//       accountId,
//       success: true,
//       itemId,
//       apiUrl: originalUrl,
//       originUrl,
//       refererUrl,
//       sessionId,
//       accessTime: nowMock.toString(),
//       browser,
//       fromIP: remoteAddress,
//       errorMessage: undefined,
//     };

//     const healthRecordEventMock: IViewAuditEvent = {
//       identifiers: [{ type: 'accountIdentifier', value: accountId }],
//       createdOn: utcMockVal,
//       createdBy: 'rxassistant-api',
//       tags: [],
//       eventType,
//       eventData: auditViewSuccessEventMock,
//     };

//     await publishViewAuditEvent(
//       requestMock,
//       responseMock,
//       ApiConstants.AUDIT_VIEW_EVENT_APPOINTMENT,
//       itemId,
//       true
//     );
//     expect(utcDateMock).toHaveBeenCalledWith(nowMock);
//     expect(getRequiredResponseLocalMock).toBeCalledWith(
//       responseMock,
//       'accountIdentifier'
//     );
//     expect(fetchRequestHeaderMock).toHaveBeenCalledTimes(3);
//     expect(fetchRequestHeaderMock).toHaveBeenNthCalledWith(
//       1,
//       requestMock,
//       'origin'
//     );
//     expect(fetchRequestHeaderMock).toHaveBeenNthCalledWith(
//       2,
//       requestMock,
//       'referer'
//     );
//     expect(fetchRequestHeaderMock).toHaveBeenNthCalledWith(
//       3,
//       requestMock,
//       'user-agent'
//     );
//     expect(getSessionIdFromRequestMock).toHaveBeenCalledWith(requestMock);
//     expect(publishHealthRecordEventMessageMock).toBeCalledWith(
//       healthRecordEventMock
//     );
//   });
//   it('should create specified audit healthrecord event for failure', async () => {
//     const nowMock = new Date();
//     getNewDateMock.mockReturnValue(nowMock);

//     const originUrl = 'https://test.myrx.io';
//     fetchRequestHeaderMock.mockReturnValueOnce(originUrl);

//     const refererUrl = 'https://test.myrx.io/';
//     fetchRequestHeaderMock.mockReturnValueOnce(refererUrl);

//     const browser = 'Mozilla/5.0 (iPhone; CPU iPhone OS)';
//     fetchRequestHeaderMock.mockReturnValueOnce(browser);

//     const remoteAddress = '127.0.0.1';
//     const requestMock = {
//       originalUrl,
//       connection: { remoteAddress },
//     } as Request;

//     const errorMessage = 'mock-error';

//     const auditViewSuccessEventMock: IViewAudit = {
//       accountId,
//       success: false,
//       itemId,
//       apiUrl: originalUrl,
//       originUrl,
//       refererUrl,
//       sessionId,
//       accessTime: nowMock.toString(),
//       browser,
//       fromIP: remoteAddress,
//       errorMessage,
//     };

//     const healthRecordEventMock: IViewAuditEvent = {
//       identifiers: [{ type: 'accountIdentifier', value: accountId }],
//       createdOn: utcMockVal,
//       createdBy: 'rxassistant-api',
//       tags: [],
//       eventType,
//       eventData: auditViewSuccessEventMock,
//     };

//     await publishViewAuditEvent(
//       requestMock,
//       responseMock,
//       ApiConstants.AUDIT_VIEW_EVENT_APPOINTMENT,
//       'order-number',
//       false,
//       errorMessage
//     );
//     expect(utcDateMock).toHaveBeenCalledWith(nowMock);
//     expect(getRequiredResponseLocalMock).toBeCalledWith(
//       responseMock,
//       'accountIdentifier'
//     );
//     expect(fetchRequestHeaderMock).toHaveBeenCalledTimes(3);
//     expect(fetchRequestHeaderMock).toHaveBeenNthCalledWith(
//       1,
//       requestMock,
//       'origin'
//     );
//     expect(fetchRequestHeaderMock).toHaveBeenNthCalledWith(
//       2,
//       requestMock,
//       'referer'
//     );
//     expect(fetchRequestHeaderMock).toHaveBeenNthCalledWith(
//       3,
//       requestMock,
//       'user-agent'
//     );
//     expect(getSessionIdFromRequestMock).toHaveBeenCalledWith(requestMock);
//     expect(publishHealthRecordEventMessageMock).toBeCalledWith(
//       healthRecordEventMock
//     );
//   });
//   it('should create specified audit healthrecord event with ip address from header if remote address is not there', async () => {
//     const nowMock = new Date();
//     getNewDateMock.mockReturnValue(nowMock);

//     const originUrl = 'https://test.myrx.io';
//     fetchRequestHeaderMock.mockReturnValueOnce(originUrl);

//     const refererUrl = 'https://test.myrx.io/';
//     fetchRequestHeaderMock.mockReturnValueOnce(refererUrl);

//     const browser = 'Mozilla/5.0 (iPhone; CPU iPhone OS)';
//     fetchRequestHeaderMock.mockReturnValueOnce(browser);

//     const remoteAddress = '127.0.0.1';
//     fetchRequestHeaderMock.mockReturnValueOnce(remoteAddress);

//     const requestMock = {
//       originalUrl,
//       connection: {},
//     } as Request;

//     const auditViewSuccessEventMock: IViewAudit = {
//       accountId,
//       success: true,
//       itemId,
//       apiUrl: originalUrl,
//       originUrl,
//       refererUrl,
//       sessionId,
//       accessTime: nowMock.toString(),
//       browser,
//       fromIP: remoteAddress,
//       errorMessage: undefined,
//     };

//     const healthRecordEventMock: IViewAuditEvent = {
//       identifiers: [{ type: 'accountIdentifier', value: accountId }],
//       createdOn: utcMockVal,
//       createdBy: 'rxassistant-api',
//       tags: [],
//       eventType,
//       eventData: auditViewSuccessEventMock,
//     };

//     await publishViewAuditEvent(
//       requestMock,
//       responseMock,
//       ApiConstants.AUDIT_VIEW_EVENT_APPOINTMENT,
//       'order-number',
//       true
//     );
//     expect(utcDateMock).toHaveBeenCalledWith(nowMock);
//     expect(getRequiredResponseLocalMock).toBeCalledWith(
//       responseMock,
//       'accountIdentifier'
//     );
//     expect(fetchRequestHeaderMock).toHaveBeenCalledTimes(4);
//     expect(fetchRequestHeaderMock).toHaveBeenNthCalledWith(
//       1,
//       requestMock,
//       'origin'
//     );
//     expect(fetchRequestHeaderMock).toHaveBeenNthCalledWith(
//       2,
//       requestMock,
//       'referer'
//     );
//     expect(fetchRequestHeaderMock).toHaveBeenNthCalledWith(
//       3,
//       requestMock,
//       'user-agent'
//     );
//     expect(fetchRequestHeaderMock).toHaveBeenNthCalledWith(
//       4,
//       requestMock,
//       'x-forwarded-for'
//     );
//     expect(getSessionIdFromRequestMock).toHaveBeenCalledWith(requestMock);
//     expect(publishHealthRecordEventMessageMock).toBeCalledWith(
//       healthRecordEventMock
//     );
//   });
// });
