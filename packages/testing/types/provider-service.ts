// Copyright 2023 Prescryptive Health, Inc.

export interface ProviderService {
  id: string;
  providerName: string;
  timezone: string;
  serviceInfo: [
    {
      serviceName: string;
      serviceType: string;
      minLeadDays: string;
      maxLeadDays: string;
      paymentRequired: boolean;
    }
  ];
}
