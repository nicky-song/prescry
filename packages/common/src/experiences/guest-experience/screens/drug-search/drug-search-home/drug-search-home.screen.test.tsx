// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  Keyboard,
  ScrollView,
} from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { BasicPageConnected } from '../../../../../components/pages/basic-page-connected';
import { DrugSearchHomeScreen } from './drug-search-home.screen';
import { drugSearchHomeScreenStyle } from './drug-search-home.screen.style';
import { ITestContainer } from '../../../../../testing/test.container';
import { useReduxContext } from '../../../context-providers/redux/use-redux-context.hook';
import { useDrugSearchContext } from '../../../context-providers/drug-search/use-drug-search-context.hook';
import { IReduxContext } from '../../../context-providers/redux/redux.context';
import { IDrugSearchContext } from '../../../context-providers/drug-search/drug-search.context';
import {
  defaultDrugSearchState,
  IDrugSearchState,
} from '../../../state/drug-search/drug-search.state';
import {
  drugSearchAsyncAction,
  IDrugSearchAsyncActionArgs,
} from '../../../state/drug-search/async-actions/drug-search.async-action';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { IDrugSearchResult } from '../../../../../models/drug-search-response';
import {
  lyricaSearchResultMock,
  preGennaSearchResultMock,
} from '../../../__mocks__/drug-search-response.mock';
import { setSelectedDrugDispatch } from '../../../state/drug-search/dispatch/set-selected-drug.dispatch';
import drugSearchResultHelper from '../../../../../utils/drug-search/drug-search-result.helper';
import { pickAPharmacyNavigateDispatch } from '../../../store/navigation/dispatch/drug-search/pick-a-pharmacy-navigate.dispatch';
import { BaseText } from '../../../../../components/text/base-text/base-text';
import { drugSearchHomeScreenContent } from './drug-search-home.screen.content';
import { getChildren } from '../../../../../testing/test.helper';
import { GoBackButton } from '../../../../../components/buttons/go-back-button/go-back.button';
import { setDrugSearchResultsDispatch } from '../../../state/drug-search/dispatch/set-drug-search-results.dispatch';
import { RootState } from '../../../store/root-reducer';
import {
  IPrimaryProfile,
  IProfile,
  RX_SUB_GROUP_DEFAULT,
} from '../../../../../models/member-profile/member-profile-info';
import { IMemberProfileState } from '../../../store/member-profile/member-profile-reducer';
import { useMembershipContext } from '../../../context-providers/membership/use-membership-context.hook';
import { IMembershipContext } from '../../../context-providers/membership/membership.context';
import {
  defaultMembershipState,
  IMembershipState,
} from '../../../state/membership/membership.state';
import { FontAwesomeIcon } from '../../../../../components/icons/font-awesome/font-awesome.icon';
import { rootStackNavigationMock } from '../../../navigation/stack-navigators/root/__mocks__/root.stack-navigation.mock';
import { useNavigation } from '@react-navigation/native';
import { useFlags } from 'launchdarkly-react-client-sdk';

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('react-native', () => ({
  Keyboard: {
    dismiss: jest.fn(),
  },
  ActivityIndicator: () => <div />,
  TouchableOpacity: () => <div />,
  View: () => <div />,
  ScrollView: () => <div />,
  Platform: { select: jest.fn() },
  Dimensions: { get: () => ({ width: 10 }) },
}));

jest.mock('../../../../../components/pages/basic-page-connected', () => ({
  BasicPageConnected: ({ children }: ITestContainer) => <div>{children}</div>,
}));

jest.mock(
  '../../../../../components/inputs/primary-text/primary-text.input',
  () => ({
    PrimaryTextInput: () => <div />,
  })
);

jest.mock('../../../../../components/text/drug-name/drug-name-text', () => ({
  DrugNameText: () => <div />,
}));

jest.mock('../../../../../components/text/base-text/base-text', () => ({
  BaseText: () => <div />,
}));

jest.mock(
  '../../../../../components/containers/body-content/body-content.container',
  () => ({ BodyContentContainer: () => <div /> })
);

jest.mock(
  '../../../../../components/buttons/list-item/list-item.button',
  () => ({ ListItemButton: () => <div /> })
);

jest.mock(
  '../../../../../components/buttons/go-back-button/go-back.button',
  () => ({ GoBackButton: () => <div /> })
);

jest.mock(
  '../../../../../components/icons/font-awesome/font-awesome.icon',
  () => ({ FontAwesomeIcon: () => <div /> })
);

