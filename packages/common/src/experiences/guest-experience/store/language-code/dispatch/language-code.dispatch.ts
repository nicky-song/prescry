// Copyright 2022 Prescryptive Health, Inc.

import { IUpdateLanguageCodeRequestBody } from '../../../../../models/api-request-body/update-language-code.request-body';
import { updateLanguageCode } from '../../../api/api-v1.update-language-code';
import { ILanguageCodeAsyncActionArgs } from '../async-actions/language-code.async-action';

export interface ILanguageCodeDispatchArgs
  extends Omit<ILanguageCodeAsyncActionArgs, 'languageCode'> {
  updateLanguageCodeRequestBody: IUpdateLanguageCodeRequestBody;
}
export const languageCodeDispatch = async (
  args: ILanguageCodeDispatchArgs
): Promise<boolean> => {
  const state = args.reduxGetState();

  try {
    const result = await updateLanguageCode(
      state.config.apis.guestExperienceApi,
      args.updateLanguageCodeRequestBody,
      state.settings.deviceToken,
      state.settings.token
    );

    return !!result;
  } catch {
    return false;
  }
};
