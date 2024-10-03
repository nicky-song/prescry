// Copyright 2020 Prescryptive Health, Inc.

import {
  dependentPickerStyle,
  IDependentPickerStyle,
} from './dependent-picker.style';

describe('dependentPickerStyle', () => {
  it('has expected styles', () => {
    const expectedStyles: IDependentPickerStyle = {
      dependentPickerContainerStyle: {
        flexDirection: 'row',
        flex: 1,
        width: '100%',
      },
      basePickerStyle: {
        width: '100%',
      },
    };

    expect(dependentPickerStyle).toEqual(expectedStyles);
  });
});
