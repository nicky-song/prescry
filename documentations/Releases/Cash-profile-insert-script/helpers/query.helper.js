// Copyright 2021 Prescryptive Health, Inc.

export const aggregateQuery = async (dbConn, databaseName) => {
  dbConn.db(databaseName).Account.aggregate([
    // Stage 1: Filter the account that has date of birth
    {
      $match: { dateOfBirth: { $exists: true } },
    },
    //Find all persons with matching phone number
    {
      $lookup: {
        from: 'Person',
        localField: 'phoneNumber',
        foreignField: 'phoneNumber',
        as: 'persons',
      },
    },
    // Filter the persons which has the CASH profile, assign personAllCount to have total Person profile
    {
      $project: {
        firstName: 1,
        lastName: 1,
        dateOfBirth: 1,
        phoneNumber: 1,
        recoveryEmail: 1,
        persons: 1,
        personAllCount: { $size: '$persons' },
        personsCash: {
          $filter: {
            input: '$persons',
            as: 'persons_field',
            cond: {
              $eq: ['$$persons_field.rxGroupType', 'CASH'],
            },
          },
        },
      },
    },
    //Now project the personCash and calculate personCashCount
    {
      $project: {
        firstName: 1,
        lastName: 1,
        dateOfBirth: 1,
        phoneNumber: 1,
        recoveryEmail: 1,
        personsCash: 1,
        personAllCount: 1,
        personsCashCount: { $size: '$personsCash' },
      },
    },
    //Now filter the ones where cashCount is 0
    {
      $match: { personsCashCount: 0 },
    },
    //Now project the all we have
    {
      $project: {
        _id: 0,
        firstName: 1,
        lastName: 1,
        dateOfBirth: 1,
        phoneNumber: 1,
        recoveryEmail: 1,
        personsCash: 0,
        personAllCount: 0,
        personsCashCount: 0,
      },
    },
  ]);
};

const nonAggregareQuery = (dbConn, databaseName) => {
  // Get all account records where user has registered
  var allRegisteredAccountRecords = dbConn
    .db(databaseName)
    .Account.find({ dateOfBirth: { $exists: true } });

  print('PHONE NUMBER, PROFILES');

  allRegisteredAccountRecords.forEach((acc) => {
    var acctPhoneNumber = acc.phoneNumber;

    // Find if CASH record exists
    var cashPersonRecord = client
      .db(process.argv[5])
      .Person.findOne({ phoneNumber: acctPhoneNumber, rxGroupType: 'CASH' });

    if (!cashPersonRecord) {
      // Check if this user has a PBM profile
      var siePersonRecord = client
        .db(process.argv[5])
        .Person.findOne({ phoneNumber: acctPhoneNumber, rxGroupType: 'SIE' });
      if (!siePersonRecord) {
        print(acctPhoneNumber+ ', NO PROFILE');
      } else {
        print(acctPhoneNumber+ ', SIE PROFILE');
      }
    }
  });
};
