// Copyright 2020 Prescryptive Health, Inc.

import { getDrugInformationResponseAction } from './get-drug-information-response.action';
import { IDrugInformationItem } from '../../../../../models/api-response/drug-information-response';

describe('getDrugInformationResponseAction', () => {
  it('returns action', () => {
    const mockResponseData = {
      drugName: 'Basaglar KwikPen',
      NDC: '00002771501',
      externalLink: 'https://e.lilly/2FMmWRZ',
      videoImage: '',
      videoLink: 'https://e.lilly/3j6MMi1',
    } as IDrugInformationItem;

    const action = getDrugInformationResponseAction(mockResponseData);
    expect(action.type).toEqual('DRUG_INFORMATION_RESPONSE');
    expect(action.payload).toEqual(mockResponseData);
  });
});
