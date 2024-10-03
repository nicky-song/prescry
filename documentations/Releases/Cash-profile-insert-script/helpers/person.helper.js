// Copyright 2021 Prescryptive Health, Inc.

export const searchCashPersonForPhoneNumber = async (
  dbConn,
  databaseName,
  phoneNumber
) => {
  return new Promise((resolve, reject) => {
    dbConn
      .db(databaseName)
      .collection('Person')
      .find(
        {
          $and: [{ rxGroupType: 'CASH' }, { phoneNumber: phoneNumber }],
        },
        'identifier firstName lastName dateOfBirth phoneNumber rxGroupType'
      )
      .toArray((err, persons) => {
        if (err) reject(err);
        resolve(persons);
      });
  }).catch((ex) => {
    console.log(ex);
    throw ex;
  });
};
