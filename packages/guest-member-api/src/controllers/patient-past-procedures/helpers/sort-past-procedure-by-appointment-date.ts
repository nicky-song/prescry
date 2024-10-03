// Copyright 2020 Prescryptive Health, Inc.

import { IPastProcedure } from '@phx/common/src/models/api-response/past-procedure-response';

export function sortPastProceduresByAppointmentDate(
  results: IPastProcedure[]
): IPastProcedure[] {
  if (results.length <= 1) {
    return results;
  }
  results.sort((first: IPastProcedure, second: IPastProcedure) => {
    if (first.date && second.date) {
      if (new Date(first.date) > new Date(second.date)) {
        return -1;
      }
    }
    return 1;
  });
  return results;
}
