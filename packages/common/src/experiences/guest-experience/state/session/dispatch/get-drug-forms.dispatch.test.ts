// Copyright 2021 Prescryptive Health, Inc.

import { IDrugForm } from '../../../../../models/drug-form';
import { getEndpointRetryPolicy } from '../../../../../utils/retry-policies/get-endpoint.retry-policy';
import { getDrugForms } from '../../../api/session/get-drug-forms/api-v1.get-drug-forms';
import { GuestExperienceConfig } from '../../../guest-experience-config';
import {
  drugForm1Mock,
  drugForm2Mock,
} from '../../../__mocks__/drug-forms.mock';
import { getDrugFormsDispatch } from './get-drug-forms.dispatch';
import { setDrugFormsDispatch } from './set-drug-forms.dispatch';

jest.mock('../../../api/session/get-drug-forms/api-v1.get-drug-forms');
const getDrugFormsMock = getDrugForms as jest.Mock;

jest.mock('./set-drug-forms.dispatch');
const setDrugFormsDispatchMock = setDrugFormsDispatch as jest.Mock;

describe('getDrugFormsDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getDrugFormsMock.mockResolvedValue({});
  });

  it('makes API request', async () => {
    const configMock = GuestExperienceConfig;
    const sessionDispatchMock = jest.fn();

    await getDrugFormsDispatch(sessionDispatchMock, configMock);

    expect(getDrugFormsMock).toHaveBeenCalledWith(
      configMock.apis.domainDataApi,
      configMock.domainDataSearchKeyPublic,
      getEndpointRetryPolicy
    );
  });

  it('dispatches set drug forms', async () => {
    const sessionDispatchMock = jest.fn();

    const drugFormsMock: IDrugForm[] = [drugForm1Mock, drugForm2Mock];
    getDrugFormsMock.mockResolvedValue(drugFormsMock);

    await getDrugFormsDispatch(sessionDispatchMock, GuestExperienceConfig);

    expect(setDrugFormsDispatchMock).toHaveBeenCalledWith(
      sessionDispatchMock,
      drugFormsMock
    );
  });
});
