// Copyright 2021 Prescryptive Health, Inc.

export interface ICouponContentProps {
  groupNumberLabel: string;
  pcnLabel: string;
  memberIdLabel: string;
  binLabel: string;
  payAsLittle: string;
}

export const CouponContent: ICouponContentProps = {
  groupNumberLabel: 'Group number',
  pcnLabel: 'PCN',
  memberIdLabel: 'Member ID',
  binLabel: 'BIN',
  payAsLittle: 'Pay as little as',
};
