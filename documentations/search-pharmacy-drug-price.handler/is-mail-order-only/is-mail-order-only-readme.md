# isMailOrderOnly

<br />

**is-mail-order-only.ts:**<br />

Contains array of npis: `mailOrderPharmacyNPIs` (current values listed below)<br />
Contains array method `includes()` and checks if passed npi matches an npi in `mailOrderPharmacyNPIs`<br />

~As of October 5, 2021.~<br />

**Current Mail Order Only Pharmacies (NPIs):**<br />
```
  '1053486795',
  '1740639590',
  '1588753263',
  '1538529698',
  '1730515792',
  '1902195415',
  '1194274936',
```

<br />

# Functionality

<br />

If an npi is passed into `isMailOrderOnly(*npi*)`, it will return true if npi is defined and matches one of the npis in the mailOrderPharmacyNPIs array (current values listed above)

