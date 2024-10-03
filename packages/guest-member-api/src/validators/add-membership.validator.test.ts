// Copyright 2020 Prescryptive Health, Inc.

import { validationResult } from 'express-validator';
import {
  ResponseCode,
  AddMembershipRequestValidationCodes,
} from '@phx/common/src/experiences/guest-experience/api/api-response-codes';
import { testExpressValidatorMiddleware } from '../utils/request-validator-test-helper';
import { AddMembershipRequestValidator } from './add-membership.validator';

const ResponseMock = {} as Response;

describe('AddMembershipRequest Validations Tests addMembershipValidate', () => {
  it('Empty Request should generate validation errors', async () => {
    const requestMock = {
      body: {},
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new AddMembershipRequestValidator().addMembershipValidate
    );
    const errors = validationResult(requestMock).array();
    expect(errors.length).toEqual(4);
  });

  it('Should Invalidate Request for Missing Firstname ', async () => {
    const requestMock = {
      body: {
        dateOfBirth: 'January-01-2000',
        lastName: 'TestName',
        primaryMemberRxId: 'PXXXXX',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new AddMembershipRequestValidator().addMembershipValidate
    );
    const validationError: ResponseCode<AddMembershipRequestValidationCodes> = {
      code: 'FIRSTNAME_REQUIRED',
    };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for Max Length on Firstname ', async () => {
    const requestMock = {
      body: {
        dateOfBirth: 'January-01-2000',
        firstName:
          'TestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestName ',
        lastName: 'TestName',
        primaryMemberRxId: 'PXXXXX',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new AddMembershipRequestValidator().addMembershipValidate
    );
    const validationError: ResponseCode<AddMembershipRequestValidationCodes> = {
      code: 'MAX_LENGTH_EXCEEDED',
    };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });
  it('Should Invalidate Request for Missing LastName ', async () => {
    const requestMock = {
      body: {
        dateOfBirth: 'January-01-2000',
        firstName: 'TestName',
        primaryMemberRxId: 'PXXX',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new AddMembershipRequestValidator().addMembershipValidate
    );
    const validationError: ResponseCode<AddMembershipRequestValidationCodes> = {
      code: 'LASTNAME_REQUIRED',
    };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });

  it('Should Invalidate Request for Max Length on LastName ', async () => {
    const requestMock = {
      body: {
        dateOfBirth: 'January-01-2000',
        firstName: 'TestName',
        lastName:
          'TestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestNameTestName ',
        primaryMemberRxId: 'PXXX',
      },
    } as unknown as Request;
    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new AddMembershipRequestValidator().addMembershipValidate
    );
    const validationError: ResponseCode<AddMembershipRequestValidationCodes> = {
      code: 'MAX_LENGTH_EXCEEDED',
    };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });

  it('Should Invalidate Request for Missing primaryMemberRxId ', async () => {
    const requestMock = {
      body: {
        dateOfBirth: 'January-01-2000',
        firstName: 'TestName',
        lastName: 'TestlastName',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new AddMembershipRequestValidator().addMembershipValidate
    );
    const validationError: ResponseCode<AddMembershipRequestValidationCodes> = {
      code: 'PRIMARY_RX_ID_REQUIRED',
    };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });

  it('Should Invalidate Request for Missing dateOfBirth ', async () => {
    const requestMock = {
      body: {
        firstName: 'TestName',
        lastName: 'TestlastName',
        primaryMemberRxId: 'PXXX',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new AddMembershipRequestValidator().addMembershipValidate
    );
    const validationError: ResponseCode<AddMembershipRequestValidationCodes> = {
      code: 'DATE_OF_BIRTH_REQUIRED',
    };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });

  it('Should Invalidate Request for Invalid dateOfBirth ', async () => {
    const requestMock = {
      body: {
        dateOfBirth: '1981-12-21',
        firstName: 'TestName',
        lastName: 'TestlastName',
        primaryMemberRxId: 'PXXX',
      },
    } as unknown as Request;

    await testExpressValidatorMiddleware(
      requestMock,
      ResponseMock,
      new AddMembershipRequestValidator().addMembershipValidate
    );
    const validationError: ResponseCode<AddMembershipRequestValidationCodes> = {
      code: 'INVALID_DATE_FORMAT',
    };
    const errors = validationResult(requestMock).array();
    expect(errors.length).toBe(1);
    expect(errors[0].msg).toEqual(validationError);
  });
});
