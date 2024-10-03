// Copyright 2021 Prescryptive Health, Inc.

import { BorderRadius } from '../../../theming/borders';
import { Spacing } from '../../../theming/spacing';
import { GreyScale, PurpleScale } from '../../../theming/theme';
import { ISearchBoxStyle, searchBoxStyle } from './search-box.style';

describe('searchBoxStyle', () => {
  it('has expected styles', () => {
    const expectedStyle: ISearchBoxStyle = {
      searchSectionStyle: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: GreyScale.lightest,
      },
      searchIconHolderStyle: {
        position: 'absolute',
        right: 40,
        height: 48,
        marginRight: -Spacing.base,
        borderWidth: 1,
        borderTopRightRadius: BorderRadius.normal,
        borderBottomRightRadius: BorderRadius.normal,
        justifyContent: 'center',
      },
      searchIconHolderStyleDisabled: {
        paddingRight: Spacing.base,
        paddingLeft: Spacing.base,
        position: 'absolute',
        right: 40,
        height: 48,
        marginRight: -Spacing.times2pt5,
        borderWidth: 1,
        borderTopRightRadius: BorderRadius.normal,
        borderBottomRightRadius: BorderRadius.normal,
        justifyContent: 'center',
        borderColor: GreyScale.lighter,
        backgroundColor: GreyScale.lighter,
      },
      searchIconHolderStyleEnabled: {
        paddingRight: Spacing.base,
        paddingLeft: Spacing.base,
        position: 'absolute',
        right: 40,
        height: 48,
        marginRight: -Spacing.times2pt5,
        borderWidth: 1,
        borderTopRightRadius: BorderRadius.normal,
        borderBottomRightRadius: BorderRadius.normal,
        justifyContent: 'center',
        borderColor: PurpleScale.darkest,
        backgroundColor: PurpleScale.darkest,
      },
      searchIconStyle: { maxHeight: 16, width: 16, color: GreyScale.lightest },
    };
    expect(searchBoxStyle).toEqual(expectedStyle);
  });
});
