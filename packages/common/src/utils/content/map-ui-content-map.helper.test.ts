// Copyright 2022 Prescryptive Health, Inc.

import { IOrderConfirmationScreenContent } from '../../experiences/guest-experience/screens/order-confirmation-screen/order-confirmation.screen.content';
import { ISmartPriceScreenContent } from '../../experiences/guest-experience/smart-price-screen/smart-price-screen.ui-content.model';
import { orderConfirmationScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/order-confirmation-screen/order-confirmation.screen.cms-content-wrapper';
import { smartPriceScreenCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/smart-price-screen/smart-price-screen.cms-content-wrapper';
import { transferFlowCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/transfer-flow/transfer-flow.cms-content-wrapper';
import { CmsGroupKey } from '../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ISmartPriceScreenCMSContent } from '../../models/cms-content/smart-price-screen.cms-content';
import { ITransferFlowCMSContent } from '../../models/cms-content/transfer-flow.cms-content';
import { defaultLanguage } from '../../models/language';
import { IUIContent, IUIContentGroup } from '../../models/ui-content';
import { mapUIContentMap } from './map-ui-content-map.helper';
import { IWhatComesNextCMSContent } from '../../models/cms-content/what-comes-next.cms-content';
import { whatComesNextCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/what-comes-next/what-comes-next.cms-content-wrapper';
import { IWhatComesNextScreenContent } from '../../models/cms-content/what-comes-next-ui-content.model';
import { ICobrandingContent } from '../../models/cms-content/co-branding.ui-content';
import { coBrandingCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/co-branding/co-branding.cms-content-wrapper';
import { IVerifyPrescriptionCMSContent } from '../../models/cms-content/verify-prescription.cms-content';
import { IVerifyPrescriptionScreenContent } from '../../models/cms-content/verify-prescription-screen.ui-content';
import { verifyPrescriptionCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/verify-prescription/verify-prescription.cms-content-wrapper';
import { desktopModalCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/desktop-modal/desktop-modal.cms-content-wrapper';
import { IDesktopModalCMSContent } from '../../models/cms-content/desktop-modal.cms-content';
import { IGetStartedModalContent } from '../../models/cms-content/desktop-modal-ui-content.model';
import { IGlobalContent } from '../../models/cms-content/global.content';
import { globalCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/global/global.cms-content-wrapper';
import { prescriptionPersonScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/prescription-person/prescription-person.screen.cms-content-wrapper';
import { IPrescriptionPersonScreenContent } from '../../experiences/guest-experience/screens/prescription-person/prescription-person.screen.content';
import { IVerifyPatientInfoScreenContent } from '../../experiences/guest-experience/screens/verify-patient-info/verify-patient-info.screen.content';
import { accumulatorProgressBarCMSContentWrapper } from '../../components/progress-bars/accumulator/accumulator.progress-bar.cms-content-wrapper';
import { IAccumulatorProgressBarContent } from '../../components/progress-bars/accumulator/accumulator.progress-bar.content';
import { verifyPatientInfoScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/verify-patient-info/verify-patient-info.screen.cms-content-wrapper';
import { ISignUpCMSContent } from '../../models/cms-content/sign-up.cms-content';
import { ISignUpContent } from '../../models/cms-content/sign-up.ui-content';
import { signUpCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/sign-up/sign-up.cms-content-wrapper';
import { IDrugDetailsTextContent } from '../../components/text/drug-details/drug-details.text.content';
import { drugDetailsTextCMSContentWrapper } from '../../components/text/drug-details/drug-details.text.cms-content-wrapper';
import { IPrescriptionCardContent } from '../../components/member/cards/prescription/prescription.card.content';
import { prescriptionCardCMSContentWrapper } from '../../components/member/cards/prescription/prescription.card.cms-content-wrapper';
import { signInCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/sign-in/sign-in.cms-content-wrapper';
import { ISignInContent } from '../../models/cms-content/sign-in.ui-content';
import { prescriptionBenefitPlanScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/prescription-benefit-plan/prescription-benefit-plan.screen.cms-content-wrapper';
import { IPrescriptionBenefitPlanScreenContent } from '../../experiences/guest-experience/screens/prescription-benefit-plan/prescription-benefit-plan.screen.content';
import { medicineCabinetScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/medicine-cabinet/medicine-cabinet.screen.cms-content-wrapper';
import { IMedicineCabinetScreenContent } from '../../experiences/guest-experience/screens/medicine-cabinet/medicine-cabinet.screen.content';
import { claimHistoryScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/claim-history/claim-history.screen.cms-content-wrapper';
import { IClaimHistoryScreenContent } from '../../experiences/guest-experience/screens/claim-history/claim-history.screen.content';
import { accumulatorsCardCMSContentWrapper } from '../../components/member/cards/accumulators/accumulators.card.cms-content-wrapper';
import { IAccumulatorsCardContent } from '../../components/member/cards/accumulators/accumulators.card.content';
import { formsCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/forms/forms.cms-content-wrapper';
import { IFormsContent } from '../../models/cms-content/forms.ui-content';
import { claimHistoryCardCMSContentWrapper } from '../../components/member/cards/claim-history/claim-history.card.cms-content-wrapper';
import { IClaimHistoryCardContent } from '../../components/member/cards/claim-history/claim-history.card.content';
import { popUpModalCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/pop-up-modal/pop-up-modal.cms-content-wrapper';
import { IPopUpModalContent } from '../../models/cms-content/pop-up-modal-content';
import {
  favoritePharmaciesScreenCMSContentWrapper,
  IFavoritePharmaciesScreenContent,
} from '../../experiences/guest-experience/screens/favorite-pharmacies/favorite-pharmacies.screen.cms-content-wrapper';
import { sideMenuCMSContentWrapper } from '../../experiences/guest-experience/navigation/drawer-navigators/side-menu/side-menu.cms-content-wrapper';
import { ISideMenuContent } from '../../experiences/guest-experience/navigation/drawer-navigators/side-menu/side-menu.content';
import {
  IPrescriptionPriceSectionContent,
  prescriptionPriceSectionCMSContentWrapper,
} from '../../components/member/prescription-price/prescription-price-section.cms-content-wrapper';
import { IPrescribedMedicationContent } from '../../components/member/prescribed-medication/prescribed-medication-content';
import { prescribedMedicationCMSContentWrapper } from '../../components/member/prescribed-medication/prescribed-medication.cms-content-wrapper';
import { communicationCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/communication/communication.cms-content-wrapper';
import { ICommunicationContent } from '../../models/cms-content/communication.content';
import { alternativesCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/alternatives/alternatives.cms-content-wrapper';
import { IAlternativesContent } from '../../models/cms-content/alternatives-content';
import { switchYourMedicationScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/switch-your-medication/switch-your-medication.screen.cms-content-wrapper';
import { ISwitchYourMedicationScreenContent } from '../../experiences/guest-experience/screens/switch-your-medication/switch-your-medication.screen.content';
import { IPrescriptionBenefitPlanLearnMoreModal } from '../../experiences/guest-experience/screens/prescription-benefit-plan/prescription-benefit-plan-learn-more.modal.content';
import { prescriptionBenefitPlanLearnMoreModalCMSContentWrapper } from '../../experiences/guest-experience/screens/prescription-benefit-plan/prescription-benefit-plan-learn-more.modal.cms-content-wrapper';
import { IRecommendedAlternativesScreenContent } from '../../experiences/guest-experience/screens/recommended-alternatives/recommended-alternatives.screen.content';
import { recommendedAlternativesScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/recommended-alternatives/recommended-alternatives.screen.cms-content-wrapper';
import { IOpenStatusContent } from '../formatters/date.formatter';
import { pharmacyOpenStatusContentWrapper } from '../formatters/pharmacy-open-status.cms-content-wrapper';
import { pickAPharmacyCMSContentWrapper } from '../../experiences/guest-experience/pick-a-pharmacy/pick-a-pharmacy.cms-content-wrapper';
import { IPickAPharmacyContent } from '../../experiences/guest-experience/pick-a-pharmacy/pick-a-pharmacy.content';
import { IFindPharmacyContent } from '../../experiences/guest-experience/screens/drug-search/find-pharmacy/find-your-pharmacy.screen.content';
import { findYourPharmacyContentWrapper } from '../../experiences/guest-experience/screens/drug-search/find-pharmacy/find-your-pharmacy.cms-content-wrapper';
import { greatPriceScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/great-price/great-price.screen.cms-content-wrapper';
import { IGreatPriceScreenContent } from '../../experiences/guest-experience/screens/great-price/great-price.screen.content';
import { planMemberSupportCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/plan-member-support/plan-member-support.cms-content-wrapper';
import { IPlanMemberSupportContent } from '../../models/cms-content/plan-member-support.content';
import { rxIdBackContentCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/rx-id-back-content/rx-id-back-content.cms-content-wrapper';
import { IRxIdBackContentCmsContent } from '../../components/cards/rx-id-back-content/rx-id-back-content.cms-content';
import { rxIdCardContentCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/rx-id-card-content/rx-id-card-content.cms-content-wrapper';
import { contactDoctorContainerCMSContentWrapper } from '../../components/member/contact-doctor/contact-doctor-container.cms-content-wrapper';
import { IContactDoctorContainerContent } from '../../components/member/contact-doctor/contact-doctor-container.content';
import { digitalIdCardScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/digital-id-card/digital-id-card.screen.cms-content-wrapper';
import { IDigitalIdCardScreenContent } from '../../experiences/guest-experience/screens/digital-id-card/digital-id-card.screen.content';
import { keepCurrentPrescriptionSectionCMSContentWrapper } from '../../components/member/keep-current-prescription/keep-current-prescription.section.cms-content-wrapper';
import { IKeepCurrentPrescriptionSectionContent } from '../../components/member/keep-current-prescription/keep-current-prescription.section.content';
import { ISelectLanguageScreenContent } from '../../experiences/guest-experience/screens/select-language/select-language.screen.content';
import { selectLanguageScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/select-language/select-language.screen.cms-content-wrapper';
import { switchYourMedicationSlideUpModalCMSContentWrapper } from '../../experiences/guest-experience/screens/recommended-alternatives/slide-up-modals/switch-your-medication/switch-your-medication.slide-up-modal.cms-content-wrapper';
import { lowestPriceSlideUpModalCMSContentWrapper } from '../../experiences/guest-experience/screens/recommended-alternatives/slide-up-modals/lowest-price/lowest-price.slide-up-modal.cms-content-wrapper';
import { ISwitchYourMedicationSlideUpModalContent } from '../../experiences/guest-experience/screens/recommended-alternatives/slide-up-modals/switch-your-medication/switch-your-medication.slide-up-modal.content';
import { ILowestPriceSlideUpModalContent } from '../../experiences/guest-experience/screens/recommended-alternatives/slide-up-modals/lowest-price/lowest-price.slide-up-modal.content';
import { alternativeSavingsCardCMSContentWrapper } from '../../components/cards/alternative-savings/alternative-savings.card.cms-content-wrapper';
import { IAlternativeSavingsCardContent } from '../../components/cards/alternative-savings/alternative-savings.card.content';
import { IContactCaregiverContainerContent } from '../../models/cms-content/contact-caregiver.container.content';
import { contactCareGiverCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/contact-caregiver/contact-caregiver.container.cms-content-wrapper';
import { IRxIdCardContent } from '../../components/cards/rx-id-card/rx-id-card.content';
import { fatalErrorCMSContentWrapper } from '../../components/member/fatal-error/fatal-error.cms-content-wrapper';
import { IFatalErrorContent } from '../../components/member/fatal-error/fatal-error.content';
import { claimReversalSlideUpModalCMSContentWrapper } from '../../experiences/guest-experience/screens/claim-reversal.slide-up-modal/claim-reversal.slide-up-modal.cms-content-wrapper';
import { IClaimReversalSlideUpModalContent } from '../../experiences/guest-experience/screens/claim-reversal.slide-up-modal/claim-reversal.slide-up-modal.content';
import { claimReversalScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/claim-reversal/claim-reversal.screen.cms-content-wrapper';
import { IClaimReversalScreenContent } from '../../experiences/guest-experience/screens/claim-reversal/claim-reversal.screen.content';
import { prescribersSectionCMSContentWrapper } from '../../experiences/guest-experience/screens/digital-id-card/sections/prescribers/prescribers.section.cms-content-wrapper';
import { IPrescribersSectionContent } from '../../experiences/guest-experience/screens/digital-id-card/sections/prescribers/prescribers.section.content';
import { pharmaciesSectionCMSContentWrapper } from '../../experiences/guest-experience/screens/digital-id-card/sections/pharmacies/pharmacies.section.cms-content-wrapper';
import { IPharmaciesSectionContent } from '../../experiences/guest-experience/screens/digital-id-card/sections/pharmacies/pharmacies.section.content';
import { pricingOptionsWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/pricing-options/pricing-options.content-wrapper';
import { IPricingOptionContent } from '../../models/cms-content/pricing-options.content';
import { benefitPlanSectionCMSContentWrapper } from '../../experiences/guest-experience/screens/digital-id-card/sections/benefit-plan/benefit-plan.section.cms-content-wrapper';
import { IRxIdCardSectionContent } from '../../models/cms-content/rx-id-card-section';
import { rxIdCardSectionWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/rx-id-card-section/rx-id-card-section.content-wrapper';
import { smartPriceSectionCMSContentWrapper } from '../../experiences/guest-experience/screens/digital-id-card/sections/smart-price/smart-price.section.cms-content-wrapper';
import { smartPriceLearnMoreModalCMSContentWrapper } from '../../experiences/guest-experience/screens/digital-id-card/smart-price-learn-more-modal/smart-price.learn-more-modal.cms-content-wrapper';
import { ISmartPriceSectionContent } from '../../experiences/guest-experience/screens/digital-id-card/sections/smart-price/smart-price.section.content';
import { ISmartPriceLearnMoreModalContent } from '../../experiences/guest-experience/screens/digital-id-card/smart-price-learn-more-modal/smart-price.learn-more-modal.content';
import { prescriptionPatientNameCMSContentWrapper } from '../../experiences/guest-experience/screens/shopping/prescription-patient/prescription-patient-name.cms-content-wrapper';
import { IPrescriptionPatientNameContent } from '../../experiences/guest-experience/screens/shopping/prescription-patient/prescription-patient-name.content';
import { healthPlanScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/health-plan/health-plan.screen.cms-content-wrapper';
import { benefitPlanLearnMoreModalCMSContentWrapper } from '../../experiences/guest-experience/screens/digital-id-card/benefit-plan-learn-more-modal/benefit-plan.learn-more-modal.cms-content-wrapper';
import { IHealthPlanScreenContent } from '../../experiences/guest-experience/screens/health-plan/health-plan.screen.content';
import { IBenefitPlanSectionContent } from '../../experiences/guest-experience/screens/digital-id-card/sections/benefit-plan/benefit-plan.section.content';
import { IBenefitPlanLearnMoreModalContent } from '../../experiences/guest-experience/screens/digital-id-card/benefit-plan-learn-more-modal/benefit-plan.learn-more-modal.content';

jest.mock(
  '../../experiences/guest-experience/screens/digital-id-card/sections/smart-price/smart-price.section.cms-content-wrapper'
);
const smartPriceSectionCMSContentWrapperMock =
  smartPriceSectionCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/health-plan/health-plan.screen.cms-content-wrapper'
);
const healthPlanScreenCMSContentWrapperMock =
  healthPlanScreenCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/digital-id-card/benefit-plan-learn-more-modal/benefit-plan.learn-more-modal.cms-content-wrapper'
);
const benefitPlanLearnMoreModalCMSContentWrapperMock =
  benefitPlanLearnMoreModalCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/digital-id-card/smart-price-learn-more-modal/smart-price.learn-more-modal.cms-content-wrapper'
);
const smartPriceLearnMoreModalCMSContentWrapperMock =
  smartPriceLearnMoreModalCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/digital-id-card/sections/pharmacies/pharmacies.section.cms-content-wrapper'
);
const pharmaciesSectionCMSContentWrapperMock =
  pharmaciesSectionCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/digital-id-card/sections/prescribers/prescribers.section.cms-content-wrapper'
);
const prescribersSectionCMSContentWrapperMock =
  prescribersSectionCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/digital-id-card/sections/benefit-plan/benefit-plan.section.cms-content-wrapper'
);
const benefitPlanSectionCMSContentWrapperMock =
  benefitPlanSectionCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/pricing-options/pricing-options.content-wrapper'
);
const pricingOptionsWrapperMock = pricingOptionsWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/claim-reversal.slide-up-modal/claim-reversal.slide-up-modal.cms-content-wrapper'
);
const claimReversalSlideUpModalCMSContentWrapperMock =
  claimReversalSlideUpModalCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/claim-reversal/claim-reversal.screen.cms-content-wrapper'
);
const claimReversalScreenCMSContentWrapperMock =
  claimReversalScreenCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/recommended-alternatives/slide-up-modals/switch-your-medication/switch-your-medication.slide-up-modal.cms-content-wrapper'
);
const switchYourMedicationSlideUpModalCMSContentWrapperMock =
  switchYourMedicationSlideUpModalCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/recommended-alternatives/slide-up-modals/lowest-price/lowest-price.slide-up-modal.cms-content-wrapper'
);
const lowestPriceSlideUpModalCMSContentWrapperMock =
  lowestPriceSlideUpModalCMSContentWrapper as jest.Mock;

jest.mock(
  '../../components/cards/alternative-savings/alternative-savings.card.cms-content-wrapper'
);
const alternativeSavingsCardCMSContentWrapperMock =
  alternativeSavingsCardCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/plan-member-support/plan-member-support.cms-content-wrapper'
);
const planMemberSupportCMSContentWrapperMock =
  planMemberSupportCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/alternatives/alternatives.cms-content-wrapper'
);
const alternativesCMSContentWrapperMock =
  alternativesCMSContentWrapper as jest.Mock;

jest.mock(
  '../../components/member/prescription-price/prescription-price-section.cms-content-wrapper'
);
const prescriptionPriceSectionCMSContentWrapperMock =
  prescriptionPriceSectionCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/pop-up-modal/pop-up-modal.cms-content-wrapper'
);
const popUpModalCMSContentWrapperMock =
  popUpModalCMSContentWrapper as jest.Mock;

jest.mock(
  '../../components/progress-bars/accumulator/accumulator.progress-bar.cms-content-wrapper'
);
const accumulatorProgressBarCMSContentWrapperMock =
  accumulatorProgressBarCMSContentWrapper as jest.Mock;

jest.mock(
  '../../components/member/cards/accumulators/accumulators.card.cms-content-wrapper'
);
const accumulatorsCardCMSContentWrapperMock =
  accumulatorsCardCMSContentWrapper as jest.Mock;

jest.mock(
  '../../components/member/cards/claim-history/claim-history.card.cms-content-wrapper'
);
const claimHistoryCardCMSContentWrapperMock =
  claimHistoryCardCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/claim-history/claim-history.screen.cms-content-wrapper'
);
const claimHistoryScreenCMSContentWrapperMock =
  claimHistoryScreenCMSContentWrapper as jest.Mock;

jest.mock(
  '../../components/text/drug-details/drug-details.text.cms-content-wrapper'
);
const drugDetailsTextCMSContentWrapperMock =
  drugDetailsTextCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/medicine-cabinet/medicine-cabinet.screen.cms-content-wrapper'
);
const medicineCabinetScreenCMSContentWrapperMock =
  medicineCabinetScreenCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/order-confirmation-screen/order-confirmation.screen.cms-content-wrapper'
);
const orderConfirmationScreenCMSContentWrapperMock =
  orderConfirmationScreenCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/prescription-benefit-plan/prescription-benefit-plan.screen.cms-content-wrapper'
);
const prescriptionBenefitPlanScreenCMSContentWrapperMock =
  prescriptionBenefitPlanScreenCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/prescription-benefit-plan/prescription-benefit-plan-learn-more.modal.cms-content-wrapper'
);
const prescriptionBenefitPlanLearnMoreModalCMSContentWrapperMock =
  prescriptionBenefitPlanLearnMoreModalCMSContentWrapper as jest.Mock;
jest.mock(
  '../../components/member/cards/prescription/prescription.card.cms-content-wrapper'
);
const prescriptionCardCMSContentWrapperMock =
  prescriptionCardCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/transfer-flow/transfer-flow.cms-content-wrapper'
);
const transferFlowCMSContentWrapperMock =
  transferFlowCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/smart-price-screen/smart-price-screen.cms-content-wrapper'
);
const smartPriceScreenCMSContentWrapperMock =
  smartPriceScreenCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/what-comes-next/what-comes-next.cms-content-wrapper'
);
const whatComesNextCMSContentWrapperMock =
  whatComesNextCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/co-branding/co-branding.cms-content-wrapper'
);
const coBrandingCMSContentWrapperMock =
  coBrandingCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/verify-prescription/verify-prescription.cms-content-wrapper'
);
const verifyPrescriptionCMSContentWrapperMock =
  verifyPrescriptionCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/desktop-modal/desktop-modal.cms-content-wrapper'
);
const desktopModalCMSContentWrapperMock =
  desktopModalCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/global/global.cms-content-wrapper'
);
const globalCMSContentWrapperMock = globalCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/prescription-person/prescription-person.screen.cms-content-wrapper'
);
const prescriptionPersonScreenCMSContentWrapperMock =
  prescriptionPersonScreenCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/sign-up/sign-up.cms-content-wrapper'
);
const signUpCMSContentWrapperMock = signUpCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/verify-patient-info/verify-patient-info.screen.cms-content-wrapper'
);
const verifyPatientInfoScreenCMSContentWrapperMock =
  verifyPatientInfoScreenCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/sign-in/sign-in.cms-content-wrapper'
);
const signInCMSContentWrapperMock = signInCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/forms/forms.cms-content-wrapper'
);
const formsCMSContentWrapperMock = formsCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/favorite-pharmacies/favorite-pharmacies.screen.cms-content-wrapper'
);
const favoritePharmaciesScreenCMSContentWrapperMock =
  favoritePharmaciesScreenCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/navigation/drawer-navigators/side-menu/side-menu.cms-content-wrapper'
);
const sideMenuCMSContentWrapperMock = sideMenuCMSContentWrapper as jest.Mock;

