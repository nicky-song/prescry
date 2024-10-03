// Copyright 2021 Prescryptive Health, Inc.

import React, { useState } from 'react';
import { View } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { ConfigureMedicationScreen } from './configure-medication.screen';
import { configureMedicationScreenContent } from './configure-medication.screen.content';
import {
  IToggleButtonOption,
  ToggleButtonGroup,
} from '../../../../../components/buttons/toggle/toggle.button-group';
import { useDrugSearchContext } from '../../../context-providers/drug-search/use-drug-search-context.hook';
import {
  IDrugSearchResult,
  IDrugVariant,
} from '../../../../../models/drug-search-response';
import { configureMedicationScreenStyles } from './configure-medication.screen.styles';
import { PrimaryTextInput } from '../../../../../components/inputs/primary-text/primary-text.input';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import {
  defaultVariantMock,
  mockDrugSearchState,
  selectedDrugMock,
} from '../../../__mocks__/drug-search-state.mock';
import { IDrugSearchContext } from '../../../context-providers/drug-search/drug-search.context';
import { ErrorConstants } from '../../../../../theming/constants';
import {
  defaultDrugSearchState,
  IDrugSearchState,
} from '../../../state/drug-search/drug-search.state';
import { IDrugConfiguration } from '../../../../../models/drug-configuration';
import { formatStrength } from '../../../../../utils/formatters/drug.formatter';
import drugSearchResultHelper from '../../../../../utils/drug-search/drug-search-result.helper';
import { getChildren } from '../../../../../testing/test.helper';
import { useNavigation } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { DrugSearchDispatch } from '../../../state/drug-search/dispatch/drug-search.dispatch';
import { setSelectedConfigurationDispatch } from '../../../state/drug-search/dispatch/set-selected-configuration.dispatch';
import { assertIsDefined } from '../../../../../assertions/assert-is-defined';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock(
  '../../../../../components/buttons/toggle/toggle.button-group',
  () => ({
    ToggleButtonGroup: () => <div />,
  })
);

jest.mock(
  '../../../../../components/inputs/primary-text/primary-text.input',
  () => ({
    PrimaryTextInput: () => <div />,
  })
);

jest.mock('@react-navigation/native');
const navigationMock = useNavigation as jest.Mock;

jest.mock(
  '../../../context-providers/drug-search/use-drug-search-context.hook'
);
const useDrugSearchContextMock = useDrugSearchContext as jest.Mock;

jest.mock(
  '../../../state/drug-search/dispatch/set-selected-configuration.dispatch'
);

jest.mock(
  '../../../../../components/containers/body-content/body-content.container'
);

const setSelectedConfigurationDispatchMock =
  setSelectedConfigurationDispatch as jest.Mock;

const defaultSetSelectedVariantMock = jest.fn();

interface IStateCalls {
  selectedForm: [IToggleButtonOption | undefined, jest.Mock];
  selectedDaysSupply: [number | undefined, jest.Mock];
  selectedQuantity: [number | undefined, jest.Mock];
  availableDosageForForm: [IToggleButtonOption[] | undefined, jest.Mock];
  selectedDosage: [IToggleButtonOption | undefined, jest.Mock];
  selectedVariant: [IDrugVariant | undefined, jest.Mock];
}

