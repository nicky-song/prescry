// Copyright 2021 Prescryptive Health, Inc.

import {
  IProvider,
  IProviderLocation,
  IService,
} from '@phx/common/src/models/provider-location';
import {
  IProviderLocationEndpointResponse,
  IProviderLocationService,
} from '../../../models/pharmacy-portal/get-provider-location.response';
import { IServices } from '../../../models/services';

export const mapProviderLocationEndpointResponseToDBLocation = (
  location: IProviderLocationEndpointResponse
): IProviderLocation => ({
  identifier: location.id,
  providerInfo: {
    providerName: location.providerInfo.name,
  } as IProvider,
  locationName: location.name,
  address1: location.address.line1,
  address2: location.address.line2,
  city: location.address.city,
  state: location.address.state,
  zip: location.address.zipCode,
  phoneNumber: location.phoneNumber,
  enabled: location.isEnabled,
  timezone: location.address.timezone ?? '',
  isTest: location.isTest,
  latitude: location.address.coordinates?.latitude ?? 0,
  longitude: location.address.coordinates?.longitude ?? 0,
  providerTaxId: location.providerInfo.taxId,
  cliaNumber: location.providerInfo.cliaNumber,
  npiNumber: location.providerInfo.npiNumber,
});

export const mapProviderLocationEndPointResponseToLocationServiceDetails = (
  providerLocationService: IProviderLocationService
): IService => ({
  serviceName: providerLocationService.clientText.serviceName,
  serviceDescription: providerLocationService.description,
  serviceType: providerLocationService.id,
  screenTitle: providerLocationService.clientText.screenTitle,
  screenDescription: providerLocationService.clientText.screenDescription,
  confirmationDescription:
    providerLocationService.clientText.confirmationDescription ?? '',
  confirmationAdditionalInfo:
    providerLocationService.clientText.confirmationAdditionalInfo,
  questions: providerLocationService.questions,
  duration: providerLocationService.duration,
  minLeadDays: providerLocationService.minLeadDuration,
  maxLeadDays: providerLocationService.maxLeadDuration,
  payment: providerLocationService.payment
    ? {
        productKey: providerLocationService.payment.priceKey,
        price: providerLocationService.payment.priceCents,
      }
    : undefined,
  isTestService: providerLocationService.isTestService,
  status: providerLocationService.scheduleMode,
});

export const mapProviderLocationEndPointResponseToServicesCollectionFields = (
  providerLocationService: IProviderLocationService
): IServices => ({
  serviceType: providerLocationService.id,
  serviceNameMyRx: providerLocationService.clientText.serviceName,
  minimumAge: providerLocationService.minimumAge,
  schedulerMinimumAge: providerLocationService.schedulerMinimumAge,
  confirmationDescriptionMyRx:
    providerLocationService.clientText.confirmationDescription,
  cancellationPolicyMyRx: providerLocationService.clientText.cancellationPolicy,
  aboutQuestionsDescriptionMyRx:
    providerLocationService.clientText.aboutQuestionsDescription,
  aboutDependentDescriptionMyRx:
    providerLocationService.clientText.aboutDependentDescription,
  serviceName: providerLocationService.clientText.serviceName,
  serviceDescription: providerLocationService.description,
  procedureCode: providerLocationService.procedureCode,
});