jest.mock(
  '../../components/member/prescribed-medication/prescribed-medication.cms-content-wrapper'
);
const prescribedMedicationCMSContentWrapperMock =
  prescribedMedicationCMSContentWrapper as jest.Mock;
jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/communication/communication.cms-content-wrapper'
);
const communicationCMSContentWrapperMock =
  communicationCMSContentWrapper as jest.Mock;
jest.mock(
  '../../experiences/guest-experience/screens/switch-your-medication/switch-your-medication.screen.cms-content-wrapper'
);
const switchYourMedicationCMSContentWrapperMock =
  switchYourMedicationScreenCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/recommended-alternatives/recommended-alternatives.screen.cms-content-wrapper'
);
const recommendedAlternativesCMSContentWrapperMock =
  recommendedAlternativesScreenCMSContentWrapper as jest.Mock;

jest.mock('../formatters/pharmacy-open-status.cms-content-wrapper');
const pharmacyOpenStatusContentWrapperMock =
  pharmacyOpenStatusContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/pick-a-pharmacy/pick-a-pharmacy.cms-content-wrapper'
);
const pickAPharmacyCMSContentWrapperMock =
  pickAPharmacyCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/drug-search/find-pharmacy/find-your-pharmacy.cms-content-wrapper'
);
const findYourPharmacyContentWrapperMock =
  findYourPharmacyContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/great-price/great-price.screen.cms-content-wrapper'
);
const greatPriceScreenCMSContentWrapperMock =
  greatPriceScreenCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/rx-id-card-content/rx-id-card-content.cms-content-wrapper'
);
const rxIdCardContentCMSContentWrapperMock =
  rxIdCardContentCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/rx-id-back-content/rx-id-back-content.cms-content-wrapper'
);
const rxIdBackContentCMSContentWrapperMock =
  rxIdBackContentCMSContentWrapper as jest.Mock;

