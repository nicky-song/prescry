// Copyright 2022 Prescryptive Health, Inc.

import { IAlternativeMedication } from '../../../models/alternative-medication';
import { IClaimAlert } from '../../../models/claim-alert/claim-alert';
import { IPrescriptionDetails } from '../../../models/prescription-details';
import { IPrescribedMedication } from '../../../models/prescribed-medication';
import { IContactInfo } from '../../../models/contact-info';

export type IWhoSaves = 'plan' | 'member';
export interface IDrugPricing {
  memberPays: number;
  planPays?: number;
}

export type ClaimNotification =
  | 'alternativesAvailable'
  | 'bestPrice'
  | 'reversal';

const orderDate = new Date().toDateString();
const identifiers: Pick<IClaimAlert, 'identifier' | 'masterId' | 'prescriber'> =
  {
    identifier: 'id-12345',
    masterId: 'person-12345',
    prescriber: {
      name: 'Dr. Ned',
      phone: '555-555-5555',
    },
  };

const pharmacyName = 'Bartell Drugs #18';
const phoneNumber = '(800) 881-5894';
const pharmacyAddress1 = '8574 Wintergreen Lane';
const pharmacyCity = 'Seattle';
const pharmacyState = 'WA';
const pharmacyZipCode = '98101';
const pharmacyHours = [
  {
    day: 'sun',
    opens: {
      h: 7,
      m: 0,
      pm: false,
    },
    closes: {
      h: 9,
      m: 0,
      pm: true,
    },
  },
  {
    day: 'mon',
    opens: {
      h: 7,
      m: 0,
      pm: false,
    },
    closes: {
      h: 9,
      m: 0,
      pm: true,
    },
  },
  {
    day: 'tue',
    opens: {
      h: 7,
      m: 0,
      pm: false,
    },
    closes: {
      h: 9,
      m: 0,
      pm: true,
    },
  },
  {
    day: 'wed',
    opens: {
      h: 7,
      m: 0,
      pm: false,
    },
    closes: {
      h: 9,
      m: 0,
      pm: true,
    },
  },
  {
    day: 'thu',
    opens: {
      h: 7,
      m: 0,
      pm: false,
    },
    closes: {
      h: 9,
      m: 0,
      pm: true,
    },
  },
  {
    day: 'fri',
    opens: {
      h: 7,
      m: 0,
      pm: false,
    },
    closes: {
      h: 9,
      m: 0,
      pm: true,
    },
  },
  {
    day: 'sat',
    opens: {
      h: 7,
      m: 0,
      pm: false,
    },
    closes: {
      h: 9,
      m: 0,
      pm: true,
    },
  },
];

export const pharmacyInfoMock: IContactInfo = {
  name: pharmacyName,
  phone: phoneNumber,
  address: {
    lineOne: pharmacyAddress1,
    city: pharmacyCity,
    state: pharmacyState,
    zip: pharmacyZipCode,
  },
  hours: pharmacyHours,
  ncpdp: 'ncpdp-mock',
};

const lyricaPrescribedMedication: IPrescribedMedication = {
  drugName: 'Lyrica',
  drugDetails: {
    strength: '150',
    unit: 'mg',
    formCode: 'capsules',
    quantity: 30,
    supply: 30,
  },
  price: 141.58,
  planPrice: 707.9,
  orderDate,
};

export const janumetPrescribedMedicationMock: IPrescribedMedication = {
  drugName: 'Janumet',
  drugDetails: {
    strength: '500',
    unit: 'mg',
    formCode: 'tablets',
    quantity: 60,
    supply: 30,
  },
  price: 141.58,
  planPrice: 707.9,
  orderDate,
};

const invokanaPrescribedMedication: IPrescribedMedication = {
  drugName: 'Invokana',
  drugDetails: {
    strength: '100',
    unit: 'mg',
    formCode: 'tablets',
    quantity: 30,
    supply: 30,
  },
  planPrice: 281.46,
  price: 281.46,
  orderDate,
};

const pregablinPrescribedMedication: IPrescribedMedication = {
  drugName: 'Pregablin',
  drugDetails: {
    strength: '150',
    unit: 'mg',
    quantity: 30,
    formCode: 'capsules',
    supply: 30,
  },
  price: 141.58,
  planPrice: 707.9,
  orderDate,
};

