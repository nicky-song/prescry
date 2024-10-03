// Copyright 2021 Prescryptive Health, Inc.

import React, { useEffect, useReducer } from 'react';
import renderer from 'react-test-renderer';
import { ITestContainer } from '../../../../testing/test.container';
import { membershipReducer } from '../../state/membership/membership.reducer';
import {
  IMembershipState,
  defaultMembershipState,
} from '../../state/membership/membership.state';
import {
  defaultMemberProfileState,
  IMemberProfileState,
} from '../../store/member-profile/member-profile-reducer';
import { MembershipContext, IMembershipContext } from './membership.context';
import { MembershipContextProvider } from './membership.context-provider';
import { setMemberProfileDispatch } from '../../store/member-profile/dispatch/set-member-profile.dispatch';
import { setMembershipDispatch } from '../../state/membership/dispatch/set-membership.dispatch';
import { useReduxContext } from '../redux/use-redux-context.hook';
import { expectToHaveBeenCalledOnceOnlyWith } from '../../../../testing/test.helper';
import {
  defaultLanguage,
  defaultLanguageCode,
  LanguageCode,
  LanguageCodeMap,
} from '../../../../models/language';
import { useLDClient, useFlags } from 'launchdarkly-react-client-sdk';
import { LDUser } from 'launchdarkly-js-sdk-common';
import {
  pbmProfileMock,
  profileListMock,
} from '../../__mocks__/profile-list.mock';
import { getHighestPriorityProfile } from '../../../../utils/profile.helper';
import { ILaunchDarklyCustomUserAttributes } from '../../../../models/launch-darkly/launch-darkly-custom-user-attributes';
import { IProfile } from '../../../../models/member-profile/member-profile-info';
import { getQueryLanguage } from '../../../../utils/translation/get-query-language.helper';
import { languageCodeAsyncAction } from '../../store/language-code/async-actions/language-code.async-action';
import { defaultSessionState } from '../../state/session/session.state';
import { useSessionContext } from '../session/use-session-context.hook';
import { getContentLanguage } from '../../../../utils/translation/get-content-language.helper';
import { setCurrentLanguageDispatch } from '../../state/session/dispatch/set-current-language.dispatch';
import { updateURLWithFeatureFlagsAndLanguage } from '../../store/navigation/update-url-with-feature-flags-and-language';
import { AutomationNameSuffix } from '../../../../models/automation-name-suffix-constants';

jest.mock('../redux/use-redux-context.hook');
const useReduxContextMock = useReduxContext as jest.Mock;

jest.mock('../../state/membership/dispatch/set-membership.dispatch');
const setMembershipDispatchMock = setMembershipDispatch as jest.Mock;

jest.mock('../../store/member-profile/dispatch/set-member-profile.dispatch');
const setMemberProfileDispatchMock = setMemberProfileDispatch as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual<Record<string, unknown>>('react'),
  useReducer: jest.fn(),
  useEffect: jest.fn(),
}));
const useReducerMock = useReducer as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('launchdarkly-react-client-sdk');
const useLDClientMock = useLDClient as jest.Mock;
const useFlagsMock = useFlags as jest.Mock;

jest.mock('../../../../utils/profile.helper');
const getHighestPriorityProfileMock = getHighestPriorityProfile as jest.Mock;

jest.mock('../../../../utils/translation/get-query-language.helper');
const getQueryLanguageMock = getQueryLanguage as jest.Mock;

jest.mock('../../store/language-code/async-actions/language-code.async-action');
const languageCodeAsyncActionMock = languageCodeAsyncAction as jest.Mock;

jest.mock('../session/use-session-context.hook');
const useSessionContextMock = useSessionContext as jest.Mock;

jest.mock('../../../../utils/translation/get-content-language.helper');
const getContentLanguageMock = getContentLanguage as jest.Mock;

jest.mock('../../state/session/dispatch/set-current-language.dispatch');
const setCurrentLanguageDispatchMock = setCurrentLanguageDispatch as jest.Mock;

jest.mock('../../store/navigation/update-url-with-feature-flags-and-language');
const updateURLWithFeatureFlagsAndLanguageMock =
  updateURLWithFeatureFlagsAndLanguage as jest.Mock;

jest.mock('./membership.context', () => ({
  MembershipContext: {
    Provider: ({ children }: ITestContainer) => <div>{children}</div>,
  },
}));

