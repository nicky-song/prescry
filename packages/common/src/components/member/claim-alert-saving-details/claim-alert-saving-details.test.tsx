// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { IClaimsAlertSavingsProps } from '../../../experiences/guest-experience/claim-alert-screen/claim-alert-screen.content';
import { NotificationColor } from '../../../theming/colors';
import { IconSize } from '../../../theming/icons';
import { MoneyFormatter } from '../../../utils/formatters/money-formatter';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { ImageAsset } from '../../image-asset/image-asset';
import { BaseText } from '../../text/base-text/base-text';
import { ClaimAlertSavingDetails } from './claim-alert-saving-details';

jest.mock('../../image-asset/image-asset');

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

const propsMock: IClaimsAlertSavingsProps = {
  heading: 'heading',
  subHeading: 'subHeading',
  description: 'description',
  imageName: 'alertCircle',
  price: 40,
};

const propsMockWithDescriptionNull: IClaimsAlertSavingsProps = {
  heading: 'heading',
  subHeading: 'subHeading',
  description: 'description',
  imageName: 'alertCircle',
};

const propsMockWithCheckCircle: IClaimsAlertSavingsProps = {
  heading: 'heading',
  subHeading: 'subHeading',
  description: 'description',
  imageName: 'check-circle',
  price: 50,
};

describe('ClaimAlertSavingDetails', () => {
  describe('type: generic', () => {
    it('renders with correct content based on props', () => {
      const claimAlertContent = renderer.create(
        <ClaimAlertSavingDetails {...propsMock} />
      );
      const claimAlertContentTexts =
        claimAlertContent.root.findAllByType(BaseText);
      expect(claimAlertContentTexts.length).toBe(4);
      expect(claimAlertContentTexts[0].props.children).toBe('heading');
      expect(claimAlertContentTexts[1].props.children).toBe('$40.00');
      expect(claimAlertContentTexts[2].props.children).toBe('subHeading');
      expect(claimAlertContentTexts[3].props.children).toBe('description');
      expect(claimAlertContent.root.findByType(ImageAsset).props.name).toBe(
        'alertCircle'
      );
    });
    it('renders with correct content based on props with price null', () => {
      const claimAlertContent = renderer.create(
        <ClaimAlertSavingDetails {...propsMockWithDescriptionNull} />
      );
      const claimAlertContentTexts =
        claimAlertContent.root.findAllByType(BaseText);
      expect(claimAlertContentTexts.length).toBe(3);
      expect(claimAlertContentTexts[0].props.children).toBe('heading');
      expect(claimAlertContentTexts[1].props.children).toBe('subHeading');
      expect(claimAlertContentTexts[2].props.children).toBe('description');
      expect(claimAlertContent.root.findByType(ImageAsset).props.name).toBe(
        'alertCircle'
      );
    });
    it('renders with FontAwesomeIcon when imageName is check-circle', () => {
      const claimAlertContent = renderer.create(
        <ClaimAlertSavingDetails {...propsMockWithCheckCircle} />
      );
      const claimAlertContentTexts =
        claimAlertContent.root.findAllByType(BaseText);
      expect(claimAlertContentTexts.length).toBe(4);
      expect(claimAlertContentTexts[0].props.children).toBe('heading');
      expect(claimAlertContentTexts[1].props.children).toBe(
        MoneyFormatter.format(propsMockWithCheckCircle.price)
      );
      expect(claimAlertContentTexts[2].props.children).toBe('subHeading');

      const checkCircle = claimAlertContent.root.findByType(FontAwesomeIcon);

      expect(checkCircle.props.name).toEqual('check-circle');
      expect(checkCircle.props.size).toEqual(IconSize.medium);
      expect(checkCircle.props.color).toEqual(NotificationColor.green);
      expect(checkCircle.props.solid).toEqual(true);
    });
  });
});
