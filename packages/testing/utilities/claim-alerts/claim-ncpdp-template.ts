// Copyright 2022 Prescryptive Health, Inc.

export const ncpdpClaim = {
  identifier: 'f880736c7f0001aa8ed9',
  RealTimeClaimMessage: {
    Identity: 'CHC',
    Request: '',
    Transformed: {
      Billing: {
        NcpdpRequest: {
          RequestHeaderSegment: {
            SubmittedBIN: '610749',
            ServiceProviderID: '1831135466',
            TransactionCode: 'B1',
            DateofService: '2022-02-07',
            VersionReleaseNumber: 'D0',
            ProcessorControlNumber: 'PH TESTRX',
            TransactionCount: '1',
            ServiceProviderIDQualifier: '01',
            HeaderResponseStatus: 'A',
          },
          PatientSegment: {
            LastName: 'TVILIO',
            FirstName: 'TVILIO',
            GenderCode: '1',
            DateofBirth: '2000-01-01',
          },
          PharmacyProviderSegment: null,
          InsuranceSegment: {
            GroupNumber: '100L7PR',
            CardHolderID: 'T4252875340',
            PersonCode: '01',
          },
          ClaimSegment: {
            DaysSupply: 30.0,
            RxNumber: '',
            ProductOrSvcID: '',
            Quantity: 2.0,
            DatePrescriptionWritten: '2022-02-09',
            FillNumber: 0.0,
            NumberofRefillsAuthorized: 5.0,
          },
          PricingSegment: {
            UsualandCustomary: '410.99',
          },
          PrescriberSegment: {
            PrescriberIDQualifier: '01',
            PrescriberID: '1235283979',
          },
        },
        Additional: {
          PlanTotalPaid: '40.84',
          OriginalAuthorizationNumber: '',
          PharmacyName: 'RITE AID PHARMACY #05196',
          DrugLabelName: 'DULERA 100 MCG/5 MCG INHALE',
          PaperClaimIndicator: '0',
          DirectMemberReimbursementIndicator: '0',
          TestClaimIndicator: '1',
          SIGValueUsedToProcessTheClaim: 'S',
          NumberOfCouponUsesForTheClaim: '0',
          CombinedCouponUsesForTheclaim: '0',
          InNetworkOrOutOfNetworkIndicator: '0',
          PlanIngredientCost: '313.84',
          PlanDispensingFee: '1.00',
          PlanGrossAmountPaid: '314.84',
          PlanBasisOfReimbursement: '03',
          DEANumberOfPrescriber: 'BM9987023',
          DebitCardValue: '0.00',
          DebitCardBypassValue: '0',
        },
        NcpdpResponse: {
          ResponseHeaderSegment: {
            ServiceProviderID: '1437165727',
            TransactionCode: 'B1',
            DateofService: '2022-02-07',
          },
          ResponseStatusSegment: {
            AuthorizationNumber: '',
            TransactionResponseStatus: 'P',
            RejectCount: null,
          },
          ResponsePricing: {
            PatientPayAmount: '15.98',
            IngredientCostPaid: '40.84',
            TotalAmountPaid: '42.82',
          },
        },
      },
    },
    Response: {
      Response: {
        ResponseStatus: 'A',
        ResponseDate: '20190919',
        ResponseTime: '09:52:00',
        Description: 'Data Received Successfully',
        ReferenceNumber: 'f4830944-108c-421a-83fe-7d5b8e2c6b17',
      },
    },
  },
};
