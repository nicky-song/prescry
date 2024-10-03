// Copyright 2021 Prescryptive Health, Inc.

import { getPharmaciesPricesByNdc } from './get-pharmacies-prices-by-ndc';
import { getSmartPriceByNdc } from './get-smart-price-by-ndc';
import { configurationMock } from '../../mock-data/configuration.mock';
import {
  prescriptionPharmacyPriceMock1,
  prescriptionPharmacyPriceMock2,
  prescriptionPharmacyPriceMock3,
  prescriptionPharmacyPriceMock4,
} from '../../mock-data/prescription-pharmacy-price.mock';
import { getPricesForNdcAndPharmacies } from './get-prices-for-pharmacies-and-ndc';
import { pbmPriceMock3 } from '../../mock-data/drug-price-ncpdp.mock';
import { getPatientCoverageByMemberId } from '../coverage/get-patient-coverage-by-member-id';
import { ICoverage } from '../../models/fhir/patient-coverage/coverage';
import { getActiveCoveragesOfPatient } from '../fhir-patient/get-active-coverages-of-patient';
import { getMasterIdFromCoverage } from '../get-master-id-from-coverage.helper';
import { publishCommonBusinessEventMessage } from '../service-bus/common-business-event.helper';
import { getRTPBPrices, IRTPBResponse } from './get-rtpb-prices';
import { ErrorConstants } from '../../constants/response-messages';
import { Extension } from '../../models/rtpb/rtpb';
import { CommonEventType } from '../../models/common-business-monitoring-event';
import { ISmartPriceLookupRequest } from '../../models/content/smart-price.request';

jest.mock('./get-rtpb-prices');
const getRTPBPricesMock = getRTPBPrices as jest.Mock;

jest.mock('../service-bus/common-business-event.helper');
const publishCommonBusinessEventMessageMock =
  publishCommonBusinessEventMessage as jest.Mock;

jest.mock('../get-master-id-from-coverage.helper');
const getMasterIdFromCoverageMock = getMasterIdFromCoverage as jest.Mock;

jest.mock('../fhir-patient/get-active-coverages-of-patient');
const getActiveCoveragesOfPatientMock =
  getActiveCoveragesOfPatient as jest.Mock;

jest.mock('../coverage/get-patient-coverage-by-member-id');
const getPatientCoverageByMemberIdMock =
  getPatientCoverageByMemberId as jest.Mock;

jest.mock('./get-smart-price-by-ndc');
const getSmartPriceByNdcMock = getSmartPriceByNdc as jest.Mock;

jest.mock('./get-pharmacies-prices-by-ndc');
const getPharmaciesPricesByNdcMock = getPharmaciesPricesByNdc as jest.Mock;

const mockFillDate = '2000-01-01T00:00:00.000Z';
beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockFillDate);
});

const memberIdMock = 'member-id';
const groupPlanCodeMock = 'gpc';
const ndcMock = 'mock-ndc';
const quantityMock = 1;
const daysSupplyMock = 30;
const rxNumberMock = 'mock-rx-number';
const refillMock = '10';
const pharmacyIdsMock: string[] = ['ncpdp1', 'ncpdp2'];
const coverageMock: ICoverage[] = [{} as ICoverage];
const activeCoveragesMock: ICoverage[] = [{} as ICoverage];
const masterIdMock = 'master-id-mock';
const prescriberNpiMock = 'prescriber-npi-mock';

