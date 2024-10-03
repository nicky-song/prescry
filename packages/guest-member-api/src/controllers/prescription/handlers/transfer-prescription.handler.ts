// Copyright 2021 Prescryptive Health, Inc.

import { Request, Response } from 'express';
import AddressValidator from '@phx/common/src/utils/validators/address.validator';
import { HttpStatusCodes } from '../../../constants/error-codes';
import {
  ErrorConstants,
  SuccessConstants,
} from '../../../constants/response-messages';
import {
  getRequiredResponseLocal,
  getResponseLocal,
} from '../../../utils/request/request-app-locals.helper';
import {
  KnownFailureResponse,
  SuccessResponse,
  UnknownFailureResponse,
} from '../../../utils/response-helper';
import { publishPersonUpdateAddressMessage } from '../../../utils/service-bus/person-update-helper';
import { ITransferPrescriptionRequestBody } from '@phx/common/src/models/api-request-body/transfer-prescription.request-body';
import { getPharmacyDetailsByNcpdp } from '../helpers/get-pharmacy-details-by-ncpdp';
import { IConfiguration } from '../../../configuration';
import { getDrugInfoByNdc } from '../helpers/get-prescription-drug-info-by-ndc';
import { buildTransferPrescriptionResource } from '../helpers/build-transfer-prescription-resource';
import {
  ITransferPrescriptionHelperResponse,
  transferPrescriptionEndpointHelper,
} from '../helpers/transfer-prescription-endpoint.helper';
import { IPerson } from '@phx/common/src/models/person';
import { isSmartpriceUser } from '../../../utils/is-smart-price-eligible';
import { getAndPublishPrescriptionPrice } from '../../../utils/external-api/get-and-publish-prescription-price';
import { Twilio } from 'twilio';
import { getCouponIfEligible } from '../helpers/get-coupon-if-eligible';
import { sendTextMessages } from '../helpers/send-text-messages';
import { IPatient } from '../../../models/fhir/patient/patient';
import { mapMemberAddressToPatientAddress } from '../../provider-location/helpers/build-patient-details';
import { updatePatientByMasterId } from '../../../utils/external-api/identity/update-patient-by-master-id';
import { findPrescriberNPIForPrescriptionFhir } from '../../../utils/fhir/prescriber-npi.helper';
import { getEndpointVersion } from '../../../utils/request/get-endpoint-version';

