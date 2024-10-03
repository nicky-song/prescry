// Copyright 2022 Prescryptive Health, Inc.

export interface RTPBPayload {
  message?: Message;
}

export interface Message {
  rtpbHeader?: RTPBHeader;
  rtpbBody?: RTPBBody;
  rtpbVersion?: string;
}

export interface RTPBHeader {
  to?: SenderOrProcessor;
  from?: SenderOrProcessor;
  messageID?: string;
  relatesToMessageID?: string;
  sentTime?: string;
  softwareSenderCertificationID?: string;
}

export interface SenderOrProcessor {
  primary?: HeaderIdentification;
  secondary?: HeaderIdentification;
  tertiary?: HeaderIdentification;
}

export interface HeaderIdentification {
  identification?: string;
  qualifier?: string;
}

export interface RTPBBody {
  rtpbRequest?: RTPBRequest;
  rtpbResponse?: RTPBResponse;
}

export interface RTPBResponseType {
  processed?: RTPBProcessedType;
  notProcessed?: RTPBNotProcessedType;
}

export interface RTPBNotProcessedType extends RTPBResponseType {
  rejectCode?: RTPBRejectCode[];
  note?: string;
  helpDeskSupportType?: RTPBHelpDeskSupportType;
  helpDeskBusinessUnit?: RTPBHelpDeskBusinessUnit[];
  extension?: Extension[];
}

export interface RTPBProcessedType extends RTPBResponseType {
  note?: string;
  helpDeskSupportType?: RTPBHelpDeskSupportType;
  helpDeskBusinessUnit?: RTPBHelpDeskBusinessUnit[];
  extension?: Extension[];
}

export interface RTPBRequest {
  patient?: RTPBPatient;
  benefitsCoordination?: RTPBBenefitsCoordination;
  requestedProduct?: RTPBProductRequested;
  prescriber?: RTPBPrescriber;
  pharmacy?: RTPBPharmacy;
  extension?: Extension[];
}

export interface RTPBResponse {
  response?: RTPBResponseType;
  patient: RTPBPatient;
  responseProduct?: RTPBResponseProduct;
  responseAlternativeProduct?: RTPBResponseAlternativeProduct[];
  restrictedPrescriber?: RTPBRestrictedPrescriber;
  extension?: Extension[];
}

export interface ExtensionString {
  value?: unknown;
}
export interface Extension {
  string?: ExtensionString;
  name?: string;
  url?: unknown;
  extension?: Extension[];
}

export interface NCICode {
  code?: string;
}

export interface RTPBAddressType {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  extension?: Extension[];
}

export interface RTPBCoAgentQualifiedCode {
  code?: string;
  qualifier?: RTPBCoAgentQualifier;
  extension?: Extension[];
}

export interface RTPBDiagnosisQualifiedCode {
  code?: string;
  qualifier?: RTPBPrimaryDiagnosisCodeQualifierCode;
  extension?: Extension[];
}

export interface RTPBDrugCodedOrNonCoded {
  ndc?: string;
  productCode?: RTPBProductCode;
  drugDBCode?: RTPBDrugDBCode;
  extension?: Extension[];
}

export interface RTPBDrugDBCode {
  code?: string;
  qualifier?: RTPBDrugDBCodeQualifier;
  extension?: Extension[];
}

export interface RTPBSexAndGenderType {
  administrativeGender?: RTPBAdminiastrativeGender;
  sexAssignedAtBirth?: RTPBSexAssignedAtBirthType;
  extension?: Extension[];
}

export interface RTPBHelpDeskBusinessUnit {
  helpdeskBusinessUnitType?: RTPBHelpDeskBusinessUnitType;
  helpDeskCommunicationNumbers?: RTPBHelpDeskCommunicationNumbersType;
  extension?: Extension[];
}

export interface RTPBHelpDeskCommunicationNumbersType {
  telephone?: RTPBPhoneType;
  fax?: RTPBPhoneType;
  uRL?: string;
  otherTelephone?: RTPBPhoneType;
  extension?: Extension[];
}

export interface RTPBName {
  lastName?: string;
  firstName?: string;
  middleName?: string;
  extension?: Extension[];
}

export interface RTPBPatientID {
  alienNumber?: string;
  driversLicenseNumber?: string;
  employerAssignedID?: string;
  governmentStudentVisaNumber?: string;
  indianTribalID?: string;
  ltcFacilityID?: string;
  medicaidNumber?: string;
  medicalRecordIdentificationNumberEHR?: string;
  medicareBeneficiaryID?: string;
  mutuallyDefined?: string;
  nonSSNBasedPatientIDAssignedByPlan?: string;
  passportID?: string;
  socialSecurity?: string;
  ssnBasedPatientIDAssignedByPlan?: string;
  stateIssuedID?: string;
  usMilitaryID?: string;
  universalPatientsIDs?: UniversalPatientsIDsType;
  extension?: Extension[];
}