const januviaPrescriptionDetails: IPrescriptionDetails = {
  productName: 'Januvia',
  strength: '100',
  unit: 'mg',
  quantity: 60,
  supply: 30,
  formCode: 'tablets',
};

const metforminPrescriptionDetails: IPrescriptionDetails = {
  productName: 'metFORMIN HCl ER',
  strength: '1000',
  unit: 'mg',
  quantity: 60,
  supply: 60,
  formCode: 'tablets',
};

const nesinaPrescriptionDetails: IPrescriptionDetails = {
  productName: 'Nesina',
  strength: '25',
  unit: 'mg',
  quantity: 30,
  supply: 45,
  formCode: 'tablets',
};

const onglyzaPrescriptionDetails: IPrescriptionDetails = {
  productName: 'Onglyza',
  strength: '5',
  unit: 'mg',
  quantity: 30,
  supply: 30,
  formCode: 'tablets',
};

const pregablinPrescriptionDetails: IPrescriptionDetails = {
  productName: 'Pregablin',
  strength: '150',
  unit: 'mg',
  quantity: 30,
  formCode: 'capsules',
};

const farxigaPrescriptionDetails: IPrescriptionDetails = {
  productName: 'Farxiga',
  strength: '5',
  unit: 'mg',
  quantity: 30,
  supply: 30,
  formCode: 'tablets',
};

const steglatroPrescriptionDetails: IPrescriptionDetails = {
  productName: 'Steglatro',
  strength: '5',
  unit: 'mg',
  quantity: 30,
  supply: 30,
  formCode: 'tablets',
};

export const alternativePlanComboBrandMedicationsMock: IAlternativeMedication[] =
  [
    {
      memberSaves: 0,
      planSaves: 622.9,
      prescriptionDetailsList: [
        januviaPrescriptionDetails,
        metforminPrescriptionDetails,
      ],
      drugPricing: { memberPays: 85, planPays: 85 },
    },
    {
      memberSaves: 0,
      planSaves: 622.9,
      prescriptionDetailsList: [
        nesinaPrescriptionDetails,
        metforminPrescriptionDetails,
      ],
      drugPricing: { memberPays: 85, planPays: 85 },
    },
    {
      memberSaves: 0,
      planSaves: 622.9,
      prescriptionDetailsList: [
        onglyzaPrescriptionDetails,
        metforminPrescriptionDetails,
      ],
      drugPricing: { memberPays: 85, planPays: 85 },
    },
  ];

export const alternativePlanComboBrand: IClaimAlert = {
  ...identifiers,
  notificationType: 'alternativesAvailable',
  prescribedMedication: janumetPrescribedMedicationMock,
  alternativeMedicationList: alternativePlanComboBrandMedicationsMock,
  pharmacyInfo: pharmacyInfoMock,
};

