// Copyright 2021 Prescryptive Health, Inc.

import { PbmType } from '@phx/common/src/models/drug-price';
import { IConfiguration } from '../../configuration';
import { ErrorConstants } from '../../constants/response-messages';
import { CommonEventType } from '../../models/common-business-monitoring-event';
import { ISmartPriceLookupRequest } from '../../models/content/smart-price.request';
import { IDrugPriceNcpdp } from '../../models/drug-price-ncpdp';
import { IPatientPriceRequest } from '../../models/platform/pharmacy-pricing-lookup.request';
import {
  Extension,
  RTPBPharmacyResponse,
  RTPBPricingAndCoverages,
  RTPBRequest,
} from '../../models/rtpb/rtpb';
import { getPatientCoverageByMemberId } from '../coverage/get-patient-coverage-by-member-id';
import { getActiveCoveragesOfPatient } from '../fhir-patient/get-active-coverages-of-patient';
import { getMasterIdFromCoverage } from '../get-master-id-from-coverage.helper';
import { publishCommonBusinessEventMessage } from '../service-bus/common-business-event.helper';
import {
  IPharmacyPriceResponse,
  getPharmaciesPricesByNdc,
} from './get-pharmacies-prices-by-ndc';
import { getRTPBPrices, IRTPBResponse } from './get-rtpb-prices';
import {
  getSmartPriceByNdc,
  ISmartPriceLookupResponse,
} from './get-smart-price-by-ndc';