describe('getPharmaciesAndPricesForNdc', () => {
  beforeEach(() => {
    getPatientCoverageByMemberIdMock.mockReturnValue(coverageMock);
    getActiveCoveragesOfPatientMock.mockReturnValue(activeCoveragesMock);
    getMasterIdFromCoverageMock.mockReturnValue(masterIdMock);
    getRTPBPricesMock.mockReturnValue({});
  });

  it('gets masterId if activeCoverages length is 1', async () => {
    await getPricesForNdcAndPharmacies(
      ndcMock,
      quantityMock,
      daysSupplyMock,
      pharmacyIdsMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      refillMock,
      rxNumberMock,
      true
    );

    expect(getPatientCoverageByMemberIdMock).toHaveBeenCalledTimes(1);
    expect(getPatientCoverageByMemberIdMock).toHaveBeenNthCalledWith(
      1,
      configurationMock,
      memberIdMock
    );

    expect(getActiveCoveragesOfPatientMock).toHaveBeenCalledTimes(1);
    expect(getActiveCoveragesOfPatientMock).toHaveBeenNthCalledWith(
      1,
      coverageMock
    );

    expect(getMasterIdFromCoverageMock).toHaveBeenCalledTimes(1);
    expect(getMasterIdFromCoverageMock).toHaveBeenNthCalledWith(
      1,
      activeCoveragesMock[0]
    );

    expect(publishCommonBusinessEventMessageMock).not.toHaveBeenCalled();
  });

  it.each([[[]], [[{} as ICoverage, {} as ICoverage]]])(
    'calls publishCommonBusinessEventMessage if there is not 1 active coverage (0 OR > 1)',
    async () => {
      getActiveCoveragesOfPatientMock.mockReset();
      getActiveCoveragesOfPatientMock.mockReturnValueOnce([]);

      await getPricesForNdcAndPharmacies(
        ndcMock,
        quantityMock,
        daysSupplyMock,
        pharmacyIdsMock,
        configurationMock,
        memberIdMock,
        groupPlanCodeMock,
        refillMock,
        rxNumberMock,
        true
      );

      expect(getPatientCoverageByMemberIdMock).toHaveBeenCalledTimes(1);
      expect(getPatientCoverageByMemberIdMock).toHaveBeenNthCalledWith(
        1,
        configurationMock,
        memberIdMock
      );

      expect(getActiveCoveragesOfPatientMock).toHaveBeenCalledTimes(1);
      expect(getActiveCoveragesOfPatientMock).toHaveBeenNthCalledWith(
        1,
        coverageMock
      );

      expect(getMasterIdFromCoverageMock).not.toHaveBeenCalled();

      expect(publishCommonBusinessEventMessageMock).toHaveBeenCalledTimes(1);
      expect(publishCommonBusinessEventMessageMock).toHaveBeenNthCalledWith(1, {
        idType: 'primaryMemberRxId',
        id: memberIdMock,
        messageOrigin: 'myPHX',
        tags: ['Pricing'],
        type: 'error' as CommonEventType,
        subject: ErrorConstants.TOO_MANY_OR_NO_ACTIVE_COVERAGES,
        messageData: JSON.stringify({
          rxInfo: {
            rxNumber: rxNumberMock,
          },
          userInfo: {
            memberId: memberIdMock,
          },
        }),
        eventDateTime: mockFillDate,
      });
    }
  );

  it('returns no prices if getRTPBResponse has no pricingAndCoverages', async () => {
    const pharmacyPrices = await getPricesForNdcAndPharmacies(
      ndcMock,
      quantityMock,
      daysSupplyMock,
      pharmacyIdsMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      refillMock,
      rxNumberMock,
      true,
      prescriberNpiMock
    );

    expect(getRTPBPricesMock).toHaveBeenCalledTimes(1);
    expect(getRTPBPricesMock).toHaveBeenNthCalledWith(
      1,
      {
        patient: masterIdMock
          ? {
              identification: {
                extension: [
                  {
                    name: 'PrescryptiveMasterId',
                    string: {
                      value: masterIdMock,
                    },
                  },
                ],
              },
            }
          : {},
        benefitsCoordination: {
          groupID: groupPlanCodeMock,
        },
        prescriber: {
          identification: {
            npi: prescriberNpiMock,
          },
        },
        requestedProduct: {
          product: {
            drugCoded: {
              ndc: ndcMock,
            },
          },
          quantity: {
            value: quantityMock.toString(),
          },
          daysSupply: daysSupplyMock.toString(),
        },
        extension: [
          {
            name: 'Pharmacies',
            url: 'https://prescryptive.io/data-dictionary/RTPB/extensions/RTPBRequest/Pharmacies',
            extension: pharmacyIdsMock.map((pharmacyId) => {
              return {
                string: { value: pharmacyId },
                name: 'NCPDPID',
                url: 'https://prescryptive.io/data-dictionary/RTPB/extensions/RTPBRequest/Pharmacies/NCPDPID',
              } as Extension;
            }),
          },
        ],
      },
      configurationMock
    );

    expect(pharmacyPrices).toEqual([]);
  });

  it('it returns the expected memberPays, planPays, pharmacyTotalPrice, and insurancePrice from the response (RISRx)', async () => {
    const ncpdpMock = 'ncpdp-mock';
    const memberPaysMock = 1;
    const planPaysMock = 0;
    const insurancePriceMock = 3;

    const rtpbResponseMock: IRTPBResponse = {
      rtpb: {
        patient: {},
        responseProduct: {
          pricingAndCoverages: [
            {
              pricingAndCoverage: [
                {
                  patientPayComponent: [
                    {
                      patientPayComponentAmount: insurancePriceMock.toString(),
                    },
                  ],
                  extension: [
                    {
                      name: 'Provider',
                      string: {
                        value: 'RISRx',
                      },
                    },
                  ],
                },
              ],
            },
            {
              pharmacy: {
                identification: {
                  ncpdpid: ncpdpMock,
                },
              },
              pricingAndCoverage: [
                {
                  patientPayComponent: [
                    {
                      patientPayComponentAmount: memberPaysMock.toString(),
                    },
                  ],
                  extension: [
                    {
                      name: 'Provider',
                      string: {
                        value: 'PhxCash',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    getRTPBPricesMock.mockReturnValue(rtpbResponseMock);

    const pharmacyPrices = await getPricesForNdcAndPharmacies(
      ndcMock,
      quantityMock,
      daysSupplyMock,
      pharmacyIdsMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      refillMock,
      rxNumberMock,
      true
    );

    expect(pharmacyPrices).toEqual([
      {
        ncpdp: ncpdpMock,
        price: {
          memberPays: memberPaysMock,
          planPays: planPaysMock,
          pharmacyTotalPrice: memberPaysMock + planPaysMock,
          insurancePrice: insurancePriceMock,
        },
        dualPrice: {
          smartPriceMemberPays: memberPaysMock,
          pbmType: 'thirdParty',
          pbmMemberPays: insurancePriceMock,
          pbmPlanPays: undefined,
        },
      },
    ]);
  });

  it('it returns the expected memberPays, planPays, pharmacyTotalPrice, and insurancePrice from the response (PhxPbm)', async () => {
    const ncpdpMock = 'ncpdp-mock';
    const memberPaysMock = 1;
    const planPaysMock = 2;

    const rtpbResponseMock: IRTPBResponse = {
      rtpb: {
        patient: {},
        responseProduct: {
          pricingAndCoverages: [
            {
              pharmacy: {
                identification: {
                  ncpdpid: ncpdpMock,
                },
              },
              pricingAndCoverage: [
                {
                  patientPayComponent: [
                    {
                      patientPayComponentAmount: memberPaysMock.toString(),
                    },
                  ],
                  estimatedNetPlanCost: planPaysMock.toString(),
                  extension: [
                    {
                      name: 'Provider',
                      string: {
                        value: 'PhxPbm',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    getRTPBPricesMock.mockReturnValue(rtpbResponseMock);

    const pharmacyPrices = await getPricesForNdcAndPharmacies(
      ndcMock,
      quantityMock,
      daysSupplyMock,
      pharmacyIdsMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      refillMock,
      rxNumberMock,
      true
    );

    expect(pharmacyPrices).toEqual([
      {
        ncpdp: ncpdpMock,
        price: {
          memberPays: memberPaysMock,
          planPays: planPaysMock,
          pharmacyTotalPrice: memberPaysMock + planPaysMock,
          insurancePrice: undefined,
        },
        dualPrice: {
          smartPriceMemberPays: undefined,
          pbmType: 'phx',
          pbmMemberPays: memberPaysMock,
          pbmPlanPays: planPaysMock,
        },
      },
    ]);
  });

  it('Returns no prices if no prices are returned by PBM pricing API: PBM user', async () => {
    const mockErrorMessage = 'mock-error';
    getPharmaciesPricesByNdcMock.mockReturnValueOnce({
      errorCode: 400,
      message: mockErrorMessage,
    });
    const expected = await getPricesForNdcAndPharmacies(
      ndcMock,
      quantityMock,
      daysSupplyMock,
      pharmacyIdsMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      refillMock,
      rxNumberMock
    );
    expect(getPharmaciesPricesByNdcMock).toHaveBeenCalledWith(
      {
        daysSupply: daysSupplyMock,
        fillDate: mockFillDate,
        refillNo: refillMock,
        ndcs: [ndcMock],
        rxNumber: rxNumberMock,
        quantity: quantityMock,
        pharmacyIds: pharmacyIdsMock,
        memberId: memberIdMock,
        groupPlanCode: groupPlanCodeMock,
      },
      configurationMock
    );
    expect(getSmartPriceByNdcMock).not.toHaveBeenCalled();
    expect(expected).toEqual([]);
  });

  it('Returns no prices if prices are returned by PBM pricing API but pharmacy is out of network: PBM user', async () => {
    getPharmaciesPricesByNdcMock.mockReturnValueOnce({
      pharmacyPrices: [
        prescriptionPharmacyPriceMock1,
        prescriptionPharmacyPriceMock2,
      ],
    });
    const expected = await getPricesForNdcAndPharmacies(
      ndcMock,
      quantityMock,
      daysSupplyMock,
      pharmacyIdsMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      refillMock,
      rxNumberMock
    );
    expect(getPharmaciesPricesByNdcMock).toHaveBeenCalledWith(
      {
        daysSupply: daysSupplyMock,
        fillDate: mockFillDate,
        refillNo: refillMock,
        ndcs: [ndcMock],
        rxNumber: rxNumberMock,
        quantity: quantityMock,
        pharmacyIds: pharmacyIdsMock,
        memberId: memberIdMock,
        groupPlanCode: groupPlanCodeMock,
      },
      configurationMock
    );
    expect(getSmartPriceByNdcMock).not.toHaveBeenCalled();
    expect(expected).toEqual([]);
  });

  it('Filters prices for PBM pricing API if pharmacy is out of network OR price values are null or undefined: PBM user', async () => {
    const patientAmountDueNullPriceMock = {
      ...prescriptionPharmacyPriceMock1,
      patientAmountDue: null,
      inNetwork: 'Y',
    };
    const totalPriceNullPriceMock = {
      ...prescriptionPharmacyPriceMock4,
      totalPrice: null,
      inNetwork: 'Y',
    };
    getPharmaciesPricesByNdcMock.mockReturnValueOnce({
      pharmacyPrices: [
        patientAmountDueNullPriceMock,
        prescriptionPharmacyPriceMock2,
        prescriptionPharmacyPriceMock3,
        totalPriceNullPriceMock,
      ],
    });
    const expected = await getPricesForNdcAndPharmacies(
      ndcMock,
      quantityMock,
      daysSupplyMock,
      pharmacyIdsMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      refillMock,
      rxNumberMock
    );
    expect(getPharmaciesPricesByNdcMock).toHaveBeenCalledWith(
      {
        daysSupply: daysSupplyMock,
        fillDate: mockFillDate,
        refillNo: refillMock,
        ndcs: [ndcMock],
        rxNumber: rxNumberMock,
        quantity: quantityMock,
        pharmacyIds: pharmacyIdsMock,
        memberId: memberIdMock,
        groupPlanCode: groupPlanCodeMock,
      },
      configurationMock
    );
    expect(getSmartPriceByNdcMock).not.toHaveBeenCalled();
    expect(expected).toEqual([
      {
        ncpdp: '3845798',
        price: {
          memberPays: 34,
          pharmacyTotalPrice: 338,
          planPays: 304,
        },
        dualPrice: {
          smartPriceMemberPays: undefined,
          pbmType: 'phx',
          pbmMemberPays: 34,
          pbmPlanPays: 304,
        },
      },
    ]);
  });

  it('Calls pbm pricing api if user is not smartprice user', async () => {
    const mockPharmacyPrices = [
      prescriptionPharmacyPriceMock1,
      prescriptionPharmacyPriceMock3,
    ];
    getPharmaciesPricesByNdcMock.mockReturnValueOnce({
      pharmacyPrices: mockPharmacyPrices,
    });

    const expected = await getPricesForNdcAndPharmacies(
      ndcMock,
      quantityMock,
      daysSupplyMock,
      pharmacyIdsMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      refillMock,
      rxNumberMock
    );
    expect(getPharmaciesPricesByNdcMock).toHaveBeenCalledWith(
      {
        daysSupply: daysSupplyMock,
        fillDate: mockFillDate,
        refillNo: refillMock,
        ndcs: [ndcMock],
        rxNumber: rxNumberMock,
        quantity: quantityMock,
        pharmacyIds: pharmacyIdsMock,
        memberId: memberIdMock,
        groupPlanCode: groupPlanCodeMock,
      },
      configurationMock
    );
    expect(getSmartPriceByNdcMock).not.toHaveBeenCalled();
    expect(expected).toEqual([pbmPriceMock3]);
  });

  it('Makes planPays as 0 if its negative : pbm pricing and not smartprice user', async () => {
    const mockPharmacyPrices = [
      { ...prescriptionPharmacyPriceMock3, patientAmountDue: 339 },
      prescriptionPharmacyPriceMock1,
    ];
    const pbmPriceWithPlanPaysZero = {
      ncpdp: '3845798',
      price: { memberPays: 339, planPays: 0, pharmacyTotalPrice: 338.0 },
      dualPrice: {
        smartPriceMemberPays: undefined,
        pbmType: 'phx',
        pbmMemberPays: 339,
        pbmPlanPays: 0,
      },
    };
    getPharmaciesPricesByNdcMock.mockReturnValueOnce({
      pharmacyPrices: mockPharmacyPrices,
    });

    const expected = await getPricesForNdcAndPharmacies(
      ndcMock,
      quantityMock,
      daysSupplyMock,
      pharmacyIdsMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      refillMock,
      rxNumberMock
    );
    expect(getPharmaciesPricesByNdcMock).toHaveBeenCalledWith(
      {
        daysSupply: daysSupplyMock,
        fillDate: mockFillDate,
        refillNo: refillMock,
        ndcs: [ndcMock],
        rxNumber: rxNumberMock,
        quantity: quantityMock,
        pharmacyIds: pharmacyIdsMock,
        memberId: memberIdMock,
        groupPlanCode: groupPlanCodeMock,
      },
      configurationMock
    );
    expect(getSmartPriceByNdcMock).not.toHaveBeenCalled();
    expect(expected).toEqual([pbmPriceWithPlanPaysZero]);
  });

  it('calls getSmartPriceByNDC if isSmartPriceEligible and isRTPB falsy', async () => {
    const pharmacyPricesMock = [
      {
        ProviderId: 'ncpdp-mock-1',
        Price: { RebatedTotalCost: 1 },
      },
      {
        ProviderId: 'ncpdp-mock-2',
        Price: { RebatedTotalCost: 2 },
      },
    ];

    getSmartPriceByNdcMock.mockReturnValueOnce({
      pharmacyPrices: pharmacyPricesMock,
    });

    const expected = await getPricesForNdcAndPharmacies(
      ndcMock,
      quantityMock,
      daysSupplyMock,
      pharmacyIdsMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      refillMock,
      rxNumberMock,
      false,
      undefined,
      true
    );

    const smartPriceRequest: ISmartPriceLookupRequest = {
      providerIds: pharmacyIdsMock,
      date: mockFillDate,
      daysSupply: daysSupplyMock,
      quantity: quantityMock,
    };

    expect(getSmartPriceByNdcMock).toHaveBeenCalledTimes(1);
    expect(getSmartPriceByNdcMock).toHaveBeenNthCalledWith(
      1,
      smartPriceRequest,
      ndcMock,
      configurationMock
    );

    expect(expected).toEqual(
      pharmacyPricesMock.map((smartPrice) => {
        return {
          ncpdp: smartPrice.ProviderId,
          price: {
            memberPays: smartPrice.Price.RebatedTotalCost,
            pharmacyTotalPrice: smartPrice.Price.RebatedTotalCost,
            planPays: 0,
          },
          dualPrice: {
            pbmType: 'none',
            smartPriceMemberPays:smartPrice.Price.RebatedTotalCost,
          },
        };
      })
    );
  });

  it('calls getRTPBPrices with test data for third-party testing', async () => {
    const useTestThirdPartyPricingMock = true;

    const rtpbMasterIdMock = 'PIUERY6A';
    const rtpbGroupIdMock = undefined;
    const rtpbNpiMock = '1326256447';
    const rtpbNdcMock = '00023320503';
    
    await getPricesForNdcAndPharmacies(
      ndcMock,
      quantityMock,
      daysSupplyMock,
      pharmacyIdsMock,
      configurationMock,
      memberIdMock,
      groupPlanCodeMock,
      refillMock,
      rxNumberMock,
      true,
      prescriberNpiMock,
      undefined,
      useTestThirdPartyPricingMock
    );

    expect(getRTPBPricesMock).toHaveBeenCalledTimes(1);
    expect(getRTPBPricesMock).toHaveBeenNthCalledWith(
      1,
      {
        patient: masterIdMock
          ? {
              identification: {
                extension: [
                  {
                    name: 'PrescryptiveMasterId',
                    string: {
                      value: rtpbMasterIdMock,
                    },
                  },
                ],
              },
            }
          : {},
        benefitsCoordination: {
          groupID: rtpbGroupIdMock,
        },
        prescriber: {
          identification: {
            npi: rtpbNpiMock,
          },
        },
        requestedProduct: {
          product: {
            drugCoded: {
              ndc: rtpbNdcMock,
            },
          },
          quantity: {
            value: quantityMock.toString(),
          },
          daysSupply: daysSupplyMock.toString(),
        },
        extension: [
          {
            name: 'Pharmacies',
            url: 'https://prescryptive.io/data-dictionary/RTPB/extensions/RTPBRequest/Pharmacies',
            extension: pharmacyIdsMock.map((pharmacyId) => {
              return {
                string: { value: pharmacyId },
                name: 'NCPDPID',
                url: 'https://prescryptive.io/data-dictionary/RTPB/extensions/RTPBRequest/Pharmacies/NCPDPID',
              } as Extension;
            }),
          },
        ],
      },
      configurationMock
    );
  });
});