jest.mock(
  '../../components/member/contact-doctor/contact-doctor-container.cms-content-wrapper'
);
const contactDoctorContainerCMSContentWrapperMock =
  contactDoctorContainerCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/digital-id-card/digital-id-card.screen.cms-content-wrapper'
);
const digitalIdCardScreenCMSContentWrapperMock =
  digitalIdCardScreenCMSContentWrapper as jest.Mock;

jest.mock(
  '../../components/member/keep-current-prescription/keep-current-prescription.section.cms-content-wrapper'
);
const keepCurrentPrescriptionSectionCMSContentWrapperMock =
  keepCurrentPrescriptionSectionCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/screens/select-language/select-language.screen.cms-content-wrapper'
);
const selectLanguageScreenCMSContentWrapperMock =
  selectLanguageScreenCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/contact-caregiver/contact-caregiver.container.cms-content-wrapper'
);
const contactCareGiverContainerCMSContentWrapperMock =
  contactCareGiverCMSContentWrapper as jest.Mock;

jest.mock(
  '../../components/member/fatal-error/fatal-error.cms-content-wrapper'
);
const fatalErrorCMSContentWrapperMock =
  fatalErrorCMSContentWrapper as jest.Mock;

jest.mock(
  '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/rx-id-card-section/rx-id-card-section.content-wrapper'
);
const rxIdCardSectionCMSContentWrapperMock =
  rxIdCardSectionWrapper as jest.Mock;

const smartPriceSectionContentMock: Partial<ISmartPriceSectionContent> = {
  heading: 'heading-mock',
};

const smartPriceLearnMoreModalContentMock: Partial<ISmartPriceLearnMoreModalContent> =
  {
    heading: 'heading-mock',
  };

jest.mock(
  '../../experiences/guest-experience/screens/shopping/prescription-patient/prescription-patient-name.cms-content-wrapper'
);
const prescriptionPatientNameCMSContentWrapperMock =
  prescriptionPatientNameCMSContentWrapper as jest.Mock;

const prescriptionPatientCMSContentMock: Partial<IPrescriptionPatientNameContent> =
  {
    forPatient: 'for-patient-mock',
  };

const claimReversalSlideUpModalContentMock: Partial<IClaimReversalSlideUpModalContent> =
  {
    heading: 'heading-mock',
  };

const claimReversalCMSContentMock: Partial<IClaimReversalScreenContent> = {
  pharmacyPlaceholder: 'pharmacy-placeholder-mock',
};

const prescriptionPriceSectionCMSContentMock: Partial<IPrescriptionPriceSectionContent> =
  {
    price: 'price',
    noPrice: 'no-price',
    youPay: 'you-pay',
    planPays: 'plan-pays',
    assistanceProgram: 'assistance-program',
    contactPharmacyForPricing: 'contact-pharmacy-for-pricing',
    skeletonPlaceHolder: 'skeleton-place-holder',
    withInsurance: 'with-insurance',
    verifyRealPrice: 'verify-real-price',
  };

const popUpModalCMSContentMock: Partial<IPopUpModalContent> = {
  leavingTitle: 'leaving-title-mock',
  leavingDesc: 'leaving-desc-mock',
  leavingPrimaryButton: 'leaving-primary-button-mock',
  leavingSecondButton: 'leaving-second-button-mock',
};

const accumulatorProgressBarContentMock: Partial<IAccumulatorProgressBarContent> =
  {
    infoButtonLabel: 'info-button-label-mock',
  };

const accumulatorsCardContentMock: Partial<IAccumulatorsCardContent> = {
  deductible: 'deductible-mock',
};

const claimHistoryCardContentMock: Partial<IClaimHistoryCardContent> = {
  pharmacy: 'pharmacy-mock',
};

const claimHistoryScreenContentMock: Partial<IClaimHistoryScreenContent> = {
  title: 'title-mock',
};

const drugDetailsTextContentMock: Partial<IDrugDetailsTextContent> = {
  asOf: 'as-of-mock',
};

const benefitPlanLearnMoreModalContentMock: Partial<IBenefitPlanLearnMoreModalContent> =
  {
    heading: 'heading-mock',
  };

const medicineCabinetScreenContentMock: Partial<IMedicineCabinetScreenContent> =
  {
    title: 'medcab-title-mock',
  };

const benefitPlanSectionContentMock: Partial<IBenefitPlanSectionContent> = {
  heading: 'heading-mock',
};

const orderConfirmationContentMock: Partial<IOrderConfirmationScreenContent> = {
  offerDeliveryInfoTitle: 'offer-delivery-info-title-mock',
};

const prescriptionBenefitPlanScreenContentMock: Partial<IPrescriptionBenefitPlanScreenContent> =
  {
    title: 'title-mock',
    learnMoreText: 'learn-more-mock',
  };

const prescriptionBenefitPlanLearnMoreModalMock: Partial<IPrescriptionBenefitPlanLearnMoreModal> =
  {
    heading: 'heading-mock',
    deductiblesTitle: 'deductibles-title-mock',
    deductiblesDescription: 'deductibles-descpription-mock',
    outOfPocketTitle: 'out-of-pocket-title-mock',
    outOfPocketDescription: 'out-of-pocket-descpription-mock',
  };

const prescriptionCardContentMock: Partial<IPrescriptionCardContent> = {
  actionLabelNotSent: 'action-label-not-sent-mock',
};

const transferFlowCMSMock: ITransferFlowCMSContent = {
  mailOrderPharmacyDescription: 'pharmacy-description-mail-order-mock',
  outOfNetworkPharmacyDescription: 'pharmacy-description-out-of-network-mock',
  deliveryInfoHeader: 'delivery-info-header-mock',
  deliveryInfoDescription: 'delivery-info-description-mock',
  couponDeliveryInfoDescription: 'delivery-info-coupon-description-mock',
  pickUpHeader: 'pick-up-header-mock',
  sendButton: 'send-button-mock',
  estimatedPriceNoticeText: 'estimated-price-notice-text-mock',
};

const transferFlowContentMock = {
  hoursNotSpecified: 'Hours not specified',
  pharmacyHoursHeading: 'Pharmacy hours',
  pharmacyInfoHeading: 'Pharmacy info',
  sendButton: transferFlowCMSMock.sendButton,
  title: 'Order preview',
  premierDescription: transferFlowCMSMock.mailOrderPharmacyDescription,
  mailDelivery: 'Mail delivery',
  mailOrderInstructions: expect.any(Function),
  outOfNetworkDescription: transferFlowCMSMock.outOfNetworkPharmacyDescription,
  outOfNetworkPrefix: 'Out of network.',
  deliveryInfoHeader: transferFlowCMSMock.deliveryInfoHeader,
  deliveryInfoDescription: transferFlowCMSMock.deliveryInfoDescription,
  couponDeliveryInfoDescription:
    transferFlowCMSMock.couponDeliveryInfoDescription,
  pickUpHeader: transferFlowCMSMock.pickUpHeader,
  estimatedPriceNoticeText: transferFlowCMSMock.estimatedPriceNoticeText,
};

const smartPriceScreenCMSMock: ISmartPriceScreenCMSContent = {
  startSavingToday: 'start-saving-today-value-mock',
  showYourPharmacist: 'show-your-pharmacist-value-mock',
  showYourPharmacistContent: 'show-your-pharmacist-content-value-mock',
  manageMyInformation: 'manage-my-information-value-mock',
  smartPriceCardHeader: 'smart-price-card-header-value-mock',
  smartPriceCardName: 'smart-price-card-name-value-mock',
  smartPriceCardMemberId: 'smart-price-card-member-id-value-mock',
  smartPriceCardGroup: 'smart-price-card-group-value-mock',
  smartPriceCardBin: 'smart-price-card-bin-value-mock',
  smartPriceCardPcn: 'smart-price-card-pcn-value-mock',
  smartPriceCardDefaultMessage: 'smart-price-card-default-message-mock',
  smartPriceCardCashPcnValue: 'smart-price-card-cash-pcn-value-mock',
  smartPriceCardCashGroupValue: 'smart-price-card-cash-group-value-mock',
  smartPriceCardCashBinValue: 'smart-price-card-cash-bin-value-mock',
};