export interface RTPBPharmacyID {
  ncpdpid?: string;
  npi?: string;
  extension?: Extension[];
}

export interface RTPBPhoneType {
  number?: string;
  numberExtension?: string;
  extension?: Extension[];
}

export interface RTPBPrescriberID {
  npi?: string;
  extension?: Extension[];
}

export interface RTPBProductCode {
  code?: string;
  qualifier?: RTPBProductQualifierCode;
  extension?: Extension[];
}

export interface RTPBQuantity {
  value?: string;
  codeListQualifier?: RTPBQuantityCodeListQualifier;
  quantityUnitOfMeasure?: NCICode;
  extension?: Extension[];
}

export interface UniversalPatientsIDsType {
  qualifier?: RTPBUniversalPatientIDsQualifier;
  id?: string;
}

export enum RTPBAdminiastrativeGender {
  Male = 'M',
  Female = 'F',
  NotSpecifiedOrUnknown = 'U',
  NonBinary = 'N',
}

export enum RTPBClinicalSignificanceCode {
  Major = '1',
  Moderate = '2',
  Minor = '3',
  Undetermined = '9',
}

export enum RTPBCoAgentQualifier {
  UPC = '01',
  HRI = '02',
  NDC = '03',
  HIBCC = '04',
  CPT4 = '07',
  CPT5 = '08',
  HCPCS = '09',
  NAPPI = '11',
  GTIN = '12',
  GPI = '14',
  GCN = '15',
  GFC = '16',
  DDID = '17',
  FDBSmartKey = '18',
  GM = '19',
  ICD10CM = '21',
  NCCI = '23',
  SNOMED = '24',
  CDT = '25',
  DSMIV = '26',
  ICD10PCS = '27',
  FDBMedNameID = '28',
  FDBRoutedMedID = '29',
  FDBRoutedDosageFormID = '30',
  FDBMedID = '31',
  GCN_SEQNO = '32',
  Misc6 = '33',
  AHFS = '37',
  SCD = '38',
  SBD = '39',
  GPCK = '40',
  BPCK = '41',
  DI = '45',
  DSM5 = '46',
  Other = '99',
}

