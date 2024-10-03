// Copyright 2021 Prescryptive Health, Inc.

import React, { ReactElement, useState } from 'react';
import { View } from 'react-native';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { configureMedicationScreenStyles as styles } from './configure-medication.screen.styles';
import { configureMedicationScreenContent } from './configure-medication.screen.content';
import {
  IToggleButtonOption,
  ToggleButtonGroup,
} from '../../../../../components/buttons/toggle/toggle.button-group';
import {
  IDrugSearchResult,
  IDrugVariant,
} from '../../../../../models/drug-search-response';
import { useDrugSearchContext } from '../../../context-providers/drug-search/use-drug-search-context.hook';
import { PrimaryTextInput } from '../../../../../components/inputs/primary-text/primary-text.input';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { setSelectedConfigurationDispatch } from '../../../state/drug-search/dispatch/set-selected-configuration.dispatch';
import drugSearchResultHelper from '../../../../../utils/drug-search/drug-search-result.helper';
import { ErrorConstants } from '../../../../../theming/constants';
import { pickAPharmacyNavigateDispatch } from '../../../store/navigation/dispatch/drug-search/pick-a-pharmacy-navigate.dispatch';
import {
  formatStrength,
  formatQuantity,
} from '../../../../../utils/formatters/drug.formatter';
import { useNavigation } from '@react-navigation/native';
import { DrugSearchStackNavigationProp } from '../../../navigation/stack-navigators/drug-search/drug-search.stack-navigator';

