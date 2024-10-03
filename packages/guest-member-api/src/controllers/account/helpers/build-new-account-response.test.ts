// Copyright 2021 Prescryptive Health, Inc.

import { Response } from 'express';
import { IPerson } from '@phx/common/src/models/person';
import { InternalResponseCode } from '../../../constants/error-codes';
import { SuccessConstants } from '../../../constants/response-messages';
import { IDatabase } from '../../../databases/mongo-database/v1/setup/setup-database';
import { configurationMock } from '../../../mock-data/configuration.mock';
import { ITermsAndConditionsWithAuthTokenAcceptance } from '../../../models/terms-and-conditions-acceptance-info';
import {
  KnownFailureResponse,
  SuccessResponse,
} from '../../../utils/response-helper';
import { publishAccountUpdateMessageAndAddToRedis } from '../../../utils/account/account.helper';
import { buildNewAccountResponse } from './build-new-account-response';
import { membershipVerificationHelper } from '../../members/helpers/membership-verification.helper';
import { createCashProfileAndAddToRedis } from '../../../utils/person/create-cash-profile-and-add-to-redis';
import {
  publishPersonUpdatePatientDetailsMessage,
  publishPhoneNumberVerificationMessage,
} from '../../../utils/service-bus/person-update-helper';
import { trackNewPhoneNumberRegistrationEvent } from '../../../utils/custom-event-helper';
import { addPhoneRegistrationKeyInRedis } from '../../../databases/redis/redis-query-helper';
import { IMemberAddress } from '@phx/common/src/models/api-request-body/create-booking.request-body';
import { updatePrescriptionWithMemberId } from '../../prescription/helpers/update-prescriptions-with-member-id';
import { expectToHaveBeenCalledOnceOnlyWith } from '@phx/common/src/testing/test.helper';

jest.mock('../../../utils/response-helper');
const knownFailureResponseMock = KnownFailureResponse as jest.Mock;
const successResponseMock = SuccessResponse as jest.Mock;

jest.mock('../../../utils/account/account.helper');
const publishAccountUpdateMessageAndAddToRedisMock =
  publishAccountUpdateMessageAndAddToRedis as jest.Mock;

jest.mock('../../members/helpers/membership-verification.helper');
const membershipVerificationHelperMock =
  membershipVerificationHelper as jest.Mock;

jest.mock('../../../utils/person/create-cash-profile-and-add-to-redis');
const createCashProfileAndAddToRedisMock =
  createCashProfileAndAddToRedis as jest.Mock;

jest.mock('../../../utils/service-bus/person-update-helper');
const publishPhoneNumberVerificationMessageMock =
  publishPhoneNumberVerificationMessage as jest.Mock;
const publishPersonUpdatePatientDetailsMessageMock =
  publishPersonUpdatePatientDetailsMessage as jest.Mock;

jest.mock('../../../utils/custom-event-helper');
const trackNewPhoneNumberRegistrationEventMock =
  trackNewPhoneNumberRegistrationEvent as jest.Mock;

jest.mock('../../../databases/redis/redis-query-helper');
const addPhoneRegistrationKeyInRedisMock =
  addPhoneRegistrationKeyInRedis as jest.Mock;

jest.mock('../../prescription/helpers/update-prescriptions-with-member-id');
const updatePrescriptionWithMemberIdMock =
  updatePrescriptionWithMemberId as jest.Mock;