export enum RTPBCoverageRestrictionCode {
  ProductIdentifierNotListed = '27',
  PharmacyNotContracted = '40',
  SubmitToOtherProcessorOrPayer = '41',
  NotCoveredForPatientAge = '60',
  NotCoveredForPatientGender = '61',
  NotCoveredForInstitutionalizedPatient = '63',
  PatientAgeExceedsMaximumAge = '66',
  ProductServiceNotCoveredPlanBenefitExclusion = '70',
  PriorAuthorizationRequired = '75',
  PlanLimitationsExceeded = '76',
  DiscontinuedProductServiceIDNumber = '77',
  CostExceedsMaximum = '78',
  DiagnosisCodeSubmittedDoesNotMeetDrugCoverageCriteria = '80',
  DURRejectError = '88',
  PharmacyNotContractedInAssistedLivingNetwork = '463',
  IDSubmittedIsAssociatedWithAnExcludedPharmacy = '559',
  PharmacyNotContractedInRetailNetwork = '560',
  PharmacyNotContractedInMailOrderNetwork = '561',
  PharmacyNotContractedInHospiceNetwork = '562',
  PharmacyNotContractedInVeteransAdministrationNetwork = '563',
  PharmacyNotContractedInMilitaryNetwork = '564',
  BrandDrugSpecificLabelerCodeRequired = '606',
  AlternateDrugTherapyRequiredPriorToUse = '608',
  ThisProductServiceMayBeCoveredUnderMedicarePartD = '620',
  RepackagedProductIsNotCoveredByTheContract = '645',
  PharmacyBenefitExclusionMayBeCoveredUnderPatientMedicalBenefit = '816',
  PharmacyBenefitExclusionCoveredUnderPatientsMedicalBenefit = '817',
  NotCoveredUnderHospice = '822',
  HospiceNonFormulary = '823',
  PharmacyNotEnrolledinStateMedicaidProgram = '890',
  DaysSupplyIsLessThanPlanMinimum = '891',
  MorphineEquivalentDoseExceedsLimits = '922',
  MorphineEquivalentDoseExceedsLimitsForPatientAge = '923',
  InitialFillDaysSupplyExceedsLimits = '925',
  InitialFillDaysSupplyExceedsLimitsForPatientAge = '926',
  DaysSupplyLimitationForProductServiceForPatientAge = '927',
  IDSubmittedIsAssociatedToAPrecludedPharmacy = '930',
  AllLotsOfDrugProductRecalled = '944',
  MustDispenseThroughSpecialtyPharmacy = '4W',
  ProviderNotEligibleToPerformServiceDispenseProduct = '6Z',
  ProviderDoesNotMatchAuthorizationOnFile = '7A',
  DaysSupplyExceedsPlanLimitation = '7X',
  QuantityDispensedExceedsMaximumAllowed = '9G',
  QuantityNotValidForProductServiceIDSubmitted = '9H',
  ThisProductMayBeCoveredUnderHospiceMedicareA = 'A3',
  ThisProductMayBeCoveredUnderTheMedicareBBundledPaymentToAnESRDDialysisFacility = 'A4',
  NotCoveredUnderPartDLaw = 'A5',
  ThisProductServiceMayBeCoveredUnderMedicarePartB = 'A6',
  ProductNotCoveredNonParticipatingManufacturer = 'AC',
  DaysSupplyLimitationForProductService = 'AG',
  UnitDosePackagingOnlyPayableForNursingHomeRecipients = 'AH',
  GenericDrugRequired = 'AJ',
  PharmacyNotContractedInSpecialtyNetwork = 'G6',
  PharmacyNotContractedInHomeInfusionNetwork = 'G7',
  PharmacyNotContractedInLongTermCareNetwork = 'G8',
  PharmacyNotContractedIn90DayRetailNetwork = 'G9',
  ProductNotOnFormulary = 'MR',
  NonMatchedUnitOfMeasureToProductServiceID = 'PZ',
  ProductServiceNotAppropriateForThisLocation = 'R6',
  DosageExceedsProductLabelingLimit = 'TQ',
  DAW0CannotBeSubmittedOnAMultisourceDrugWithAvailableGenerics = 'UU',
  DateOfTransactionOutsideMarketingDates = 'AA1',
  PharmacyNotContractedWithPlanProcessorOnDateOfTransaction = 'AA2',
  QuantitytoDispenseIncorrectforNDCSent = 'AA3',
  TransitionFillFutureFillsMayNotBeCovered = 'AA4',
  TransitionFillPriorAuthorizationRequired = 'AA5',
  TransitionFillNonFormularyDrug = 'AA6',
  TransitionFillPlanLimitOrOtherPlanRestriction = 'AA7',
  EmergencyFillFutureFillsWillNotBeCovered = 'AA8',
  EmergencyFillPriorAuthorizationRequired = 'AA9',
  EmergencyFillNonFormularyDrug = 'AB1',
  EmergencyFillPlanLimitOrOtherPlanRestriction = 'AB2',
  LevelofCareFutureFillsMayNotBeCovered = 'AB3',
  LevelofCarePriorAuthorizationRequired = 'AB4',
  LevelofCareNonFormularyDrug = 'AB5',
  LevelofCarePlanLimitOrOtherPlanRestriction = 'AB6',
  HospiceCompassionateFillFutureFillsMayNotBeCovered = 'AB7',
  PriorAuthorizationApprovalOnFile = 'AB8',
  QuantityLimited = 'AB9',
  DaysSupplyLimited = 'AC1',
  Overutilizer = '828',
  QuantityDoesNotMatchDispensingUnit = '9E',
  PatientLockedIntoSpecificPrescriber = '979',
  PatientLockedIntoSpecificPharmacy = '980',
}

export enum RTPBCoverageStatusCode {
  Covered = 'CC',
  NotCovered = 'NC',
  CoveredWithRestrictions = 'CR',
  PharmacyTypeNotSupported = 'PT',
  PharmacyNotFound = 'PF',
}

export enum RTPBDatabaseIndicator {
  FirstDataBank = '1',
  MediSpan = '2',
  Micromedex = '3',
  ProcessorDeveloped = '4',
  Other = '5',
  Redbook = '6',
  Multum = '7',
}

export enum RTPBDispenseAsWrittenProductSelectionCode {
  NoProductSelection = '0',
  SubstitutionNotAllowedByPrescriber = '1',
  PatientRequestedProductDispensed = '2',
  PharmacistSelectedProductDispensed = '3',
  GenericDrugNotinStock = '4',
  BrandDrugDispensedAsGeneric = '5',
  Override = '6',
  BrandDrugMandatedByLaw = '7',
  GenericDrugNotAvailable = '8',
  PlanRequestedBrandToBeDispensed = '9',
}

