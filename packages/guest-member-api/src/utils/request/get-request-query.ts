// Copyright 2018 Prescryptive Health, Inc.

import { Request } from 'express';
import { ErrorBadRequest } from '@phx/common/src/errors/error-bad-request';
import { ErrorConstants } from '../../constants/response-messages';
import {
  RxGroupTypesEnum,
  RxGroupTypes,
} from '@phx/common/src/models/member-profile/member-profile-info';
import { ServiceTypes } from '@phx/common/src/models/provider-location';

export type IRequestQueryKeys = keyof IRequestQuery;

export type SearchPharmaciesSortField = 'price';
interface IRequestQuery {
  rxgrouptype: RxGroupTypes;
  servicetype: ServiceTypes;
  testpharmacy: boolean;
  eventid: string;
  ordernumber: string;
  zipcode?: string;
  limit?: number;
  distance?: number;
  identifier: string;
  sortby?: SearchPharmaciesSortField;
  latitude?: number;
  longitude?: number;
  ndc?: string;
  supply?: number;
  quantity?: number;
  start?: number;
  type?: string;
  pdf?: boolean;
  query?: string;
  year?: string;
  blockchain?: string;
  groupKey: string;
  language?: string;
  version?: number;
  experienceKey?: string;
  ncpdp?: string;
}

export const RestrictedRequestQueryValuesMap = new Map<
  IRequestQueryKeys,
  (RxGroupTypes | string)[]
>([
  ['rxgrouptype', Object.values(RxGroupTypesEnum)],
  ['testpharmacy', ['true', 'false']],
]);

const restrictedQueryKeys = [...RestrictedRequestQueryValuesMap.keys()];

export const getRequiredRequestQuery = <
  K extends keyof Required<IRequestQuery>
>(
  request: Request,
  key: K
): IRequestQuery[K] => {
  const value = getRequestQuery(request, key);
  if (value) {
    return value;
  }
  throw new ErrorBadRequest(ErrorConstants.QUERYSTRING_MISSING);
};

export const getRequestQuery = <K extends keyof IRequestQuery>(
  request: Request,
  key: K
): IRequestQuery[K] | undefined => {
  const query = request.query as unknown as IRequestQuery;
  const value = query[key];
  if (value) {
    const isRestricted = restrictedQueryKeys.includes(key);
    if (isRestricted) {
      const isValid = RestrictedRequestQueryValuesMap.get(key)?.includes(
        value as RxGroupTypes
      );
      if (!isValid) {
        throw new ErrorBadRequest(ErrorConstants.QUERYSTRING_INVALID);
      }
    }
  }
  return value;
};
