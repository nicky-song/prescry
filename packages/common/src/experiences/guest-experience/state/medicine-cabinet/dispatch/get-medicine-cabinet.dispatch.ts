// Copyright 2021 Prescryptive Health, Inc.

import { IPrescriptionInfo } from '../../../../../models/prescription-info';
import { getMedicineCabinet } from '../../../api/api-v1.get-medicine-cabinet';
import { tokenUpdateDispatch } from '../../../store/settings/dispatch/token-update.dispatch';
import { medicineCabinetStateMock } from '../../../__mocks__/medicine-cabinet-state.mock';
import { IGetMedicineCabinetAsyncActionArgs } from '../async-actions/get-medicine-cabinet.async-action';
import { setMedicineCabinetPrescriptionsDispatch } from './set-medicine-cabinet-prescriptions.dispatch';
import { setMoreMedicineCabinetPrescriptionsDispatch } from './set-more-medicine-cabinet-prescriptions.dispatch';

export const getMedicineCabinetDispatch = async ({
  page,
  medicineCabinetDispatch,
  reduxGetState,
  reduxDispatch,
}: IGetMedicineCabinetAsyncActionArgs): Promise<void> => {
  const state = reduxGetState();
  const { config, settings } = state;
  const apiConfig = config.apis.guestExperienceApi;
  if (!state.features.usetestcabinet) {
    const response = await getMedicineCabinet(
      page,
      apiConfig,
      settings.token,
      settings.deviceToken,
      undefined
    );

    await tokenUpdateDispatch(reduxDispatch, response.refreshToken);

    if (page === 1) {
      setMedicineCabinetPrescriptionsDispatch(
        medicineCabinetDispatch,
        response.data
      );
    } else {
      setMoreMedicineCabinetPrescriptionsDispatch(
        medicineCabinetDispatch,
        response.data
      );
    }
  } else {
    if (page === 1) {
      setMedicineCabinetPrescriptionsDispatch(
        medicineCabinetDispatch,
        medicineCabinetMockPrescriptions(
          medicineCabinetStateMock.prescriptions,
          page
        )
      );
    } else {
      setMoreMedicineCabinetPrescriptionsDispatch(
        medicineCabinetDispatch,
        medicineCabinetMockPrescriptions(
          medicineCabinetStateMock.prescriptions,
          page
        )
      );
    }
  }
};

const medicineCabinetMockPrescriptions = (
  prescriptions: IPrescriptionInfo[],
  page: number
): IPrescriptionInfo[] => {
  const limit = 5;
  const sortedPrescriptions = prescriptions.sort(
    (a: IPrescriptionInfo, b: IPrescriptionInfo) => {
      if (a.authoredOn && b.authoredOn) {
        return (
          new Date(b.authoredOn).getTime() - new Date(a.authoredOn).getTime()
        );
      } else {
        return -1;
      }
    }
  );
  return paginate(sortedPrescriptions, limit, page);
};

const paginate = (
  array: IPrescriptionInfo[],
  pageSize: number,
  pageLimit: number
): IPrescriptionInfo[] => {
  return array.slice((pageLimit - 1) * pageSize, pageLimit * pageSize);
};
