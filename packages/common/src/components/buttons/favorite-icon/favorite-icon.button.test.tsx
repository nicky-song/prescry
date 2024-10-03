// Copyright 2022 Prescryptive Health, Inc.

import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { getChildren } from '../../../testing/test.helper';
import { NotificationColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { FavoriteIconButton } from './favorite-icon.button';
import { favoriteIconButtonStyles as styles } from './favorite-icon.button.styles';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { useIsMounted } from '../../../hooks/use-is-mounted/use-is-mounted.hook';
import { isPharmacyFavorited } from '../../../utils/validators/is-pharmacy-favorited.validator';
import { useMembershipContext } from '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook';

jest.mock(
  '../../../experiences/guest-experience/context-providers/membership/use-membership-context.hook'
);
const useMembershipContextMock = useMembershipContext as jest.Mock;

jest.mock('../../../utils/validators/is-pharmacy-favorited.validator');
const isPharmacyFavoritedMock = isPharmacyFavorited as jest.Mock;

jest.mock('../../../hooks/use-is-mounted/use-is-mounted.hook');
const useIsMountedMock = useIsMounted as jest.Mock;

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));
const useStateMock = useState as jest.Mock;
const useEffectMock = useEffect as jest.Mock;

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content'
);
const useContentMock = useContent as jest.Mock;

const setIsFavoritedMock = jest.fn();
const setIsDisabledMock = jest.fn();

const ncpdpMock = 'ncpdp-mock';
const favoritedPharmaciesMock = [ncpdpMock];

describe('FavoriteIconButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStateMock.mockReturnValueOnce([false, setIsFavoritedMock]);
    useStateMock.mockReturnValueOnce([false, setIsDisabledMock]);
    useContentMock.mockReturnValue({
      content: {
        favoriteIconButton: 'favorite-icon-button-mock',
        unfavoriteIconButton: 'unfavorite-icon-button-mock',
      },
    });
    useIsMountedMock.mockReturnValue({
      current: true,
    });
    isPharmacyFavoritedMock.mockReturnValue(false);
    useMembershipContextMock.mockReturnValue({
      membershipState: {
        account: {
          favoritedPharmacies: favoritedPharmaciesMock,
        },
      },
    });
  });

  it('renders as TouchableOpacity', () => {
    const setFavoritingActionMock = jest.fn();
    const viewStyleMock = { backgroundColor: 'purple' };
    const testIDMock = 'favoriteIconButton';
    const isDisabledMock = false;

    const testRenderer = renderer.create(
      <FavoriteIconButton
        onPress={setFavoritingActionMock}
        ncpdp={ncpdpMock}
        viewStyle={viewStyleMock}
        testID={testIDMock}
        isDisabled={isDisabledMock}
      />
    );
    const touchableOpacity = testRenderer.root.children[0] as ReactTestInstance;

    expect(touchableOpacity.type).toEqual(TouchableOpacity);
    expect(touchableOpacity.props.style).toEqual([
      styles.viewStyle,
      viewStyleMock,
    ]);
    expect(touchableOpacity.props.onPress).toEqual(expect.any(Function));
    expect(touchableOpacity.props.accessibilityLabel).toEqual(
      'favorite-icon-button-mock'
    );
    expect(touchableOpacity.props.disabled).toEqual(isDisabledMock);
    expect(touchableOpacity.props.testID).toEqual(testIDMock);
  });

  it.each([[true], [false]])(
    'renders expected FontAwesomeIcon',
    (isInitiallyFavorited: boolean) => {
      useStateMock.mockReset();
      useStateMock.mockReturnValueOnce([
        isInitiallyFavorited,
        setIsFavoritedMock,
      ]);
      isPharmacyFavoritedMock.mockReturnValue(isInitiallyFavorited);

      const setFavoritingActionMock = jest.fn();

      const testRenderer = renderer.create(
        <FavoriteIconButton
          onPress={setFavoritingActionMock}
          ncpdp={ncpdpMock}
        />
      );
      const touchableOpacity = testRenderer.root
        .children[0] as ReactTestInstance;

      expect(getChildren(touchableOpacity).length).toEqual(1);

      const fontAwesomeIcon = getChildren(touchableOpacity)[0];

      expect(fontAwesomeIcon.type).toEqual(FontAwesomeIcon);
      expect(fontAwesomeIcon.props.name).toEqual('heart');
      expect(fontAwesomeIcon.props.solid).toEqual(isInitiallyFavorited);
      expect(fontAwesomeIcon.props.regular).toEqual(!isInitiallyFavorited);
      expect(fontAwesomeIcon.props.color).toEqual(NotificationColor.heartRed);
      expect(fontAwesomeIcon.props.size).toEqual(IconSize.regular);
    }
  );

  it.each([[true], [false]])(
    'calls setFavoritingAction & setIsFavorited with expected args',
    async (isInitiallyFavorited: boolean) => {
      useStateMock.mockReset();
      useStateMock.mockReturnValueOnce([
        isInitiallyFavorited,
        setIsFavoritedMock,
      ]);
      isPharmacyFavoritedMock.mockReturnValue(isInitiallyFavorited);

      const setFavoritingActionMock = jest.fn().mockResolvedValue(true);

      const testRenderer = renderer.create(
        <FavoriteIconButton
          onPress={setFavoritingActionMock}
          ncpdp={ncpdpMock}
        />
      );
      const touchableOpacity = testRenderer.root
        .children[0] as ReactTestInstance;

      const expectedAccessibilityLabel = isInitiallyFavorited
        ? 'unfavorite-icon-button-mock'
        : 'favorite-icon-button-mock';

      expect(touchableOpacity.props.accessibilityLabel).toEqual(
        expectedAccessibilityLabel
      );

      const onPress = touchableOpacity.props.onPress;

      await onPress();

      expect(setIsFavoritedMock).toHaveBeenCalledTimes(1);
      expect(setIsFavoritedMock).toHaveBeenNthCalledWith(
        1,
        !isInitiallyFavorited
      );
    }
  );

  it('sets isFavorited on useEffect callback with dependencies: [ncpdp, favoritedPharmacies]', () => {
    const isInitiallyFavorited = true;

    useStateMock.mockReset();
    useStateMock.mockReturnValueOnce([
      isInitiallyFavorited,
      setIsFavoritedMock,
    ]);
    isPharmacyFavoritedMock.mockReturnValue(isInitiallyFavorited);

    const setFavoritingActionMock = jest.fn().mockResolvedValue(true);

    renderer.create(
      <FavoriteIconButton onPress={setFavoritingActionMock} ncpdp={ncpdpMock} />
    );

    expect(useEffectMock.mock.calls).toEqual([
      [expect.any(Function), [favoritedPharmaciesMock]],
    ]);

    expect(setIsFavoritedMock).toHaveBeenCalledTimes(0);
    expect(isPharmacyFavoritedMock).toHaveBeenCalledTimes(0);

    useEffectMock.mock.calls[0][0]();

    expect(isPharmacyFavoritedMock).toHaveBeenCalledTimes(1);
    expect(isPharmacyFavoritedMock).toHaveBeenNthCalledWith(
      1,
      ncpdpMock,
      favoritedPharmaciesMock
    );

    expect(setIsFavoritedMock).toHaveBeenCalledTimes(1);
    expect(setIsFavoritedMock).toHaveBeenNthCalledWith(1, isInitiallyFavorited);
  });
});