const smartPriceScreenContentMock: ISmartPriceScreenContent = {
  startSavingTodayLabel: smartPriceScreenCMSMock.startSavingToday,
  showYourPharmacistLabel: smartPriceScreenCMSMock.showYourPharmacist,
  showYourPharmacistContent: smartPriceScreenCMSMock.showYourPharmacistContent,
  manageMyInformationLabel: smartPriceScreenCMSMock.manageMyInformation,
  digitalIdCard: {
    sieUserHeader: smartPriceScreenCMSMock.smartPriceCardHeader,
    name: smartPriceScreenCMSMock.smartPriceCardName,
    memberId: smartPriceScreenCMSMock.smartPriceCardMemberId,
    group: smartPriceScreenCMSMock.smartPriceCardGroup,
    bin: smartPriceScreenCMSMock.smartPriceCardBin,
    pcn: smartPriceScreenCMSMock.smartPriceCardPcn,
  },
  unauthSmartPriceCard: {
    defaultMessage: smartPriceScreenCMSMock.smartPriceCardDefaultMessage,
    pcnValue: smartPriceScreenCMSMock.smartPriceCardCashPcnValue,
    groupValue: smartPriceScreenCMSMock.smartPriceCardCashGroupValue,
    binValue: smartPriceScreenCMSMock.smartPriceCardCashBinValue,
  },
};

const whatComesNextCMSContentMock: IWhatComesNextCMSContent = {
  whatComesNextAnotherPharmacy: 'what-comes-next-another-pharmacy-es-mock',
  whatComesNextAnotherPharmacySubtitle:
    'what-comes-next-another-pharmacy-subtitle-es-mock',
  whatComesNextNewPrescription: 'what-comes-next-new-prescription-es-mock',
  whatComesNextNewPrescriptionSubtitle:
    'what-comes-next-new-prescription-subtitle-es-mock',
  prescriptionAtThisPharmacyInstructionsText:
    'prescription-at-this-pharmacy-instructions-text-es-mock',
  prescriptionAtThisPharmacyHeadingText:
    'prescription-at-this-pharmacy-heading-text-es-mock',
  prescriptionAtThisPharmacyUnAuthInformationText:
    'prescription-at-this-pharmacy-unauth-information-text-es-mock',
  prescriptionAtThisPharmacySignUpText:
    'prescription-at-this-pharmacy-signup-text-es-mock',
};

const whatComesNextContentMock: IWhatComesNextScreenContent = {
  anotherPharmacyLabel:
    whatComesNextCMSContentMock.whatComesNextAnotherPharmacy,
  anotherPharmacySubtitle:
    whatComesNextCMSContentMock.whatComesNextAnotherPharmacySubtitle,
  newPrescriptionLabel:
    whatComesNextCMSContentMock.whatComesNextNewPrescription,
  newPrescriptionSubtitle:
    whatComesNextCMSContentMock.whatComesNextNewPrescriptionSubtitle,
  getStartedLabel: 'Get started',
  prescriptionAtThisPharmacy: {
    instructions:
      whatComesNextCMSContentMock.prescriptionAtThisPharmacyInstructionsText,
    heading: whatComesNextCMSContentMock.prescriptionAtThisPharmacyHeadingText,
    unAuthInformation:
      whatComesNextCMSContentMock.prescriptionAtThisPharmacyUnAuthInformationText,
    signUpButtonLabel:
      whatComesNextCMSContentMock.prescriptionAtThisPharmacySignUpText,
  },
};

const coBrandingContentMock: Partial<ICobrandingContent> = {
  logo: 'logo-url-mock',
};

const verifyPrescriptionCMSMock: IVerifyPrescriptionCMSContent = {
  verifyPrescriptionHeader: 'verify-prescription-header-mock',
  verifyPrescriptionContent: 'verify-prescription-content-mock',
  prescriptionArrivalNotice: 'prescription-arrival-notice-mock',
  prescriptionInfoHeader: 'prescription-info-header-mock',
  prescriptionNumberText: 'prescription-number-text-mock',
  prescriptionNumberPlaceholder: 'prescription-number-placeholder-mock',
  addressComponentHeaderText: 'address-component-header-text-mock',
  needMoreInformationNotice: 'need-more-information-notice-mock',
};

const verifyPrescriptionContentMock: IVerifyPrescriptionScreenContent = {
  verifyPrescriptionHeader: verifyPrescriptionCMSMock.verifyPrescriptionHeader,
  verifyPrescriptionContent:
    verifyPrescriptionCMSMock.verifyPrescriptionContent,
  prescriptionArrivalNotice:
    verifyPrescriptionCMSMock.prescriptionArrivalNotice,
  prescriptionInfoHeader: verifyPrescriptionCMSMock.prescriptionInfoHeader,
  quantityLabel: 'qty',
  daysLabel: 'days',
  prescriptionNumberText: verifyPrescriptionCMSMock.prescriptionNumberText,
  prescriptionNumberPlaceholder:
    verifyPrescriptionCMSMock.prescriptionNumberPlaceholder,
  submitButtonText: 'Submit',
  cancelButtonText: 'Cancel',
  addressComponentHeaderText:
    verifyPrescriptionCMSMock.addressComponentHeaderText,
  fromLabel: 'From',
  toLabel: 'To',
  needMoreInformationNotice:
    verifyPrescriptionCMSMock.needMoreInformationNotice,
};

const desktopModalCMSMock: IDesktopModalCMSContent = {
  preLinkSentTitle: 'pre-link-sent-title-value-mock',
  enterMobileNumber: 'enter-mobile-number-value-mock',
  myRxMobileExperience: 'myrx-mobile-experience-value-mock',
  yourNumberIsLogin: 'your-number-is-login-value-mock',
  supportText: 'support-text-value-mock',
  myRxSupportEmail: 'myrx-support-email-value-mock',
  sentMessage: 'sent-message-value-mock',
  withALink: 'with-a-link-value-mock',
  clickRegistrationProcess: 'click-registration-process-value-mock',
  postLinkSentTitle: 'post-link-sent-title-value-mock',
  smsErrorInvalidNumber: 'sms-error-invalid-number-value-mock',
  smsErrorServiceUnavailable: 'sms-error-service-unavailable-value-mock',
  getLinkLabel: 'get-link-label-mock',
  resendLinkLabel: 'resend-link-label-mock',
  sendLinkLabel: 'send-link-label-mock',
};

const desktopModalContentMock: IGetStartedModalContent = {
  enterMobile: desktopModalCMSMock.enterMobileNumber,
  myrxMobileExperience: desktopModalCMSMock.myRxMobileExperience,
  yourNumberIsLogin: desktopModalCMSMock.yourNumberIsLogin,
  sentMessage: desktopModalCMSMock.sentMessage,
  withALink: desktopModalCMSMock.withALink,
  clickRegistrationProcess: desktopModalCMSMock.clickRegistrationProcess,
  smsErrorInvalidNumber: desktopModalCMSMock.smsErrorInvalidNumber,
  smsErrorSeriviceUnavailable: desktopModalCMSMock.smsErrorServiceUnavailable,
  haveQuestions: desktopModalCMSMock.supportText,
  email: desktopModalCMSMock.myRxSupportEmail,
  getStarted: desktopModalCMSMock.preLinkSentTitle,
  linkSent: desktopModalCMSMock.postLinkSentTitle,
  getLinkLabel: desktopModalCMSMock.getLinkLabel,
  resendLinkLabel: desktopModalCMSMock.resendLinkLabel,
  sendLinkLabel: desktopModalCMSMock.sendLinkLabel,
};

const favoritePharmaciesMock: Partial<IFavoritePharmaciesScreenContent> = {
  favoritePharmaciesTitle: 'favorite-pharmacies-title-mock',
  favoritePharmaciesErrorMessage: 'favorite-pharmacies-error-message-mock',
};

const globalContentMock: Partial<IGlobalContent> = {
  homeButton: 'home-button-mock',
};

const prescriptionPersonMock: Partial<IPrescriptionPersonScreenContent> = {
  prescriptionPersonTitle: 'prescription-person-title-mock',
};

const verifyPatientInfoMock: Partial<IVerifyPatientInfoScreenContent> = {
  verifyPatientInfoTitle: 'verify-patient-info-title-mock',
};

const signUpContentCMSMock: ISignUpCMSContent = {
  confirmPinErrorMessage: 'confirm-pin-error-message-mock',
  confirmPinHeader: 'confirm-pin-header-mock',
  confirmPinScreenInfo: 'confirm-pin-screen-info-mock',
  continueButton: 'continue-button-mock',
  emailAddressLabel: 'email-address-label-mock',
  firstNameLabel: 'first-name-label-mock',
  lastNameLabel: 'last-name-label-mock',
  ageNotMetError: 'age-not-met-error',
  memberIdHelpText: 'member-id-help-text-mock',
  memberIdLabel: 'member-id-label-mock',
  memberIdPlaceholder: 'member-id-placeholder-mock',
  nextButtonLabel: 'next-button-label-mock',
  pbmBenefit1: 'pbm-benefit-1-mock',
  pbmBenefit2: 'pbm-benefit-2-mock',
  pbmBenefit3: 'pbm-benefit-3-mock',
  pbmSignUpDescription: 'pbm-sign-up-description-mock',
  pbmSignUpHeader: 'pbm-sign-up-header-mock',
  phoneNumberHelpText: 'phone-number-help-text-mock',
  phoneNumberLabel: 'phone-number-label-mock',
  createPinHeader: 'create-pin-header-mock',
  createPinScreenInfo: 'create-pin-screen-info-mock',
  updatePinErrorMessage: 'update-pin-error-message-mock',
  updatePinHeader: 'update-pin-header-mock',
  verifyPinLabel: 'verify-pin-label-mock',
  accountNotFoundError: 'account-not-found-error-mock',
  activationPersonMismatchError: 'activation-person-mismatch-error-mock',
  createAccountHeader: 'create-account-header-mock',
  createAccountInstructions: 'create-account-instructions-mock',
  dataMismatchError: 'data-mismatch-error-mock',
  emailErrorMessage: 'email-error-message-mock',
  haveAccountHelpText: 'have-account-help-text-mock',
  noAccountError: 'no-account-error-mock',
  pbmMemberInstructions: 'pbm-member-instructions-mock',
  signIn: 'sign-in-mock',
  ssoError: 'sso-error-mock',
  smsNotSupported: 'sms-not-supported-mock',
  unknownErrorType: 'unknown-error-type-mock',
  prescriptionPersonTitle: 'prescription-person-title-mock',
  prescriptionPersonInstructions: 'prescription-person-instructions-mock',
};