describe('MembershipContextProvider', () => {
  const ChildMock = jest.fn().mockReturnValue(<div />);

  const stateMock = {
    account: {},
    profileList: [],
  };

  const reduxDispatchMock = jest.fn();
  const reduxGetStateMock = jest.fn();
  const sessionDispatchMock = jest.fn();
  const windowReloadMock = jest.fn();

  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { reload: windowReloadMock },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    useReducerMock.mockReturnValue([stateMock, jest.fn()]);

    useReduxContextMock.mockReturnValue({
      dispatch: reduxDispatchMock,
      getState: reduxGetStateMock,
    });

    const sessionContextMock = {
      sessionState: defaultSessionState,
      sessionDispatch: sessionDispatchMock,
    };
    useSessionContextMock.mockReturnValue(sessionContextMock);
    useFlagsMock.mockReturnValue({ usetrans: true });
  });

  it('calls useReducer with expected arguments', () => {
    renderer.create(
      <MembershipContextProvider>
        <ChildMock />
      </MembershipContextProvider>
    );

    const initialState: IMembershipState = defaultMembershipState;
    expect(useReducerMock).toHaveBeenCalledWith(
      membershipReducer,
      initialState
    );
  });

  it('has expected number of effect handlers', () => {
    renderer.create(
      <MembershipContextProvider>
        <ChildMock />
      </MembershipContextProvider>
    );

    expect(useEffectMock).toHaveBeenCalledTimes(2);
  });

  it('renders as context provider with expected properties', () => {
    const stateMock: IMembershipState = defaultMembershipState;
    const dispatchMock = jest.fn();
    useReducerMock.mockReturnValue([stateMock, dispatchMock]);

    const testRenderer = renderer.create(
      <MembershipContextProvider>
        <ChildMock />
      </MembershipContextProvider>
    );

    const provider = testRenderer.root.findByType(MembershipContext.Provider);

    const expectedContext: IMembershipContext = {
      membershipState: stateMock,
      membershipDispatch: dispatchMock,
    };
    expect(provider.props.value).toEqual(expectedContext);
    expect(provider.props.children).toEqual(<ChildMock />);
  });

  it('calls setMemberProfileDispatch in useEffect if favoritedPharmacies changed', () => {
    const favoritedPharmaciesMock1 = ['ncpdp-mock-1'];
    const favoritedPharmaciesMock2 = ['ncpdp-mock-1', 'ncpdp-mock-2'];
    const memberProfileStateMock = {
      account: {
        favoritedPharmacies: favoritedPharmaciesMock1,
        phoneNumber: 'phone-number-mock',
      },
    } as IMemberProfileState;

    const membershipStateMock = {
      account: {
        favoritedPharmacies: favoritedPharmaciesMock2,
        phoneNumber: 'phone-number-mock',
      },
    } as IMembershipState;

    const dispatchMock = jest.fn();

    useReducerMock.mockReset();
    useReducerMock.mockReturnValue([membershipStateMock, dispatchMock]);

    renderer.create(
      <MembershipContextProvider memberProfileState={memberProfileStateMock}>
        <ChildMock />
      </MembershipContextProvider>
    );

    const useEffectMockOne = useEffectMock.mock.calls[0];

    expect(useEffectMockOne[0]).toEqual(expect.any(Function));
    expect(useEffectMockOne[1]).toEqual([membershipStateMock]);

    useEffectMockOne[0]();

    expectToHaveBeenCalledOnceOnlyWith(
      setMemberProfileDispatchMock,
      reduxDispatchMock,
      {
        account: membershipStateMock.account,
        profileList: membershipStateMock.profileList,
      }
    );
  });

  it('calls setMemberProfileDispatch in useEffect if languageCode is updated', () => {
    const languageCodeMock1: LanguageCode = 'en';
    const languageCodeMock2: LanguageCode = 'es';
    const favoritedPharmaciesMock = ['favorite-pharmacies-mock'];
    const phoneNumberMock = 'phone-number-mock';

    const memberProfileStateMock = {
      account: {
        languageCode: languageCodeMock1,
        favoritedPharmacies: favoritedPharmaciesMock,
        phoneNumber: phoneNumberMock,
      },
    } as IMemberProfileState;

    const membershipStateMock = {
      account: {
        languageCode: languageCodeMock2,
        favoritedPharmacies: favoritedPharmaciesMock,
        phoneNumber: phoneNumberMock,
      },
    } as IMembershipState;

    const dispatchMock = jest.fn();

    useReducerMock.mockReset();
    useReducerMock.mockReturnValue([membershipStateMock, dispatchMock]);

    renderer.create(
      <MembershipContextProvider memberProfileState={memberProfileStateMock}>
        <ChildMock />
      </MembershipContextProvider>
    );

    expect(useEffectMock.mock.calls.length).toEqual(2);

    const useEffectMockOne = useEffectMock.mock.calls[0];

    expect(useEffectMockOne[0]).toEqual(expect.any(Function));
    expect(useEffectMockOne[1]).toEqual([membershipStateMock]);

    useEffectMockOne[0]();

    expectToHaveBeenCalledOnceOnlyWith(
      setMemberProfileDispatchMock,
      reduxDispatchMock,
      {
        account: membershipStateMock.account,
        profileList: membershipStateMock.profileList,
      }
    );
  });

  it('calls setMemberProfileDispatch in useEffect if languageCode differs from queryLanguage', () => {
    const languageCodeMock1: LanguageCode = 'en';
    const languageCodeMock2: LanguageCode = 'es';
    const favoritedPharmaciesMock = ['favorite-pharmacies-mock'];
    const phoneNumberMock = 'phone-number-mock';
    const languageMock = 'Spanish';

    const memberProfileStateMock = {
      account: {
        languageCode: languageCodeMock1,
        favoritedPharmacies: favoritedPharmaciesMock,
        phoneNumber: phoneNumberMock,
      },
    } as IMemberProfileState;

    const membershipStateMock = {
      account: {
        languageCode: languageCodeMock1,
        favoritedPharmacies: favoritedPharmaciesMock,
        phoneNumber: phoneNumberMock,
      },
    } as IMembershipState;

    const membershipStateMockWithUpdatedLanguage: IMembershipState = {
      ...membershipStateMock,
      account: {
        ...membershipStateMock.account,
        languageCode: languageCodeMock2,
      },
    };

    const dispatchMock = jest.fn();

    useReducerMock.mockReset();
    useReducerMock.mockReturnValue([membershipStateMock, dispatchMock]);
    setMemberProfileDispatchMock.mockReset();
    getQueryLanguageMock.mockReturnValue(languageMock);
    renderer.create(
      <MembershipContextProvider memberProfileState={memberProfileStateMock}>
        <ChildMock />
      </MembershipContextProvider>
    );

    expect(useEffectMock.mock.calls.length).toEqual(2);

    const useEffectMockOne = useEffectMock.mock.calls[0];

    expect(useEffectMockOne[0]).toEqual(expect.any(Function));
    expect(useEffectMockOne[1]).toEqual([membershipStateMock]);

    useEffectMockOne[0]();

    expectToHaveBeenCalledOnceOnlyWith(
      setMemberProfileDispatchMock,
      reduxDispatchMock,
      {
        account: membershipStateMockWithUpdatedLanguage.account,
        profileList: membershipStateMock.profileList,
      }
    );
  });

  it('calls setMembershipDispatch in useEffect if memberProfileState is defined', () => {
    const favoritedPharmaciesMock1 = ['ncpdp-mock-1'];
    const favoritedPharmaciesMock2 = ['ncpdp-mock-2'];
    const memberProfileStateMock = {
      account: {
        favoritedPharmacies: favoritedPharmaciesMock1,
        phoneNumber: 'phone-number-mock',
      },
    } as IMemberProfileState;

    const membershipStateMock = {
      account: {
        favoritedPharmacies: favoritedPharmaciesMock2,
        phoneNumber: 'phone-number-mock',
      },
    } as IMembershipState;

    const dispatchMock = jest.fn();

    useReducerMock.mockReset();
    useReducerMock.mockReturnValue([membershipStateMock, dispatchMock]);

    renderer.create(
      <MembershipContextProvider memberProfileState={memberProfileStateMock}>
        <ChildMock />
      </MembershipContextProvider>
    );

    const useEffectMockTwo = useEffectMock.mock.calls[1];

    expect(useEffectMockTwo[0]).toEqual(expect.any(Function));
    expect(useEffectMockTwo[1]).toEqual([memberProfileStateMock]);

    useEffectMockTwo[0]();

    expect(setMembershipDispatchMock).toHaveBeenCalledTimes(1);
    expect(setMembershipDispatchMock).toHaveBeenNthCalledWith(
      1,
      dispatchMock,
      memberProfileStateMock
    );
  });

  it('calls languageCodeAsyncAction with queryLanguage in useEffect if !memberProfileState.account.languageCode and not equal to default', () => {
    const favoritedPharmaciesMock = ['ncpdp-mock-1'];
    const languageMock = 'Spanish';
    const memberProfileStateMock = {
      account: {
        favoritedPharmacies: favoritedPharmaciesMock,
        phoneNumber: 'phone-number-mock',
      },
    } as IMemberProfileState;

    const languageCodeMock = LanguageCodeMap.get(languageMock);

    const membershipStateMock = {
      account: {
        favoritedPharmacies: favoritedPharmaciesMock,
        phoneNumber: 'phone-number-mock',
      },
    } as IMembershipState;

    const dispatchMock = jest.fn();

    useReducerMock.mockReset();
    useReducerMock.mockReturnValue([membershipStateMock, dispatchMock]);
    getQueryLanguageMock.mockReturnValue(languageMock);

    renderer.create(
      <MembershipContextProvider memberProfileState={memberProfileStateMock}>
        <ChildMock />
      </MembershipContextProvider>
    );

    const useEffectMockTwo = useEffectMock.mock.calls[1];

    expect(useEffectMockTwo[0]).toEqual(expect.any(Function));
    expect(useEffectMockTwo[1]).toEqual([memberProfileStateMock]);

    useEffectMockTwo[0]();

    expectToHaveBeenCalledOnceOnlyWith(languageCodeAsyncActionMock, {
      languageCode: languageCodeMock,
      membershipDispatch: dispatchMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    });
  });

  it('calls languageCodeAsyncAction with sessionState language in useEffect if !memberProfileState.account.languageCode and not equal to default', () => {
    const favoritedPharmaciesMock = ['ncpdp-mock-1'];
    const memberProfileStateMock = {
      account: {
        favoritedPharmacies: favoritedPharmaciesMock,
        phoneNumber: 'phone-number-mock',
      },
    } as IMemberProfileState;

    const languageCodeMock: LanguageCode = 'en';

    const membershipStateMock = {
      account: {
        favoritedPharmacies: favoritedPharmaciesMock,
        phoneNumber: 'phone-number-mock',
      },
    } as IMembershipState;

    const dispatchMock = jest.fn();

    useReducerMock.mockReset();
    useReducerMock.mockReturnValue([membershipStateMock, dispatchMock]);
    getQueryLanguageMock.mockReset();

    renderer.create(
      <MembershipContextProvider memberProfileState={memberProfileStateMock}>
        <ChildMock />
      </MembershipContextProvider>
    );

    const useEffectMockTwo = useEffectMock.mock.calls[1];

    expect(useEffectMockTwo[0]).toEqual(expect.any(Function));
    expect(useEffectMockTwo[1]).toEqual([memberProfileStateMock]);

    useEffectMockTwo[0]();

    expectToHaveBeenCalledOnceOnlyWith(languageCodeAsyncActionMock, {
      languageCode: languageCodeMock,
      membershipDispatch: dispatchMock,
      reduxDispatch: reduxDispatchMock,
      reduxGetState: reduxGetStateMock,
    });
  });

  it.each([
    [defaultLanguageCode, true],
    [defaultLanguageCode, false],
    ['es' as LanguageCode, true],
    ['es' as LanguageCode, false],
  ])(
    'calls setCurrentLanguageDispatch with member language in useEffect if memberProfileState.account.languageCode and not equal to session with languageCode as %s',
    (memberProfileLanguage: LanguageCode, usetransMock: boolean) => {
      const favoritedPharmaciesMock = ['ncpdp-mock-1'];
      const memberProfileStateMock = {
        account: {
          favoritedPharmacies: favoritedPharmaciesMock,
          phoneNumber: 'phone-number-mock',
          languageCode: memberProfileLanguage,
        },
      } as IMemberProfileState;

      let languageMock;
      const spanishMock = 'Spanish';

      const membershipStateMock = {
        account: {
          favoritedPharmacies: favoritedPharmaciesMock,
          phoneNumber: 'phone-number-mock',
          languageCode: memberProfileLanguage,
        },
      } as IMembershipState;

      const dispatchMock = jest.fn();

      useReducerMock.mockReset();
      useReducerMock.mockReturnValue([membershipStateMock, dispatchMock]);
      getQueryLanguageMock.mockReset();

      if (memberProfileLanguage === defaultLanguageCode) {
        languageMock = defaultLanguage;
        useSessionContextMock.mockReset();
        useSessionContextMock.mockReturnValue({
          sessionState: {
            ...defaultSessionState,
            currentLanguage: spanishMock,
          },
          sessionDispatch: sessionDispatchMock,
        });
      } else {
        languageMock = 'Spanish';
      }

      getContentLanguageMock.mockReturnValue(languageMock);
      useFlagsMock.mockReset();
      useFlagsMock.mockReturnValue({ usetrans: usetransMock });

      renderer.create(
        <MembershipContextProvider memberProfileState={memberProfileStateMock}>
          <ChildMock />
        </MembershipContextProvider>
      );

      const useEffectMockTwo = useEffectMock.mock.calls[1];

      expect(useEffectMockTwo[0]).toEqual(expect.any(Function));
      expect(useEffectMockTwo[1]).toEqual([memberProfileStateMock]);

      useEffectMockTwo[0]();

      if (memberProfileLanguage !== defaultLanguageCode) {
        expectToHaveBeenCalledOnceOnlyWith(
          updateURLWithFeatureFlagsAndLanguageMock,
          location.pathname,
          memberProfileLanguage
        );
        if (usetransMock) {
          expect(windowReloadMock).toHaveBeenCalledTimes(1);
        }
      }

      expect(setCurrentLanguageDispatchMock).toHaveBeenCalledWith(
        sessionDispatchMock,
        languageMock
      );
    }
  );

  it.each([
    ['es', true],
    ['en', false],
  ])(
    'calls updateURLWithFeatureFlagsAndLanguageMock with member language in useEffect if memberProfileState.account.languageCode and not equal to queryLanguageCode as %s',
    (queryLanguageCode: string, shouldUpdate: boolean) => {
      const favoritedPharmaciesMock = ['ncpdp-mock-1'];
      const englishLanguageCode = 'en';
      const memberProfileStateMock = {
        account: {
          favoritedPharmacies: favoritedPharmaciesMock,
          phoneNumber: 'phone-number-mock',
          languageCode: englishLanguageCode,
        },
      } as IMemberProfileState;

      const spanishMock = queryLanguageCode === 'es' ? 'Spanish' : 'English';

      const membershipStateMock = {
        account: {
          favoritedPharmacies: favoritedPharmaciesMock,
          phoneNumber: 'phone-number-mock',
          languageCode: englishLanguageCode,
        },
      } as IMembershipState;

      const dispatchMock = jest.fn();

      useReducerMock.mockReset();
      useReducerMock.mockReturnValue([membershipStateMock, dispatchMock]);
      getQueryLanguageMock.mockReturnValue(spanishMock);

      useSessionContextMock.mockReset();
      useSessionContextMock.mockReturnValue({
        sessionState: {
          ...defaultSessionState,
          currentLanguage: spanishMock,
        },
        sessionDispatch: sessionDispatchMock,
      });

      getContentLanguageMock.mockReturnValue(defaultLanguage);
      useFlagsMock.mockReset();
      useFlagsMock.mockReturnValue({ usetrans: true });

      renderer.create(
        <MembershipContextProvider memberProfileState={memberProfileStateMock}>
          <ChildMock />
        </MembershipContextProvider>
      );

      const useEffectMockTwo = useEffectMock.mock.calls[1];

      expect(useEffectMockTwo[0]).toEqual(expect.any(Function));
      expect(useEffectMockTwo[1]).toEqual([memberProfileStateMock]);

      useEffectMockTwo[0]();

      if (shouldUpdate) {
        expect(setCurrentLanguageDispatchMock).toHaveBeenCalledWith(
          sessionDispatchMock,
          'English'
        );
        expectToHaveBeenCalledOnceOnlyWith(
          updateURLWithFeatureFlagsAndLanguageMock,
          location.pathname,
          englishLanguageCode,
          true
        );
        expect(windowReloadMock).toHaveBeenCalledTimes(1);
      }
    }
  );

  it.each([
    ['CONTROL', false],
    ['TEST_AUTOMATION', true],
    ['USER _AUTOMATION', true],
    ['WRONG SUFFIX _AUTOMATION_', false],
    ['WRONG SUFFIX _AUTOMATIO', false],
  ])(
    'Dont set Launch Darkly user if automation account (firstName: %p  | isAutomation: %p)',
    (firstName: string, isAutomation: boolean) => {
      const profileMock = {
        ...pbmProfileMock,
        primary: { ...pbmProfileMock.primary, firstName },
      };

      const memberProfileStateMock: Partial<IMemberProfileState> = {
        profileList: profileListMock,
        account: defaultMemberProfileState.account,
      };

      useReducerMock.mockReset();
      useReducerMock.mockReturnValue([memberProfileStateMock, jest.fn()]);

      const clientIdentifyMock = jest.fn();
      useLDClientMock.mockReturnValue({ identify: clientIdentifyMock });

      renderer.create(
        <MembershipContextProvider
          memberProfileState={memberProfileStateMock as IMemberProfileState}
        >
          <ChildMock />
        </MembershipContextProvider>
      );

      getHighestPriorityProfileMock.mockReturnValue(profileMock);

      const effectHandler = useEffectMock.mock.calls[1][0];
      effectHandler();

      expectToHaveBeenCalledOnceOnlyWith(
        getHighestPriorityProfileMock,
        profileListMock
      );

      if (
        !profileMock ||
        profileMock.primary.firstName.endsWith(AutomationNameSuffix)
      ) {
        expect(isAutomation).toBe(true);
        expect(clientIdentifyMock).not.toHaveBeenCalled();
      } else {
        expect(isAutomation).toBe(false);
        const {
          identifier,
          firstName,
          lastName,
          rxGroup = '',
          rxSubGroup,
          rxGroupType,
          brokerAssociation = '',
          state = '',
        } = profileMock.primary;

        const customAttributes: ILaunchDarklyCustomUserAttributes = {
          rxGroup,
          rxSubGroup,
          rxGroupType,
          brokerAssociation,
          state,
        };
        const expectedUser: LDUser = {
          key: identifier,
          firstName,
          lastName,
          custom: customAttributes,
        };
        expectToHaveBeenCalledOnceOnlyWith(clientIdentifyMock, expectedUser);
      }
    }
  );

  it.each([[undefined], [pbmProfileMock]])(
    'sets Launch Darkly user when member profile changes and profile exists (profile: %p)',
    (profileMock: IProfile | undefined) => {
      const memberProfileStateMock: Partial<IMemberProfileState> = {
        profileList: profileListMock,
        account: defaultMemberProfileState.account,
      };

      useReducerMock.mockReset();
      useReducerMock.mockReturnValue([memberProfileStateMock, jest.fn()]);

      const clientIdentifyMock = jest.fn();
      useLDClientMock.mockReturnValue({ identify: clientIdentifyMock });

      renderer.create(
        <MembershipContextProvider
          memberProfileState={memberProfileStateMock as IMemberProfileState}
        >
          <ChildMock />
        </MembershipContextProvider>
      );

      getHighestPriorityProfileMock.mockReturnValue(profileMock);

      const effectHandler = useEffectMock.mock.calls[1][0];
      effectHandler();

      expectToHaveBeenCalledOnceOnlyWith(
        getHighestPriorityProfileMock,
        profileListMock
      );

      if (!profileMock) {
        expect(clientIdentifyMock).not.toHaveBeenCalled();
      } else {
        const {
          identifier,
          firstName,
          lastName,
          rxGroup = '',
          rxSubGroup,
          rxGroupType,
          brokerAssociation = '',
          state = '',
        } = profileMock.primary;

        const customAttributes: ILaunchDarklyCustomUserAttributes = {
          rxGroup,
          rxSubGroup,
          rxGroupType,
          brokerAssociation,
          state,
        };
        const expectedUser: LDUser = {
          key: identifier,
          firstName,
          lastName,
          custom: customAttributes,
        };
        expectToHaveBeenCalledOnceOnlyWith(clientIdentifyMock, expectedUser);
      }
    }
  );
});
