// Copyright 2023 Prescryptive Health, Inc.

import { ClaimUserType, InsuredIndividualConsumer } from '../types';
import generateAndSendClaimAlerts from '../utilities/claim-alerts/generate-and-send-claim-alerts';
import { Twilio } from './external';

export abstract class ClaimLinkService {
  private static getGenderCode(gender: string) {
    switch (gender) {
      case 'female':
        return 1;
      case 'male':
        return 0;
      default:
        return 2;
    }
  }

  public static generate(person: ClaimUserType, scenario: string) {
    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      phoneNumber,
      phoneNumberDialingCode,
      primaryMemberFamilyId,
      rxSubGroup,
      primaryMemberPersonCode,
    } = person;
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !email ||
      !phoneNumber ||
      !phoneNumberDialingCode ||
      !primaryMemberFamilyId ||
      !rxSubGroup ||
      !primaryMemberPersonCode
    ) {
      throw new Error(`Missing claim info in person ${JSON.stringify(person)}`);
    }
    const birthDate = dateOfBirth.toISOString().split('T')[0];
    const persona: InsuredIndividualConsumer = {
      firstName,
      lastName,
      dateOfBirth: birthDate,
      email,
      cardHolderID: primaryMemberFamilyId,
      groupNumber: rxSubGroup,
      personCode: primaryMemberPersonCode,
      genderCode: this.getGenderCode(person.gender),
      phoneNumber,
      phoneNumberDialingCode,
      pin: '',
    };
    const drugs = [scenario];
    return generateAndSendClaimAlerts(persona, drugs);
  }

  public static async getShortLink(
    phoneNumber: string,
    lastMessageTime: string | null
  ) {
    const linkRegex = /[a-z.]*\.myprescryptive\.com\/[a-z0-9]*/g;
    if (!phoneNumber) {
      throw new Error('Missing phone number');
    }
    const messages = await Twilio.getMessages(phoneNumber);
    const lastDate = messages[0].date_created;
    if (lastDate !== lastMessageTime) {
      const message = messages[0].body;
      const link = message.match(linkRegex);
      if (link && link.length > 0) {
        const firstMatch = link[0];
        return `http://${firstMatch}`;
      } else {
        throw new Error(`Message did not match the pattern: ${message}`);
      }
    }
  }
}
