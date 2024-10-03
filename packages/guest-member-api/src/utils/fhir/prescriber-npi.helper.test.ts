// Copyright 2023 Prescryptive Health, Inc.

import { IFhir } from '../../models/fhir/fhir';
import { findFhirMedicationRequestResource } from './fhir-resource.helper';
import { findPrescriberNPIForPrescriptionFhir } from './prescriber-npi.helper';

jest.mock('./fhir-resource.helper');
const findFhirMedicationRequestResourceMock =
  findFhirMedicationRequestResource as jest.Mock;

const fhirMock = {} as IFhir;

const npiMock = 'npi-mock';

describe('findPrescriberNPIForPrescriptionFhir', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    findFhirMedicationRequestResourceMock.mockReturnValue({
      requester: {
        reference: npiMock,
      },
    });
  });
  it('destructures fhir and returns expected identifier value', () => {
    const result = findPrescriberNPIForPrescriptionFhir(fhirMock);

    expect(findFhirMedicationRequestResourceMock).toHaveBeenCalledTimes(1);
    expect(findFhirMedicationRequestResourceMock).toHaveBeenNthCalledWith(
      1,
      fhirMock
    );

    expect(result).toEqual(npiMock);
  });
});
