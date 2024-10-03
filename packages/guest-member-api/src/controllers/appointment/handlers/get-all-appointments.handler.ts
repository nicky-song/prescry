// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import {
  IAppointmentListItem,
  IAppointmentsResponseData,
} from '@phx/common/src/models/api-response/appointment.response';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';

import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';

import {
  getAllAppointmentEventsForMember,
  getPastAppointmentEventsForMember,
  getCancelledAppointmentEventsForMember,
  getUpcomingAppointmentEventsForMember,
} from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { getAllowedMemberIdsForLoggedInUser } from '../../../utils/person/get-dependent-person.helper';
import { getRequestQuery } from '../../../utils/request/get-request-query';
import { buildAppointmentList } from '../helpers/build-appointment-list';
import { IAppointmentEvent } from '../../../models/appointment-event';
import { IConfiguration } from '../../../configuration';

export async function getAllAppointmentsHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration
) {
  try {
    const allowedMemberIds = getAllowedMemberIdsForLoggedInUser(response);
    const startVal = getRequestQuery(request, 'start');
    const start = startVal && !isNaN(Number(startVal)) ? Number(startVal) : 0;
    const type = getRequestQuery(request, 'type');
    const limit = 5;
    let appointmentList: IAppointmentEvent[] | undefined = [];
    if (type === 'upcoming') {
      appointmentList = await getUpcomingAppointmentEventsForMember(
        allowedMemberIds || [],
        database,
        start,
        limit
      );
    } else if (type === 'past') {
      appointmentList = await getPastAppointmentEventsForMember(
        allowedMemberIds || [],
        database,
        start,
        limit
      );
    } else if (type === 'cancelled') {
      appointmentList = await getCancelledAppointmentEventsForMember(
        allowedMemberIds || [],
        database,
        start,
        limit
      );
    } else {
      appointmentList = await getAllAppointmentEventsForMember(
        allowedMemberIds || [],
        database
      );
    }
    const appointments: IAppointmentListItem[] = await buildAppointmentList(
      configuration,
      appointmentList
    );
    return SuccessResponse<IAppointmentsResponseData>(
      response,
      SuccessConstants.DOCUMENT_FOUND,
      {
        appointments,
      }
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