export enum RTPBDrugDBCodeQualifier {
  BrandName = 'BN',
  IngredientGenericName = 'IN',
  MultiIngredientGenericName = 'MIN',
  PreciseIngredientGenericName = 'PIN',
  SemanticBrandedDrugForm = 'SBF',
  SemanticClinicalDrugForm = 'SCF',
}

export enum RTPBHelpDeskBusinessUnitType {
  PharmacyHelpDesk = '1',
  ClinicalPA = '2',
  HealthPlan = '3',
  EligibilityThirdPartyLiability = '4',
  Other = '5',
}

export enum RTPBHelpDeskSupportType {
  Pharmacy = '1',
  Prescriber = '2',
  MemberServices = '3',
  OtherPayer = '4',
  Other = '5',
}

export enum RTPBMaximumAgeQualifier {
  Days = 'D',
  Years = 'Y',
}

export enum RTPBMaximumAmountQualifier {
  DollarAmount = 'DL',
  DaysSupply = 'DS',
  Fills = 'FL',
  Quantity = 'QY',
}

export enum RTPBMaximumAmountTimePeriod {
  CalendarMonth = 'CM',
  CalendarQuarter = 'CQ',
  CalendarYear = 'CY',
  Days = 'DY',
  Lifetime = 'LT',
  PerDispensing = 'PD',
  SpecificDateRange = 'SP',
}

export enum RTPBMinimumAgeQualifier {
  Days = 'D',
  Years = 'Y',
}

export enum RTPBPatientPayComponentQualifier {
  AmountAppliedtoPeriodicDeductible = '01',
  AmountAttributedtoProductSelectionBrandDrug = '02',
  AmountAttributedtoPercentageTax = '03',
  AmountExceedingPeriodicBenefitMaximum = '04',
  AmountofCopay = '05',
  AmountofCoinsurance = '07',
  AmountAttributedtoProductSelectionNonPreferredFormularySelection = '08',
  AmountAttributedtoHealthPlanAssistanceAmount = '09',
  AmountAttributedtoProviderNetworkSelection = '10',
  AmountAttributedtoProductSelectionBrandNonPreferredFormularySelection = '11',
  AmountAttributedtoCoverageGap = '12',
  AmountAttributedtoProcessorFee = '13',
  AmountAttributedtoGracePeriod = '14',
  AmountAttributedtoCatastrophicBenefit = '15',
  AmountAttributedtoUnbalancedPatientPayOPPRA = '16',
  AmountAttributedtoRegulatoryFee = '17',
  AmountAttributedtoSpendDown = '18',
}

export enum RTPBPharmacyType {
  LongTermCare = 'L',
  MailOrder = 'M',
  Retail = 'R',
  Specialty = 'S',
}

export enum RTPBPricingAndCoverageIndicator {
  Retail = 'R',
  Retail90Day = 'D',
  Mail = 'M',
  Specialty = 'S',
}

export enum RTPBPrimaryDiagnosisCodeQualifierCode {
  ICD10CM = 'ABF',
  SNOMED = 'LD',
}

export enum RTPBProductQualifierCode {
  DeviceIdentifier = 'DI',
  BPCK = 'BPK',
  GPCK = 'GPK',
  HRI = 'NH',
  NDFRT = 'RT',
  SBD = 'SBD',
  SCD = 'SCD',
  UNII = 'UN',
  UPC = 'UP',
}

export enum RTPBQuantityCodeListQualifier {
  RequestedQuantity = '38',
  QuantityPriced = 'QP',
  PreviousDispensing = 'PD',
}