export const getPricesForNdcAndPharmacies = async (
  ndc: string,
  quantity: number,
  daysSupply: number,
  pharmacyIds: string[],
  configuration: IConfiguration,
  memberId: string,
  groupPlanCode: string,
  refillNumber: string,
  rxNumber: string,
  isRTPB?: boolean,
  prescriberNpi?: string,
  isSmartPriceEligible?: boolean,
  useTestThirdPartyPricing?: boolean
): Promise<IDrugPriceNcpdp[]> => {
  const fillDate = new Date().toISOString();

  if (isRTPB) {
    const pharmacyPrices: IDrugPriceNcpdp[] = [];

    const coverage =
      memberId !== 'MOCK-DRUG-SEARCH-MEMBER-ID'
        ? await getPatientCoverageByMemberId(configuration, memberId)
        : undefined;

    let masterId;

    if (coverage?.length) {
      const activeCoverages = getActiveCoveragesOfPatient(coverage);

      if (activeCoverages.length === 1) {
        masterId = getMasterIdFromCoverage(activeCoverages[0]);
      } else {
        publishCommonBusinessEventMessage({
          idType: 'primaryMemberRxId',
          id: memberId,
          messageOrigin: 'myPHX',
          tags: ['Pricing'],
          type: 'error' as CommonEventType,
          subject: ErrorConstants.TOO_MANY_OR_NO_ACTIVE_COVERAGES,
          messageData: JSON.stringify({
            rxInfo: {
              rxNumber,
            },
            userInfo: {
              memberId,
            },
          }),
          eventDateTime: fillDate,
        });
      }
    }

    const rtpbMasterId = useTestThirdPartyPricing ? 'PIUERY6A' : masterId;
    const rtpbNpi = useTestThirdPartyPricing ? '1326256447' : prescriberNpi;
    const rtpbNdc = useTestThirdPartyPricing ? '00023320503' : ndc;
    const rtpbGroupId = useTestThirdPartyPricing
      ? undefined
      : groupPlanCode || undefined;

    const rtpbRequest: RTPBRequest = {
      patient: masterId
        ? {
            identification: {
              extension: [
                {
                  name: 'PrescryptiveMasterId',
                  string: {
                    value: rtpbMasterId,
                  },
                },
              ],
            },
          }
        : {},
      benefitsCoordination: {
        groupID: rtpbGroupId,
      },
      prescriber: {
        identification: {
          npi: rtpbNpi,
        },
      },
      requestedProduct: {
        product: {
          drugCoded: {
            ndc: rtpbNdc,
          },
        },
        quantity: {
          value: quantity.toString(),
        },
        daysSupply: daysSupply.toString(),
      },
      extension: [
        {
          name: 'Pharmacies',
          url: 'https://prescryptive.io/data-dictionary/RTPB/extensions/RTPBRequest/Pharmacies',
          extension: pharmacyIds.map((pharmacyId) => {
            return {
              string: { value: pharmacyId },
              name: 'NCPDPID',
              url: 'https://prescryptive.io/data-dictionary/RTPB/extensions/RTPBRequest/Pharmacies/NCPDPID',
            } as Extension;
          }),
        },
      ],
    };

    const rtpbApiResponse: IRTPBResponse = await getRTPBPrices(
      rtpbRequest,
      configuration
    );

    const { rtpb } = rtpbApiResponse;

    let insurancePrice: number | undefined;

    const isRISRx = (pricingAndCoverage: RTPBPricingAndCoverages) => {
      return !!pricingAndCoverage.extension?.find((extension) => {
        return (
          extension.name === 'Provider' && extension.string?.value === 'RISRx'
        );
      });
    };

    const getPricingAndCoverageRISRx = (
      pricingAndCoverages: RTPBPharmacyResponse[]
    ) => {
      let pricingAndCoverageRISRx: RTPBPricingAndCoverages | undefined;

      pricingAndCoverages.find((pricingCoverages) => {
        const pricingAndCoverage = pricingCoverages.pricingAndCoverage.find(
          (pricingAndCoverage) => {
            return isRISRx(pricingAndCoverage);
          }
        );

        if (pricingAndCoverage) {
          pricingAndCoverageRISRx = pricingAndCoverage;
        }

        return !!pricingAndCoverage;
      });

      return pricingAndCoverageRISRx;
    };

    const setInsurancePriceFromPricingAndCoverage = (
      pricingAndCoverage: RTPBPricingAndCoverages | undefined
    ) => {
      if (
        pricingAndCoverage?.patientPayComponent &&
        pricingAndCoverage?.patientPayComponent[0] &&
        pricingAndCoverage?.patientPayComponent[0].patientPayComponentAmount
      )
        insurancePrice =
          +pricingAndCoverage?.patientPayComponent[0].patientPayComponentAmount;
    };

    if (rtpb?.responseProduct?.pricingAndCoverages) {
      const pricingAndCoverageRISRx = getPricingAndCoverageRISRx(
        rtpb?.responseProduct?.pricingAndCoverages
      );

      setInsurancePriceFromPricingAndCoverage(pricingAndCoverageRISRx);
    }

    const getPricesFromPricingAndCoverage = (
      pricingAndCoverage: RTPBPricingAndCoverages[]
    ) => {
      let pbmPrice: number | undefined;
      let cashPrice: number | undefined;
      let planPays = 0;

      pricingAndCoverage.forEach((pricingAndCoverage) => {
        if (
          pricingAndCoverage.patientPayComponent &&
          pricingAndCoverage.patientPayComponent[0].patientPayComponentAmount
        ) {
          const patientPayComponent = pricingAndCoverage.patientPayComponent[0];

          const memberPrice = patientPayComponent.patientPayComponentAmount;
          const planPrice = pricingAndCoverage.estimatedNetPlanCost ?? 0;

          if (memberPrice && pricingAndCoverage.extension) {
            const extension = pricingAndCoverage.extension.find((extension) => {
              return extension.name === 'Provider';
            });
            const extensionName = extension?.string?.value;

            switch (extensionName) {
              case 'PhxPbm':
                pbmPrice = +memberPrice;
                planPays = +planPrice;
                break;
              case 'PhxCash':
                cashPrice = +memberPrice;
                break;
              default:
                break;
            }
          }
        }
      });

      return { pbmPrice, planPays, cashPrice };
    };

    const buildPharmacyPrice = (
      pbmPrice: number | undefined,
      cashPrice: number | undefined,
      planPays: number,
      insurancePrice: number | undefined,
      ncpdp: string | undefined
    ) => {
      if (ncpdp) {
        const memberPays = pbmPrice ?? cashPrice;

        if (memberPays) {
          const pharmacyTotalPrice = memberPays + planPays;

          const pbmType: PbmType =
            insurancePrice !== undefined
              ? 'thirdParty'
              : pbmPrice !== undefined
              ? 'phx'
              : 'none';

          const pbmPlanPays = pbmType === 'phx' ? planPays : undefined;

          return {
            ncpdp,
            price: {
              memberPays,
              planPays,
              pharmacyTotalPrice,
              insurancePrice,
            },
            dualPrice: {
              smartPriceMemberPays: cashPrice,
              pbmType,
              pbmMemberPays: insurancePrice || pbmPrice,
              pbmPlanPays,
            },
          };
        }
      }

      return undefined;
    };

    if (rtpb?.responseProduct?.pricingAndCoverages) {
      rtpb.responseProduct?.pricingAndCoverages.forEach(
        (pricingAndCoverages) => {
          const ncpdp = pricingAndCoverages.pharmacy?.identification?.ncpdpid;

          const { pbmPrice, cashPrice, planPays } =
            getPricesFromPricingAndCoverage(
              pricingAndCoverages.pricingAndCoverage
            );

          const pharmacyPrice = buildPharmacyPrice(
            pbmPrice,
            cashPrice,
            planPays,
            insurancePrice,
            ncpdp
          );

          if (pharmacyPrice) pharmacyPrices.push(pharmacyPrice);
        }
      );
    }

    return pharmacyPrices;
  } else if (isSmartPriceEligible) {
    const smartPriceRequest: ISmartPriceLookupRequest = {
      providerIds: pharmacyIds,
      date: fillDate,
      daysSupply,
      quantity,
    };
    const smartPriceApiResponse: ISmartPriceLookupResponse =
      await getSmartPriceByNdc(smartPriceRequest, ndc, configuration);
    const { pharmacyPrices } = smartPriceApiResponse;
    return pharmacyPrices
      ? pharmacyPrices.map((smartPrice) => {
          return {
            ncpdp: smartPrice.ProviderId,
            price: {
              memberPays: smartPrice.Price.RebatedTotalCost,
              pharmacyTotalPrice: smartPrice.Price.RebatedTotalCost,
              planPays: 0,
            },
            dualPrice: {
              smartPriceMemberPays: smartPrice.Price.RebatedTotalCost,
              pbmType: 'none',
            },
          };
        })
      : [];
  } else {
    const priceRequest: IPatientPriceRequest = {
      daysSupply,
      fillDate,
      refillNo: refillNumber,
      ndcs: [ndc],
      rxNumber,
      quantity,
      pharmacyIds,
      memberId,
      groupPlanCode,
    };
    const pricingApiResponse: IPharmacyPriceResponse =
      await getPharmaciesPricesByNdc(priceRequest, configuration);
    const { pharmacyPrices } = pricingApiResponse;
    return pharmacyPrices
      ? pharmacyPrices
          .filter(
            (x) =>
              x.inNetwork === 'Y' &&
              x.patientAmountDue !== null &&
              x.patientAmountDue !== undefined &&
              x.totalPrice !== null &&
              x.totalPrice !== undefined
          )
          .map((pharmacyPrice) => {
            const planPays =
              pharmacyPrice.totalPrice - pharmacyPrice.patientAmountDue;

            return {
              ncpdp: pharmacyPrice.pharmacyId,
              price: {
                memberPays: pharmacyPrice.patientAmountDue,
                pharmacyTotalPrice: pharmacyPrice.totalPrice,
                planPays: planPays < 0 ? 0 : planPays,
              },
              dualPrice: {
                smartPriceMemberPays: undefined,
                pbmType: 'phx',
                pbmMemberPays: pharmacyPrice.patientAmountDue,
                pbmPlanPays: planPays < 0 ? 0 : planPays,
              },
            };
          })
      : [];
  }
};