jest.mock('../../../context-providers/redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock(
  '../../../context-providers/drug-search/use-drug-search-context.hook'
);
const useDrugSearchContextMock = useDrugSearchContext as jest.Mock;

jest.mock('../../../state/drug-search/async-actions/drug-search.async-action');
const drugSearchAsyncActionMock = drugSearchAsyncAction as jest.Mock;
const debouncedDrugSearchAsyncActionMock = AwesomeDebouncePromise(
  drugSearchAsyncActionMock,
  200
) as jest.Mock;

jest.mock('../../../state/drug-search/dispatch/set-selected-drug.dispatch');
const setSelectedDrugDispatchMock = setSelectedDrugDispatch as jest.Mock;

jest.mock(
  '../../../store/navigation/dispatch/drug-search/pick-a-pharmacy-navigate.dispatch'
);
const pickAPharmacyNavigateDispatchMock =
  pickAPharmacyNavigateDispatch as jest.Mock;

jest.mock(
  '../../../state/drug-search/dispatch/set-drug-search-results.dispatch'
);
const setDrugSearchResultsDispatchMock =
  setDrugSearchResultsDispatch as jest.Mock;

const drugSearchDispatchMock = jest.fn();

jest.mock('../../../context-providers/membership/use-membership-context.hook');
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('@react-navigation/native');
const navigationMock = useNavigation as jest.Mock;

jest.mock('launchdarkly-react-client-sdk');
const useFlagsMock = useFlags as jest.Mock;

const mockListener = {
  remove: jest.fn(),
};
const originalAddListener = Keyboard.addListener;
const mockAddListener = jest.fn().mockReturnValue(mockListener);

interface IStateCalls {
  showSpinnerCall: [boolean, jest.Mock];
  showDeleteIconCall: [boolean, jest.Mock];
  showResultsCall: [boolean, jest.Mock];
  userInputCall: [string, jest.Mock];
  isKeyboardVisibleCall: [boolean, jest.Mock];
}

function stateReset({
  showSpinnerCall = [false, jest.fn()],
  showDeleteIconCall = [false, jest.fn()],
  showResultsCall = [false, jest.fn()],
  userInputCall = ['', jest.fn()],
  isKeyboardVisibleCall = [false, jest.fn()],
}: Partial<IStateCalls>) {
  useStateMock.mockReset();

  useStateMock.mockReturnValueOnce(showSpinnerCall);
  useStateMock.mockReturnValueOnce(showDeleteIconCall);
  useStateMock.mockReturnValueOnce(showResultsCall);
  useStateMock.mockReturnValueOnce(userInputCall);
  useStateMock.mockReturnValueOnce(isKeyboardVisibleCall);
}

const defaultReduxStateMock: Partial<RootState> = {
  memberProfile: {} as IMemberProfileState,
};
const defaultGetStateMock = jest.fn().mockReturnValue(defaultReduxStateMock);

