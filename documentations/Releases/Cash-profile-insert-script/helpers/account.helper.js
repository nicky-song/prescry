// Copyright 2021 Prescryptive Health, Inc.

export const searchAccountWithDateOfBirth = async (
  dbConn,
  databaseName,
  skip,
  limit
) => {
  return new Promise((resolve, reject) => {
    dbConn
      .db(databaseName)
      .collection('Account')
      .find(
        { dateOfBirth: { $exists: true } },
        'firstName lastName dateOfBirth phoneNumber recoveryEmail'
      )
      .skip(skip)
      .limit(limit)
      .toArray((err, accounts) => {
        if (err) {
          reject(err);
        }
        resolve(accounts);
      });
  }).catch((ex) => {
    console.log(ex);
    throw ex;
  });
};
