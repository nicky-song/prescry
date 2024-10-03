// Copyright 2021 Prescryptive Health, Inc.

import { IPrescriptionPharmacy } from '../models/platform/pharmacy-lookup.response';

export const prescriptionPharmacyMock1: IPrescriptionPharmacy = {
  address: {
    city: 'BELLEVUE',
    lineOne: '10116 NE 8TH STREET',
    lineTwo: '',
    state: 'WA',
    zip: '98004',
  },
  email: 'RX40@BARTELLDRUGS.COM',
  hasDriveThru: false,
  hours: [
    {
      closes: {
        hours: 7,
        minutes: 0,
        pm: true,
      },
      day: 'Sun',
      opens: {
        hours: 9,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
      day: 'Mon',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
      day: 'Tue',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
      day: 'Wed',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
      day: 'Thu',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
      day: 'Fri',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 7,
        minutes: 0,
        pm: true,
      },
      day: 'Sat',
      opens: {
        hours: 9,
        minutes: 0,
        pm: false,
      },
    },
  ],
  name: 'BARTELL DRUGS #40',
  ncpdp: '4902234',
  phone: '4254542468',
  type: 'retail',
  distanceFromSearchPointInMiles: 30.4567,
  twentyFourHours: false,
  inNetwork: true,
};

export const prescriptionPharmacyMock2: IPrescriptionPharmacy = {
  address: {
    city: 'BELLEVUE',
    lineOne: '120 106TH AVENUE NORTHEAST',
    lineTwo: '',
    state: 'WA',
    zip: '98004',
  },
  email: '',
  hasDriveThru: false,
  hours: [
    {
      closes: {
        hours: 6,
        minutes: 0,
        pm: true,
      },
      day: 'Sun',
      opens: {
        hours: 10,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 8,
        minutes: 0,
        pm: true,
      },
      day: 'Mon',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 8,
        minutes: 0,
        pm: true,
      },
      day: 'Tue',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 8,
        minutes: 0,
        pm: true,
      },
      day: 'Wed',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 8,
        minutes: 0,
        pm: true,
      },
      day: 'Thu',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 8,
        minutes: 0,
        pm: true,
      },
      day: 'Fri',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
    },
    {
      closes: {
        hours: 6,
        minutes: 0,
        pm: true,
      },
      day: 'Sat',
      opens: {
        hours: 9,
        minutes: 0,
        pm: false,
      },
    },
  ],
  name: 'RITE AID PHARMACY # 05176',
  ncpdp: '4921575',
  phone: '4254546513',
  type: 'retail',
  distanceFromSearchPointInMiles: 35.005,
  twentyFourHours: false,
};

export const prescriptionPharmacyMock3: IPrescriptionPharmacy = {
  address: {
    city: 'REDMOND',
    lineOne: '655 NW GREENWOOD AVE STE 1',
    lineTwo: '',
    state: 'OR',
    zip: '977561672',
  },
  email: 'JOHNCOOPER53@GMAIL.COM',
  hours: [
    {
      day: 'Sun',
    },
    {
      day: 'Mon',
      opens: {
        hours: 9,
        minutes: 0,
        pm: false,
      },
      closes: {
        hours: 5,
        minutes: 30,
        pm: true,
      },
    },
    {
      day: 'Tue',
      opens: {
        hours: 9,
        minutes: 0,
        pm: false,
      },
      closes: {
        hours: 5,
        minutes: 30,
        pm: true,
      },
    },
    {
      day: 'Wed',
      opens: {
        hours: 9,
        minutes: 0,
        pm: false,
      },
      closes: {
        hours: 5,
        minutes: 30,
        pm: true,
      },
    },
    {
      day: 'Thu',
      opens: {
        hours: 9,
        minutes: 0,
        pm: false,
      },
      closes: {
        hours: 5,
        minutes: 30,
        pm: true,
      },
    },
    {
      day: 'Fri',
      opens: {
        hours: 9,
        minutes: 0,
        pm: false,
      },
      closes: {
        hours: 5,
        minutes: 30,
        pm: true,
      },
    },
    {
      day: 'Sat',
    },
  ],
  name: 'CENTRAL OREGON PHARMACY AND COMPOUNDING',
  nationalProviderIdentifier: '1023483823',
  ncpdp: '3845798',
  phone: '5415481066',
  fax: '5415481067',
  type: 'retail',
  twentyFourHours: false,
  distanceFromSearchPointInMiles: 0,
};
export const prescriptionPharmacyMock4: IPrescriptionPharmacy = {
  address: {
    city: 'REDMOND',
    lineOne: '1450 S HWY 97',
    lineTwo: '',
    state: 'OR',
    zip: '977568864',
  },
  email: 'THIRDPARTYOPS@WALGREENS.COM',
  hours: [
    {
      day: 'Sun',
      opens: {
        hours: 10,
        minutes: 0,
        pm: false,
      },
      closes: {
        hours: 6,
        minutes: 0,
        pm: true,
      },
    },
    {
      day: 'Mon',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
    },
    {
      day: 'Tue',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
    },
    {
      day: 'Wed',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
    },
    {
      day: 'Thu',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
    },
    {
      day: 'Fri',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
    },
    {
      day: 'Sat',
      opens: {
        hours: 9,
        minutes: 0,
        pm: false,
      },
      closes: {
        hours: 6,
        minutes: 0,
        pm: true,
      },
    },
  ],
  name: 'WALGREENS #7971',
  nationalProviderIdentifier: '1043225030',
  ncpdp: '3815341',
  phone: '5415481731',
  fax: '5415485176',
  twentyFourHours: false,
  type: 'retail',
  inNetwork: true,
};

export const couponFeaturedPharmacyMock: IPrescriptionPharmacy = {
  address: {
    city: 'REDMOND',
    lineOne: '1450 S HWY 97',
    lineTwo: '',
    state: 'OR',
    zip: '977568864',
  },
  email: 'THIRDPARTYOPS@PREMIER.COM',
  hours: [
    {
      day: 'Sun',
      opens: {
        hours: 10,
        minutes: 0,
        pm: false,
      },
      closes: {
        hours: 6,
        minutes: 0,
        pm: true,
      },
    },
    {
      day: 'Mon',
      opens: {
        hours: 8,
        minutes: 0,
        pm: false,
      },
      closes: {
        hours: 10,
        minutes: 0,
        pm: true,
      },
    },
  ],
  name: 'PREMIER #7971',
  nationalProviderIdentifier: '1194274936',
  ncpdp: '0000002',
  phone: '5415481731',
  fax: '5415485176',
  twentyFourHours: false,
  type: 'retail',
  inNetwork: false,
};