function stateReset({
  selectedForm = [defaultFormSelection, jest.fn()],
  selectedDaysSupply: selectedDays = [30, jest.fn()],
  selectedQuantity = [defaultQuantity, jest.fn()],
  availableDosageForForm = [availableDosages, jest.fn()],
  selectedDosage = [defaultDosageSelection, jest.fn()],
  selectedVariant = [defaultVariantMock, defaultSetSelectedVariantMock],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();
  useStateMock.mockReturnValueOnce(selectedForm);
  useStateMock.mockReturnValueOnce(selectedDays);
  useStateMock.mockReturnValueOnce(selectedQuantity);
  useStateMock.mockReturnValueOnce(availableDosageForForm);
  useStateMock.mockReturnValueOnce(selectedDosage);
  useStateMock.mockReturnValueOnce(selectedVariant);
}

const buildFormOptions = () => {
  if (selectedDrugMock) {
    const options: IToggleButtonOption[] = [];
    selectedDrugMock?.forms?.forEach((e) => {
      options.push({ value: e, label: e });
    });
    return options;
  }
  return undefined;
};

const formOptions = buildFormOptions();

const defaultFormSelection = formOptions?.find((e) => {
  return e.label?.toString() === defaultVariantMock?.form;
});

const getAvailableDosages = (drug: IDrugSearchResult, form: string) => {
  return drug?.drugVariants
    ?.filter((variant: IDrugVariant) => {
      return variant.form === form;
    })
    .reduce((strengths: IToggleButtonOption[], variant: IDrugVariant) => {
      const drugStrength = `${
        variant.strength
      } ${variant.strengthUnit.toLowerCase()}`;

      if (!strengths.some((e) => e.label === drugStrength)) {
        strengths.push({
          value: variant.ndc,
          label: drugStrength,
        });
      }

      return strengths;
    }, []);
};

const availableDosages = getAvailableDosages(
  selectedDrugMock,
  defaultFormSelection?.label as string
);

const defaultDosageSelection = availableDosages?.find((e) => {
  return (
    e.label?.toString() ===
    `${
      defaultVariantMock?.strength
    } ${defaultVariantMock?.strengthUnit.toLowerCase()}`
  );
});

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

const drugSearchDispatchMock = {} as DrugSearchDispatch;

const defaultDays = mockDrugSearchState.selectedConfiguration?.supply;
const defaultQuantity = mockDrugSearchState.selectedConfiguration?.quantity;

const defaultDaysSelection = daysOptions?.find((e) => {
  return e.value === defaultDays?.toString();
});

let originalConsoleError: ((data: unknown) => void) | undefined;

describe('ConfigureMedicationScreen', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    useDrugSearchContextMock.mockReturnValue({
      drugSearchState: mockDrugSearchState,
      drugSearchDispatch: drugSearchDispatchMock,
    });
    navigationMock.mockReturnValue(rootStackNavigationMock);
    stateReset({});
  });

  afterEach(() => {
    if (originalConsoleError) {
      // tslint:disable-next-line:no-console
      console.error = originalConsoleError;
      originalConsoleError = undefined;
    }
  });

  it('throws error if selectedDrug is undefined', () => {
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: { ...mockDrugSearchState, selectedDrug: undefined },
      drugSearchDispatch: jest.fn(),
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    // tslint:disable-next-line:no-console
    originalConsoleError = console.error;
    // tslint:disable-next-line:no-console
    console.error = jest.fn();

    try {
      renderer.create(<ConfigureMedicationScreen />);
      fail('Expected exception but none thrown');
    } catch (ex) {
      expect((ex as Error).message).toEqual(
        ErrorConstants.errorUndefinedSelectedDrugOrConfiguration
      );
    }
  });

  it('throws error is selectedConfiguration is undefined', () => {
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchState: {
        ...mockDrugSearchState,
        selectedConfiguration: undefined,
      },
      drugSearchDispatch: jest.fn(),
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    // tslint:disable-next-line:no-console
    originalConsoleError = console.error;
    // tslint:disable-next-line:no-console
    console.error = jest.fn();

    try {
      renderer.create(<ConfigureMedicationScreen />);
      fail('Expected exception but none thrown');
    } catch (ex) {
      expect((ex as Error).message).toEqual(
        ErrorConstants.errorUndefinedSelectedDrugOrConfiguration
      );
    }
  });

  it('returns selectedDrugVariant when dosage is selected', () => {
    const selection = '500mg';
    const testRenderer = renderer.create(<ConfigureMedicationScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const dosageOptionsToggle = body.props.children[1];

    dosageOptionsToggle.props.onSelect(selection);

    expect(defaultSetSelectedVariantMock).toHaveBeenCalledWith({
      ndc: '00071101578',
      name: 'Lyrica',
      genericName: 'Pregabalin',
      strength: '500',
      strengthUnit: 'MG',
      packageQuantity: '1',
      form: 'Solution',
      formCode: 'SOLN',
      displayName: 'Pregabalin',
    });
  });

  it('renders as basic page', () => {
    const testRenderer = renderer.create(<ConfigureMedicationScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);

    const navigateBack = basicPage.props.navigateBack;
    navigateBack();

    expect(rootStackNavigationMock.goBack).toHaveBeenCalledTimes(1);
    expect(basicPage.props.translateContent).toEqual(true);
  });

  it('renders body content container', () => {
    const testRenderer = renderer.create(<ConfigureMedicationScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = basicPageConnected.props.body;

    expect(bodyContentContainer.type).toEqual(BodyContentContainer);
    expect(bodyContentContainer.props.title).toEqual(
      configureMedicationScreenContent.title
    );
    expect(getChildren(bodyContentContainer).length).toEqual(5);
  });

  it('should render form options as expected', () => {
    const testRenderer = renderer.create(<ConfigureMedicationScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const formOptionsToggle = body.props.children[0];

    expect(formOptionsToggle.type).toEqual(ToggleButtonGroup);
    expect(formOptionsToggle.props.viewStyle).toEqual(
      configureMedicationScreenStyles.topToggleButtonViewStyle
    );
    expect(formOptionsToggle.props.headerText).toEqual(
      configureMedicationScreenContent.formLabel
    );
    expect(formOptionsToggle.props.options).toEqual(formOptions);
    expect(formOptionsToggle.props.selected).toEqual(
      defaultFormSelection?.value
    );
  });

  it('handles drug form select', () => {
    const setSelectedFormMock = jest.fn();
    const setAvailableDosageForFormMock = jest.fn();
    const setSelectedVariantMock = jest.fn();
    const setSelectedDosageMock = jest.fn();
    const setSelectedQuantityMock = jest.fn();
    const setSelectedDaysSupplyMock = jest.fn();

    stateReset({
      selectedForm: [undefined, setSelectedFormMock],
      availableDosageForForm: [undefined, setAvailableDosageForFormMock],
      selectedVariant: [undefined, setSelectedVariantMock],
      selectedDosage: [undefined, setSelectedDosageMock],
      selectedQuantity: [1, setSelectedQuantityMock],
      selectedDaysSupply: [30, setSelectedDaysSupplyMock],
    });

    const selectedFormValueMock = 'Solution';
    const selectedVariantMock = drugSearchResultHelper.getVariantByForm(
      selectedFormValueMock,
      selectedDrugMock
    );

    assertIsDefined(selectedVariantMock);
    const selectedConfigurationMock: IDrugConfiguration = {
      ndc: selectedVariantMock.ndc,
      quantity: 10,
      supply: 60,
    };

    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      selectedDrug: selectedDrugMock,
      selectedConfiguration: selectedConfigurationMock,
    };

    const drugSearchContextMock: Partial<IDrugSearchContext> = {
      drugSearchState: drugSearchStateMock,
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    const testRenderer = renderer.create(<ConfigureMedicationScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);

    const formToggle = basicPage.props.body.props.children[0];

    expect(formToggle.props.headerText).toEqual(
      configureMedicationScreenContent.formLabel
    );

    const onFormSelect = formToggle.props.onSelect;

    onFormSelect(selectedFormValueMock);

    const expectedSelectedForm = {
      label: selectedFormValueMock,
      value: selectedFormValueMock,
    };
    expect(setSelectedFormMock).toHaveBeenCalledWith(expectedSelectedForm);

    const formattedVariantStrength = [
      formatStrength(
        selectedDrugMock.drugVariants[0].strength,
        selectedDrugMock.drugVariants[0].strengthUnit
      ),
      formatStrength(
        selectedDrugMock.drugVariants[1].strength,
        selectedDrugMock.drugVariants[1].strengthUnit
      ),
    ];

    assertIsDefined(selectedVariantMock);
    const expectedAvailableDosages = [
      {
        key: selectedVariantMock.form + formattedVariantStrength[0],
        label: formattedVariantStrength[0],
        value: formattedVariantStrength[0],
      },
      {
        key: selectedVariantMock.form + formattedVariantStrength[1],
        label: formattedVariantStrength[1],
        value: formattedVariantStrength[1],
      },
    ];
    expect(setAvailableDosageForFormMock).toHaveBeenCalledWith(
      expectedAvailableDosages
    );

    expect(setSelectedVariantMock).toHaveBeenCalledWith(selectedVariantMock);

    expect(setSelectedDosageMock).toHaveBeenCalledWith(
      expectedAvailableDosages[0]
    );

    expect(setSelectedQuantityMock).toHaveBeenCalledWith(
      drugSearchResultHelper.getSupportedDefaultQuantity(
        selectedVariantMock?.modeQuantity
      )
    );
    expect(setSelectedDaysSupplyMock).toHaveBeenCalledWith(
      drugSearchResultHelper.getSupportedDefaultDaysSupply(
        selectedVariantMock?.modeDaysSupply
      )
    );
  });

  it.each([
    [
      ['500mg', '100mg', '200mg'],
      ['100mg', '200mg', '500mg'],
    ],
    [
      ['120mg', '80mg', '90mg'],
      ['80mg', '90mg', '120mg'],
    ],
    [
      ['90.5mg', '90.1mg', '90mg'],
      ['90mg', '90.1mg', '90.5mg'],
    ],
    [
      ['see', 'hear', 'speak'],
      ['hear', 'see', 'speak'],
    ],
  ])(
    'should render dosage options as expected (dosages: %p)',
    (dosagesMock: string[], expectedDosages: string[]) => {
      const availableDosagesMock: IToggleButtonOption[] = dosagesMock.map(
        (dosage) => ({
          label: dosage,
          value: '',
          key: dosage,
        })
      );

      stateReset({ availableDosageForForm: [availableDosagesMock, jest.fn()] });

      const testRenderer = renderer.create(<ConfigureMedicationScreen />);
      const basicPageConnected =
        testRenderer.root.findByType(BasicPageConnected);
      const pageProps = basicPageConnected.props;
      const body = pageProps.body;
      const dosageOptionsToggle = body.props.children[1];

      expect(dosageOptionsToggle.type).toEqual(ToggleButtonGroup);
      expect(dosageOptionsToggle.props.viewStyle).toEqual(
        configureMedicationScreenStyles.toggleGroupViewStyle
      );
      expect(dosageOptionsToggle.props.headerText).toEqual(
        configureMedicationScreenContent.dosageLabel
      );

      const expectedAvailableDosages: IToggleButtonOption[] =
        expectedDosages.map((dosage) => ({
          label: dosage,
          value: '',
          key: dosage,
        }));

      expect(dosageOptionsToggle.props.options).toEqual(
        expectedAvailableDosages
      );

      expect(dosageOptionsToggle.props.selected).toEqual(
        defaultDosageSelection?.value
      );
    }
  );

  it('should render supply options as expected', () => {
    const testRenderer = renderer.create(<ConfigureMedicationScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const supplyOptionsToggle = body.props.children[2];

    expect(supplyOptionsToggle.type).toEqual(ToggleButtonGroup);
    expect(supplyOptionsToggle.props.viewStyle).toEqual(
      configureMedicationScreenStyles.toggleGroupViewStyle
    );
    expect(supplyOptionsToggle.props.headerText).toEqual(
      configureMedicationScreenContent.supplyLabel
    );
    expect(supplyOptionsToggle.props.options).toEqual(daysOptions);
    expect(supplyOptionsToggle.props.selected).toEqual(
      defaultDaysSelection?.value
    );
  });

  it('should render quantityInput as expected', () => {
    const testRenderer = renderer.create(<ConfigureMedicationScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const quantityInput = body.props.children[3];

    expect(quantityInput.type).toEqual(PrimaryTextInput);
    expect(quantityInput.props.label).toEqual(
      configureMedicationScreenContent.quantityLabel
    );
    expect(quantityInput.props.viewStyle).toEqual(
      configureMedicationScreenStyles.quantityViewStyle
    );
    expect(quantityInput.props.value).toEqual(defaultQuantity?.toString());
    expect(quantityInput.props.testID).toEqual(
      'configureMedicationScreenPrimaryTextInputQuantity'
    );
  });

  it('should render buttonContainer as expected', () => {
    const testRenderer = renderer.create(<ConfigureMedicationScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const buttonContainer = body.props.children[4];

    expect(buttonContainer.type).toEqual(View);
    expect(buttonContainer.props.style).toEqual(
      configureMedicationScreenStyles.buttonViewStyle
    );

    const searchButton = buttonContainer.props.children;
    expect(searchButton.type).toEqual(BaseButton);
    expect(searchButton.props.children).toEqual(
      configureMedicationScreenContent.searchButtonLabel
    );
    expect(searchButton.props.testID).toEqual(
      'configureMedicationScreenBaseButtonSearch'
    );
  });

  it('sets configuration and navigates correctly', () => {
    const testRenderer = renderer.create(<ConfigureMedicationScreen />);
    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const buttonContainer = body.props.children[4];
    const searchButton = buttonContainer.props.children;

    searchButton.props.onPress();

    expect(setSelectedConfigurationDispatchMock).toHaveBeenCalledWith(
      drugSearchDispatchMock,
      {
        ndc: defaultVariantMock.ndc,
        quantity: defaultQuantity,
        supply: 30,
      }
    );
    expect(rootStackNavigationMock.navigate).toHaveBeenCalledWith(
      'DrugSearchPickAPharmacy'
    );
  });
});
