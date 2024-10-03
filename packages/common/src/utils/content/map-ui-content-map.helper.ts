// Copyright 2022 Prescryptive Health, Inc.

import { desktopModalCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/desktop-modal/desktop-modal.cms-content-wrapper';
import { orderConfirmationScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/order-confirmation-screen/order-confirmation.screen.cms-content-wrapper';
import { smartPriceScreenCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/smart-price-screen/smart-price-screen.cms-content-wrapper';
import { transferFlowCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/transfer-flow/transfer-flow.cms-content-wrapper';
import { whatComesNextCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/what-comes-next/what-comes-next.cms-content-wrapper';
import { CmsGroupKey } from '../../experiences/guest-experience/state/cms-content/cms-group-key';
import { IContentWithIsLoading } from '../../models/cms-content/content-with-isloading.model';
import { defaultLanguage, Language } from '../../models/language';
import { IUIContentGroup } from '../../models/ui-content';
import { mapDesktopModalContent } from './map-desktop-modal-content.helper';
import { mapSmartPriceScreenContent } from './map-smart-price-screen-content.helper';
import { mapTransferFlowContent } from './map-transfer-flow-content.helper';
import { mapWhatComesNextContent } from './map-what-comes-next-content.helper';
import { verifyPrescriptionCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/verify-prescription/verify-prescription.cms-content-wrapper';
import { ICobrandingContent } from '../../models/cms-content/co-branding.ui-content';
import { coBrandingCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/co-branding/co-branding.cms-content-wrapper';
import { mapVerifyPrscriptionScreenContent } from './map-verify-prescription-screen-content.helper';
import { globalCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/global/global.cms-content-wrapper';
import { prescriptionPersonScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/prescription-person/prescription-person.screen.cms-content-wrapper';
import { accumulatorProgressBarCMSContentWrapper } from '../../components/progress-bars/accumulator/accumulator.progress-bar.cms-content-wrapper';
import { verifyPatientInfoScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/verify-patient-info/verify-patient-info.screen.cms-content-wrapper';
import { signUpCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/sign-up/sign-up.cms-content-wrapper';
import { mapSignUpContent } from './map-sign-up-content.helper';
import { drugDetailsTextCMSContentWrapper } from '../../components/text/drug-details/drug-details.text.cms-content-wrapper';
import { prescriptionCardCMSContentWrapper } from '../../components/member/cards/prescription/prescription.card.cms-content-wrapper';
import { signInCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/sign-in/sign-in.cms-content-wrapper';
import { prescriptionBenefitPlanScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/prescription-benefit-plan/prescription-benefit-plan.screen.cms-content-wrapper';
import { medicineCabinetScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/medicine-cabinet/medicine-cabinet.screen.cms-content-wrapper';
import { accumulatorsCardCMSContentWrapper } from '../../components/member/cards/accumulators/accumulators.card.cms-content-wrapper';
import { claimHistoryScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/claim-history/claim-history.screen.cms-content-wrapper';
import { formsCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/forms/forms.cms-content-wrapper';
import { claimHistoryCardCMSContentWrapper } from '../../components/member/cards/claim-history/claim-history.card.cms-content-wrapper';
import { popUpModalCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/pop-up-modal/pop-up-modal.cms-content-wrapper';
import { favoritePharmaciesScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/favorite-pharmacies/favorite-pharmacies.screen.cms-content-wrapper';
import { sideMenuCMSContentWrapper } from '../../experiences/guest-experience/navigation/drawer-navigators/side-menu/side-menu.cms-content-wrapper';
import { prescriptionPriceSectionCMSContentWrapper } from '../../components/member/prescription-price/prescription-price-section.cms-content-wrapper';
import { prescribedMedicationCMSContentWrapper } from '../../components/member/prescribed-medication/prescribed-medication.cms-content-wrapper';
import { communicationCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/communication/communication.cms-content-wrapper';
import { alternativesCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/alternatives/alternatives.cms-content-wrapper';
import { switchYourMedicationScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/switch-your-medication/switch-your-medication.screen.cms-content-wrapper';
import { prescriptionBenefitPlanLearnMoreModalCMSContentWrapper } from '../../experiences/guest-experience/screens/prescription-benefit-plan/prescription-benefit-plan-learn-more.modal.cms-content-wrapper';
import { recommendedAlternativesScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/recommended-alternatives/recommended-alternatives.screen.cms-content-wrapper';
import { pickAPharmacyCMSContentWrapper } from '../../experiences/guest-experience/pick-a-pharmacy/pick-a-pharmacy.cms-content-wrapper';
import { pharmacyOpenStatusContentWrapper } from '../formatters/pharmacy-open-status.cms-content-wrapper';
import { findYourPharmacyContentWrapper } from '../../experiences/guest-experience/screens/drug-search/find-pharmacy/find-your-pharmacy.cms-content-wrapper';
import { greatPriceScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/great-price/great-price.screen.cms-content-wrapper';
import { planMemberSupportCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/plan-member-support/plan-member-support.cms-content-wrapper';
import { rxIdBackContentCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/rx-id-back-content/rx-id-back-content.cms-content-wrapper';
import { rxIdCardContentCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/rx-id-card-content/rx-id-card-content.cms-content-wrapper';
import { contactDoctorContainerCMSContentWrapper } from '../../components/member/contact-doctor/contact-doctor-container.cms-content-wrapper';
import { digitalIdCardScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/digital-id-card/digital-id-card.screen.cms-content-wrapper';
import { keepCurrentPrescriptionSectionCMSContentWrapper } from '../../components/member/keep-current-prescription/keep-current-prescription.section.cms-content-wrapper';
import { selectLanguageScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/select-language/select-language.screen.cms-content-wrapper';
import { switchYourMedicationSlideUpModalCMSContentWrapper } from '../../experiences/guest-experience/screens/recommended-alternatives/slide-up-modals/switch-your-medication/switch-your-medication.slide-up-modal.cms-content-wrapper';
import { lowestPriceSlideUpModalCMSContentWrapper } from '../../experiences/guest-experience/screens/recommended-alternatives/slide-up-modals/lowest-price/lowest-price.slide-up-modal.cms-content-wrapper';
import { alternativeSavingsCardCMSContentWrapper } from '../../components/cards/alternative-savings/alternative-savings.card.cms-content-wrapper';
import { contactCareGiverCMSContentWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/contact-caregiver/contact-caregiver.container.cms-content-wrapper';
import { fatalErrorCMSContentWrapper } from '../../components/member/fatal-error/fatal-error.cms-content-wrapper';
import { claimReversalSlideUpModalCMSContentWrapper } from '../../experiences/guest-experience/screens/claim-reversal.slide-up-modal/claim-reversal.slide-up-modal.cms-content-wrapper';
import { claimReversalScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/claim-reversal/claim-reversal.screen.cms-content-wrapper';
import { prescribersSectionCMSContentWrapper } from '../../experiences/guest-experience/screens/digital-id-card/sections/prescribers/prescribers.section.cms-content-wrapper';
import { pharmaciesSectionCMSContentWrapper } from '../../experiences/guest-experience/screens/digital-id-card/sections/pharmacies/pharmacies.section.cms-content-wrapper';
import { benefitPlanSectionCMSContentWrapper } from '../../experiences/guest-experience/screens/digital-id-card/sections/benefit-plan/benefit-plan.section.cms-content-wrapper';
import { pricingOptionsWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/pricing-options/pricing-options.content-wrapper';
import { rxIdCardSectionWrapper } from '../../experiences/guest-experience/state/cms-content/cms-content-wrappers/rx-id-card-section/rx-id-card-section.content-wrapper';
import { smartPriceSectionCMSContentWrapper } from '../../experiences/guest-experience/screens/digital-id-card/sections/smart-price/smart-price.section.cms-content-wrapper';
import { smartPriceLearnMoreModalCMSContentWrapper } from '../../experiences/guest-experience/screens/digital-id-card/smart-price-learn-more-modal/smart-price.learn-more-modal.cms-content-wrapper';
import { healthPlanScreenCMSContentWrapper } from '../../experiences/guest-experience/screens/health-plan/health-plan.screen.cms-content-wrapper';
import { prescriptionPatientNameCMSContentWrapper } from '../../experiences/guest-experience/screens/shopping/prescription-patient/prescription-patient-name.cms-content-wrapper';
import { benefitPlanLearnMoreModalCMSContentWrapper } from '../../experiences/guest-experience/screens/digital-id-card/benefit-plan-learn-more-modal/benefit-plan.learn-more-modal.cms-content-wrapper';

export type IContent = Map<
  string,
  Omit<IContentWithIsLoading<unknown>, 'fetchCMSContent'>
>;

export const mapUIContentMap = (
  currentLanguage: Language,
  uiCMSContentMap: Map<string, IUIContentGroup>,
  coBrandId?: string
): IContent => {
  const accumulatorProgressBarContent = accumulatorProgressBarCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const accumulatorsCardContent = accumulatorsCardCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const benefitPlanLearnMoreModalContent =
    benefitPlanLearnMoreModalCMSContentWrapper(
      defaultLanguage,
      uiCMSContentMap
    );

  const claimHistoryCardContent = claimHistoryCardCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const claimHistoryScreenContent = claimHistoryScreenCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const drugDetailTextContent = drugDetailsTextCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const medicineCabinetScreenContent = medicineCabinetScreenCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const benefitPlanScreenContent = benefitPlanSectionCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const orderConfirmationContent = orderConfirmationScreenCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const prescriptionBenefitPlanScreenContent =
    prescriptionBenefitPlanScreenCMSContentWrapper(
      defaultLanguage,
      uiCMSContentMap
    );

  const prescriptionCardContent = prescriptionCardCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const transferFlowCmsContent = transferFlowCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const smartPriceCmsContent = smartPriceScreenCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const whatComesNextContent = whatComesNextCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const favoritePharmaciesScreenContent =
    favoritePharmaciesScreenCMSContentWrapper(defaultLanguage, uiCMSContentMap);

  const globalContent = globalCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const coBrandingContent: ICobrandingContent | undefined = coBrandId
    ? coBrandingCMSContentWrapper(coBrandId, defaultLanguage, uiCMSContentMap)
    : undefined;

  const verifyPrescriptionContent = verifyPrescriptionCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const desktopModalContent = desktopModalCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const prescriptionPersonContent = prescriptionPersonScreenCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const verifyPatientInfoContent = verifyPatientInfoScreenCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const signUpContent = signUpCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const signInContent = signInCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const popUpModalContent = popUpModalCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const prescriptionPriceSectionContent =
    prescriptionPriceSectionCMSContentWrapper(defaultLanguage, uiCMSContentMap);

  const formsContent = formsCMSContentWrapper(defaultLanguage, uiCMSContentMap);

  const sideMenuContent = sideMenuCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const prescribedMedicationContent = prescribedMedicationCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const communicationContent = communicationCMSContentWrapper(
    currentLanguage,
    uiCMSContentMap
  );

  const prescriptionBenefitPlanModalContent =
    prescriptionBenefitPlanLearnMoreModalCMSContentWrapper(
      defaultLanguage,
      uiCMSContentMap
    );
  const alternativesContent = alternativesCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const switchYourMedicationContent =
    switchYourMedicationScreenCMSContentWrapper(
      defaultLanguage,
      uiCMSContentMap
    );

  const recommendedAlternativesContent =
    recommendedAlternativesScreenCMSContentWrapper(
      defaultLanguage,
      uiCMSContentMap
    );

  const pharmacyOpenStatusContent = pharmacyOpenStatusContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const pickAPharmacyContent = pickAPharmacyCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const findYourPharmacyContent = findYourPharmacyContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const greatPriceScreenContent = greatPriceScreenCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const planMemberSupportContent = planMemberSupportCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const rxIdCardContentContent = rxIdCardContentCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const rxIdBackContentContent = rxIdBackContentCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const contactDoctorContainerContent = contactDoctorContainerCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const digitalIdCardContent = digitalIdCardScreenCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const keepCurrentPrescriptionSectionContent =
    keepCurrentPrescriptionSectionCMSContentWrapper(
      defaultLanguage,
      uiCMSContentMap
    );

  const selectLanguageScreenContent = selectLanguageScreenCMSContentWrapper(
    currentLanguage,
    uiCMSContentMap
  );

  const switchYourMedicationSlideUpModalContent =
    switchYourMedicationSlideUpModalCMSContentWrapper(
      defaultLanguage,
      uiCMSContentMap
    );

  const lowestPriceSlideUpModalContent =
    lowestPriceSlideUpModalCMSContentWrapper(defaultLanguage, uiCMSContentMap);

  const alternativeSavingsCardContent = alternativeSavingsCardCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const contactCareGiverContent = contactCareGiverCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const fatalErrorContent = fatalErrorCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const healthPlanScreenContent = healthPlanScreenCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const claimReversalSlideUpModalContent =
    claimReversalSlideUpModalCMSContentWrapper(
      defaultLanguage,
      uiCMSContentMap
    );

  const claimReversalScreenContent = claimReversalScreenCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const rxIdCardSectionContent = rxIdCardSectionWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const smartPriceSectionContent = smartPriceSectionCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const smartPriceLearnMoreModalContent =
    smartPriceLearnMoreModalCMSContentWrapper(defaultLanguage, uiCMSContentMap);

  const pricingOptionsContent = pricingOptionsWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const prescribersSectionContent = prescribersSectionCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );

  const pharmaciesSectionContent = pharmaciesSectionCMSContentWrapper(
    defaultLanguage,
    uiCMSContentMap
  );
  const prescriptionPatientNameContent =
    prescriptionPatientNameCMSContentWrapper(defaultLanguage, uiCMSContentMap);

  const contentMap: Map<
    string,
    {
      content: unknown;
      isContentLoading: boolean;
    }
  > = new Map([
    [
      CmsGroupKey.accumulatorProgressBar,
      {
        content: accumulatorProgressBarContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.accumulatorProgressBar)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.accumulatorsCard,
      {
        content: accumulatorsCardContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.accumulatorsCard)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.benefitPlanLearnMoreModal,
      {
        content: benefitPlanLearnMoreModalContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.benefitPlanLearnMoreModal)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.claimHistoryCard,
      {
        content: claimHistoryCardContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.claimHistoryCard)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.claimHistoryScreen,
      {
        content: claimHistoryScreenContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.claimHistoryScreen)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.drugDetailsText,
      {
        content: drugDetailTextContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.drugDetailsText)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.medicineCabinetScreen,
      {
        content: medicineCabinetScreenContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.medicineCabinetScreen)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.benefitPlanSection,
      {
        content: benefitPlanScreenContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.benefitPlanSection)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.orderConfirmation,
      {
        content: orderConfirmationContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.orderConfirmation)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.prescriptionBenefitPlanScreen,
      {
        content: prescriptionBenefitPlanScreenContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.prescriptionBenefitPlanScreen)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.prescriptionCard,
      {
        content: prescriptionCardContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.prescriptionCard)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.transferFlow,
      {
        content: mapTransferFlowContent(transferFlowCmsContent),
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.transferFlow)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.smartPriceScreen,
      {
        content: mapSmartPriceScreenContent(smartPriceCmsContent),
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.smartPriceScreen)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.smartPriceSection,
      {
        content: smartPriceSectionContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.smartPriceSection)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.smartPriceLearnMoreModal,
      {
        content: smartPriceLearnMoreModalContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.smartPriceLearnMoreModal)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.whatComesNext,
      {
        content: mapWhatComesNextContent(whatComesNextContent),
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.whatComesNext)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.verifyPrescription,
      {
        content: mapVerifyPrscriptionScreenContent(verifyPrescriptionContent),
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.verifyPrescription)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.desktopModal,
      {
        content: mapDesktopModalContent(desktopModalContent),
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.desktopModal)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.favoritePharmaciesScreen,
      {
        content: favoritePharmaciesScreenContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.favoritePharmaciesScreen)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.global,
      {
        content: globalContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.global)?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.prescriptionPersonScreen,
      {
        content: prescriptionPersonContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.prescriptionPersonScreen)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.verifyPatientInfoScreen,
      {
        content: verifyPatientInfoContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.verifyPatientInfoScreen)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.signUp,
      {
        content: mapSignUpContent(signUpContent),
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.signUp)?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.signIn,
      {
        content: signInContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.signIn)?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.popUpModal,
      {
        content: popUpModalContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.popUpModal)?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.prescriptionPriceSection,
      {
        content: prescriptionPriceSectionContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.prescriptionPriceSection)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.forms,
      {
        content: formsContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.forms)?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.sideMenu,
      {
        content: sideMenuContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.sideMenu)?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.prescribedMedication,
      {
        content: prescribedMedicationContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.prescribedMedication)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.communication,
      {
        content: communicationContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.communication)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.alternatives,
      {
        content: alternativesContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.alternatives)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.prescriptionBenefitPlanLearnMoreModal,
      {
        content: prescriptionBenefitPlanModalContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.prescriptionBenefitPlanLearnMoreModal)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.switchYourMedication,
      {
        content: switchYourMedicationContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.switchYourMedication)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.recommendedAlternatives,
      {
        content: recommendedAlternativesContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.recommendedAlternatives)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.pharmacyOpenStatus,
      {
        content: pharmacyOpenStatusContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.pharmacyOpenStatus)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.pickAPharmacy,
      {
        content: pickAPharmacyContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.pickAPharmacy)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.findYourPharmacy,
      {
        content: findYourPharmacyContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.findYourPharmacy)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.greatPrice,
      {
        content: greatPriceScreenContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.greatPrice)?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.planMemberSupport,
      {
        content: planMemberSupportContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.planMemberSupport)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.rxIdCardContent,
      {
        content: rxIdCardContentContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.rxIdCardContent)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.rxIdBackContent,
      {
        content: rxIdBackContentContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.rxIdBackContent)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.digitalIdCard,
      {
        content: digitalIdCardContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.digitalIdCard)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.contactDoctor,
      {
        content: contactDoctorContainerContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.contactDoctor)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.keepCurrentPrescriptionSection,
      {
        content: keepCurrentPrescriptionSectionContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.keepCurrentPrescriptionSection)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.selectLanguage,
      {
        content: selectLanguageScreenContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.selectLanguage)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.switchYourMedicationSlideUpModal,
      {
        content: switchYourMedicationSlideUpModalContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.switchYourMedicationSlideUpModal)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.lowestPriceSlideUpModal,
      {
        content: lowestPriceSlideUpModalContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.lowestPriceSlideUpModal)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.alternativeSavingsCard,
      {
        content: alternativeSavingsCardContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.alternativeSavingsCard)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.contactCareGiver,
      {
        content: contactCareGiverContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.contactCareGiver)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.fatalError,
      {
        content: fatalErrorContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.fatalError)?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.healthPlanScreen,
      {
        content: healthPlanScreenContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.healthPlanScreen)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.claimReversalSlideUpModal,
      {
        content: claimReversalSlideUpModalContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.claimReversalSlideUpModal)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.claimReversalScreen,
      {
        content: claimReversalScreenContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.claimReversalScreen)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.prescribersSection,
      {
        content: prescribersSectionContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.prescribersSection)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.pharmaciesSection,
      {
        content: pharmaciesSectionContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.pharmaciesSection)
            ?.isContentLoading ?? true,
      },
    ],
    [
      CmsGroupKey.rxIdCardSection,
      {
        content: rxIdCardSectionContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.rxIdCardSection)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.pricingOptions,
      {
        content: pricingOptionsContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.pricingOptions)?.isContentLoading ??
          true,
      },
    ],
    [
      CmsGroupKey.prescriptionPatientName,
      {
        content: prescriptionPatientNameContent,
        isContentLoading:
          uiCMSContentMap.get(CmsGroupKey.prescriptionPatientName)
            ?.isContentLoading ?? true,
      },
    ],
  ]);

  if (coBrandId) {
    contentMap.set(coBrandId, {
      content: coBrandingContent
        ? coBrandingContent
        : ({} as ICobrandingContent),
      isContentLoading:
        uiCMSContentMap.get(coBrandId)?.isContentLoading ?? true,
    });
  }

  return contentMap;
};