export enum RTPBRejectCode {
  MIIINNumber = '01',
  MIVersionReleaseNum = '02',
  MITransactionCode = '03',
  MIProcessorControlNumber = '04',
  MIServiceProviderNumber = '05',
  MIGroupID = '06',
  MICardholderID = '07',
  MIPersonCode = '08',
  MIDateOfBirth = '09',
  MIPatientGenderCode = '10',
  MIPlaceOfService = '12',
  MIDaysSupply = '19',
  MIProductServiceID = '21',
  MIDispenseAsWrittenOrProductSelectionCode = '22',
  MIPrescriberID = '25',
  MIUnitOfMeasure = '26',
  MIDiagnosisCode = '39',
  PrescriberIDInactiveOrExpired = '42',
  PrescriberDEANumberInactiveOrExpired = '43',
  PrescriberDEANumberNotFound = '44',
  PrescriberDEANumberDoesNotAllowThisDrugDEAClass = '46',
  NonMatchedPharmacyNumber = '50',
  NonMatchedGroupID = '51',
  NonMatchedCardholderID = '52',
  NonMatchedPersonCode = '53',
  NonMatchedProductServiceIDNumber = '54',
  NonMatchedProductPackageSize = '55',
  NonMatchedPrescriberID = '56',
  PatientCardHolderIDNameMismatch = '62',
  PatientNotCovered = '65',
  PrescriberIDNotCovered = '71',
  SystemUnavailableHostUnavailable = '92',
  TimeOut = '95',
  ScheduledDowntime = '96',
  PayerUnavailable = '97',
  HostProcessingError = '99',
  DiagnosisCodeGroupingIncorrect = '445',
  RTPBClinicalSegmentIncorrectlyFormatted = '448',
  RTPBPatientSegmentIncorrectlyFormatted = '449',
  RTPBInsuranceSegmentIncorrectlyFormatted = '450',
  TransactionHeaderSegmentIncorrectlyFormatted = '451',
  RTPBPrescriberSegmentIncorrectlyFormatted_454 = '454',
  RTPBPrescriberSegmentIncorrectlyFormatted_464 = '464',
  PatientIDQualifierDoesNotPrecedePatientID = '465',
  ProductServiceIDQualifierDoesNotPrecedeProductServiceID = '467',
  PrescriberIDQualifierDoesNotPrecedePrescriberID = '474',
  DiagnosisCodeCountDoesNotPrecedeDiagnosisCodeAndOrQualifier = '493',
  DiagnosisCodeQualifierDoesNotPrecedeDiagnosisCode = '494',
  PatientIDCountDoesNotPrecedePatientIDDataFields = '500',
  DiagnosisCodeQualifierValueNotSupported = '521',
  PatientGenderCodeValueNotSupported = '538',
  PrescriberIDQualifierValueNotSupported = '543',
  TransactionCountValueNotSupported = '555',
  UnitOfMeasureValueNotSupported = '556',
  MoreThanOnePatientFound = '598',
  CardholderIDMatchedButLastNameDidNot = '599',
  CoverageOutsideSubmittedDateOfServiceTransaction = '600',
  UppercaseRequired = '614',
  PrescriberType1NPIRequired = '619',
  ThisMedicaidPatientIsMedicareEligible = '621',
  PatientNotEligibleDueToNonPaymentOfPremiumPatientToContactPlan = '646',
  CannontVerifyActiveStateLicenseForPrescriberID = '777',
  PrescriberNPIdNotFound = '826',
  PharmacyServiceProviderTemporarilySuspended = '827',
  DrugNotCoveredDueToFailureToMeetMedicarePartDActive = '829',
  ProductServiceIDCarveOut = '831',
  CriteriaNotMet = '876',
  BeneficiaryEnrolledInExcludedFederalHealthCareProgram = '888',
  PrescriberNotEnrolledinStateMedicaidProgram = '889',
  IDAssociatedWithAPrecludedPrescriber = '929',
  MIPatientMiddleName = '932',
  MIServiceProviderTelephoneNumber = '941',
  DateOfTransactionBeforeCoverageEffective = '948',
  DateOfTransactionAfterCoverageExpired = '949',
  DateOfTransactionAfterCoverageTerminated = '950',
  TransactionNotProcessed = '951',
  SenderResponseError = '952',
  DateOfTransactionPriorToDateOfBirth = '953',
  MIDateTimeofTransaction = '954',
  MIRelatestoMessageID = '955',
  MIPBMMemberID = '956',
  MIQuantityRequested = '957',
  PBMMemberIDSubmittedIsInactiveOrExpired = '958',
  PBMMemberIDSubmittedNotOnFile = '959',
  RxNormQualifierValueSubmittedNotCovered = '960',
  RxNormQualifierValueNotSupported = '961',
  RxNormQualifierDoesNotPrecedeRxNormCode = '962',
  MIRxNormCode = '963',
  MIRxNormQualifier = '964',
  MIRTPBProductSegment = '965',
  RTPBProductSegmentRequired = '966',
  RTPBPharmacySegmentRequired = '967',
  PatientnotEligible = '968',
  RTPBProductSegmentIncorrectlyFormatted = '969',
  MIRTPBPharmacySegment = '970',
  RTPBPharmacySegmentIncorrectlyFormatted = '971',
  MIPayerProcessorID = '972',
  RTPBSenderIDQualifierDoesNotPrecedeRTPBSenderID = '973',
  MIRTPBSenderIDQualifier = '974',
  MIRTPBSenderID = '975',
  MIRTPBSenderType = '976',
  RTPBSenderIDQualifierValueNotSupportedForProcessorPayer = '977',
  RTPBSenderTypeValueNotSupported = '978',
  RTPBTransactionNotSupported = '983',
  MISexAssignedatBirth = '986',
  SexAssignedatBirthValueNotSupported = '987',
  VersionReleaseValueNotSupported = '1R',
  TransactionCodeTypeValueNotSupported = '1S',
  PCNMustContainProcessorPayerAssignedValue = '1T',
  TransactionCountDoesNotMatchNumberofTransactions = '1U',
  MultipleTransactionsNotSupported = '1V',
  VendorNotCertifiedForProcessorPayer = '1X',
  RTPBClinicalSegmentRequired = '1Z',
  MIPatientResidence = '4X',
  PatientResidenceValueNotSupported = '4Y',
  PlaceofServiceNotSupportedByPlan = '4Z',
  RTPBInsuranceSegmentRequired = '6J',
  RTPBPatientSegmentRequired = '6K',
  RTPBPrescriberSegmentRequired = '6N',
  TransactionSegmentRequired = '6S',
  NotAuthorizedToSubmitElectronically = '6Y',
  ServiceProviderIDQualifierValueNotSupportedForProcessorPayer = '7B',
  NonMatchedDOB = '7D',
  NonMatchedGenderCode = '7H',
  PatientIDQualifierValueNotSupported = '7N',
  DAWCodeValueNotSupported = '8K',
  ProductServiceIDQualifierValueNotSupported = '8Z',
  PrescriberIDQualifierSubmittedNotCovered = '9V',
  IDSubmittedIsAssociatedWithAnExcludedPrescriber = 'A1',
  IDSubmittedIsAssociatedToADeceasedPrescriber = 'A2',
  MITransactionCount = 'A9',
  PatientEnrolledUnderManagedCare = 'AF',
  MISoftwareVendorCertificationID = 'AK',
  MISegmentIdentification = 'AM',
  MIServiceProviderIDQualifier = 'B2',
  DiagnosisCodeQualifierSubmittedNotCovered = 'BB',
  MIPatientFirstName = 'CA',
  MIPatientLastName = 'CB',
  MIPatientIDQualifier = 'CX',
  MIPatientID = 'CY',
  MIPrescriberLastName = 'DR',
  MIProductServiceIDQualifier = 'E1',
  MIPrescriberIDQualifier = 'EZ',
  PrescriberMustContactPlan = 'G4',
  PharmacistMustContactPlan = 'G5',
  MITransactionReferenceNumber = 'K5',
  Morethan1CardholderFoundNarrowSearchCriteria = 'MS',
  NoPatientMatchFound = 'N1',
  DiagnosisCodeCountDoesNotMatchNumberOfRepetitions = 'P7',
  FieldIsNonRepeatable = 'P9',
  InvalidTransactionCountForThisTransactionCode = 'PB',
  MIRTPBClinicalSegment = 'PD',
  MIRTPBInsuranceSegment = 'PJ',
  MIRTPBPatientSegment = 'PK',
  MIRequestRTPBPrescriberSegment = 'PN',
  MITransactionHeaderSegment = 'PS',
  RepeatingSegmentNotAllowedInSameTransaction = 'R7',
  SyntaxError = 'R8',
  MIPatientIDCount = 'RR',
  MandatoryDataElementsMustOccurBeforeOptionalDataElementsInASegment = 'RU',
  PatientIDCountDoesNotMatchNumberOfRepetitions = 'TH',
  MIDiagnosisCodeCount = 'VE',
  MIDiagnosisCodeQualifier = 'WE',
  DiagnosisCodeCountExceedsNumberOfOccurrencesSupported = 'X9',
  MIServiceProviderName = 'YK',
  PatientIDCountIsNotUsedforThisTransactionCode = 'DD3',
  PatientIDCountExceedsNumberofOccurrencesSupported = 'DD4',
  PatientIDGroupingisIncorrecte = 'DD5',
  PatientMiddleNameIsNotUsedforThisTransactionCode = 'DD6',
  PrescriberMiddleNameIsNotUsedforThisTransactionCode = 'DD7',
  MIPrescriberStreetAddressLine1 = 'DD8',
  MIPrescriberStreetAddressLine2 = 'DD9',
  MIPrescriberTelephoneNumberExtension = 'DE1',
  CardholderIDSubmittedInactive = 'ZZ',
}