describe('DrugSearchHomeScreen', () => {
  beforeAll(() => {
    Keyboard.addListener = mockAddListener;
  });
  afterAll(() => {
    Keyboard.addListener = originalAddListener;
  });
  beforeEach(() => {
    navigationMock.mockReturnValue(rootStackNavigationMock);
    mockAddListener.mockClear();
    mockListener.remove.mockClear();
    jest.clearAllMocks();

    useEffectMock.mockReset();
    const defaultReduxContext: IReduxContext = {
      dispatch: jest.fn(),
      getState: defaultGetStateMock,
    };
    useReduxContextMock.mockReturnValue(defaultReduxContext);

    const defaultDrugSearchContext: IDrugSearchContext = {
      drugSearchDispatch: drugSearchDispatchMock,
      drugSearchState: defaultDrugSearchState,
    };
    useDrugSearchContextMock.mockReturnValue(defaultDrugSearchContext);
    stateReset({});

    const membershipContextMock: IMembershipContext = {
      membershipDispatch: jest.fn(),
      membershipState: defaultMembershipState,
    };
    useMembershipContextMock.mockReturnValue(membershipContextMock);
    rootStackNavigationMock.canGoBack = jest.fn().mockReturnValue(true);
    
    useFlagsMock.mockReturnValue({
      useAllMedicationsSearch: false,
    });
  });

  it('renders as BasicPage', () => {
    const testRenderer = renderer.create(<DrugSearchHomeScreen />);

    const basicPage = testRenderer.root.children[0] as ReactTestInstance;

    expect(basicPage.type).toEqual(BasicPageConnected);
    expect(basicPage.props.hideApplicationHeader).toEqual(true);
  });

  it('renders page body in body content container', () => {
    const testRenderer = renderer.create(<DrugSearchHomeScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const scrollView = bodyRenderer.root.findByType(ScrollView);

    const container = scrollView.props.children;

    const containerChildren = container.props.children;

    expect(containerChildren.length).toEqual(4);
  });

  it('renders input container', () => {
    const testRenderer = renderer.create(<DrugSearchHomeScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const scrollView = bodyRenderer.root.findByType(ScrollView);

    const container = scrollView.props.children;

    const containerChildren = container.props.children;

    const inputContainer = containerChildren[0];

    expect(inputContainer.type).toEqual(View);
    expect(inputContainer.props.style).toEqual(
      drugSearchHomeScreenStyle.searchTextViewStyle
    );
    expect(inputContainer.props.testID).toEqual('drugSearchSearchText');
    expect(inputContainer.props.children.length).toEqual(3);
    const input = getChildren(inputContainer)[1];
    expect(input.props.testID).toEqual('searchForDrugsTextInput');
  });

  it('renders back button if can go back', () => {
    const testRenderer = renderer.create(<DrugSearchHomeScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const scrollView = bodyRenderer.root.findByType(ScrollView);

    const container = scrollView.props.children;

    const containerChildren = container.props.children;

    const inputContainer = containerChildren[0];
    const backButton = inputContainer.props.children[0];

    expect(backButton.type).toEqual(GoBackButton);
    expect(backButton.props.accessibilityLabel).toEqual(
      drugSearchHomeScreenContent.goBackButtonLabel
    );
  });

  it('does not render back button if cannot go back', () => {
    rootStackNavigationMock.canGoBack = jest.fn().mockReturnValue(false);
    const testRenderer = renderer.create(<DrugSearchHomeScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const scrollView = bodyRenderer.root.findByType(ScrollView);

    const container = scrollView.props.children;

    const containerChildren = container.props.children;

    const inputContainer = containerChildren[0];

    const backButton = getChildren(inputContainer)[0];

    expect(backButton).toBeNull();
  });

  it.each([
    ['a', [], false, 'n/a', false],
    ['ab', [], false, 'n/a', false],
    ['abc', [], true, RX_SUB_GROUP_DEFAULT, false],
    [
      'abcd',
      [{ primary: { rxSubGroup: 'HMA01' } as IPrimaryProfile }],
      true,
      'HMA01',
      false
    ],
    [
      'abcd',
      [
        {
          primary: {
            rxGroup: 'CASH',
            rxSubGroup: 'CASH01',
          } as IPrimaryProfile,
        },
        {
          primary: {
            rxGroup: 'SIE',
            rxSubGroup: 'HMA01',
          } as IPrimaryProfile,
        },
      ],
      true,
      'HMA01',
      false
    ],
    [
      'abcd',
      [{ primary: { rxSubGroup: 'HMA01' } as IPrimaryProfile }],
      true,
      'HMA01',
      true
    ],
  ])(
    'requests drug search when input changes if minimum length reached (value: %p; profileList: %p)',
    async (
      valueMock: string,
      profileListMock: Partial<IProfile>[],
      isRequestExpected: boolean,
      expectedRxSubGroup: string,
      useAllMedicationsSearch: boolean
    ) => {
      const reduxContextMock: IReduxContext = {
        dispatch: jest.fn(),
        getState: jest.fn(),
      };
      useReduxContextMock.mockReturnValue(reduxContextMock);

      const membershipStateMock: IMembershipState = {
        ...defaultMembershipState,
        profileList: profileListMock as IProfile[],
      };
      const membershipContextMock: IMembershipContext = {
        membershipDispatch: jest.fn(),
        membershipState: membershipStateMock,
      };
      useMembershipContextMock.mockReturnValue(membershipContextMock);

      const drugSearchContextMock: IDrugSearchContext = {
        drugSearchDispatch: jest.fn(),
        drugSearchState: defaultDrugSearchState,
      };
      useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

      const testRenderer = renderer.create(<DrugSearchHomeScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const body = basicPage.props.body;
      const bodyContentContainer = getChildren(body)[0];
      const view = getChildren(bodyContentContainer)[0];
      const input = getChildren(view)[1];
      const onChangeText = input.props.onChangeText;
      onChangeText(valueMock);

      if (isRequestExpected) {
        const expectedArgs: IDrugSearchAsyncActionArgs = {
          drugSearchDispatch: drugSearchContextMock.drugSearchDispatch,
          filter: valueMock,
          rxSubGroup: expectedRxSubGroup,
          maxResults: 8,
          navigation: rootStackNavigationMock,
          reduxDispatch: reduxContextMock.dispatch,
          reduxGetState: reduxContextMock.getState,
          useAllMedicationsSearch,
        };
        await debouncedDrugSearchAsyncActionMock(expectedArgs);
        expect(drugSearchAsyncActionMock).toHaveBeenCalledWith(expectedArgs);
      } else {
        expect(drugSearchAsyncActionMock).not.toHaveBeenCalled();
      }
    }
  );

  it('renders "x" when user starts typing in the search drug text box', () => {
    stateReset({ showDeleteIconCall: [true, jest.fn()] });
    const testRenderer = renderer.create(<DrugSearchHomeScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const scrollView = bodyRenderer.root.findByType(ScrollView);

    const container = scrollView.props.children;

    const containerChildren = container.props.children;

    const inputContainer = containerChildren[0];

    const deletedIconHolder = getChildren(inputContainer)[2];
    const deleteIcon = getChildren(deletedIconHolder)[0];
    expect(deletedIconHolder.type).toBe(TouchableOpacity);
    expect(deleteIcon.type).toBe(FontAwesomeIcon);
  });

  it.each([
    [[], false, '', false],
    [[], false, 'a', false],
    [[], false, 'aa', false],
    [[], false, 'aaa', true],
    [[], true, 'aaa', false],
    [[lyricaSearchResultMock], false, 'aaa', false],
  ])(
    'renders no results message (results: %p, isSpinnerShown: %p, userInput: %p)',
    (
      resultsMock: IDrugSearchResult[],
      isSpinnerShownMock: boolean,
      userInputMock: string,
      isMessageShown: boolean
    ) => {
      const drugSearchContextMock: Partial<IDrugSearchContext> = {
        drugSearchState: {
          ...defaultDrugSearchState,
          drugSearchResults: resultsMock,
        },
      };
      useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

      stateReset({
        showSpinnerCall: [isSpinnerShownMock, jest.fn()],
        userInputCall: [userInputMock, jest.fn()],
      });

      const testRenderer = renderer.create(<DrugSearchHomeScreen />);

      const basicPage = testRenderer.root.findByType(BasicPageConnected);
      const body = basicPage.props.body;

      const bodyRenderer = renderer.create(body);

      const scrollView = bodyRenderer.root.findByType(ScrollView);

      const container = scrollView.props.children;

      const containerChildren = container.props.children;

      const messageText = containerChildren[1];

      if (!isMessageShown) {
        expect(messageText).toBeNull();
      } else {
        expect(messageText.type).toEqual(BaseText);
        expect(messageText.props.style).toEqual(
          drugSearchHomeScreenStyle.noResultsTextStyle
        );
        expect(messageText.props.children).toEqual(
          drugSearchHomeScreenContent.noResultsMessage
        );
      }
    }
  );

  it('renders spinner in view with correct styles while fetching the search results', () => {
    stateReset({ showSpinnerCall: [true, jest.fn()] });
    const testRenderer = renderer.create(<DrugSearchHomeScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const scrollView = bodyRenderer.root.findByType(ScrollView);

    const container = scrollView.props.children;

    const containerChildren = container.props.children;

    const spinnerContainer = containerChildren[3];

    expect(spinnerContainer.type).toBe(View);
    expect(spinnerContainer.props.style).toBe(
      drugSearchHomeScreenStyle.spinnerViewStyle
    );
    expect(spinnerContainer.props.children.type).toBe(ActivityIndicator);
  });

  it('dispatches selected drug and default configuration when drug selected', () => {
    const drugSearchResultsMock: IDrugSearchResult[] = [
      lyricaSearchResultMock,
      preGennaSearchResultMock,
    ];
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      drugSearchResults: drugSearchResultsMock,
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchDispatch: drugSearchDispatchMock,
      drugSearchState: drugSearchStateMock,
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    stateReset({ showResultsCall: [true, jest.fn()] });

    const testRenderer = renderer.create(<DrugSearchHomeScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyContentContainer = getChildren(body)[0];
    const itemButtons = bodyContentContainer.props.children[2];

    drugSearchResultsMock.forEach((selectedDrug, index) => {
      const onPress = itemButtons[index].props.onPress;
      onPress();

      const defaultConfiguration =
        drugSearchResultHelper.getDefaultConfiguration(selectedDrug);

      expect(setSelectedDrugDispatchMock).toHaveBeenCalledWith(
        drugSearchDispatchMock,
        selectedDrug,
        defaultConfiguration
      );

      expect(itemButtons[index].props.testID).toEqual(
        'listItemDrugNameButton-' + selectedDrug.name
      );
    });
  });

  it('dispatches navigate to Pick a Pharmacy screen when drug selected', () => {
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      drugSearchResults: [lyricaSearchResultMock],
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchDispatch: jest.fn(),
      drugSearchState: drugSearchStateMock,
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    const reduxDispatchMock = jest.fn();
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
      getState: defaultGetStateMock,
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    stateReset({ showResultsCall: [true, jest.fn()] });

    const testRenderer = renderer.create(<DrugSearchHomeScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyContentContainer = getChildren(body)[0];
    const itemButtons = bodyContentContainer.props.children[2];
    const onPress = itemButtons[0].props.onPress;

    onPress();

    expect(pickAPharmacyNavigateDispatchMock).toHaveBeenCalledWith(
      rootStackNavigationMock
    );
  });

  it('doesnt dispatch navigate to Pick a Pharmacy screen on drug selection when keyboard is open', () => {
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      drugSearchResults: [lyricaSearchResultMock],
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchDispatch: jest.fn(),
      drugSearchState: drugSearchStateMock,
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    const reduxDispatchMock = jest.fn();
    const reduxContextMock: Partial<IReduxContext> = {
      dispatch: reduxDispatchMock,
      getState: defaultGetStateMock,
    };
    useReduxContextMock.mockReturnValueOnce(reduxContextMock);

    stateReset({
      showResultsCall: [true, jest.fn()],
      isKeyboardVisibleCall: [true, jest.fn()],
    });

    const testRenderer = renderer.create(<DrugSearchHomeScreen />);
    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyContentContainer = getChildren(body)[0];
    const itemButtons = bodyContentContainer.props.children[2];
    const onPress = itemButtons[0].props.onPress;

    onPress();

    expect(Keyboard.dismiss).toHaveBeenCalled();

    expect(pickAPharmacyNavigateDispatchMock).not.toHaveBeenCalled();
  });

  it('dispatches selected drug on change text', () => {
    const drugSearchResultsMock: IDrugSearchResult[] = [
      lyricaSearchResultMock,
      preGennaSearchResultMock,
    ];
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      drugSearchResults: drugSearchResultsMock,
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchDispatch: drugSearchDispatchMock,
      drugSearchState: drugSearchStateMock,
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    stateReset({ showResultsCall: [true, jest.fn()] });

    const testRenderer = renderer.create(<DrugSearchHomeScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;
    const bodyContentContainer = getChildren(body)[0];
    const view = getChildren(bodyContentContainer)[0];
    const input = getChildren(view)[1];
    const onChangeText = input.props.onChangeText;
    onChangeText('abc');

    expect(setSelectedDrugDispatchMock).toHaveBeenCalled();
  });

  it('clears results and navigates back on back button press', () => {
    const testRenderer = renderer.create(<DrugSearchHomeScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const scrollView = bodyRenderer.root.findByType(ScrollView);

    const container = scrollView.props.children;

    const containerChildren = container.props.children;

    const inputContainer = containerChildren[0];

    const backButton = getChildren(inputContainer)[0];

    backButton.props.onPress();

    expect(backButton.type).toEqual(GoBackButton);
    expect(setDrugSearchResultsDispatchMock).toBeCalledTimes(1);
    expect(setDrugSearchResultsDispatchMock).toBeCalledWith(
      drugSearchDispatchMock,
      [],
      0
    );
  });
  it('clears results when search drug text box is empty', () => {
    const drugSearchResultsMock: IDrugSearchResult[] = [
      lyricaSearchResultMock,
      preGennaSearchResultMock,
    ];
    const drugSearchStateMock: IDrugSearchState = {
      ...defaultDrugSearchState,
      drugSearchResults: drugSearchResultsMock,
    };
    const drugSearchContextMock: IDrugSearchContext = {
      drugSearchDispatch: drugSearchDispatchMock,
      drugSearchState: drugSearchStateMock,
    };
    useDrugSearchContextMock.mockReturnValue(drugSearchContextMock);

    const testRenderer = renderer.create(<DrugSearchHomeScreen />);

    const basicPage = testRenderer.root.findByType(BasicPageConnected);
    const body = basicPage.props.body;

    const bodyRenderer = renderer.create(body);

    const scrollView = bodyRenderer.root.findByType(ScrollView);

    const container = scrollView.props.children;

    const containerChildren = container.props.children;

    const drugList = containerChildren[2];

    expect(drugList).toBeNull();
  });
});