const signUpContentMock: ISignUpContent = {
  confirmPinErrorMessage: signUpContentCMSMock.confirmPinErrorMessage,
  confirmPinHeader: signUpContentCMSMock.confirmPinHeader,
  confirmPinScreenInfo: signUpContentCMSMock.confirmPinScreenInfo,
  continueButton: signUpContentCMSMock.continueButton,
  emailAddressLabel: signUpContentCMSMock.emailAddressLabel,
  firstNameLabel: signUpContentCMSMock.firstNameLabel,
  lastNameLabel: signUpContentCMSMock.lastNameLabel,
  ageNotMetError: signUpContentCMSMock.ageNotMetError,
  memberIdHelpText: signUpContentCMSMock.memberIdHelpText,
  memberIdLabel: signUpContentCMSMock.memberIdLabel,
  memberIdPlaceholder: signUpContentCMSMock.memberIdPlaceholder,
  nextButtonLabel: signUpContentCMSMock.nextButtonLabel,
  pbmBenefit1: signUpContentCMSMock.pbmBenefit1,
  pbmBenefit2: signUpContentCMSMock.pbmBenefit2,
  pbmBenefit3: signUpContentCMSMock.pbmBenefit3,
  pbmSignUpDescription: signUpContentCMSMock.pbmSignUpDescription,
  pbmSignUpHeader: signUpContentCMSMock.pbmSignUpHeader,
  phoneNumberHelpText: signUpContentCMSMock.phoneNumberHelpText,
  phoneNumberLabel: signUpContentCMSMock.phoneNumberLabel,
  createPinHeader: signUpContentCMSMock.createPinHeader,
  createPinScreenInfo: signUpContentCMSMock.createPinScreenInfo,
  updatePinErrorMessage: signUpContentCMSMock.updatePinErrorMessage,
  updatePinHeader: signUpContentCMSMock.updatePinHeader,
  verifyPinLabel: signUpContentCMSMock.verifyPinLabel,
  accountNotFoundError: signUpContentCMSMock.accountNotFoundError,
  activationPersonMismatchError:
    signUpContentCMSMock.activationPersonMismatchError,
  createAccountHeader: signUpContentCMSMock.createAccountHeader,
  createAccountInstructions: signUpContentCMSMock.createAccountInstructions,
  dataMismatchError: signUpContentCMSMock.dataMismatchError,
  emailErrorMessage: signUpContentCMSMock.emailErrorMessage,
  haveAccountHelpText: signUpContentCMSMock.haveAccountHelpText,
  noAccountError: signUpContentCMSMock.noAccountError,
  pbmMemberInstructions: signUpContentCMSMock.pbmMemberInstructions,
  signIn: signUpContentCMSMock.signIn,
  smsNotSupported: signUpContentCMSMock.smsNotSupported,
  ssoError: signUpContentCMSMock.ssoError,
  unknownErrorType: expect.any(Function),
  prescriptionPersonTitle: 'prescription-person-title-mock',
  prescriptionPersonInstructions: 'prescription-person-instructions-mock',
};

const signInContentMock: ISignInContent = {
  addMembershipHeader: 'add-membership-header-mock',
  attestAuthorizationCheckboxLabel: 'attest-authorization-checkbox-label-mock',
  pbmMemberInstructions: 'pbm-member-instructions-mock',
  memberIdHelpText: 'member-id-help-text-mock',
  lastNamePlaceholder: 'last-name-placeholder-mock',
  firstNamePlaceholder: 'first-name-placeholder-mock',
  createAccount: 'create-account-mock',
  addMembership: 'add-membership-mock',
  emailPlaceholder: 'email-placeholder-mock',
  emailHelperText: 'email-helper-text-mock',
  createAccountHeader: 'create-account-header-mock',
  createAccountInstructions: 'create-account-instructions-mock',
  invalidEmailErrorText: 'invalid-email-error-text-mock',
  firstNameLabel: 'first-name-label-mock',
  lastNameLabel: 'last-name-label-mock',
  emailLabel: 'email-label-mock',
  memberIdLabel: 'member-id-label-mock',
  claimAlertHeader: 'claim-alert-header-mock',
  loginScreenErrorMessage: 'login-screen-error-message-mock',
  accountLockedHeaderText: 'account-locked-header-text-mock',
  accountLockedWarningText: 'account-locked-warning-text-mock',
  forgotPin: 'forgot-your-pin-text-mock',
  forgotPinText: 'forgot-my-pin-text-mock',
  loginPinScreenHeader: 'login-pin-screen-header-mock',
  loginButtonText: 'login-button-label-mock',
  maxPinVerifyError1: 'max-pin-verify-error-1-mock',
  maxPinVerifyError2: 'max-pin-verify-error-2-mock',
  maxPinVerifyError3: 'max-pin-verify-error-3-mock',
  maxPinVerifyError4: 'max-pin-verify-error-4-mock',
  resetButtonText: 'reset-button-label-mock',
  loginPinScreenInfo: 'login-pin-screen-info-mock',
  updatePinHeader: 'update-pin-header-mock',
  nextButtonLabel: 'next-button-label-mock',
  containerHeaderText: 'pin-welcome-screen-header-mock',
  continueButtonCaption: 'continue-button-text-mock',
  pinWelcomeInfoText1: 'pin-welcome-info-text-1-mock',
  pinWelcomeInfoText2: 'pin-welcome-info-text-2-mock',
  welcomeText: 'welcome-text-mock',
  notHaveAccountHelpText: 'not-have-account-help-text-mock',
  phoneNumberLoginCreateAccountText:
    'phone-number-login-create-account-text-mock',
  phoneNumberLoginHeader: 'phone-number-login-header-mock',
  enterCode: 'enter-code-mock',
  enterCodeSent: 'enter-code-sent-mock',
  phoneVerificationErrorText: 'phone-verification-error-text-mock',
  phoneVerificationResentText: 'phone-verification-resent-text-mock',
  resendCodeQuestionText: 'resend-code-question-text-mock',
  resendLabel: 'resend-label-mock',
  termsAndConditionsCheckboxLabel: 't-&-c-checkbox-label-mock',
  phoneNumberRegistrationErrorMessage: 'phone-registration-error-message-mock',
  providePhoneNumberMessage: 'provide-phone-number-message-mock',
  relevantTextAlertsMessage: 'relevant-text-alerts-message-mock',
  phoneVerificationHeaderText: 'phone-verification-header-text-mock',
  verifyButtonLabel: 'verify-button-label-mock',
  verifyIdentityHeader: 'verify-identity-header-mock',
  verifyIdentityInstructions: 'verify-identity-instructions-mock',
  verificationCodeConfirmationText: 'verification-code-confirmation-text-mock',
  otcPlaceholderText: 'otc-placeholder-text-mock',
  resendCodeText: 'resend-code-text-mock',
  verificationCodeInstructions: 'verification-code-instructions-mock',
  verifyIdentitySendCodeHeader: 'verify-identity-send-code-header-mock',
  verifyIdentitySendCodeInstructions:
    'verify-identity-send-code-instructions-mock',
};

const formsContentMock: IFormsContent = {
  dayLabel: 'day-label-mock',
  dobLabel: 'dob-label-mock',
  monthLabel: 'month-label-mock',
  yearLabel: 'year-label-mock',
  months: {
    januaryLabel: 'january-label-mock',
    februaryLabel: 'february-label-mock',
    marchLabel: 'march-label-mock',
    aprilLabel: 'april-label-mock',
    mayLabel: 'may-label-mock',
    juneLabel: 'june-label-mock',
    julyLabel: 'july-label-mock',
    augustLabel: 'august-label-mock',
    septemberLabel: 'september-label-mock',
    octoberLabel: 'october-label-mock',
    novemberLabel: 'november-label-mock',
    decemberLabel: 'december-label-mock',
  },
  ageNotMetError: 'age-not-met-error-mock',
  phoneNumberLabel: 'phone-number-label-mock',
  phoneNumberPlaceholder: 'phone-number-placeholder-mock',
};

const sideMenuContentMock: ISideMenuContent = {
  favoritePharmaciesDrawerItemLabel:
    'favorite-pharmacies-drawer-item-label-mock',
  idCardDrawerItemLabel: 'id-card-drawer-item-label-mock',
  benefitPlanDrawerItemLabel: 'benefit-plan-drawer-item-label-mock',
  profileDrawerItemLabel: 'profile-drawer-item-label-mock',
  supportDrawerItemLabel: 'support-drawer-item-label-mock',
  signOutDrawerItemLabel: 'sign-out-drawer-item-label-mock',
  medicineCabinetDrawerItemLabel: 'medicine-cabinet-drawer-item-label-mock',
  createAccountDrawerItemLabel: 'create-account-drawer-item-label-mock',
  joinEmployerPlanDrawerItemLabel: 'join-employer-plan-drawer-item-label-mock',
  contactUsDrawerItemLabel: 'contact-us-drawer-item-label-mock',
  closeButtonAccessibilityLabel: 'close-button-accessibility-label-mock',
  signInButton: 'sign-in-button-mock',
  copyRightText: 'copyright-text-mock',
  termsAndConditions: 't-&-c-mock',
  privacyPolicy: 'privacy-policy-mock',
  planDeductiblesLabel: 'plan-deductibles-label-mock',
  rightsReservedText: 'rights-reserved-text-mock',
  languageDrawerItemLabel: 'language-drawer-item-label',
  viewPrescryptiveCards: 'view-prescryptive-cards',
};

const prescribedMedicationContentMock: IPrescribedMedicationContent = {
  title: 'title-mock',
  youPay: 'you-pay-mock',
  planPays: 'plan-pays-mock',
  sentToMessage: 'sent-to-message-mock',
  estimatedPriceMessage: 'estimated-price-message-mock',
  sendToText: 'send-to-text-mock',
};

const communicationContentMock: ICommunicationContent = {
  supportCashPhone: 'support-cash-phone',
  supportPBMPhone: 'support-pbm-phone',
  pbmTextInformationMessage: 'pbm-text-info-message',
  cashTextInformationMessage: 'cash-text-info-message',
  couponTextInformationMessage: 'coupon-text-info-message',
  groupNumberText: 'group-number-text-mock',
  pcnText: 'pcn-text-mock',
  memberIdText: 'member-id-text-mock',
  binText: 'bin-text-mock',
  questionsText: 'questions-text-mock',
};

const alternativesContentMock: IAlternativesContent = {
  pricingAt: 'pricing-at-mock',
};

const switchYourMedicationContentMock: Partial<ISwitchYourMedicationScreenContent> =
  {
    title: 'title-mock',
    switchingMedicationLabel: 'switching-medication-label-mock',
    combinationTitle: 'combination-title-mock',
    singleTitle: 'single-title-mock',
    description: 'description-mock',
    callButtonLabel: 'call-button-label-mock',
    actionButtonLabel: 'action-button-label-mock',
  };

