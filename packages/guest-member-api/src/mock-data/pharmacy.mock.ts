// Copyright 2021 Prescryptive Health, Inc.

import { IPharmacy } from '@phx/common/src/models/pharmacy';

export const pharmacyMock1: IPharmacy = {
  address: {
    city: 'BELLEVUE',
    lineOne: '10116 NE 8TH STREET',
    lineTwo: '',
    state: 'WA',
    zip: '98004',
  },
  hours: [
    {
      closes: {
        h: 7,
        m: 0,
        pm: true,
      },
      day: 'Sun',
      opens: {
        h: 9,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
      day: 'Mon',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
      day: 'Tue',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
      day: 'Wed',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
      day: 'Thu',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
      day: 'Fri',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 7,
        m: 0,
        pm: true,
      },
      day: 'Sat',
      opens: {
        h: 9,
        m: 0,
        pm: false,
      },
    },
  ],
  name: 'BARTELL DRUGS #40',
  ncpdp: '4902234',
  phoneNumber: '4254542468',
  twentyFourHours: false,
  distance: 30.46,
  isMailOrderOnly: false,
  inNetwork: true,
};

export const pharmacyMock2: IPharmacy = {
  address: {
    city: 'BELLEVUE',
    lineOne: '120 106TH AVENUE NORTHEAST',
    lineTwo: '',
    state: 'WA',
    zip: '98004',
  },
  hours: [
    {
      closes: {
        h: 6,
        m: 0,
        pm: true,
      },
      day: 'Sun',
      opens: {
        h: 10,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 8,
        m: 0,
        pm: true,
      },
      day: 'Mon',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 8,
        m: 0,
        pm: true,
      },
      day: 'Tue',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 8,
        m: 0,
        pm: true,
      },
      day: 'Wed',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 8,
        m: 0,
        pm: true,
      },
      day: 'Thu',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 8,
        m: 0,
        pm: true,
      },
      day: 'Fri',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 6,
        m: 0,
        pm: true,
      },
      day: 'Sat',
      opens: {
        h: 9,
        m: 0,
        pm: false,
      },
    },
  ],
  name: 'RITE AID PHARMACY # 05176',
  ncpdp: '4921575',
  phoneNumber: '4254546513',
  twentyFourHours: false,
  distance: 35.01,
  isMailOrderOnly: false,
};

export const pharmacyMock3: IPharmacy = {
  address: {
    city: 'REDMOND',
    lineOne: '655 NW GREENWOOD AVE STE 1',
    lineTwo: '',
    state: 'OR',
    zip: '977561672',
  },
  hours: [
    {
      day: 'Sun',
    },
    {
      day: 'Mon',
      opens: {
        h: 9,
        m: 0,
        pm: false,
      },
      closes: {
        h: 5,
        m: 30,
        pm: true,
      },
    },
    {
      day: 'Tue',
      opens: {
        h: 9,
        m: 0,
        pm: false,
      },
      closes: {
        h: 5,
        m: 30,
        pm: true,
      },
    },
    {
      day: 'Wed',
      opens: {
        h: 9,
        m: 0,
        pm: false,
      },
      closes: {
        h: 5,
        m: 30,
        pm: true,
      },
    },
    {
      day: 'Thu',
      opens: {
        h: 9,
        m: 0,
        pm: false,
      },
      closes: {
        h: 5,
        m: 30,
        pm: true,
      },
    },
    {
      day: 'Fri',
      opens: {
        h: 9,
        m: 0,
        pm: false,
      },
      closes: {
        h: 5,
        m: 30,
        pm: true,
      },
    },
    {
      day: 'Sat',
    },
  ],
  name: 'CENTRAL OREGON PHARMACY AND COMPOUNDING',
  ncpdp: '3845798',
  phoneNumber: '5415481066',
  twentyFourHours: false,
  distance: 0,
  isMailOrderOnly: false,
};