export async function transferPrescriptionHandler(
  request: Request,
  response: Response,
  configuration: IConfiguration,
  twilioClient: Twilio
) {
  const version = getEndpointVersion(request);
  const isV2Endpoint = version === 'v2';
  try {
    const {
      memberAddress,
      sourceNcpdp,
      destinationNcpdp,
      ndc,
      daysSupply,
      quantity,
      prescriptionNumber,
    } = request.body as ITransferPrescriptionRequestBody;

    const personList = getResponseLocal(response, 'personList');
    if (!personList) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.BAD_REQUEST,
        ErrorConstants.NO_MEMBERSHIP_FOUND
      );
    }

    const cashMember: IPerson | undefined = personList.find(
      (x) => x.rxGroupType === 'CASH'
    );
    const sieMember: IPerson | undefined = personList.find(
      (x) => x.rxGroupType === 'SIE'
    );

    const features = getRequiredResponseLocal(response, 'features');
    const isRTPB = features.usertpb;

    const patientProfiles = getResponseLocal(response, 'patientProfiles');

    const cashPatient: IPatient | undefined = patientProfiles?.find(
      (x) => x.rxGroupType === 'CASH'
    )?.primary;

    const siePatient: IPatient | undefined = patientProfiles?.find(
      (x) => x.rxGroupType === 'SIE'
    )?.primary;

    if (isV2Endpoint) {
      if (!siePatient) {
        const patientAddress = cashPatient?.address?.some((addr) => addr.city);
        if (
          !patientAddress &&
          !AddressValidator.isAddressWithoutCountyValid(memberAddress)
        ) {
          return KnownFailureResponse(
            response,
            HttpStatusCodes.BAD_REQUEST,
            ErrorConstants.MISSING_ADDRESS
          );
        }

        if (cashPatient && memberAddress) {
          const newPatientAddress =
            mapMemberAddressToPatientAddress(memberAddress);

          cashPatient.address = [
            newPatientAddress,
            ...(cashPatient.address?.filter(
              (x) => x.use !== 'home' || x.type !== 'physical'
            ) ?? []),
          ];

          if (cashPatient.id) {
            await updatePatientByMasterId(
              cashPatient.id,
              cashPatient,
              configuration
            );
          }
        }
      }
    }

    if (!sieMember) {
      const personAddress = personList.find((x) => x.zip && x.address1);
      if (
        !personAddress?.zip &&
        !AddressValidator.isAddressWithoutCountyValid(memberAddress)
      ) {
        return KnownFailureResponse(
          response,
          HttpStatusCodes.BAD_REQUEST,
          ErrorConstants.MISSING_ADDRESS
        );
      }
      if (cashMember && memberAddress) {
        cashMember.address1 = memberAddress.address1.trim().toUpperCase();
        cashMember.city = memberAddress.city.trim().toUpperCase();
        cashMember.state = memberAddress.state.toUpperCase();
        cashMember.zip = memberAddress.zip;
        await publishPersonUpdateAddressMessage(
          cashMember.identifier,
          cashMember.address1 || '',
          cashMember.address2 || '',
          cashMember.city || '',
          cashMember.state || '',
          cashMember.zip || ''
        );
      }
    }

    const sourcePharmacyDetails = await getPharmacyDetailsByNcpdp(
      sourceNcpdp,
      configuration
    );

    const destPharmacyDetails = await getPharmacyDetailsByNcpdp(
      destinationNcpdp,
      configuration
    );

    if (!sourcePharmacyDetails || !destPharmacyDetails) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.NOT_FOUND,
        ErrorConstants.PHARMACY_NOT_FOUND
      );
    }

    const drugInfo = await getDrugInfoByNdc(ndc, configuration);

    if (!drugInfo.success) {
      return KnownFailureResponse(
        response,
        drugInfo.errorCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR,
        drugInfo.message ?? ErrorConstants.INTERNAL_SERVER_ERROR
      );
    }

    const personInfo = sieMember ?? cashMember;

    if (!personInfo) {
      return KnownFailureResponse(
        response,
        HttpStatusCodes.NOT_FOUND,
        ErrorConstants.NO_MEMBERSHIP_FOUND
      );
    }

    const prescriptionPayload = buildTransferPrescriptionResource(
      sourcePharmacyDetails,
      destPharmacyDetails,
      personInfo,
      drugInfo,
      daysSupply,
      quantity,
      prescriptionNumber
    );

    const transferPrescriptionApiResponse: ITransferPrescriptionHelperResponse =
      await transferPrescriptionEndpointHelper(
        prescriptionPayload,
        configuration
      );

    if (transferPrescriptionApiResponse.success) {
      const prescriberNpi =
        findPrescriberNPIForPrescriptionFhir(prescriptionPayload);
      const groupPlanCode: string = personInfo.rxSubGroup ?? '';
      const isSmartPriceEligible = isSmartpriceUser(groupPlanCode);
      const coupon = await getCouponIfEligible(
        configuration,
        isSmartPriceEligible,
        ndc,
        quantity,
        destinationNcpdp
      );
      await getAndPublishPrescriptionPrice(
        ndc,
        quantity,
        daysSupply,
        destPharmacyDetails.ncpdp,
        configuration,
        personInfo.primaryMemberRxId,
        groupPlanCode,
        '1',
        transferPrescriptionApiResponse.bundleId ?? '',
        prescriptionNumber ?? '',
        'transferRequest',
        coupon,
        isRTPB,
        prescriberNpi,
        isSmartPriceEligible,
        features.useTestThirdPartyPricing
      );

      await sendTextMessages(
        configuration,
        twilioClient,
        response,
        false,
        coupon,
        personInfo,
        version
      );

      return SuccessResponse(
        response,
        SuccessConstants.TRANSFER_PRESCRIPTION_SUCCESS
      );
    }
    return KnownFailureResponse(
      response,
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
      transferPrescriptionApiResponse.errorMessage ??
        ErrorConstants.INTERNAL_SERVER_ERROR
    );
  } catch (error) {
    return UnknownFailureResponse(
      response,
      ErrorConstants.INTERNAL_SERVER_ERROR,
      error as Error
    );
  }
}