export enum RTPBResidenceCode {
  Home = '01',
  SkilledNursingFacility = '02',
  NursingFacility = '03',
  AssistedLivingFacility = '04',
  CustodialCareFacility = '05',
  GroupHome = '06',
  InpatientPsychiatricFacility = '07',
  PsychiatricFacilityPartialHospitalization = '08',
  IntermediateCareFacilityMentallyRetarded = '09',
  ResidentialSubstanceAbuseTreatmentFacility = '10',
  Hospice = '11',
  PsychiatricResidentialTreatmentFacility = '12',
  NotSpecified = '0',
  ComprehensiveInpatientRehabilitationFacility = '13',
  HomelessShelter = '14',
  CorrectionalInstitution = '15',
}

export enum RTPBServiceReasonCode {
  AdditionalDrugNeeded = 'AD ',
  PrescriptionAuthentication = 'AN',
  AdverseDrugReaction = 'AR',
  AdditiveToxicity = 'AT',
  ChronicDiseaseManagement = 'CD',
  CallHelpDesk = 'CH',
  PatientComplaintSymptom = 'CS',
  DrugAllergy = 'DA',
  DrugDiseaseInferred = 'DC',
  DrugDrugInteraction = 'DD',
  DrugFoodInteraction = 'DF',
  DrugIncompatibility = 'DI',
  DrugLabConflict = 'DL',
  ApparentDrugMisuse = 'DM',
  PartialLotDrugRecallWarning = 'DP',
  DoseRangeConflict = 'DR',
  TobaccoUse = 'DS',
  PatientEducationInstruction = 'ED',
  Overuse = 'ER',
  ExcessiveQuantity = 'EX',
  HighCumulativeDose = 'HC',
  HighDose = 'HD',
  IatrogenicCondition = 'IC',
  IngredientDuplication = 'ID',
  LowDose = 'LD',
  LockInRecipient = 'LK',
  Underuse = 'LR',
  DrugDiseaseReported = 'MC',
  InsufficientDuration = 'MN',
  PolyPharmacyDetected = 'MP',
  PolyPrescriberDetected = 'MR',
  MissingInformationClarification = 'MS',
  ExcessiveDuration = 'MX',
  DrugNotAvailable = 'NA',
  NoncoveredDrugPurchase = 'NC',
  NewDiseaseDiagnosis = 'ND',
  NonFormularyDrug = 'NF',
  UnnecessaryDrug = 'NN',
  NewPatientProcessing = 'NP',
  LactationNursingInteraction = 'NR',
  InsufficientQuantity = 'NS ',
  AlcoholConflict = 'OH',
  DrugAge = 'PA',
  PatientQuestionConcern = 'PC',
  DrugPregnancy = 'PG',
  PreventiveHealthCare = 'PH',
  PrescriberConsultation = 'PN',
  PlanProtocol = 'PP',
  PriorAdverseReaction = 'PR',
  ProductSelectionOpportunity = 'PS',
  SuspectedEnvironmentalRisk = 'RE',
  HealthProviderReferral = 'RF',
  SuboptimalCompliance = 'SC',
  SuboptimalDrugIndication = 'SD',
  SideEffect = 'SE',
  SuboptimalDosageForm = 'SF',
  SuboptimalRegimen = 'SR',
  DrugGender = 'SX',
  Therapeutic = 'TD',
  LaboratoryTestNeeded = 'TN',
  PayerProcessorQuestion = 'TP',
  DuplicateDrug = 'UD',
}