export const pharmacyMock4: IPharmacy = {
  address: {
    city: 'REDMOND',
    lineOne: '1450 S HWY 97',
    lineTwo: '',
    state: 'OR',
    zip: '977568864',
  },
  distance: undefined,
  hours: [
    {
      day: 'Sun',
      opens: {
        h: 10,
        m: 0,
        pm: false,
      },
      closes: {
        h: 6,
        m: 0,
        pm: true,
      },
    },
    {
      day: 'Mon',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
    },
    {
      day: 'Tue',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
    },
    {
      day: 'Wed',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
    },
    {
      day: 'Thu',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
    },
    {
      day: 'Fri',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
    },
    {
      day: 'Sat',
      opens: {
        h: 9,
        m: 0,
        pm: false,
      },
      closes: {
        h: 6,
        m: 0,
        pm: true,
      },
    },
  ],
  name: 'WALGREENS #7971',
  ncpdp: '3815341',
  phoneNumber: '5415481731',
  twentyFourHours: false,
  isMailOrderOnly: false,
  inNetwork: true,
};

export const pharmacyMock5: IPharmacy = {
  address: {
    city: 'BELLEVUE',
    lineOne: '10116 NE 8TH STREET',
    lineTwo: '',
    state: 'WA',
    zip: '98004',
  },
  hasDriveThru: false,
  hours: [
    {
      closes: {
        h: 7,
        m: 0,
        pm: true,
      },
      day: 'Sun',
      opens: {
        h: 9,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
      day: 'Mon',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
      day: 'Tue',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
      day: 'Wed',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
      day: 'Thu',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
      day: 'Fri',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 7,
        m: 0,
        pm: true,
      },
      day: 'Sat',
      opens: {
        h: 9,
        m: 0,
        pm: false,
      },
    },
  ],
  name: 'BARTELL DRUGS #40',
  ncpdp: '4902234',
  phoneNumber: '4254542468',
  type: 'retail',
  distance: 30.46,
  twentyFourHours: false,
  inNetwork: true,
  isMailOrderOnly: false,
  email: 'RX40@BARTELLDRUGS.COM',
};

export const pharmacyMock6: IPharmacy = {
  address: {
    city: 'BELLEVUE',
    lineOne: '120 106TH AVENUE NORTHEAST',
    lineTwo: '',
    state: 'WA',
    zip: '98004',
  },
  hasDriveThru: false,
  hours: [
    {
      closes: {
        h: 6,
        m: 0,
        pm: true,
      },
      day: 'Sun',
      opens: {
        h: 10,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 8,
        m: 0,
        pm: true,
      },
      day: 'Mon',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 8,
        m: 0,
        pm: true,
      },
      day: 'Tue',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 8,
        m: 0,
        pm: true,
      },
      day: 'Wed',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 8,
        m: 0,
        pm: true,
      },
      day: 'Thu',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 8,
        m: 0,
        pm: true,
      },
      day: 'Fri',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
    },
    {
      closes: {
        h: 6,
        m: 0,
        pm: true,
      },
      day: 'Sat',
      opens: {
        h: 9,
        m: 0,
        pm: false,
      },
    },
  ],
  name: 'RITE AID PHARMACY # 05176',
  ncpdp: '4921575',
  phoneNumber: '4254546513',
  type: 'retail',
  distance: 35.01,
  twentyFourHours: false,
  isMailOrderOnly: false,
  email: '',
};

export const couponPharmacyMock: IPharmacy = {
  address: {
    city: 'REDMOND',
    lineOne: '1450 S HWY 97',
    lineTwo: '',
    state: 'OR',
    zip: '977568864',
  },
  distance: undefined,
  hours: [
    {
      day: 'Sun',
      opens: {
        h: 10,
        m: 0,
        pm: false,
      },
      closes: {
        h: 6,
        m: 0,
        pm: true,
      },
    },
    {
      day: 'Mon',
      opens: {
        h: 8,
        m: 0,
        pm: false,
      },
      closes: {
        h: 10,
        m: 0,
        pm: true,
      },
    },
  ],
  name: 'PREMIER #7971',
  ncpdp: '0000002',
  phoneNumber: '5415481731',
  twentyFourHours: false,
  isMailOrderOnly: true,
  inNetwork: false,
};
