// Copyright 2022 Prescryptive Health, Inc.

import { HttpStatusCodes } from '../../../errors/error-codes';
import { buildUrl, call, IApiConfig } from '../../../utils/api.helper';
import { IRetryPolicy } from '../../../utils/retry-policies/retry-policy.helper';
import {
  IDrugSearchResult,
  IDrugVariant,
  IDrugVariantFormPackage,
  IDrugVariantForms,
  IResponseDrugVariant,
} from '../../../models/drug-search-response';
import { ErrorConstants } from '../../../theming/constants';
import { ApiResponseHelper } from '../../../utils/api-helpers/api-response-helper';

export async function elasticDrugSearch(
  config: IApiConfig,
  subscriptionKey: string,
  filter: string,
  maxResults: number,
  rxSubGroup = '',
  retryPolicy?: IRetryPolicy,
  useAllMedicationsSearch?: boolean,
): Promise<IDrugSearchResult[]> {
  if (!filter) {
    return [];
  }

  const urlPath = (useAllMedicationsSearch || !rxSubGroup)
    ? 'elasticDrugSearchAll'
    : 'elasticDrugSearch';

  const url = buildUrl(config, urlPath, {
    ':filter': encodeURIComponent(filter),
    ':maxResults': maxResults.toString(),
    ':rxSubGroup': rxSubGroup,
  });
  const response: Response = await call(
    url,
    undefined,
    'GET',
    { ['Ocp-Apim-Subscription-Key']: subscriptionKey },
    retryPolicy
  );

  if (response.ok) {
    return await getResultFromResponse(response);
  }

  if (response.status === HttpStatusCodes.NOT_FOUND) {
    throw Error(ErrorConstants.errorUrlNotFound(url));
  }

  const errorMessage = await ApiResponseHelper.getErrorMessageFromResponse(
    response
  );

  throw Error(ErrorConstants.errorDrugSearch(errorMessage));
}

type ResponseStringField =
  | 'representativeNdc'
  | 'strength'
  | 'strengthUnit'
  | 'displayName'
  | 'drugForms'
  | 'variants';
type ResponseNumberField = 'modeQuantity' | 'modeDaysSupply';
export type IResponseDrug = Record<ResponseStringField, string> &
  Record<ResponseNumberField, number> &
  Record<ResponseStringField, string[]> &
  Record<ResponseStringField, IResponseDrugVariant[]>;

export const mapVariants = (
  variants: IResponseDrugVariant[],
  representativeNdc: string,
  displayName: string
): IDrugVariant[] => {
  const mapPackageQuantityByNDC = (
    packages: IDrugVariantFormPackage[],
    representativeNdc: string
  ) => {
    return packages.find(
      (pkg: IDrugVariantFormPackage) =>
        pkg.representativeNdc === representativeNdc
    );
  };

  const mappedDrugs: IDrugVariant[][] = variants.map(
    (variant: IResponseDrugVariant) => {
      return variant.forms.map((form: IDrugVariantForms) => ({
        displayName,
        form: form.formValue,
        formCode: form.formCode,
        ndc: form.representativeNdc,
        packageQuantity:
          mapPackageQuantityByNDC(form.packages, representativeNdc)
            ?.packageQuantity ?? '1',
        strength: form.strength,
        strengthUnit: form.strengthUnit,
        modeQuantity: form.modeQuantity,
        modeDaysSupply: form.modeDaysSupply,
      }));
    }
  );

  return mappedDrugs[0];
};

async function getResultFromResponse(
  response: Response
): Promise<IDrugSearchResult[]> {
  const responseData = await response.json();
  if (!responseData) {
    return [];
  }

  const drugData = responseData || [];
  const updatedDrugSearchResult: IDrugSearchResult[] = drugData.map(
    (drug: IResponseDrug) => {
      const drugVariants: IDrugVariant[] = mapVariants(
        drug.variants,
        drug.representativeNdc,
        drug.displayName
      );
      const drugSearchResult: IDrugSearchResult = {
        name: drug.displayName,
        forms: drug.drugForms,
        drugVariants,
      };
      return drugSearchResult;
    }
  );
  return updatedDrugSearchResult;
}