export const ConfigureMedicationScreen = (): ReactElement => {
  const navigation = useNavigation<DrugSearchStackNavigationProp>();
  const {
    drugSearchState: { selectedDrug, selectedConfiguration },
    drugSearchDispatch,
  } = useDrugSearchContext();

  if (!selectedDrug || !selectedConfiguration) {
    throw new Error(ErrorConstants.errorUndefinedSelectedDrugOrConfiguration);
  }

  const defaultVariant = drugSearchResultHelper.getVariantByNdc(
    selectedConfiguration.ndc,
    selectedDrug
  );

  const defaultDaysSupply =
    drugSearchResultHelper.getSupportedDefaultDaysSupply(
      selectedConfiguration?.supply
    );
  const defaultQuantity = drugSearchResultHelper.getSupportedDefaultQuantity(
    selectedConfiguration?.quantity
  );

  const buildFormOptions = () => {
    if (selectedDrug) {
      const options: IToggleButtonOption[] = [];
      selectedDrug?.forms?.forEach((form) => {
        options.push({ value: form, label: form });
      });
      return options;
    }
    return [];
  };

  const formOptions = buildFormOptions();

  const defaultFormSelection = formOptions.find((e) => {
    return e.label === defaultVariant?.form ?? '';
  });

  const getAvailableDosages = (drug: IDrugSearchResult, form: string) => {
    return drug?.drugVariants
      ?.filter((variant: IDrugVariant) => {
        return variant.form === form;
      })
      .reduce((strengths: IToggleButtonOption[], variant: IDrugVariant) => {
        const formattedStrength = formatStrength(
          variant.strength,
          variant.strengthUnit
        );
        if (formattedStrength) {
          if (
            !strengths.some(
              (toggleButtonOption) =>
                toggleButtonOption.label === formattedStrength
            )
          ) {
            strengths.push({
              value: formattedStrength,
              label: formattedStrength,
              key: `${form}${formattedStrength}`,
            });
          }
        }

        return strengths;
      }, []);
  };

  const [selectedForm, setSelectedForm] = useState(defaultFormSelection);
  const [selectedDaysSupply, setSelectedDaysSupply] =
    useState(defaultDaysSupply);
  const [selectedQuantity, setSelectedQuantity] = useState(defaultQuantity);
  const [availableDosageForForm, setAvailableDosageForForm] = useState(
    selectedDrug
      ? getAvailableDosages(selectedDrug, defaultFormSelection?.label ?? '')
      : undefined
  );

  const formattedDefaultStrength = formatStrength(
    defaultVariant?.strength,
    defaultVariant?.strengthUnit
  );

  const defaultDosageSelection = availableDosageForForm?.find((e) => {
    return e.label === formattedDefaultStrength;
  });

  const [selectedDosage, setSelectedDosage] = useState(defaultDosageSelection);
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  const onFormSelected = (selectedFormValue: string) => {
    const selectedOption = formOptions.find((e) => {
      return e.value === selectedFormValue;
    });

    setSelectedForm(selectedOption);

    const dosages = selectedDrug
      ? getAvailableDosages(selectedDrug, selectedFormValue)
      : undefined;

    setAvailableDosageForForm(dosages);

    const selectedDrugVariant = drugSearchResultHelper.getVariantByForm(
      selectedFormValue,
      selectedDrug
    );
    setSelectedVariant(selectedDrugVariant);

    setSelectedDosage(dosages ? dosages[0] : { value: '', label: '' });

    setSelectedQuantity(
      drugSearchResultHelper.getSupportedDefaultQuantity(
        selectedDrugVariant?.modeQuantity
      )
    );
    setSelectedDaysSupply(
      drugSearchResultHelper.getSupportedDefaultDaysSupply(
        selectedDrugVariant?.modeDaysSupply
      )
    );
  };

  const daysOptions: IToggleButtonOption[] = [
    {
      value: '30',
      label: configureMedicationScreenContent.thirtyDaysLabel,
    },
    {
      value: '60',
      label: configureMedicationScreenContent.sixtyDaysLabel,
    },
    {
      value: '90',
      label: configureMedicationScreenContent.ninetyDaysLabel,
    },
  ];

  const defaultDaysSelection = daysOptions?.find((e) => {
    return e.value === selectedDaysSupply.toString();
  });

  const onDosageSelected = (selectedStrengthAndUnit: string) => {
    const selectedOption = availableDosageForForm?.find((e) => {
      return e.value === selectedStrengthAndUnit;
    });

    const selectedDrugVariant = drugSearchResultHelper.getVariantByStrength(
      selectedForm?.value ?? '',
      selectedStrengthAndUnit,
      selectedDrug
    );

    setSelectedDosage(selectedOption);
    setSelectedVariant(selectedDrugVariant);
  };

  const onDaysSelected = (selection: string) => {
    const selectedOption = daysOptions?.find((e) => {
      return e.value === selection;
    });

    const value = selectedOption?.value;
    if (value) {
      setSelectedDaysSupply(parseInt(value, 10));
    }
  };

  const onQuantityChange = (value: string) => {
    setSelectedQuantity(formatQuantity(parseFloat(value) || 0));
  };

  const hasDosage = availableDosageForForm?.length;

  const searchEnabled =
    selectedForm &&
    (!hasDosage || selectedDosage?.value) &&
    selectedDaysSupply &&
    selectedQuantity;

  const onSearchPress = () => {
    if (selectedVariant && selectedQuantity && selectedDaysSupply) {
      setSelectedConfigurationDispatch(drugSearchDispatch, {
        ndc: selectedVariant.ndc,
        quantity: selectedQuantity,
        supply: selectedDaysSupply,
      });
      pickAPharmacyNavigateDispatch(navigation);
    }
  };

  const dosageCompare = (
    a: IToggleButtonOption,
    b: IToggleButtonOption
  ): number => {
    const aLabelAsNum = parseFloat(a.label);
    const bLabelAsNum = parseFloat(b.label);

    if (isNaN(aLabelAsNum) || isNaN(bLabelAsNum)) {
      return a.label.localeCompare(b.label, 'en', { sensitivity: 'base' });
    }

    return aLabelAsNum - bLabelAsNum;
  };

  const sortedDosages = [...(availableDosageForForm ?? [])].sort(dosageCompare);

  const body = (
    <BodyContentContainer title={configureMedicationScreenContent.title}>
      {formOptions.length ? (
        <ToggleButtonGroup
          selected={selectedForm?.value}
          onSelect={onFormSelected}
          headerText={configureMedicationScreenContent.formLabel}
          options={formOptions}
          viewStyle={styles.topToggleButtonViewStyle}
        />
      ) : null}
      {availableDosageForForm && availableDosageForForm?.length !== 0 ? (
        <ToggleButtonGroup
          selected={selectedDosage?.value}
          onSelect={onDosageSelected}
          headerText={configureMedicationScreenContent.dosageLabel}
          options={sortedDosages}
          viewStyle={styles.toggleGroupViewStyle}
        />
      ) : null}
      <ToggleButtonGroup
        selected={defaultDaysSelection?.value}
        onSelect={onDaysSelected}
        headerText={configureMedicationScreenContent.supplyLabel}
        options={daysOptions}
        viewStyle={styles.toggleGroupViewStyle}
      />
      <PrimaryTextInput
        label={configureMedicationScreenContent.quantityLabel}
        onChangeText={onQuantityChange}
        value={(selectedQuantity || '').toString()}
        viewStyle={styles.quantityViewStyle}
        testID='configureMedicationScreenPrimaryTextInputQuantity'
      />

      <View style={styles.buttonViewStyle}>
        <BaseButton
          disabled={!searchEnabled}
          onPress={onSearchPress}
          testID='configureMedicationScreenBaseButtonSearch'
        >
          {configureMedicationScreenContent.searchButtonLabel}
        </BaseButton>
      </View>
    </BodyContentContainer>
  );

  return (
    <BasicPageConnected
      navigateBack={navigation.goBack}
      body={body}
      translateContent={true}
    />
  );
};