describe('buildNewAccountResponse', () => {
  const responseMock = {} as Response;
  const databaseMock = {} as IDatabase;
  const tokenMock = 'token';
  const phoneNumberMock = '1234567890';
  const firstNameMock = 'Johnny';
  const lastNameMock = 'Appleseed';
  const emailMock = 'test@test.com';
  const dateOfBirthMock = '2000-01-01';
  const termsAndConditionsAcceptancesMock =
    {} as ITermsAndConditionsWithAuthTokenAcceptance;
  const activationPersonRecordMock = {
    firstName: 'JOHNNY',
    lastName: 'APPLESEED',
    dateOfBirth: '2000-01-01',
    activationPhoneNumber: phoneNumberMock,
    phoneNumber: '',
    primaryMemberRxId: 'T123456789',
    identifier: '12345',
  } as IPerson;

  beforeEach(() => {
    jest.clearAllMocks();
    membershipVerificationHelperMock.mockReturnValue({
      isValidMembership: false,
    });
  });

  it.each([
    ['First', 'Last', 'master-id', 'account-id', 'FIRST', 'LAST'],
    ['First  ', '  Last', undefined, undefined, 'FIRST', 'LAST'],
    ['  First', 'Last ', 'master-id', 'account-id', 'FIRST', 'LAST'],
    ['', 'Last', 'master-id', 'account-id', '', 'LAST'],
  ])(
    'creates account with the information passed (firstName: %p, lastName:%p, expectedFirstName:%p, expectedLastName: %p)',
    async (
      firstName: string,
      lastName: string,
      masterIdMock: string | undefined,
      accountIdMock: string | undefined,
      expectedFirstName: string,
      expectedLastName: string
    ) => {
      await buildNewAccountResponse(
        responseMock,
        databaseMock,
        configurationMock,
        phoneNumberMock,
        firstName,
        lastName,
        emailMock,
        dateOfBirthMock,
        tokenMock,
        termsAndConditionsAcceptancesMock,
        true,
        undefined,
        undefined,
        undefined,
        undefined,
        masterIdMock,
        accountIdMock,
        'family-id'
      );

      expect(knownFailureResponseMock).not.toBeCalled();
      expect(createCashProfileAndAddToRedisMock).not.toBeCalled();
      expect(publishAccountUpdateMessageAndAddToRedisMock).toBeCalledWith(
        {
          dateOfBirth: dateOfBirthMock,
          firstName: expectedFirstName,
          lastName: expectedLastName,
          recoveryEmail: emailMock,
          phoneNumber: phoneNumberMock,
          termsAndConditionsAcceptances: termsAndConditionsAcceptancesMock,
          masterId: masterIdMock,
          accountId: accountIdMock,
          recentlyUpdated: true,
        },
        configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
      );
      expect(successResponseMock).toBeCalledWith(
        responseMock,
        SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN,
        { deviceToken: tokenMock, recoveryEmailExists: true },
        undefined,
        undefined,
        undefined,
        InternalResponseCode.REQUIRE_USER_SET_PIN
      );
    }
  );

  it.each([
    ['First', 'Last', 'FIRST', 'LAST'],
    ['First  ', '  Last', 'FIRST', 'LAST'],
    ['  First', 'Last ', 'FIRST', 'LAST'],
    ['', 'Last', '', 'LAST'],
  ])(
    'creates account with the information passed (firstName: %p, lastName:%p, expectedFirstName:%p, expectedLastName: %p) and address',
    async (
      firstName: string,
      lastName: string,
      expectedFirstName: string,
      expectedLastName: string
    ) => {
      const prescriptionAddress: IMemberAddress = {
        address1: 'address1Mock',
        address2: 'address2Mock',
        county: 'countyMock',
        city: 'cityMock',
        state: 'stateMock',
        zip: 'zipMock',
      };
      await buildNewAccountResponse(
        responseMock,
        databaseMock,
        configurationMock,
        phoneNumberMock,
        firstName,
        lastName,
        emailMock,
        dateOfBirthMock,
        tokenMock,
        termsAndConditionsAcceptancesMock,
        true,
        undefined,
        prescriptionAddress
      );

      expect(knownFailureResponseMock).not.toBeCalled();
      expect(createCashProfileAndAddToRedisMock).not.toBeCalled();
      expect(publishAccountUpdateMessageAndAddToRedisMock).toBeCalledWith(
        {
          dateOfBirth: dateOfBirthMock,
          firstName: expectedFirstName,
          lastName: expectedLastName,
          recoveryEmail: emailMock,
          phoneNumber: phoneNumberMock,
          termsAndConditionsAcceptances: termsAndConditionsAcceptancesMock,
          recentlyUpdated: true,
        },
        configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
      );
      expect(successResponseMock).toBeCalledWith(
        responseMock,
        SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN,
        { deviceToken: tokenMock, recoveryEmailExists: true },
        undefined,
        undefined,
        undefined,
        InternalResponseCode.REQUIRE_USER_SET_PIN
      );
    }
  );

  it('calls membershipVerificationHelper if primaryMemberRxId is passed', async () => {
    const primaryMemberRxIdMock = 'member-id';

    await buildNewAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      emailMock,
      dateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptancesMock,
      false,
      primaryMemberRxIdMock
    );

    expect(membershipVerificationHelperMock).toBeCalledWith(
      databaseMock,
      phoneNumberMock,
      'JOHNNY',
      'APPLESEED',
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
    expect(publishAccountUpdateMessageAndAddToRedisMock).not.toBeCalledWith();
    expect(createCashProfileAndAddToRedisMock).not.toBeCalled();
  });

  it('publishes phone number verification message when "primaryMemberRxId" value is present and membership is verified', async () => {
    const primaryMemberRxIdMock = 'member-id1';

    const memberMock = {
      identifier: '123',
    };

    membershipVerificationHelperMock.mockReturnValueOnce({
      member: memberMock,
      isValidMembership: true,
    });

    await buildNewAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      emailMock,
      dateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptancesMock,
      false,
      primaryMemberRxIdMock
    );

    expect(publishPhoneNumberVerificationMessageMock).toHaveBeenCalledWith(
      memberMock.identifier,
      phoneNumberMock
    );
  });

  it('adds Phone RegistrationKey in Redis  when "primaryMemberRxId" value is present and membership is verified', async () => {
    const primaryMemberRxIdMock = 'member-id';

    const memberMock = {
      identifier: '123',
    };

    membershipVerificationHelperMock.mockReturnValueOnce({
      member: memberMock,
      isValidMembership: true,
    });

    await buildNewAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      emailMock,
      dateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptancesMock,
      false,
      primaryMemberRxIdMock
    );

    expect(addPhoneRegistrationKeyInRedisMock).toHaveBeenCalledWith(
      phoneNumberMock,
      memberMock,
      configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
    );
  });

  it.each([[false], [true]])(
    'tracks phone number verification message when "primaryMemberRxId" value is present and membership is verified (has master id and account id defined %p)',
    async (hasMasterId: boolean) => {
      const primaryMemberRxIdMock = 'T123456789';

      const activationPersonRecordMock = {
        firstName: 'JOHNNY',
        lastName: 'APPLESEED',
        dateOfBirth: '2000-01-01',
        activationPhoneNumber: phoneNumberMock,
        phoneNumber: '',
        primaryMemberRxId: 'T123456789',
        identifier: '12345',
      } as IPerson;
      const masterIdMock = 'master-id2';
      const patientAccountIdMock = 'patient-account';

      const memberMock = {
        identifier: '123',
      };

      membershipVerificationHelperMock.mockReturnValueOnce({
        member: memberMock,
        isValidMembership: true,
      });

      await buildNewAccountResponse(
        responseMock,
        databaseMock,
        configurationMock,
        phoneNumberMock,
        firstNameMock,
        lastNameMock,
        emailMock,
        dateOfBirthMock,
        tokenMock,
        termsAndConditionsAcceptancesMock,
        false,
        primaryMemberRxIdMock,
        undefined,
        undefined,
        activationPersonRecordMock,
        hasMasterId ? masterIdMock : undefined,
        hasMasterId ? patientAccountIdMock : undefined,
        undefined
      );

      if (hasMasterId) {
        expect(
          publishPersonUpdatePatientDetailsMessageMock
        ).toHaveBeenCalledWith(
          memberMock.identifier,
          masterIdMock,
          patientAccountIdMock
        );
      } else {
        expect(publishPersonUpdatePatientDetailsMessageMock).not.toBeCalled();
      }

      expect(trackNewPhoneNumberRegistrationEventMock).toHaveBeenCalledWith(
        phoneNumberMock,
        memberMock.identifier
      );
    }
  );

  it('creates CASH member only if it does not exist', async () => {
    const personMock = { firstName: firstNameMock } as IPerson;
    createCashProfileAndAddToRedisMock.mockReturnValueOnce(personMock);

    const masterIdMock = 'master-id';
    const patientAccountIdMock = 'patient-account';
    const familyIdMock = 'family-id';

    await buildNewAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      emailMock,
      dateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptancesMock,
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      masterIdMock,
      patientAccountIdMock,
      familyIdMock
    );

    expect(knownFailureResponseMock).not.toBeCalled();
    expectToHaveBeenCalledOnceOnlyWith(
      createCashProfileAndAddToRedisMock,
      databaseMock,
      configurationMock,
      'JOHNNY',
      'APPLESEED',
      dateOfBirthMock,
      phoneNumberMock,
      emailMock,
      undefined,
      masterIdMock,
      patientAccountIdMock,
      familyIdMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      publishAccountUpdateMessageAndAddToRedisMock,
      {
        dateOfBirth: dateOfBirthMock,
        firstName: 'JOHNNY',
        lastName: 'APPLESEED',
        recoveryEmail: emailMock,
        phoneNumber: phoneNumberMock,
        termsAndConditionsAcceptances: termsAndConditionsAcceptancesMock,
        masterId: masterIdMock,
        accountId: patientAccountIdMock,
        recentlyUpdated: true,
      },
      configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
    );
    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      responseMock,
      SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN,
      { deviceToken: tokenMock, recoveryEmailExists: true },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
  });

  it('uses pbm profile info to create CASH profile if primaryMemberRxId is passed', async () => {
    const primaryMemberRxIdMock = 'member-id';

    const firstNamePbm = 'some-name';
    const lastNamePbm = 'some-last-name';
    const personMock = {
      firstName: firstNamePbm,
      lastName: lastNamePbm,
      primaryMemberRxId: primaryMemberRxIdMock,
    } as IPerson;
    createCashProfileAndAddToRedisMock.mockReturnValueOnce(personMock);
    membershipVerificationHelperMock.mockReturnValueOnce({
      member: personMock,
      isValidMembership: true,
    });

    const masterIdMock = 'master-id';
    const patientAccountIdMock = 'patient-account';
    const familyIdMock = 'family-id';

    await buildNewAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      emailMock,
      dateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptancesMock,
      false,
      primaryMemberRxIdMock,
      undefined,
      undefined,
      undefined,
      masterIdMock,
      patientAccountIdMock,
      familyIdMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      membershipVerificationHelperMock,
      databaseMock,
      phoneNumberMock,
      'JOHNNY',
      'APPLESEED',
      dateOfBirthMock,
      primaryMemberRxIdMock
    );
    expect(knownFailureResponseMock).not.toBeCalled();
    expectToHaveBeenCalledOnceOnlyWith(
      createCashProfileAndAddToRedisMock,
      databaseMock,
      configurationMock,
      firstNamePbm,
      lastNamePbm,
      dateOfBirthMock,
      phoneNumberMock,
      emailMock,
      undefined,
      masterIdMock,
      patientAccountIdMock,
      familyIdMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      publishAccountUpdateMessageAndAddToRedisMock,
      {
        dateOfBirth: dateOfBirthMock,
        firstName: firstNamePbm,
        lastName: lastNamePbm,
        recoveryEmail: emailMock,
        phoneNumber: phoneNumberMock,
        termsAndConditionsAcceptances: termsAndConditionsAcceptancesMock,
        masterId: masterIdMock,
        accountId: patientAccountIdMock,
        recentlyUpdated: true,
      },
      configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
    );
    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      responseMock,
      SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN,
      { deviceToken: tokenMock, recoveryEmailExists: true },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
  });

  it('publishes phone number verification message if activationPersonRecord is passed and activationPersonRecord.phoneNumber is empty', async () => {
    const personMock = { firstName: firstNameMock } as IPerson;
    createCashProfileAndAddToRedisMock.mockReturnValueOnce(personMock);

    const masterIdMock = 'master-id';
    const patientAccountIdMock = 'patient-account';
    const familyIdMock = 'family-id';

    await buildNewAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      emailMock,
      dateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptancesMock,
      false,
      undefined,
      undefined,
      undefined,
      activationPersonRecordMock,
      masterIdMock,
      patientAccountIdMock,
      familyIdMock
    );

    expect(knownFailureResponseMock).not.toBeCalled();
    expectToHaveBeenCalledOnceOnlyWith(
      createCashProfileAndAddToRedisMock,
      databaseMock,
      configurationMock,
      'JOHNNY',
      'APPLESEED',
      dateOfBirthMock,
      phoneNumberMock,
      emailMock,
      undefined,
      masterIdMock,
      patientAccountIdMock,
      familyIdMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      publishAccountUpdateMessageAndAddToRedisMock,
      {
        dateOfBirth: dateOfBirthMock,
        firstName: 'JOHNNY',
        lastName: 'APPLESEED',
        recoveryEmail: emailMock,
        phoneNumber: phoneNumberMock,
        termsAndConditionsAcceptances: termsAndConditionsAcceptancesMock,
        masterId: masterIdMock,
        accountId: patientAccountIdMock,
        recentlyUpdated: true,
      },
      configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
    );
    expectToHaveBeenCalledOnceOnlyWith(
      publishPhoneNumberVerificationMessageMock,
      activationPersonRecordMock.identifier,
      phoneNumberMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      addPhoneRegistrationKeyInRedisMock,
      phoneNumberMock,
      activationPersonRecordMock,
      configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
    );
    expect(publishPersonUpdatePatientDetailsMessageMock).toHaveBeenCalledWith(
      activationPersonRecordMock.identifier,
      masterIdMock,
      patientAccountIdMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      responseMock,
      SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN,
      { deviceToken: tokenMock, recoveryEmailExists: true },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
  });

  it('creates CASH member if profile does not exist and address is passed', async () => {
    const personMock = { firstName: firstNameMock } as IPerson;
    createCashProfileAndAddToRedisMock.mockReturnValueOnce(personMock);
    membershipVerificationHelperMock.mockReturnValueOnce({
      member: personMock,
      isValidMembership: true,
    });
    const memberAddress: IMemberAddress = {
      address1: 'address1Mock',
      address2: 'address2Mock',
      county: 'countyMock',
      city: 'cityMock',
      state: 'stateMock',
      zip: 'zipMock',
    };

    const masterIdMock = 'master-id';
    const patientAccountIdMock = 'patient-account';
    const familyIdMock = 'family-id';

    await buildNewAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      emailMock,
      dateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptancesMock,
      false,
      undefined,
      memberAddress,
      undefined,
      undefined,
      masterIdMock,
      patientAccountIdMock,
      familyIdMock
    );

    expect(knownFailureResponseMock).not.toBeCalled();
    expectToHaveBeenCalledOnceOnlyWith(
      createCashProfileAndAddToRedisMock,
      databaseMock,
      configurationMock,
      'JOHNNY',
      'APPLESEED',
      dateOfBirthMock,
      phoneNumberMock,
      emailMock,
      memberAddress,
      masterIdMock,
      patientAccountIdMock,
      familyIdMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      publishAccountUpdateMessageAndAddToRedisMock,
      {
        dateOfBirth: dateOfBirthMock,
        firstName: 'JOHNNY',
        lastName: 'APPLESEED',
        recoveryEmail: emailMock,
        phoneNumber: phoneNumberMock,
        termsAndConditionsAcceptances: termsAndConditionsAcceptancesMock,
        masterId: masterIdMock,
        accountId: patientAccountIdMock,
        recentlyUpdated: true,
      },
      configurationMock.redisPhoneNumberRegistrationKeyExpiryTime
    );
    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      responseMock,
      SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN,
      { deviceToken: tokenMock, recoveryEmailExists: true },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
  });

  it('calls updatePrescriptions with MemberId if updatePrescriptionparams is passed and clientpatientId exists', async () => {
    const updatedPrescriptionParamsMock = {
      clientPatientId: 'CAJY01',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };

    updatePrescriptionWithMemberIdMock.mockReturnValueOnce({ success: true });
    const memberAddress: IMemberAddress = {
      address1: 'address1Mock',
      address2: 'address2Mock',
      county: 'countyMock',
      city: 'cityMock',
      state: 'stateMock',
      zip: 'zipMock',
    };
    await buildNewAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      emailMock,
      dateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptancesMock,
      false,
      undefined,
      memberAddress,
      updatedPrescriptionParamsMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      updatePrescriptionWithMemberIdMock,
      updatedPrescriptionParamsMock,
      configurationMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      responseMock,
      SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN,
      { deviceToken: tokenMock, recoveryEmailExists: true },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
  });

  it('will NOT call updatePrescriptionsWithMemberId endpoint if updatePrescriptionparams is passed and clientpatientId not exist', async () => {
    const updatedPrescriptionParamsMock = {
      clientPatientId: '',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };
    createCashProfileAndAddToRedisMock.mockReturnValueOnce({});
    const memberAddress: IMemberAddress = {
      address1: 'address1Mock',
      address2: 'address2Mock',
      county: 'countyMock',
      city: 'cityMock',
      state: 'stateMock',
      zip: 'zipMock',
    };

    await buildNewAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      emailMock,
      dateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptancesMock,
      false,
      undefined,
      memberAddress,
      updatedPrescriptionParamsMock
    );
    expect(updatePrescriptionWithMemberIdMock).not.toBeCalled();
  });

  it('utilizes memberID from activation record if updatePrescriptionparams is passed with empty clientpatientId and activationRecord exists', async () => {
    const updatedPrescriptionParamsMock = {
      clientPatientId: '',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };
    const personMock = {
      firstName: firstNameMock,
      primaryMemberRxId: '12345',
    } as IPerson;
    createCashProfileAndAddToRedisMock.mockReturnValueOnce(personMock);
    updatePrescriptionWithMemberIdMock.mockReturnValueOnce({ success: true });
    const memberAddress: IMemberAddress = {
      address1: 'address1Mock',
      address2: 'address2Mock',
      county: 'countyMock',
      city: 'cityMock',
      state: 'stateMock',
      zip: 'zipMock',
    };

    await buildNewAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      emailMock,
      dateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptancesMock,
      false,
      undefined,
      memberAddress,
      updatedPrescriptionParamsMock,
      activationPersonRecordMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      updatePrescriptionWithMemberIdMock,
      { ...updatedPrescriptionParamsMock, clientPatientId: 'T123456789' },
      configurationMock
    );
    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      responseMock,
      SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN,
      { deviceToken: tokenMock, recoveryEmailExists: true },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
  });

  it('utilizes memberID from created cash profile if updatePrescriptionparams is passed with empty clientpatientId', async () => {
    const updatedPrescriptionParamsMock = {
      clientPatientId: '',
      rxNo: 'MOCK-RXNUMBER',
      pharmacyManagementSystemPatientId: 'PRIMERX-ID',
      refillNo: 0,
    };
    const personMock = {
      firstName: firstNameMock,
      primaryMemberRxId: '12345',
    } as IPerson;
    createCashProfileAndAddToRedisMock.mockReturnValueOnce(personMock);
    updatePrescriptionWithMemberIdMock.mockReturnValueOnce({ success: true });
    const memberAddress: IMemberAddress = {
      address1: 'address1Mock',
      address2: 'address2Mock',
      county: 'countyMock',
      city: 'cityMock',
      state: 'stateMock',
      zip: 'zipMock',
    };

    await buildNewAccountResponse(
      responseMock,
      databaseMock,
      configurationMock,
      phoneNumberMock,
      firstNameMock,
      lastNameMock,
      emailMock,
      dateOfBirthMock,
      tokenMock,
      termsAndConditionsAcceptancesMock,
      false,
      undefined,
      memberAddress,
      updatedPrescriptionParamsMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      updatePrescriptionWithMemberIdMock,
      { ...updatedPrescriptionParamsMock, clientPatientId: '12345' },
      configurationMock
    );

    expectToHaveBeenCalledOnceOnlyWith(
      successResponseMock,
      responseMock,
      SuccessConstants.PHONE_NUMBER_VERIFIED_SUCCESSFULLY_SET_PIN,
      { deviceToken: tokenMock, recoveryEmailExists: true },
      undefined,
      undefined,
      undefined,
      InternalResponseCode.REQUIRE_USER_SET_PIN
    );
  });
});
