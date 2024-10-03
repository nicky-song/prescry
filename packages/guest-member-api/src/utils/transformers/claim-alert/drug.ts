// Copyright 2022 Prescryptive Health, Inc.

import { Transformer } from '../transformer.types';
import { IMedication } from '@phx/common/src/models/medication';
import { IPrescriptionDetails } from '@phx/common/src/models/prescription-details';
import { IPrescribedMedication } from '@phx/common/src/models/prescribed-medication';

type AdditionalKeys1 = 'quantity' | 'supply' | 'memberPays' | 'planPays';
type AdditionalKeys2 = 'drugDetails' | 'price' | 'planPrice' | 'orderDate';

type DrugTransformerPrescriptionDetails = Transformer<
  IMedication,
  IPrescriptionDetails,
  AdditionalKeys1
>;
type DrugTransformerPrescribedMedication = Transformer<
  IMedication,
  IPrescribedMedication,
  AdditionalKeys2
>;

export const drugTransformerPrescriptionDetails: DrugTransformerPrescriptionDetails =
  ({ fromModel, additional }) => {
    const { name: productName, strength, units, form } = fromModel;

    const prescribedDrug: IPrescriptionDetails = {
      productName,
      strength,
      unit: units,
      formCode: form,
      ...additional,
    };
    return prescribedDrug;
  };

export const drugTransformerPrescribedMedication: DrugTransformerPrescribedMedication =
  ({ fromModel, additional }) => {
    const { name: drugName } = fromModel;

    const prescribedDrug: IPrescribedMedication = {
      drugName,
      ...additional,
    };
    return prescribedDrug;
  };
