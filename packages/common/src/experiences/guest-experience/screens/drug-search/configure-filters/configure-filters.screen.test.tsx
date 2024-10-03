// Copyright 2022 Prescryptive Health, Inc.

import React, { useState } from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { IReduxContext } from '../../../context-providers/redux/redux.context';
import { configureFiltersScreenStyles as styles } from './configure-filters.screen.styles';
import { BodyContentContainer } from '../../../../../components/containers/body-content/body-content.container';
import { getChildren } from '../../../../../testing/test.helper';
import {
  ConfigureFiltersScreen,
  IConfigureFiltersScreenRouteProps,
  ISortOptions,
  SortByOption,
} from './configure-filters.screen';
import { Heading } from '../../../../../components/member/heading/heading';
import { RadioButtonToggle } from '../../../../../components/member/radio-button-toggle/radio-button-toggle';
import { configureFiltersScreenContent as content } from './configure-filters.screen.content';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import {
  defaultDistanceSliderMaximumPosition,
  DistanceSlider,
} from '../../../../../components/sliders/distance/distance.slider';
import { LineSeparator } from '../../../../../components/member/line-separator/line-separator';
import { BaseButton } from '../../../../../components/buttons/base/base.button';
import { distanceSliderContent } from '../../../../../components/sliders/distance/distance.slider.content';
import { useNavigation, useRoute } from '@react-navigation/native';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { setFilterPreferencesDispatch } from '../../../state/session/dispatch/set-filter-preferences.dispatch';
import { useSessionContext } from '../../../context-providers/session/use-session-context.hook';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
}));
const useStateMock = useState as jest.Mock;

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: () => <div />,
}));

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../../../../components/member/heading/heading', () => ({
  Heading: () => <div />,
}));
jest.mock('../../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));
jest.mock('../../../../../components/sliders/distance/distance.slider', () => ({
  DistanceSlider: () => <div />,
}));
jest.mock(
  '../../../../../components/member/line-separator/line-separator',
  () => ({
    LineSeparator: () => <div />,
  })
);
jest.mock(
  '../../../../../components/member/radio-button-toggle/radio-button-toggle',
  () => ({
    RadioButtonToggle: () => <div />,
  })
);
jest.mock('../../../../../components/buttons/base/base.button', () => ({
  BaseButton: () => <div />,
}));
jest.mock('../../../state/session/dispatch/set-filter-preferences.dispatch');
const setFilterPreferencesDispatchMock =
  setFilterPreferencesDispatch as jest.Mock;
jest.mock('../../../context-providers/session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;
jest.mock('@react-navigation/native');
const useNavigationMock = useNavigation as jest.Mock;
const useRouteMock = useRoute as jest.Mock;

interface IStateCalls {
  currentSort: [string, jest.Mock];
  currentDistance: [number, jest.Mock];
  currentScrollEnabled: [boolean, jest.Mock];
}

const defaultSortSelection = 'distance';
const defaultDistanceSelection = 50;

const defaultSelectedOptionValueMock = (defaultSort: string) =>
  sortOptionsMock.find((x) => x.sortBy === defaultSort)?.value ?? 0;

const sortOptionsMock: ISortOptions[] = [
  {
    label: 'Distance',
    value: 0,
    sortBy: 'distance' as SortByOption,
  },
  {
    label: 'You pay',
    value: 1,
    sortBy: 'youpay' as SortByOption,
  },
  {
    label: 'Plan pays',
    value: 2,
    sortBy: 'planpays' as SortByOption,
  },
];

const unitMock = 'unit-mock';
const maxPosition = 100;
const minPosition = 1;

const defaultConfigureFiltersScreenProps: IConfigureFiltersScreenRouteProps = {
  defaultDistanceSliderPosition: defaultDistanceSelection,
  defaultSort: defaultSortSelection,
  sortOptions: sortOptionsMock,
  distanceUnit: unitMock,
  maximumDistanceSliderPosition: maxPosition,
  minimumDistanceSliderPosition: minPosition,
};

const setCurrentSortMock = jest.fn();
const setCurrentDistanceMock = jest.fn();
const sessionDispatchMock = jest.fn();

const defaultScrollEnabled = true;
const setScrollEnabled = jest.fn();

function stateReset({
  currentSort = [defaultSortSelection, setCurrentSortMock],
  currentDistance = [defaultDistanceSelection, setCurrentDistanceMock],
  currentScrollEnabled = [defaultScrollEnabled, setScrollEnabled],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();
  useStateMock.mockReturnValueOnce(currentSort);
  useStateMock.mockReturnValueOnce(currentDistance);
  useStateMock.mockReturnValueOnce(currentScrollEnabled);
  useNavigationMock.mockReturnValue(rootStackNavigationMock);
  useRouteMock.mockReturnValue({ params: defaultConfigureFiltersScreenProps });
  useSessionContextMock.mockReturnValue({
    sessionDispatch: sessionDispatchMock,
  });
}

describe('ConfigureFiltersScreen', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    const reduxContextMock: IReduxContext = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);
    stateReset({});
  });

  it('renders as basic page', () => {
    const reduxDispatchMock = jest.fn();
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const testRenderer = renderer.create(<ConfigureFiltersScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);

    const navigateBack = basicPage.props.navigateBack;
    navigateBack();

    expect(rootStackNavigationMock.goBack).toHaveBeenCalled();
    expect(basicPage.props.translateContent).toEqual(true);
  });

  it('renders body content container', () => {
    const testRenderer = renderer.create(<ConfigureFiltersScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const bodyContentContainer = basicPageConnected.props.body;

    expect(bodyContentContainer.type).toEqual(BodyContentContainer);
    expect(bodyContentContainer.props.viewStyle).toEqual(
      styles.bodyContentContainerViewStyle
    );
    expect(getChildren(bodyContentContainer).length).toEqual(6);
  });

  it('should render filter by heading', () => {
    const testRenderer = renderer.create(<ConfigureFiltersScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const heading = body.props.children[0];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.textStyle).toEqual(styles.headingTextStyle);
    expect(getChildren(heading)[0]).toEqual(content.filterByLabel);
  });

  it('should render distance label', () => {
    const testRenderer = renderer.create(<ConfigureFiltersScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const labelText = body.props.children[1];

    expect(labelText.type).toEqual(BaseText);
    expect(labelText.props.style).toEqual(styles.labelTextStyle);
    expect(getChildren(labelText)[0]).toEqual(
      content.distanceRange(maxPosition, unitMock)
    );
  });

  it('should render distance slider with correct action', () => {
    const testRenderer = renderer.create(<ConfigureFiltersScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const distanceSlider = body.props.children[2];

    expect(distanceSlider.type).toEqual(DistanceSlider);
    expect(distanceSlider.props.defaultPosition).toEqual(
      defaultConfigureFiltersScreenProps.defaultDistanceSliderPosition
    );
    expect(distanceSlider.props.minimumPosition).toEqual(1);
    expect(distanceSlider.props.maximumPosition).toEqual(100);
    expect(distanceSlider.props.unit).toEqual(unitMock);
    expect(distanceSlider.props.onSliderChange).toEqual(expect.any(Function));

    distanceSlider.props.onSliderChange('stopped');

    expect(setScrollEnabled).toHaveBeenNthCalledWith(1, true);

    const onSelectDistance = distanceSlider.props.onSelectedValue;
    const selectDistanceMock = 1;
    expect(onSelectDistance).toEqual(expect.any(Function));

    onSelectDistance(selectDistanceMock);
    expect(setCurrentDistanceMock).toBeCalledWith(selectDistanceMock);
  });

  it('should use default values for maximumDistanceSliderPosition and distanceUnit if not provided', () => {
    useRouteMock.mockReset();
    useRouteMock.mockReturnValue({
      params: {
        ...defaultConfigureFiltersScreenProps,
        maximumDistanceSliderPosition: undefined,
        distanceUnit: undefined,
      },
    });
    const testRenderer = renderer.create(<ConfigureFiltersScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const distanceSlider = body.props.children[2];
    expect(distanceSlider.props.maximumPosition).toBe(
      defaultDistanceSliderMaximumPosition
    );
    expect(distanceSlider.props.unit).toBe(distanceSliderContent.defaultUnit);
  });

  it('should render line separator', () => {
    const testRenderer = renderer.create(<ConfigureFiltersScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const lineSeparator = body.props.children[3];

    expect(lineSeparator.type).toEqual(LineSeparator);
    expect(lineSeparator.props.viewStyle).toEqual(
      styles.lineSeparatorViewStyle
    );
  });

  it('should render sort by heading', () => {
    const testRenderer = renderer.create(<ConfigureFiltersScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const heading = body.props.children[4];

    expect(heading.type).toEqual(Heading);
    expect(heading.props.textStyle).toEqual(styles.headingTextStyle);
    expect(getChildren(heading)[0]).toEqual(content.sortByLabel);
  });

  it('should render sort options as expected', () => {
    const testRenderer = renderer.create(<ConfigureFiltersScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const radioButtonToggle = body.props.children[5];

    expect(radioButtonToggle.type).toEqual(RadioButtonToggle);
    expect(radioButtonToggle.props.options).toEqual(sortOptionsMock);
    expect(radioButtonToggle.props.defaultSelectedOption).toEqual(
      defaultSelectedOptionValueMock(defaultSortSelection)
    );
    expect(radioButtonToggle.props.buttonViewStyle).toEqual(
      styles.radioButtonViewStyle
    );
    expect(radioButtonToggle.props.viewStyle).toEqual(
      styles.radioButtonToggleViewStyle
    );
    expect(radioButtonToggle.props.checkBoxContainerViewStyle).toEqual(
      styles.checkBoxContainerViewStyle
    );

    const onSelectSort = radioButtonToggle.props.onOptionSelected;
    const selectSortMock = 0;
    expect(onSelectSort).toEqual(expect.any(Function));

    onSelectSort(selectSortMock);
    expect(setCurrentSortMock).toBeCalledWith(defaultSortSelection);
  });

  it('should not render sort options if not provided', () => {
    useRouteMock.mockReset();
    useRouteMock.mockReturnValue({
      params: { ...defaultConfigureFiltersScreenProps, sortOptions: [] },
    });
    const testRenderer = renderer.create(<ConfigureFiltersScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const pageProps = basicPageConnected.props;
    const body = pageProps.body;
    const radioButtonToggle = body.props.children[5];

    expect(radioButtonToggle).toEqual(null);
  });

  it('renders apply button disabled with default sort and distance values', () => {
    const reduxDispatchMock = jest.fn();
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const testRenderer = renderer.create(<ConfigureFiltersScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const footerContainer = basicPageConnected.props.footer;

    expect(footerContainer.type).toEqual(BaseButton);
    expect(footerContainer.props.disabled).toEqual(true);
    expect(footerContainer.props.onPress).toEqual(expect.any(Function));
  });

  it('renders apply button enabled with non-default sort and default distance values and updates state', () => {
    useStateMock.mockReset();

    const reduxDispatchMock = jest.fn();
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const sortByMock = 'sortby';
    const currentSort = [sortByMock, jest.fn()];
    const currentDistance = [defaultDistanceSelection, jest.fn()];
    const currentScrollEnabled = [defaultScrollEnabled, jest.fn()];

    useStateMock.mockReturnValueOnce(currentSort);
    useStateMock.mockReturnValueOnce(currentDistance);
    useStateMock.mockReturnValueOnce(currentScrollEnabled);

    const testRenderer = renderer.create(<ConfigureFiltersScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const footerContainer = basicPageConnected.props.footer;

    expect(footerContainer.type).toEqual(BaseButton);
    expect(footerContainer.props.disabled).toEqual(false);

    const onApplyPressMock = footerContainer.props.onPress;
    expect(onApplyPressMock).toEqual(expect.any(Function));

    onApplyPressMock();
    expect(setFilterPreferencesDispatchMock).toHaveBeenCalledWith(
      sessionDispatchMock,
      sortByMock,
      defaultDistanceSelection
    );
    expect(rootStackNavigationMock.goBack).toHaveBeenCalled();
  });

  it('renders apply button enabled with default sort and non-default distance values and updates state', () => {
    useStateMock.mockReset();

    const reduxDispatchMock = jest.fn();
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const distanceMock = 1;
    const currentSort = [defaultSortSelection, jest.fn()];
    const currentDistance = [distanceMock, jest.fn()];
    const currentScrollEnabled = [defaultScrollEnabled, jest.fn()];

    useStateMock.mockReturnValueOnce(currentSort);
    useStateMock.mockReturnValueOnce(currentDistance);
    useStateMock.mockReturnValueOnce(currentScrollEnabled);

    const testRenderer = renderer.create(<ConfigureFiltersScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const footerContainer = basicPageConnected.props.footer;

    expect(footerContainer.type).toEqual(BaseButton);
    expect(footerContainer.props.disabled).toEqual(false);
    const onApplyPressMock = footerContainer.props.onPress;
    expect(onApplyPressMock).toEqual(expect.any(Function));

    onApplyPressMock();
    expect(setFilterPreferencesDispatchMock).toHaveBeenCalledWith(
      sessionDispatchMock,
      defaultSortSelection,
      distanceMock
    );
    expect(rootStackNavigationMock.goBack).toHaveBeenCalled();
  });

  it('renders apply button enabled with non-default sort and non-default distance values and updates state', () => {
    useStateMock.mockReset();

    const reduxDispatchMock = jest.fn();
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
    };
    useReduxContextMock.mockReturnValue(reduxContextMock);

    const sortByMock = 'sortby';
    const distanceMock = 1;
    const currentSort = [sortByMock, jest.fn()];
    const currentDistance = [distanceMock, jest.fn()];
    const currentScrollEnabled = [defaultScrollEnabled, jest.fn()];

    useStateMock.mockReturnValueOnce(currentSort);
    useStateMock.mockReturnValueOnce(currentDistance);
    useStateMock.mockReturnValueOnce(currentScrollEnabled);

    const testRenderer = renderer.create(<ConfigureFiltersScreen />);

    const basicPageConnected = testRenderer.root.findByType(BasicPageConnected);
    const footerContainer = basicPageConnected.props.footer;

    expect(footerContainer.type).toEqual(BaseButton);
    expect(footerContainer.props.disabled).toEqual(false);
    const onApplyPressMock = footerContainer.props.onPress;
    expect(onApplyPressMock).toEqual(expect.any(Function));

    onApplyPressMock();
    expect(setFilterPreferencesDispatchMock).toHaveBeenCalledWith(
      sessionDispatchMock,
      sortByMock,
      distanceMock
    );
    expect(rootStackNavigationMock.goBack).toHaveBeenCalled();
  });
});
