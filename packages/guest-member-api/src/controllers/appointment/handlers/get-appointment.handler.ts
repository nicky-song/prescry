// Copyright 2020 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IAppointmentResponseData } from '@phx/common/src/models/api-response/appointment.response';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';

import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import {
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { knownFailureResponseAndPublishEvent } from '../../../utils/known-failure-and-publish-audit-event';
import { getAppointmentEventByOrderNumberNoRxId } from '../../../databases/mongo-database/v1/query-helper/appointment-event.query-helper';
import { buildAppointmentItem } from '../../appointment/helpers/build-appointment-item';
import { HttpStatusCodes } from '../../../constants/error-codes';
import { getAllowedPersonsForLoggedInUser } from '../../../utils/person/get-dependent-person.helper';
import { IConfiguration } from '../../../configuration';
import { buildAppointmentPdf } from '../helpers/build-appointment-pdf';
import { ApiConstants } from '../../../constants/api-constants';
import { publishViewAuditEvent } from '../../../utils/health-record-event/publish-view-audit-event';
import { UnauthorizedRequestError } from '../../../errors/request-errors/unauthorized.request-error';
import { assertHasPatient } from '../../../assertions/assert-has-patient';
import {
  getAllActivePatientsForLoggedInUser,
  getPatientWithMemberId,
} from '../../../utils/fhir-patient/patient.helper';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function getAppointmentHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration
) {
  const version = getEndpointVersion(request);
  const orderNumber = request.params.identifier;

  try {
    const appointmentDetails = await getAppointmentEventByOrderNumberNoRxId(
      orderNumber,
      database
    );

    if (appointmentDetails) {
      let dateOfBirth: string | undefined;
      const memberIdFromAppointment =
        appointmentDetails.eventData.appointment.memberRxId;

      if (version === 'v2') {
        const patients = getAllActivePatientsForLoggedInUser(response);
        const patient = getPatientWithMemberId(
          patients,
          memberIdFromAppointment
        );

        assertHasPatient(patient);
        dateOfBirth = patient.birthDate;
      } else {
        const allowedPersons = getAllowedPersonsForLoggedInUser(response);

        const appointmentPerson = allowedPersons.find(
          (person) => person.primaryMemberRxId === memberIdFromAppointment
        );
        if (!appointmentPerson) {
          throw new UnauthorizedRequestError();
        }

        dateOfBirth = appointmentPerson.dateOfBirth;
      }

      const appointment = await buildAppointmentItem(
        appointmentDetails,
        database,
        configuration,
        dateOfBirth
      );
      if (appointment) {
        appointment.pdfBase64 =
          appointment.bookingStatus === 'Completed'
            ? await buildAppointmentPdf(appointment)
            : undefined;
        await publishViewAuditEvent(
          request,
          response,
          ApiConstants.AUDIT_VIEW_EVENT_APPOINTMENT,
          orderNumber,
          true
        );
        return SuccessResponse<IAppointmentResponseData>(
          response,
          SuccessConstants.DOCUMENT_FOUND,
          {
            appointment,
          }
        );
      }
    }

    return SuccessResponse<IAppointmentResponseData>(
      response,
      SuccessConstants.SUCCESS_OK,
      {
        appointment: undefined,
      }
    );
  } catch (error) {
    if (error instanceof UnauthorizedRequestError) {
      return await knownFailureResponseAndPublishEvent(
        request,
        response,
        ApiConstants.AUDIT_VIEW_EVENT_APPOINTMENT,
        orderNumber,
        HttpStatusCodes.UNAUTHORIZED_REQUEST,
        ErrorConstants.UNAUTHORIZED_ACCESS
      );
    }

    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
