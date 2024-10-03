// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { IConfiguration } from '../../../configuration';
import {
  KnownFailureResponse,
  SuccessResponse,
  errorResponseWithTwilioErrorHandling,
} from '../../../utils/response-helper';
import {
  ErrorConstants,
  SuccessConstants,
} from '@phx/common/src/experiences/guest-experience/api/api-response-messages';
import { Twilio } from 'twilio';
import { buildSmartPriceRegistration } from '../helpers/build-smart-price-registration';
import { getNext } from '../../../utils/redis/redis-order-number.helper';
import { publishPersonCreateMessage } from '../../../utils/service-bus/person-update-helper';
import { searchPersonByPhoneNumber } from '../../../databases/mongo-database/v1/query-helper/person-collection-helper';
import { ISmartPriceMembership } from '../smart-price-membership';
import { getRequiredResponseLocal } from '../../../utils/request/request-app-locals.helper';
import { HttpStatusCodes } from '@phx/common/src/errors/error-codes';
import { publishBrokerReferralEvent } from '../helpers/publish-broker-referral-event';
import { smartPriceWelcomeMessageBuilder } from '../helpers/build-smart-price-message';
import sgMail from '@sendgrid/mail';
import { buildEmailBody } from '../helpers/build-email-body';
import RestException from 'twilio/lib/base/RestException';

export interface ISmartPriceRegistration {
  verifyCode: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  source?: string;
}

export async function appRegisterSmartPriceHandler(
  request: Request,
  response: Response,
  database: IDatabase,
  configuration: IConfiguration,
  twilioClient: Twilio
) {
  const payload = request.body as ISmartPriceRegistration;

  try {
    const phoneNumber = getRequiredResponseLocal(response, 'device').data;
    if (phoneNumber) {
      const memberNumber = await getNext(
        database,
        configuration.orderNumberBlockLength
      );
      const expectedMembership = buildSmartPriceRegistration(
        payload,
        memberNumber
      );
      const persons = await searchPersonByPhoneNumber(database, phoneNumber);
      const siePersonIndex = persons.findIndex((p) => p.rxGroupType === 'SIE');
      if (siePersonIndex >= 0) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
          ErrorConstants.SMARTPRICE_NOT_ELIGIBLE
        );
      }
      const personIndex = persons.findIndex(
        (p) =>
          p.rxGroup === expectedMembership.rxGroup &&
          p.rxGroupType === expectedMembership.rxGroupType
      );
      const isNew = personIndex < 0;
      if (isNew) {
        await publishPersonCreateMessage(expectedMembership);
        if (expectedMembership.source) {
          await publishBrokerReferralEvent(
            expectedMembership.primaryMemberRxId,
            expectedMembership.source
          );
        }
      } else {
        const person = persons[personIndex];
        if (expectedMembership.source) {
          await publishBrokerReferralEvent(
            person.primaryMemberRxId,
            expectedMembership.source
          );
        }
      }
      const membership = isNew ? expectedMembership : persons[personIndex];

      const memberInfo = {
        memberId: `${membership.primaryMemberFamilyId}`,
        rxGroup: membership.rxGroup,
        rxBin: membership.rxBin,
        carrierPCN: membership.carrierPCN,
      } as ISmartPriceMembership;
      // send txt message
      await twilioClient.messages.create({
        to: phoneNumber,
        body: smartPriceWelcomeMessageBuilder(memberInfo),
        from: configuration.twilioMessagingFromPhoneNumber,
      });
      const emailRequest = buildEmailBody(payload, memberInfo);
      sgMail.setApiKey(configuration.sendgridApiKey);
      await sgMail.send(emailRequest);
      return SuccessResponse<ISmartPriceMembership>(
        response,
        SuccessConstants.SUCCESS_OK,
        memberInfo
      );
    }
    return KnownFailureResponse(
      response,
      HttpStatusCodes.BAD_REQUEST,
      ErrorConstants.DEVICE_NOT_VERIFIED
    );
  } catch (error) {
    return errorResponseWithTwilioErrorHandling(
      response,
      payload.phoneNumber,
      error as RestException
    );
  }
}
