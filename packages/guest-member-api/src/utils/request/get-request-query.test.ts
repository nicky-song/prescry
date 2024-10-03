// Copyright 2020 Prescryptive Health, Inc.

import { Request } from 'express';
import { getRequestQuery, getRequiredRequestQuery } from './get-request-query';
import { ErrorBadRequest } from '@phx/common/src/errors/error-bad-request';
import { ErrorConstants } from '../../constants/response-messages';
import { ServiceTypes } from '@phx/common/src/models/provider-location';

describe('get-required-request-query', () => {
  it('if required query value is missing, should throw missing error', () => {
    const request = {
      query: {},
    } as unknown as Request;

    expect(() => getRequiredRequestQuery(request, 'rxgrouptype')).toThrowError(
      new ErrorBadRequest(ErrorConstants.QUERYSTRING_MISSING)
    );
  });
});

describe('get-request-query - servicetype', () => {
  it('should support servicetype', () => {
    const request = {
      query: {
        servicetype: ServiceTypes.antigen,
      },
    } as unknown as Request;

    const actual = getRequestQuery(request, 'servicetype');
    expect(actual).toEqual(ServiceTypes.antigen);
  });
});

describe('get-request-query - rxgrouptype', () => {
  it('should return the request query string value', () => {
    const request = {
      query: {
        rxgrouptype: 'COVID19',
      },
    } as unknown as Request;

    const actual = getRequestQuery(request, 'rxgrouptype');
    expect(actual).toEqual('COVID19');
  });

  it('should return undefined if missing', () => {
    const request = {
      query: {
        other: 'COVID19',
      },
    } as unknown as Request;

    const actual = getRequestQuery(request, 'rxgrouptype');
    expect(actual).toBeUndefined();
  });

  it('if query value is an enum, should throw invalid querystring value error', () => {
    const request = {
      query: {
        rxgrouptype: 'NOTRIGHT',
      },
    } as unknown as Request;

    expect(() => getRequestQuery(request, 'rxgrouptype')).toThrowError(
      new ErrorBadRequest(ErrorConstants.QUERYSTRING_INVALID)
    );
  });
  it('if query value is an enum with correct value, should return value', () => {
    const request = {
      query: {
        servicetype: 'abbott_antigen',
      },
    } as unknown as Request;

    const actual = getRequestQuery(request, 'servicetype');
    expect(actual).toEqual('abbott_antigen');
  });
  it('get request query for patient test result pdf', () => {
    const request = {
      query: {
        pdf: true,
      },
    } as unknown as Request;

    const actual = getRequestQuery(request, 'pdf');
    expect(actual).toEqual(true);
  });
  it('get request query for autocomplete', () => {
    const request = {
      query: {
        query: '20032',
      },
    } as unknown as Request;

    const actual = getRequestQuery(request, 'query');
    expect(actual).toEqual('20032');
  });
  it('gets request query for year', () => {
    const request = {
      query: {
        year: '2022',
      },
    } as unknown as Request;

    const actual = getRequestQuery(request, 'year');
    expect(actual).toEqual('2022');
  });
});
describe('get-request-query - cmsContent', () => {
  it('if required query value groupKey is missing, should throw missing error', () => {
    const request = {
      query: {},
    } as unknown as Request;

    expect(() => getRequiredRequestQuery(request, 'groupKey')).toThrowError(
      new ErrorBadRequest(ErrorConstants.QUERYSTRING_MISSING)
    );
  });
  it('gets default request query for groupKey', () => {
    const groupKeyMock = 'group-key-mock';
    const request = {
      query: {
        groupKey: groupKeyMock,
      },
    } as unknown as Request;

    const actual = getRequestQuery(request, 'groupKey');
    expect(actual).toEqual(groupKeyMock);
  });
  it('gets default request query for language', () => {
    const languageMock = 'language-mock';
    const request = {
      query: {
        language: languageMock,
      },
    } as unknown as Request;

    const actual = getRequestQuery(request, 'language');
    expect(actual).toEqual(languageMock);
  });
  it('gets default request query for version', () => {
    const versionMock = '1';
    const request = {
      query: {
        version: versionMock,
      },
    } as unknown as Request;

    const actual = getRequestQuery(request, 'version');
    expect(actual).toEqual(versionMock.toString());
  });
  it('gets default request query for experienceKey', () => {
    const experienceKeyMock = 'experience-key-mock';
    const request = {
      query: {
        experienceKey: experienceKeyMock,
      },
    } as unknown as Request;

    const actual = getRequestQuery(request, 'experienceKey');
    expect(actual).toEqual(experienceKeyMock);
  });
});
