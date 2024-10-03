// Copyright 2022 Prescryptive Health, Inc.

import { IUpdateLanguageCodeRequestBody } from '../../../../../models/api-request-body/update-language-code.request-body';
import { LanguageCode } from '../../../../../models/language';
import { RootStackNavigationProp } from '../../../navigation/stack-navigators/root/root.stack-navigator';
import { IAsyncActionArgs } from '../../../state/async-action-args';
import { MembershipDispatch } from '../../../state/membership/dispatch/membership.dispatch';
import { 
  setLanguageCodeDispatch as setMemberLanguageCodeDispatch 
} from '../../../state/membership/dispatch/set-language-code.dispatch';
import {
  ILanguageCodeDispatchArgs,
  languageCodeDispatch,
} from '../dispatch/language-code.dispatch';
import { dataLoadingAction } from '../../modal-popup/modal-popup.reducer.actions';

export interface ILanguageCodeAsyncActionArgs extends IAsyncActionArgs {
  languageCode: LanguageCode;
  membershipDispatch: MembershipDispatch;
  navigation?: RootStackNavigationProp;
  showSpinner?: boolean;
}

export const languageCodeAsyncAction = async (
  args: ILanguageCodeAsyncActionArgs
): Promise<boolean> => {
  try {
    if (args.showSpinner) {
      await dataLoadingAction(asyncAction, args)(
        args.reduxDispatch,
        args.reduxGetState
      );
    } else {
      await asyncAction(args)();
    }

    return true;
  } catch (error) {
    return false;
  }
};

const asyncAction = (args: ILanguageCodeAsyncActionArgs) => {
  return async () => {
    setMemberLanguageCodeDispatch(args.membershipDispatch, args.languageCode);

    const updateLanguageCodeRequestBody: IUpdateLanguageCodeRequestBody = {
      languageCode: args.languageCode,
    };

    const languageCodeDispatchArgs: ILanguageCodeDispatchArgs = {
      updateLanguageCodeRequestBody,
      navigation: args.navigation,
      reduxDispatch: args.reduxDispatch,
      reduxGetState: args.reduxGetState,
      membershipDispatch: args.membershipDispatch,
    };

    const result = await languageCodeDispatch(languageCodeDispatchArgs);
    if (!result) {
      throw new Error('languageCodeDispatch failed');
    }
  };
};
