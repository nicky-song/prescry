// Copyright 2022 Prescryptive Health, Inc.

import { getNewDate } from '@phx/common/src/utils/date-time/get-new-date';
import { isDateInBetween } from '@phx/common/src/utils/date-time/is-date-in-between.helper';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';

export const getActiveCoveragesOfPatient = (
  patientCoverages: ICoverage[]
): ICoverage[] => {
  const activeCoverages: ICoverage[] = [];

  const nowDate = getNewDate();

  for (const coverage of patientCoverages) {
    const period = coverage.period;

    if (period) {
      const periodStart = period.start;
      const periodEnd = period.end;

      if (periodStart && periodEnd) {
        const isPatientCoverageActive = isDateInBetween(
          periodStart,
          periodEnd,
          nowDate
        );

        if (isPatientCoverageActive) {
          activeCoverages.push(coverage);
        }
      }
    }
  }

  return activeCoverages;
};
