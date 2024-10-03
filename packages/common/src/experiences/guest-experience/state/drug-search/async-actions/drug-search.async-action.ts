// Copyright 2021 Prescryptive Health, Inc.

import { internalErrorDispatch } from '../../../store/error-handling/dispatch/internal-error.dispatch';
import { IAsyncActionArgs } from '../../async-action-args';
import { DrugSearchDispatch } from '../dispatch/drug-search.dispatch';
import { getDrugSearchResultsDispatch } from '../dispatch/get-drug-search-results.dispatch';
import { RootStackNavigationProp } from './../../../navigation/stack-navigators/root/root.stack-navigator';

export interface IDrugSearchAsyncActionArgs extends IAsyncActionArgs {
  filter: string;
  maxResults: number;
  rxSubGroup: string;
  drugSearchDispatch: DrugSearchDispatch;
  navigation: RootStackNavigationProp;
  useAllMedicationsSearch?: boolean;
}

export const drugSearchAsyncAction = async (
  args: IDrugSearchAsyncActionArgs
): Promise<void> => {
  try {
    await getDrugSearchResultsDispatch(args);
  } catch (error) {
    internalErrorDispatch(args.navigation, error as Error);
  }
};
