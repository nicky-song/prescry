// Copyright 2022 Prescryptive Health, Inc.

export const getAllUsersByActivationPhoneNumberOrPhoneNumber = async (
  dbConn,
  databaseName,
  phoneNumbers,
  skip,
  limit
) => {
  return new Promise((resolve, reject) => {
    dbConn
      .db(databaseName)
      .collection('Person')
      .find({
        $or: [
          {
            activationPhoneNumber: { $in: phoneNumbers },
          },
          {
            phoneNumber: { $in: phoneNumbers },
          },
        ],
      })
      .skip(skip)
      .limit(limit)
      .toArray((err, users) => {
        if (err) {
          reject(err);
        }
        resolve(users);
      });
  }).catch((ex) => {
    console.log(ex);
    throw ex;
  });
};