export enum RTPBSexAssignedAtBirthType {
  Male = 'M',
  Female = 'F',
  Intersex = 'I',
  NotSpecifiedorUnknown = 'U',
}

export enum RTPBUniversalPatientIDsQualifier {
  Appriss = 'APPRISS',
  LexisNexis = 'LEXI',
  NCPDP = 'NCPDP',
}

export interface RTPBBenefitsCoordination {
  cardholderID?: string;
  groupID?: string;
  personCode?: string;
  pbmMemberID?: string;
  extension?: Extension[];
}

export interface RTPBCoverageRestrictions {
  coverageRestrictionCode?: RTPBCoverageRestrictionCode;
  maximumAmountQualifier?: RTPBQualifierMaximumAmount;
  maximumAge?: RTPBMaxAge;
  minimumAge?: RTPBMinAge;
  sexAndGender?: RTPBSexAndGenderType;
  extension?: Extension[];
}

export interface RTPBDrugUseEvaluation {
  serviceReasonCode?: RTPBServiceReasonCode;
  clinicalSignificanceCode?: RTPBClinicalSignificanceCode;
  coAgent?: RTPBCoAgentQualifiedCode;
  dispensingPharmacy?: RTPBPharmacy;
  quantity?: RTPBQuantity;
  lastFillDate?: Date;
  databaseIndicator?: RTPBDatabaseIndicator;
  prescriber?: RTPBPrescriberDUE;
  note?: string;
  extension?: Extension[];
}

export interface RTPBMaxAge {
  maximumAgeQualifier?: RTPBMaximumAgeQualifier;
  maximumAge?: string;
  extension?: Extension[];
}