const alternativePlanComboGenericMedications: IAlternativeMedication[] = [
  {
    memberSaves: 0,
    planSaves: 622.9,
    prescriptionDetailsList: [
      januviaPrescriptionDetails,
      metforminPrescriptionDetails,
    ],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
  {
    memberSaves: 0,
    planSaves: 622.9,
    prescriptionDetailsList: [
      nesinaPrescriptionDetails,
      metforminPrescriptionDetails,
    ],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
  {
    memberSaves: 0,
    planSaves: 622.9,
    prescriptionDetailsList: [metforminPrescriptionDetails],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
];

export const alternativePlanComboGenericMock: IClaimAlert = {
  ...identifiers,
  notificationType: 'alternativesAvailable',
  prescribedMedication: janumetPrescribedMedicationMock,
  alternativeMedicationList: alternativePlanComboGenericMedications,
  pharmacyInfo: pharmacyInfoMock,
};

const alternativePlanSingleBrandMedications: IAlternativeMedication[] = [
  {
    memberSaves: 0,
    planSaves: 260.76,
    prescriptionDetailsList: [metforminPrescriptionDetails],
    drugPricing: { memberPays: 5.17, planPays: 20.7 },
  },
];
export const alternativePlanSingleBrand: IClaimAlert = {
  ...identifiers,
  notificationType: 'alternativesAvailable',
  prescribedMedication: invokanaPrescribedMedication,
  alternativeMedicationList: alternativePlanSingleBrandMedications,
  pharmacyInfo: pharmacyInfoMock,
};

const alternativePlanSingleGenericMedications: IAlternativeMedication[] = [
  {
    memberSaves: 0,
    planSaves: 682,
    prescriptionDetailsList: [pregablinPrescriptionDetails],
    drugPricing: { memberPays: 25, planPays: 25 },
  },
];

export const alternativePlanSingleGeneric: IClaimAlert = {
  ...identifiers,
  notificationType: 'alternativesAvailable',
  prescribedMedication: lyricaPrescribedMedication,
  alternativeMedicationList: alternativePlanSingleGenericMedications,
  pharmacyInfo: pharmacyInfoMock,
};

const alternativeMemberComboBrandMedications: IAlternativeMedication[] = [
  {
    memberSaves: 56,
    planSaves: 0,
    prescriptionDetailsList: [
      januviaPrescriptionDetails,
      metforminPrescriptionDetails,
    ],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
  {
    memberSaves: 56,
    planSaves: 0,
    prescriptionDetailsList: [
      nesinaPrescriptionDetails,
      metforminPrescriptionDetails,
    ],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
  {
    memberSaves: 56,
    planSaves: 0,
    prescriptionDetailsList: [
      onglyzaPrescriptionDetails,
      metforminPrescriptionDetails,
    ],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
];

export const alternativeMemberComboBrand: IClaimAlert = {
  ...identifiers,
  notificationType: 'alternativesAvailable',
  prescribedMedication: janumetPrescribedMedicationMock,
  alternativeMedicationList: alternativeMemberComboBrandMedications,
  pharmacyInfo: pharmacyInfoMock,
};

const alternativeMemberComboGenericMedications: IAlternativeMedication[] = [
  {
    memberSaves: 56,
    planSaves: 0,
    prescriptionDetailsList: [
      januviaPrescriptionDetails,
      metforminPrescriptionDetails,
    ],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
  {
    memberSaves: 56,
    planSaves: 0,
    prescriptionDetailsList: [
      nesinaPrescriptionDetails,
      metforminPrescriptionDetails,
    ],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
  {
    memberSaves: 56,
    planSaves: 0,
    prescriptionDetailsList: [metforminPrescriptionDetails],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
];

export const alternativeMemberComboGeneric: IClaimAlert = {
  ...identifiers,
  notificationType: 'alternativesAvailable',
  prescribedMedication: janumetPrescribedMedicationMock,
  alternativeMedicationList: alternativeMemberComboGenericMedications,
  pharmacyInfo: pharmacyInfoMock,
};

const alternativeMemberSingleBrandMedications: IAlternativeMedication[] = [
  {
    memberSaves: 249.32,
    planSaves: 0,
    prescriptionDetailsList: [steglatroPrescriptionDetails],
    drugPricing: { memberPays: 32.14, planPays: 289.27 },
  },
  {
    memberSaves: 228.57,
    planSaves: 0,
    prescriptionDetailsList: [farxigaPrescriptionDetails],
    drugPricing: { memberPays: 52.89, planPays: 460.04 },
  },
  {
    memberSaves: 276.29,
    planSaves: 0,
    prescriptionDetailsList: [metforminPrescriptionDetails],
    drugPricing: { memberPays: 5.17, planPays: 20.7 },
  },
];

export const alternativeMemberSingleBrand: IClaimAlert = {
  ...identifiers,
  notificationType: 'alternativesAvailable',
  prescribedMedication: invokanaPrescribedMedication,
  alternativeMedicationList: alternativeMemberSingleBrandMedications,
  pharmacyInfo: pharmacyInfoMock,
};

const alternativeMemberSingleGenericMedications: IAlternativeMedication[] = [
  {
    memberSaves: 116,
    planSaves: 0,
    prescriptionDetailsList: [pregablinPrescriptionDetails],
    drugPricing: { memberPays: 25, planPays: 25 },
  },
];

const alternativeBothComboBrandMedications: IAlternativeMedication[] = [
  {
    memberSaves: 56.58,
    planSaves: 622.9,
    prescriptionDetailsList: [
      januviaPrescriptionDetails,
      metforminPrescriptionDetails,
    ],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
  {
    memberSaves: 56.58,
    planSaves: 622.9,
    prescriptionDetailsList: [
      nesinaPrescriptionDetails,
      metforminPrescriptionDetails,
    ],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
  {
    memberSaves: 56.58,
    planSaves: 622.9,
    prescriptionDetailsList: [
      onglyzaPrescriptionDetails,
      metforminPrescriptionDetails,
    ],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
];

export const alternativeBothComboBrand: IClaimAlert = {
  ...identifiers,
  notificationType: 'alternativesAvailable',
  prescribedMedication: janumetPrescribedMedicationMock,
  alternativeMedicationList: alternativeBothComboBrandMedications,
  pharmacyInfo: pharmacyInfoMock,
};

const alternativeBothComboGenericMedications: IAlternativeMedication[] = [
  {
    memberSaves: 56.58,
    planSaves: 622.9,
    prescriptionDetailsList: [
      januviaPrescriptionDetails,
      metforminPrescriptionDetails,
    ],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
  {
    memberSaves: 56.58,
    planSaves: 622.9,
    prescriptionDetailsList: [
      nesinaPrescriptionDetails,
      metforminPrescriptionDetails,
    ],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
  {
    memberSaves: 56.58,
    planSaves: 622.9,
    prescriptionDetailsList: [metforminPrescriptionDetails],
    drugPricing: { memberPays: 85, planPays: 85 },
  },
];

export const alternativeBothComboGeneric: IClaimAlert = {
  ...identifiers,
  notificationType: 'alternativesAvailable',
  prescribedMedication: janumetPrescribedMedicationMock,
  alternativeMedicationList: alternativeBothComboGenericMedications,
  pharmacyInfo: pharmacyInfoMock,
};

const alternativeBothSingleBrandMedications: IAlternativeMedication[] = [
  {
    memberSaves: 276.29,
    planSaves: 260.76,
    prescriptionDetailsList: [metforminPrescriptionDetails],
    drugPricing: { memberPays: 5.17, planPays: 20.7 },
  },
];
export const alternativeBothSingleBrand: IClaimAlert = {
  ...identifiers,
  notificationType: 'alternativesAvailable',
  prescribedMedication: invokanaPrescribedMedication,
  alternativeMedicationList: alternativeBothSingleBrandMedications,
  pharmacyInfo: pharmacyInfoMock,
};

const alternativeBothSingleGenericMedications: IAlternativeMedication[] = [
  {
    memberSaves: 116.58,
    planSaves: 682,
    prescriptionDetailsList: [pregablinPrescriptionDetails],
    drugPricing: { memberPays: 25, planPays: 25 },
  },
];

export const alternativeBothSingleGeneric: IClaimAlert = {
  ...identifiers,
  notificationType: 'alternativesAvailable',
  prescribedMedication: lyricaPrescribedMedication,
  alternativeMedicationList: alternativeBothSingleGenericMedications,
  pharmacyInfo: pharmacyInfoMock,
};

export const alternativeMemberSingleGeneric: IClaimAlert = {
  ...identifiers,
  notificationType: 'alternativesAvailable',
  prescribedMedication: lyricaPrescribedMedication,
  alternativeMedicationList: alternativeMemberSingleGenericMedications,
  pharmacyInfo: pharmacyInfoMock,
};

export const bestPriceBrand: IClaimAlert = {
  ...identifiers,
  notificationType: 'bestPrice',
  prescribedMedication: lyricaPrescribedMedication,
  alternativeMedicationList: [],
  pharmacyInfo: pharmacyInfoMock,
};

export const bestPriceGeneric: IClaimAlert = {
  ...identifiers,
  notificationType: 'bestPrice',
  prescribedMedication: pregablinPrescribedMedication,
  alternativeMedicationList: [],
  pharmacyInfo: pharmacyInfoMock,
};

export const claimAlertMock: IClaimAlert = {
  ...identifiers,
  notificationType: 'alternativesAvailable',
  prescribedMedication: lyricaPrescribedMedication,
  alternativeMedicationList: alternativeMemberSingleBrandMedications,
  pharmacyInfo: pharmacyInfoMock,
};