const recommendedAlternativesContentMock: IRecommendedAlternativesScreenContent =
  {
    title: 'title-mock',
    heading: 'heading-mock',
    learnMoreDescription: 'learn-more-description-mock',
    skipButtonLabel: 'skip-button-label-mock',
  };

const openStatusContentMock: IOpenStatusContent = {
  closed: 'closed',
  open: 'open',
  open24Hours: 'open-24-hours',
  opensAt: 'opens-at-label',
  closesAt: 'closes-at-label',
};

const pickAPharmacyContentMock: Partial<IPickAPharmacyContent> = {
  eligibility: 'elegibility-label-mock',
  pickYourPharmacy: 'pick-your-pharmacy-label-mock',
  informationButtonLabel: 'information-button-label-mock',
  location: 'location-label-mock',
  noPharmacyFound: 'no-pharmacy-found-label-mock',
  youPayLabel: 'you-pay-label-mock',
  planPaysLabel: 'plan-pays-label-mock',
  distanceLabel: 'distance-label-mock',
  popUpModalText: 'popup-modal-text-label-mock',
  popUpModalLabel: 'popup-modal-label-mock',
  popUpModalContent: 'popup-modal-content-label-mock',
  noPharmaciesFoundErrorMessage: 'no-pharmacies-found-error-message-label',
  noPharmaciesFoundErrorMessagePlural:
    'no-pharmacies-found-error-message-plural-label',
};

const findYourPharmacyContentMock: IFindPharmacyContent = {
  placeholder: 'place-holder-label-mock',
  searchresults: 'search-results-label-mock',
  header: 'header-label-mock',
  subHeader: 'sub-header-label-mock',
  displayMore: 'display-more-label-mock',
  backToTheTop: 'back-to-the-top-label-mock',
};

const greatPriceScreenContentMock: Partial<IGreatPriceScreenContent> = {
  title: 'title-mock',
};

const planMemberSupportContentMock: Partial<IPlanMemberSupportContent> = {
  title: 'title-mock',
};

const rxIdBackContentContentMock: Partial<IRxIdBackContentCmsContent> = {
  memberSince: 'member-since-mock',
};

const contactDoctorContentMock: Partial<IContactDoctorContainerContent> = {
  switchYourMedsTitle: 'switchYourMedsTitle',
  switchYourMedsDescription: 'switchYourMedsDescription',
  callNowButtonLabel: 'callNowButtonLabel',
};

const digitalIdCardContentMock: Partial<IDigitalIdCardScreenContent> = {
  title: 'title-mock',
};

const keepCurrentPrescriptionSectionContentMock: Partial<IKeepCurrentPrescriptionSectionContent> =
  {
    heading: 'heading-mock',
  };

const rxIdCardContentContentMock: Partial<IRxIdCardContent> = {
  rxBenefitsLabel: 'rx-benefit-label-mock',
  rxSavingsLabel: 'rx-savings-label-mock',
};

const selectLanguageMock: Partial<ISelectLanguageScreenContent> = {
  selectLanguageTitle: 'select-language-title-mock',
};

const switchYourMedicationSlideUpModalContentMock: Partial<ISwitchYourMedicationSlideUpModalContent> =
  {
    heading: 'heading-mock',
  };

const lowestPriceSlideUpModalContentMock: Partial<ILowestPriceSlideUpModalContent> =
  {
    heading: 'heading-mock',
  };

const alternativeSavingsCardContentMock: Partial<IAlternativeSavingsCardContent> =
  {
    message: 'message-mock',
  };

const contactCareGiverContentMock: IContactCaregiverContainerContent = {
  title: 'Contact your caregiver',
  titleDescription:
    'You must meet certain age requirements to have a myPrescryptive account. Only your caregiver can manage your prescriptions.',
  subTitle: 'Here is more information about caregivers and dependents',
  subItems: [
    {
      id: 'dependents',
      title: 'Dependents',
      info: 'are people who are not able to take care of themseleves, either because they do not meet the legal age requirements, or because they have a medical condition.',
    },
    {
      id: 'caregivers',
      title: 'Caregivers',
      info: 'help take care of dependents, including managing their healthcare and making medical decisions.',
    },
    {
      id: 'caretip',
      info: 'In the US, the parent or legal guardian is typically the caregiver for a minor dependent, but a court can appoint a guardian if necessary.',
    },
  ],
  helpLinkTitle: 'Prescryptive is ready to help.',
  helpLinkText: 'Contact Us',
  helpLinkInfo: 'if you have any questions.',
  providedBy: 'Provided by',
};

const fatalErrorContentMock: IFatalErrorContent = {
  loadingError: 'Oops! An error occurred while loading',
  errorContact: 'If the error continues, contact',
};

const healthPlanScreenContentMock: IHealthPlanScreenContent = {
  heading: 'heading-mock',
  viewPlanAccumulators: 'view-plan-accumulators-mock',
  addToWallet: 'add-to-wallet-mock',
};

const rxIdCardSectionContentMock: IRxIdCardSectionContent = {
  pbmTitle: 'pbm-title',
  pbmDescription: 'pbm-description',
  smartPriceTitle: 'smart-price-title',
  smartPriceDescription: 'smart-price-escription',
};

const prescribersSectionContentMock: IPrescribersSectionContent = {
  heading: 'heading-mock',
  labelOne: 'label-one-mock',
  descriptionOne: 'description-one-mock',
  labelTwo: 'label-two-mock',
  descriptionTwo: 'description-two-mock',
};

const pharmaciesSectionContentMock: Partial<IPharmaciesSectionContent> = {
  heading: 'heading-mock',
};

const pricingOptionContentMock: IPricingOptionContent = {
  pbmTitle: 'pbm-title',
  pbmSubText: 'pbm-sub-text',
  smartPriceTitle: 'smart-price-title',
  smartPriceSubText: 'smart-price-sub-text',
  thirdPartyTitle: 'third-party-title',
  thirdPartySubText: 'third-party-sub-text',
  noPriceLabel: 'no-price-label',
  pricingOptionsTitle: 'pricing-options-title',
  pricingOptionsDescription: 'pricing-options-description',
  pricingOptionsFooterLabel: 'pricing-options-footer-label',
};

