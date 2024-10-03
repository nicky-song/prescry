// Copyright 2023 Prescryptive Health, Inc.

import fetch from 'node-fetch';
import { decode } from 'jsonwebtoken';
import { createHash } from 'crypto';

export abstract class AccountService {
  public static async updateEmail(props: {
    email: string;
    oldEmail: string;
    token: string;
    deviceToken: string;
  }): Promise<{ status: string; message: string }> {
    const { email, oldEmail, token, deviceToken } = props;
    const updateMailUri = `https://${process.env.MY_PRESCRYPTIVE_URL}/api/account/email/update`;
    const body = JSON.stringify({
      email,
      oldEmail,
    });
    const response = await fetch(updateMailUri, {
      method: 'POST',
      headers: {
        Authorization: token,
        'x-prescryptive-device-token': deviceToken,
        'Content-Type': 'application/json',
        'x-version': 'v2',
      },
      body,
    });
    const json = await response.json();
    return json;
  }

  private static generateHash(pin: string, deviceToken: string) {
    const { deviceKey } = decode(deviceToken) as { deviceKey: string };
    const sha256Hash = createHash('sha256');
    sha256Hash.update(pin + deviceKey);
    return sha256Hash.digest('base64');
  }

  public static async updatePin(props: {
    newPin: string;
    oldPin: string;
    token: string;
    deviceToken: string;
  }): Promise<{ status: string; message: string }> {
    const { newPin, oldPin, token, deviceToken } = props;
    const updatePinUri = `https://${process.env.MY_PRESCRYPTIVE_URL}/api/account/pin/update`;
    const encryptedPinCurrent = AccountService.generateHash(
      newPin,
      deviceToken
    );
    const encryptedPinNew = AccountService.generateHash(oldPin, deviceToken);
    const body = JSON.stringify({
      encryptedPinCurrent,
      encryptedPinNew,
    });
    const response = await fetch(updatePinUri, {
      method: 'POST',
      headers: {
        Authorization: token,
        'x-prescryptive-device-token': deviceToken,
        'Content-Type': 'application/json',
        'x-version': 'v2',
      },
      body,
    });
    const json = await response.json();
    return json;
  }

  private static readonly favoritedPharmaciesUri = `https://${process.env.MY_PRESCRYPTIVE_URL}/api/account/favorited-pharmacies`;

  public static async getFavoritedPharmacies(props: {
    token: string;
    deviceToken: string;
  }) {
    const { token, deviceToken } = props;
    const response = await fetch(this.favoritedPharmaciesUri, {
      method: 'GET',
      headers: {
        Authorization: token,
        'x-prescryptive-device-token': deviceToken,
      },
    });
    const json = await response.json();
    return json;
  }

  public static async setFavoritedPharmacies(props: {
    favoritedPharmacies: string[];
    token: string;
    deviceToken: string;
  }) {
    const { favoritedPharmacies, token, deviceToken } = props;
    const response = await fetch(this.favoritedPharmaciesUri, {
      method: 'POST',
      headers: {
        Authorization: token,
        'x-prescryptive-device-token': deviceToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ favoritedPharmacies }),
    });
    const json = await response.json();
    return json;
  }
}
