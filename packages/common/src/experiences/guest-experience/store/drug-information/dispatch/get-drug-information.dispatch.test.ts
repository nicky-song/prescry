// Copyright 2021 Prescryptive Health, Inc.

import { getDrugInformationResponseAction } from '../actions/get-drug-information-response.action';
import { getDrugInformationDispatch } from './get-drug-information.dispatch';
import { getDrugInformation } from '../../../api/api-v1.get-drug-information';
import { IDrugInformationItem } from '../../../../../models/api-response/drug-information-response';

jest.mock('../../../api/api-v1.get-drug-information', () => ({
  getDrugInformation: jest.fn().mockResolvedValue({ data: {} }),
}));
const getDrugInformationMock = getDrugInformation as jest.Mock;
const ndc = '00000101111';
describe('getDrugInformationDispatch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('calls getDrugInformation API with expected arguments', async () => {
    const dispatchMock = jest.fn();
    const contentManagementApiMock = 'contentManagementApi';
    const state = {
      config: {
        apis: {
          contentManagementApi: contentManagementApiMock,
        },
      },
    };
    const stateMock = jest.fn().mockReturnValue(state);
    await getDrugInformationDispatch(dispatchMock, stateMock, ndc);

    expect(getDrugInformationMock).toHaveBeenCalledWith(
      contentManagementApiMock,
      ndc
    );
  });

  it('dispatches getDrugInformationResponseAction', async () => {
    const contentManagementApiMock = 'contentManagementApi';
    const state = {
      config: {
        apis: {
          contentManagementApi: contentManagementApiMock,
        },
      },
    };
    const stateMock = jest.fn().mockReturnValue(state);
    const drugInformationResponseMock = {
      drugName: 'Basaglar KwikPen',
      NDC: '00002771501',
      externalLink: 'https://e.lilly/2FMmWRZ',
      videoImage: '',
      videoLink: 'https://e.lilly/3j6MMi1',
    } as IDrugInformationItem;

    getDrugInformationMock.mockResolvedValue(drugInformationResponseMock);

    const dispatchMock = jest.fn();
    await getDrugInformationDispatch(dispatchMock, stateMock, ndc);

    const responseAction = getDrugInformationResponseAction(
      drugInformationResponseMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(responseAction);
  });

  it('does not dispatches getDrugInformationResponseAction if there is an exception from API', async () => {
    const contentManagementApiMock = 'contentManagementApi';
    const state = {
      config: {
        apis: {
          contentManagementApi: contentManagementApiMock,
        },
      },
    };
    const stateMock = jest.fn().mockReturnValue(state);

    getDrugInformationMock.mockImplementation(() => {
      throw new Error('some error');
    });

    const dispatchMock = jest.fn();
    await getDrugInformationDispatch(dispatchMock, stateMock, ndc);
    expect(dispatchMock).not.toHaveBeenCalled();
  });
});
