// Copyright 2021 Prescryptive Health, Inc.

import { GrayScaleColor } from '../../../theming/colors';
import { FontWeight, getFontFace } from '../../../theming/fonts';
import { Spacing } from '../../../theming/spacing';
import {
  IPrescriberDetailsStyle,
  prescriberDetailsStyle,
} from './prescriber-details.style';

describe('prescriberDetailsStyle', () => {
  it('has expected styles', () => {
    const expectedStyle: IPrescriberDetailsStyle = {
      callButtonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: GrayScaleColor.white,
        paddingTop: Spacing.half,
        paddingLeft: 0,
      },
      doctorContactText: {
        ...getFontFace(),
        color: GrayScaleColor.black,
      },
      prescriberText: {
        ...getFontFace({ weight: FontWeight.bold }),
        marginBottom: Spacing.threeQuarters,
      },
    };

    expect(prescriberDetailsStyle).toEqual(expectedStyle);
  });
});