const cmsContentMapMock: Map<string, IUIContentGroup> = new Map([
  [
    CmsGroupKey.accumulatorProgressBar,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.accumulatorsCard,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.benefitPlanLearnMoreModal,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.claimHistoryCard,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.claimHistoryScreen,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.drugDetailsText,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.medicineCabinetScreen,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.benefitPlanSection,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.orderConfirmation,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.prescriptionBenefitPlanScreen,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.prescriptionBenefitPlanLearnMoreModal,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.prescriptionCard,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.transferFlow,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.smartPriceScreen,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.smartPriceSection,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.smartPriceLearnMoreModal,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.whatComesNext,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.verifyPrescription,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.desktopModal,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.favoritePharmaciesScreen,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.global,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.prescriptionPersonScreen,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.verifyPatientInfoScreen,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.signUp,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.signIn,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.forms,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.popUpModal,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.sideMenu,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.prescriptionPriceSection,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.prescribedMedication,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.communication,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.alternatives,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.switchYourMedication,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.recommendedAlternatives,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.pharmacyOpenStatus,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.pickAPharmacy,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.findYourPharmacy,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.greatPrice,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.planMemberSupport,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.rxIdCardContent,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.rxIdBackContent,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.digitalIdCard,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.contactDoctor,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.keepCurrentPrescriptionSection,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.rxIdCardContainer,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.selectLanguage,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.switchYourMedicationSlideUpModal,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.lowestPriceSlideUpModal,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.alternativeSavingsCard,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.contactCareGiver,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.fatalError,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.healthPlanScreen,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.claimReversalSlideUpModal,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.claimReversalScreen,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.pricingOptions,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.prescribersSection,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.pricingOptions,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.pharmaciesSection,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.pricingOptions,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.rxIdCardSection,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
  [
    CmsGroupKey.prescriptionPatientName,
    {
      content: [],
      lastUpdated: 0,
      isContentLoading: false,
    },
  ],
]);

describe('mapUIContentMap', () => {
  beforeEach(() => {
    prescriptionPriceSectionCMSContentWrapperMock.mockReturnValue(
      prescriptionPriceSectionCMSContentMock
    );

    popUpModalCMSContentWrapperMock.mockReturnValue(popUpModalCMSContentMock);

    accumulatorProgressBarCMSContentWrapperMock.mockReturnValue(
      accumulatorProgressBarContentMock
    );

    accumulatorsCardCMSContentWrapperMock.mockReturnValue(
      accumulatorsCardContentMock
    );

    benefitPlanLearnMoreModalCMSContentWrapperMock.mockReturnValue(
      benefitPlanLearnMoreModalContentMock
    );

    claimHistoryCardCMSContentWrapperMock.mockReturnValue(
      claimHistoryCardContentMock
    );

    claimHistoryScreenCMSContentWrapperMock.mockReturnValue(
      claimHistoryScreenContentMock
    );

    drugDetailsTextCMSContentWrapperMock.mockReturnValue(
      drugDetailsTextContentMock
    );

    favoritePharmaciesScreenCMSContentWrapperMock.mockReturnValue(
      favoritePharmaciesMock
    );

    medicineCabinetScreenCMSContentWrapperMock.mockReturnValue(
      medicineCabinetScreenContentMock
    );

    benefitPlanSectionCMSContentWrapperMock.mockReturnValue(
      benefitPlanSectionContentMock
    );

    orderConfirmationScreenCMSContentWrapperMock.mockReturnValue(
      orderConfirmationContentMock
    );

    prescriptionBenefitPlanScreenCMSContentWrapperMock.mockReturnValue(
      prescriptionBenefitPlanScreenContentMock
    );

    prescriptionBenefitPlanLearnMoreModalCMSContentWrapperMock.mockReturnValue(
      prescriptionBenefitPlanLearnMoreModalMock
    );
    prescriptionCardCMSContentWrapperMock.mockReturnValue(
      prescriptionCardContentMock
    );

    transferFlowCMSContentWrapperMock.mockReturnValue(transferFlowCMSMock);
    smartPriceScreenCMSContentWrapperMock.mockReturnValue(
      smartPriceScreenCMSMock
    );
    smartPriceSectionCMSContentWrapperMock.mockReturnValue(
      smartPriceSectionContentMock
    );
    smartPriceLearnMoreModalCMSContentWrapperMock.mockReturnValue(
      smartPriceLearnMoreModalContentMock
    );
    whatComesNextCMSContentWrapperMock.mockReturnValue(
      whatComesNextCMSContentMock
    );
    verifyPrescriptionCMSContentWrapperMock.mockReturnValue(
      verifyPrescriptionCMSMock
    );
    coBrandingCMSContentWrapperMock.mockReturnValue(coBrandingContentMock);
    desktopModalCMSContentWrapperMock.mockReturnValue(desktopModalCMSMock);
    globalCMSContentWrapperMock.mockReturnValue(globalContentMock);
    prescriptionPersonScreenCMSContentWrapperMock.mockReturnValue(
      prescriptionPersonMock
    );
    verifyPatientInfoScreenCMSContentWrapperMock.mockReturnValue(
      verifyPatientInfoMock
    );
    signUpCMSContentWrapperMock.mockReturnValue(signUpContentMock);
    signInCMSContentWrapperMock.mockReturnValue(signInContentMock);
    formsCMSContentWrapperMock.mockReturnValue(formsContentMock);
    sideMenuCMSContentWrapperMock.mockReturnValue(sideMenuContentMock);
    prescribedMedicationCMSContentWrapperMock.mockReturnValue(
      prescribedMedicationContentMock
    );
    communicationCMSContentWrapperMock.mockReturnValue(
      communicationContentMock
    );
    alternativesCMSContentWrapperMock.mockReturnValue(alternativesContentMock);
    switchYourMedicationCMSContentWrapperMock.mockReturnValue(
      switchYourMedicationContentMock
    );
    recommendedAlternativesCMSContentWrapperMock.mockReturnValue(
      recommendedAlternativesContentMock
    );
    pharmacyOpenStatusContentWrapperMock.mockReturnValue(openStatusContentMock);
    pickAPharmacyCMSContentWrapperMock.mockReturnValue(
      pickAPharmacyContentMock
    );
    findYourPharmacyContentWrapperMock.mockReturnValue(
      findYourPharmacyContentMock
    );
    greatPriceScreenCMSContentWrapperMock.mockReturnValue(
      greatPriceScreenContentMock
    );
    planMemberSupportCMSContentWrapperMock.mockReturnValue(
      planMemberSupportContentMock
    );
    rxIdCardContentCMSContentWrapperMock.mockReturnValue(
      rxIdCardContentContentMock
    );
    rxIdBackContentCMSContentWrapperMock.mockReturnValue(
      rxIdBackContentContentMock
    );
    contactDoctorContainerCMSContentWrapperMock.mockReturnValue(
      contactDoctorContentMock
    );
    digitalIdCardScreenCMSContentWrapperMock.mockReturnValue(
      digitalIdCardContentMock
    );
    keepCurrentPrescriptionSectionCMSContentWrapperMock.mockReturnValue(
      keepCurrentPrescriptionSectionContentMock
    );
    selectLanguageScreenCMSContentWrapperMock.mockReturnValue(
      selectLanguageMock
    );
    switchYourMedicationSlideUpModalCMSContentWrapperMock.mockReturnValue(
      switchYourMedicationSlideUpModalContentMock
    );
    lowestPriceSlideUpModalCMSContentWrapperMock.mockReturnValue(
      lowestPriceSlideUpModalContentMock
    );
    alternativeSavingsCardCMSContentWrapperMock.mockReturnValue(
      alternativeSavingsCardContentMock
    );
    contactCareGiverContainerCMSContentWrapperMock.mockReturnValue(
      contactCareGiverContentMock
    );
    fatalErrorCMSContentWrapperMock.mockReturnValue(fatalErrorContentMock);
    healthPlanScreenCMSContentWrapperMock.mockReturnValue(
      healthPlanScreenContentMock
    );
    claimReversalSlideUpModalCMSContentWrapperMock.mockReturnValue(
      claimReversalSlideUpModalContentMock
    );
    claimReversalScreenCMSContentWrapperMock.mockReturnValue(
      claimReversalCMSContentMock
    );
    rxIdCardSectionCMSContentWrapperMock.mockReturnValue(
      rxIdCardSectionContentMock
    );
    prescribersSectionCMSContentWrapperMock.mockReturnValue(
      prescribersSectionContentMock
    );
    pharmaciesSectionCMSContentWrapperMock.mockReturnValue(
      pharmaciesSectionContentMock
    );
    pricingOptionsWrapperMock.mockReturnValue(pricingOptionContentMock);
    prescriptionPatientNameCMSContentWrapperMock.mockReturnValue(
      prescriptionPatientCMSContentMock
    );
  });

  it('should return the correct ui content map from cmsContentMap', () => {
    const expectedContentMap = new Map([
      [
        CmsGroupKey.accumulatorProgressBar,
        {
          content: accumulatorProgressBarContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.accumulatorsCard,
        {
          content: accumulatorsCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.benefitPlanLearnMoreModal,
        {
          content: benefitPlanLearnMoreModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.claimHistoryCard,
        {
          content: claimHistoryCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.claimHistoryScreen,
        {
          content: claimHistoryScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.drugDetailsText,
        {
          content: drugDetailsTextContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.medicineCabinetScreen,
        {
          content: medicineCabinetScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.benefitPlanSection,
        {
          content: benefitPlanSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.orderConfirmation,
        {
          content: orderConfirmationContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionBenefitPlanScreen,
        {
          content: prescriptionBenefitPlanScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionBenefitPlanLearnMoreModal,
        {
          content: prescriptionBenefitPlanLearnMoreModalMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionCard,
        {
          content: prescriptionCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.transferFlow,
        {
          content: transferFlowContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.smartPriceScreen,
        {
          content: smartPriceScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.smartPriceSection,
        {
          content: smartPriceSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.smartPriceLearnMoreModal,
        {
          content: smartPriceLearnMoreModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.whatComesNext,
        {
          content: whatComesNextContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.verifyPrescription,
        {
          content: verifyPrescriptionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.desktopModal,
        {
          content: desktopModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.favoritePharmaciesScreen,
        {
          content: favoritePharmaciesMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.global,
        {
          content: globalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionPersonScreen,
        {
          content: prescriptionPersonMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.verifyPatientInfoScreen,
        {
          content: verifyPatientInfoMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.signUp,
        {
          content: signUpContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.signIn,
        {
          content: signInContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.forms,
        {
          content: formsContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.popUpModal,
        {
          content: popUpModalCMSContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.sideMenu,
        {
          content: sideMenuContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionPriceSection,
        {
          content: prescriptionPriceSectionCMSContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescribedMedication,
        {
          content: prescribedMedicationContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.communication,
        {
          content: communicationContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.alternatives,
        {
          content: alternativesContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.switchYourMedication,
        {
          content: switchYourMedicationContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.recommendedAlternatives,
        {
          content: recommendedAlternativesContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.pharmacyOpenStatus,
        {
          content: openStatusContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.pickAPharmacy,
        {
          content: pickAPharmacyContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.findYourPharmacy,
        {
          content: findYourPharmacyContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.greatPrice,
        {
          content: greatPriceScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.planMemberSupport,
        {
          content: planMemberSupportContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.rxIdCardContent,
        {
          content: rxIdCardContentContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.rxIdBackContent,
        {
          content: rxIdBackContentContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.digitalIdCard,
        {
          content: digitalIdCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.contactDoctor,
        {
          content: contactDoctorContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.keepCurrentPrescriptionSection,
        {
          content: keepCurrentPrescriptionSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.selectLanguage,
        {
          content: selectLanguageMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.switchYourMedicationSlideUpModal,
        {
          content: switchYourMedicationSlideUpModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.lowestPriceSlideUpModal,
        {
          content: lowestPriceSlideUpModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.alternativeSavingsCard,
        {
          content: alternativeSavingsCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.contactCareGiver,
        {
          content: contactCareGiverContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.fatalError,
        {
          content: fatalErrorContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.healthPlanScreen,
        {
          content: healthPlanScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.claimReversalSlideUpModal,
        {
          content: claimReversalSlideUpModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.claimReversalScreen,
        {
          content: claimReversalCMSContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescribersSection,
        {
          content: prescribersSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.pharmaciesSection,
        {
          content: pharmaciesSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.rxIdCardSection,
        {
          content: rxIdCardSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.pricingOptions,
        {
          content: pricingOptionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionPatientName,
        {
          content: prescriptionPatientCMSContentMock,
          isContentLoading: false,
        },
      ],
    ]);

    const result = mapUIContentMap(defaultLanguage, cmsContentMapMock);

    expect(result).toEqual(expectedContentMap);
  });

  it('should return the correct ui content map from cmsContentMap when coBrandId is defined', () => {
    const coBrandIdMock = 'transcarent';

    const expectedContentMap = new Map([
      [
        CmsGroupKey.accumulatorProgressBar,
        {
          content: accumulatorProgressBarContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.accumulatorsCard,
        {
          content: accumulatorsCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.benefitPlanLearnMoreModal,
        {
          content: benefitPlanLearnMoreModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.claimHistoryCard,
        {
          content: claimHistoryCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.claimHistoryScreen,
        {
          content: claimHistoryScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.drugDetailsText,
        {
          content: drugDetailsTextContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.medicineCabinetScreen,
        {
          content: medicineCabinetScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.benefitPlanSection,
        {
          content: benefitPlanSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.orderConfirmation,
        {
          content: orderConfirmationContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionBenefitPlanScreen,
        {
          content: prescriptionBenefitPlanScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionBenefitPlanLearnMoreModal,
        {
          content: prescriptionBenefitPlanLearnMoreModalMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionCard,
        {
          content: prescriptionCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.transferFlow,
        {
          content: transferFlowContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.smartPriceScreen,
        {
          content: smartPriceScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.smartPriceSection,
        {
          content: smartPriceSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.smartPriceLearnMoreModal,
        {
          content: smartPriceLearnMoreModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.whatComesNext,
        {
          content: whatComesNextContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.verifyPrescription,
        {
          content: verifyPrescriptionContentMock,
          isContentLoading: false,
        },
      ],
      [
        coBrandIdMock,
        {
          content: coBrandingContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.desktopModal,
        {
          content: desktopModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.favoritePharmaciesScreen,
        {
          content: favoritePharmaciesMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.global,
        {
          content: globalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionPersonScreen,
        {
          content: prescriptionPersonMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.verifyPatientInfoScreen,
        {
          content: verifyPatientInfoMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.signUp,
        {
          content: signUpContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.signIn,
        {
          content: signInContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.forms,
        {
          content: formsContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.popUpModal,
        {
          content: popUpModalCMSContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.sideMenu,
        {
          content: sideMenuContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionPriceSection,
        {
          content: prescriptionPriceSectionCMSContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescribedMedication,
        {
          content: prescribedMedicationContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.communication,
        {
          content: communicationContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.alternatives,
        {
          content: alternativesContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.switchYourMedication,
        {
          content: switchYourMedicationContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.recommendedAlternatives,
        {
          content: recommendedAlternativesContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.pharmacyOpenStatus,
        {
          content: openStatusContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.pickAPharmacy,
        {
          content: pickAPharmacyContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.findYourPharmacy,
        {
          content: findYourPharmacyContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.greatPrice,
        {
          content: greatPriceScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.planMemberSupport,
        {
          content: planMemberSupportContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.rxIdCardContent,
        {
          content: rxIdCardContentContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.rxIdBackContent,
        {
          content: rxIdBackContentContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.digitalIdCard,
        {
          content: digitalIdCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.contactDoctor,
        {
          content: contactDoctorContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.keepCurrentPrescriptionSection,
        {
          content: keepCurrentPrescriptionSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.selectLanguage,
        {
          content: selectLanguageMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.switchYourMedicationSlideUpModal,
        {
          content: switchYourMedicationSlideUpModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.lowestPriceSlideUpModal,
        {
          content: lowestPriceSlideUpModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.alternativeSavingsCard,
        {
          content: alternativeSavingsCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.contactCareGiver,
        {
          content: contactCareGiverContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.fatalError,
        {
          content: fatalErrorContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.healthPlanScreen,
        {
          content: healthPlanScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.claimReversalSlideUpModal,
        {
          content: claimReversalSlideUpModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.claimReversalScreen,
        {
          content: claimReversalCMSContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescribersSection,
        {
          content: prescribersSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.pharmaciesSection,
        {
          content: pharmaciesSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.rxIdCardSection,
        {
          content: rxIdCardSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.pricingOptions,
        {
          content: pricingOptionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionPatientName,
        {
          content: prescriptionPatientCMSContentMock,
          isContentLoading: false,
        },
      ],
    ]);

    cmsContentMapMock.set(coBrandIdMock, {
      content: [] as IUIContent[],
      lastUpdated: 0,
      isContentLoading: false,
    });

    const result = mapUIContentMap(
      defaultLanguage,
      cmsContentMapMock,
      coBrandIdMock
    );

    expect(result).toEqual(expectedContentMap);
  });

  it('should return the correct ui content map from cmsContentMap when coBrandId is defined but the content for cobranding is undefined', () => {
    const coBrandIdMock = 'transcarent';

    const expectedContentMap = new Map([
      [
        CmsGroupKey.accumulatorProgressBar,
        {
          content: accumulatorProgressBarContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.accumulatorsCard,
        {
          content: accumulatorsCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.benefitPlanLearnMoreModal,
        {
          content: benefitPlanLearnMoreModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.claimHistoryCard,
        {
          content: claimHistoryCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.claimHistoryScreen,
        {
          content: claimHistoryScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.drugDetailsText,
        {
          content: drugDetailsTextContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.medicineCabinetScreen,
        {
          content: medicineCabinetScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.benefitPlanSection,
        {
          content: benefitPlanSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.orderConfirmation,
        {
          content: orderConfirmationContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionBenefitPlanScreen,
        {
          content: prescriptionBenefitPlanScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionBenefitPlanLearnMoreModal,
        {
          content: prescriptionBenefitPlanLearnMoreModalMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionCard,
        {
          content: prescriptionCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.transferFlow,
        {
          content: transferFlowContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.smartPriceScreen,
        {
          content: smartPriceScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.smartPriceSection,
        {
          content: smartPriceSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.smartPriceLearnMoreModal,
        {
          content: smartPriceLearnMoreModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.whatComesNext,
        {
          content: whatComesNextContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.verifyPrescription,
        {
          content: verifyPrescriptionContentMock,
          isContentLoading: false,
        },
      ],
      [
        coBrandIdMock,
        {
          content: {} as ICobrandingContent,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.desktopModal,
        {
          content: desktopModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.favoritePharmaciesScreen,
        {
          content: favoritePharmaciesMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.global,
        {
          content: globalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionPersonScreen,
        {
          content: prescriptionPersonMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.verifyPatientInfoScreen,
        {
          content: verifyPatientInfoMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.signUp,
        {
          content: signUpContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.signIn,
        {
          content: signInContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.forms,
        {
          content: formsContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.popUpModal,
        {
          content: popUpModalCMSContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.sideMenu,
        {
          content: sideMenuContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionPriceSection,
        {
          content: prescriptionPriceSectionCMSContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescribedMedication,
        {
          content: prescribedMedicationContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.communication,
        {
          content: communicationContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.alternatives,
        {
          content: alternativesContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.switchYourMedication,
        {
          content: switchYourMedicationContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.recommendedAlternatives,
        {
          content: recommendedAlternativesContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.pharmacyOpenStatus,
        {
          content: openStatusContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.pickAPharmacy,
        {
          content: pickAPharmacyContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.findYourPharmacy,
        {
          content: findYourPharmacyContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.greatPrice,
        {
          content: greatPriceScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.planMemberSupport,
        {
          content: planMemberSupportContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.rxIdCardContent,
        {
          content: rxIdCardContentContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.rxIdBackContent,
        {
          content: rxIdBackContentContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.digitalIdCard,
        {
          content: digitalIdCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.contactDoctor,
        {
          content: contactDoctorContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.keepCurrentPrescriptionSection,
        {
          content: keepCurrentPrescriptionSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.selectLanguage,
        {
          content: selectLanguageMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.switchYourMedicationSlideUpModal,
        {
          content: switchYourMedicationSlideUpModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.lowestPriceSlideUpModal,
        {
          content: lowestPriceSlideUpModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.alternativeSavingsCard,
        {
          content: alternativeSavingsCardContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.contactCareGiver,
        {
          content: contactCareGiverContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.fatalError,
        {
          content: fatalErrorContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.healthPlanScreen,
        {
          content: healthPlanScreenContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.claimReversalSlideUpModal,
        {
          content: claimReversalSlideUpModalContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.claimReversalScreen,
        {
          content: claimReversalCMSContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescribersSection,
        {
          content: prescribersSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.pharmaciesSection,
        {
          content: pharmaciesSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.rxIdCardSection,
        {
          content: rxIdCardSectionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.pricingOptions,
        {
          content: pricingOptionContentMock,
          isContentLoading: false,
        },
      ],
      [
        CmsGroupKey.prescriptionPatientName,
        {
          content: prescriptionPatientCMSContentMock,
          isContentLoading: false,
        },
      ],
    ]);

    coBrandingCMSContentWrapperMock.mockReturnValue(undefined);

    const result = mapUIContentMap(
      defaultLanguage,
      cmsContentMapMock,
      coBrandIdMock
    );

    expect(result).toEqual(expectedContentMap);
  });

  it('should return the correct ui content map when cmsContentMap is undefined', () => {
    const expectedContentMap = new Map([
      [
        CmsGroupKey.accumulatorProgressBar,
        {
          content: accumulatorProgressBarContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.accumulatorsCard,
        {
          content: accumulatorsCardContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.benefitPlanLearnMoreModal,
        {
          content: benefitPlanLearnMoreModalContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.claimHistoryCard,
        {
          content: claimHistoryCardContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.claimHistoryScreen,
        {
          content: claimHistoryScreenContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.drugDetailsText,
        {
          content: drugDetailsTextContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.medicineCabinetScreen,
        {
          content: medicineCabinetScreenContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.benefitPlanSection,
        {
          content: benefitPlanSectionContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.orderConfirmation,
        {
          content: orderConfirmationContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.prescriptionBenefitPlanScreen,
        {
          content: prescriptionBenefitPlanScreenContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.prescriptionBenefitPlanLearnMoreModal,
        {
          content: prescriptionBenefitPlanLearnMoreModalMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.prescriptionCard,
        {
          content: prescriptionCardContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.transferFlow,
        {
          content: transferFlowContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.smartPriceScreen,
        {
          content: smartPriceScreenContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.smartPriceSection,
        {
          content: smartPriceSectionContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.smartPriceLearnMoreModal,
        {
          content: smartPriceLearnMoreModalContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.whatComesNext,
        {
          content: whatComesNextContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.verifyPrescription,
        {
          content: verifyPrescriptionContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.desktopModal,
        {
          content: desktopModalContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.favoritePharmaciesScreen,
        {
          content: favoritePharmaciesMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.global,
        {
          content: globalContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.prescriptionPersonScreen,
        {
          content: prescriptionPersonMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.verifyPatientInfoScreen,
        {
          content: verifyPatientInfoMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.signUp,
        {
          content: signUpContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.signIn,
        {
          content: signInContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.forms,
        {
          content: formsContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.popUpModal,
        {
          content: popUpModalCMSContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.sideMenu,
        {
          content: sideMenuContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.prescriptionPriceSection,
        {
          content: prescriptionPriceSectionCMSContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.prescribedMedication,
        {
          content: prescribedMedicationContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.communication,
        {
          content: communicationContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.alternatives,
        {
          content: alternativesContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.switchYourMedication,
        {
          content: switchYourMedicationContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.recommendedAlternatives,
        {
          content: recommendedAlternativesContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.pharmacyOpenStatus,
        {
          content: openStatusContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.pickAPharmacy,
        {
          content: pickAPharmacyContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.findYourPharmacy,
        {
          content: findYourPharmacyContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.greatPrice,
        {
          content: greatPriceScreenContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.planMemberSupport,
        {
          content: planMemberSupportContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.rxIdCardContent,
        {
          content: rxIdCardContentContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.rxIdBackContent,
        {
          content: rxIdBackContentContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.digitalIdCard,
        {
          content: digitalIdCardContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.contactDoctor,
        {
          content: contactDoctorContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.keepCurrentPrescriptionSection,
        {
          content: keepCurrentPrescriptionSectionContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.selectLanguage,
        {
          content: selectLanguageMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.switchYourMedicationSlideUpModal,
        {
          content: switchYourMedicationSlideUpModalContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.lowestPriceSlideUpModal,
        {
          content: lowestPriceSlideUpModalContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.alternativeSavingsCard,
        {
          content: alternativeSavingsCardContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.contactCareGiver,
        {
          content: contactCareGiverContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.fatalError,
        {
          content: fatalErrorContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.healthPlanScreen,
        {
          content: healthPlanScreenContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.claimReversalSlideUpModal,
        {
          content: claimReversalSlideUpModalContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.claimReversalScreen,
        {
          content: claimReversalCMSContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.prescribersSection,
        {
          content: prescribersSectionContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.pharmaciesSection,
        {
          content: pharmaciesSectionContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.rxIdCardSection,
        {
          content: rxIdCardSectionContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.pricingOptions,
        {
          content: pricingOptionContentMock,
          isContentLoading: true,
        },
      ],
      [
        CmsGroupKey.prescriptionPatientName,
        {
          content: prescriptionPatientCMSContentMock,
          isContentLoading: true,
        },
      ],
    ]);

    const result = mapUIContentMap(defaultLanguage, new Map());

    expect(result).toEqual(expectedContentMap);
  });
});
