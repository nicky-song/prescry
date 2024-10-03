// Copyright 2021 Prescryptive Health, Inc.

import { setPrescriptionInfoDispatch } from './set-prescription-info.dispatch';
import { prescriptionInfoSetAction } from '../actions/prescription-info-set.action';
import { prescriptionInfoMock } from '../../../__mocks__/prescription-info.mock';
import { IDrugInformationItem } from '../../../../../models/api-response/drug-information-response';

describe('setOrderDateDispatch', () => {
  it('dispatches expected action', () => {
    const dispatchMock = jest.fn();

    setPrescriptionInfoDispatch(dispatchMock, prescriptionInfoMock);

    const expectedAction = prescriptionInfoSetAction(prescriptionInfoMock);
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });

  it('dispatches expected action when drug information exists', () => {
    const dispatchMock = jest.fn();
    const drugInfoMock = {} as IDrugInformationItem;
    setPrescriptionInfoDispatch(
      dispatchMock,
      prescriptionInfoMock,
      drugInfoMock
    );
    const expectedAction = prescriptionInfoSetAction(
      prescriptionInfoMock,
      drugInfoMock
    );
    expect(dispatchMock).toHaveBeenCalledWith(expectedAction);
  });
});