export interface RTPBMaximumTimePeriodAmount {
  maximumAmountTimePeriod?: RTPBMaximumAmountTimePeriod;
  startDate?: Date;
  endDate?: Date;
  extension?: Extension[];
}

export interface RTPBMaxmount {
  maximumAmountQualifier?: RTPBMaximumAmountQualifier;
  maximumAmount?: string;
  extension?: Extension[];
}

export interface RTPBMinAge {
  minimumAgeQualifier?: RTPBMinimumAgeQualifier;
  minimumAge?: string;
  extension?: Extension[];
}

export interface RTPBPatient {
  identification?: RTPBPatientID;
  name?: RTPBName;
  sexAndGender?: RTPBSexAndGenderType;
  dateOfBirth?: Date;
  residenceCode?: RTPBResidenceCode;
  placeOfService?: string;
  extension?: Extension[];
}

export interface RTPBPatientPayComponent {
  patientPayComponentQualifier?: RTPBPatientPayComponentQualifier;
  patientPayComponentAmount?: string;
  extension?: Extension[];
}

export interface RTPBPharmacy {
  identification?: RTPBPharmacyID;
  businessName?: string;
  primaryTelephoneNumber?: string;
  extension?: Extension[];
}

export interface RTPBPharmacyResponse {
  pharmacy?: RTPBResponsePharmacy;
  pricingAndCoverage: RTPBPricingAndCoverages[];
  extension?: Extension[];
}

export interface RTPBPrescriber {
  identification?: RTPBPrescriberID;
  lastName?: string;
  extension?: Extension[];
}

export interface RTPBPrescriberDUE {
  name?: RTPBName;
  primaryTelephoneNumber?: RTPBPhoneType;
  extension?: Extension[];
}

export interface RTPBPricingAndCoverages {
  pricingAndCoverageIndicator?: RTPBPricingAndCoverageIndicator;
  coverageStatusCode?: RTPBCoverageStatusCode;
  quantity?: RTPBQuantity;
  daysSupply?: string;
  estimatedPatientFinancialResponsibility?: string;
  patientPayComponent?: RTPBPatientPayComponent[];
  accumulatedDeductibleAmount?: string;
  remainingDeductibleAmount?: string;
  estimatedNetPlanCost?: string;
  estimatedCombinedPlanAndPatientSavings?: string;
  coverageRestriction?: RTPBCoverageRestrictions[];
  drugUseEvaluation?: RTPBDrugUseEvaluation[];
  extension?: Extension[];
}

export interface RTPBProductRequested {
  product?: RTPBRequestProduct;
  quantity?: RTPBQuantity;
  daysSupply?: string;
  dispensedAsWrittenProductSelectionCode?: RTPBDispenseAsWrittenProductSelectionCode;
  diagnosis?: RTPBDiagnosisQualifiedCode;
  extension?: Extension[];
}

export interface RTPBProductResponse {
  drugCoded?: RTPBDrugCodedOrNonCoded;
  nonDrugCoded?: RTPBDrugCodedOrNonCoded;
}

export interface RTPBRequestProduct {
  drugCoded?: RTPBDrugCodedOrNonCoded;
  nonDrugCoded?: RTPBDrugCodedOrNonCoded;
}

export interface RTPBQualifierMaximumAmount {
  maximumAmount?: RTPBMaxmount;
  maximumAmountTimePeriod?: RTPBMaximumTimePeriodAmount;
  maximumAmountTimePeriodUnits?: string;
  extension?: Extension[];
}

export interface RTPBResponseAlternativeProduct {
  product?: RTPBProductResponse;
  drugDescription?: string;
  electronicPriorAuthorizationEnabled?: boolean;
  pricingAndCoverages?: RTPBPharmacyResponse[];
  extension?: Extension[];
}

export interface RTPBResponsePatient {
  identification?: RTPBPatientID;
  name?: RTPBName;
  dateOfBirth?: Date;
  extension?: Extension[];
}

export interface RTPBResponsePharmacy {
  pharmacyType?: RTPBPharmacyType;
  identification?: RTPBPharmacyID;
  businessName?: string;
  address?: RTPBAddressType;
  primaryTelephoneNumber?: string;
  extension?: Extension[];
}

export interface RTPBResponseProduct {
  product?: RTPBProductResponse;
  drugDescription?: string;
  quantity?: RTPBQuantity;
  ePAEnabled?: boolean;
  pricingAndCoverages?: RTPBPharmacyResponse[];
  extension?: Extension[];
}

export interface RTPBRestrictedPrescriber {
  identification?: RTPBPrescriberID;
  name?: RTPBName;
  facilityName?: string;
  address?: RTPBAddressType;
  communicationNumbers?: RTPBPhoneType;
  extension?: Extension[];
}
