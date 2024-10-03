// Copyright 2022 Prescryptive Health, Inc.

import { initializeFontAwesomeIcon } from '@phx/common/src/components/icons/font-awesome/font-awesome.icon';
import { FontAwesome5ProIcon } from './font-awesome-5-pro/font-awesome-5-pro.icon';
import { initializeIcons } from './initialize-icons';

jest.mock('@phx/common/src/components/icons/font-awesome/font-awesome.icon');
const initializeFontAwesomeIconMock = initializeFontAwesomeIcon as jest.Mock;

jest.mock('./font-awesome-5-pro/font-awesome-5-pro.icon');

describe('initializeIcons', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // TODO: Actions to perform before each test
  });

  it('initializes FontAwesomeIcon', () => {
    initializeIcons();

    expect(initializeFontAwesomeIconMock).toHaveBeenCalledWith(
      FontAwesome5ProIcon
    );
  });
});
