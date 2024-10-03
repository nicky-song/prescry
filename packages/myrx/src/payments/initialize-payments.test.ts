// Copyright 2022 Prescryptive Health, Inc.

import { environments, initializePayments } from './initialize-payments';
import { loadStripe } from '@stripe/stripe-js';
import { GuestExperiencePayments } from '@phx/common/src/experiences/guest-experience/guest-experience-payments';
import { ICheckoutSessionInfo } from '@phx/common/src/models/api-response/create-booking-response';
import { IPaymentsConfig } from '@phx/common/src/experiences/guest-experience/guest-experience-config';

jest.mock(
  '@phx/common/src/experiences/guest-experience/guest-experience-payments',
  () => ({
    GuestExperiencePayments: {
      redirectToCheckout: null,
    },
  })
);

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(),
}));

const loadStripeMock = loadStripe as jest.Mock;
const original = GuestExperiencePayments.redirectToCheckout;

beforeEach(() => {
  GuestExperiencePayments.redirectToCheckout = original;
  loadStripeMock.mockReset();
});

describe('initializePayments', () => {
  it('initializePayments should start loadStripe', async () => {
    const configMock: IPaymentsConfig = {
      publicKey: 'public-key',
      testPublicKey: 'test-public-key',
      experienceBaseUrl: 'base-url',
    };

    environments.clear();
    const redirectToCheckout = jest.fn();
    loadStripeMock.mockResolvedValue({
      redirectToCheckout,
    });
    await initializePayments(configMock);
    expect(await environments.get(configMock.publicKey)).toMatchObject({
      redirectToCheckout,
    });
    expect(await environments.get(configMock.testPublicKey)).toMatchObject({
      redirectToCheckout,
    });
    expect(loadStripe).toHaveBeenNthCalledWith(1, configMock.publicKey);
    expect(loadStripe).toHaveBeenNthCalledWith(2, configMock.testPublicKey);
  });

  it('initializePayments should reassign redirectToCheckout', async () => {
    environments.clear();
    const redirectToCheckout = jest.fn();
    loadStripeMock.mockResolvedValue({
      redirectToCheckout,
    });
    const configMock: IPaymentsConfig = {
      publicKey: 'public-key',
      testPublicKey: 'test-public-key',
      experienceBaseUrl: 'base-url',
    };

    await initializePayments(configMock);
    expect(GuestExperiencePayments.redirectToCheckout).not.toBe(original);
  });

  describe('if stripe returns null then stripe.redirectToCheckout should throw error on redirect for each payMode key', () => {
    it('prod mode', async () => {
      environments.clear();
      loadStripeMock.mockResolvedValue(null);
      const configMock: IPaymentsConfig = {
        publicKey: 'public-key',
        testPublicKey: 'test-public-key',
        experienceBaseUrl: 'base-url',
      };

      await initializePayments(configMock);
      const session: ICheckoutSessionInfo = {
        sessionId: 'sessionId mock',
        publicKey: configMock.publicKey,
      } as ICheckoutSessionInfo;
      await expect(() =>
        GuestExperiencePayments.redirectToCheckout(session)
      ).rejects.toThrowError(
        `Unable to initialize payments: ${configMock.publicKey}`
      );
    });

    it('test mode', async () => {
      environments.clear();
      loadStripeMock.mockResolvedValue(null);
      const configMock: IPaymentsConfig = {
        publicKey: 'public-key',
        testPublicKey: 'test-public-key',
        experienceBaseUrl: 'base-url',
      };

      await initializePayments(configMock);
      const session: ICheckoutSessionInfo = {
        sessionId: 'sessionId mock',
        publicKey: configMock.testPublicKey,
      } as ICheckoutSessionInfo;
      await expect(() =>
        GuestExperiencePayments.redirectToCheckout(session)
      ).rejects.toThrowError(
        `Unable to initialize payments: ${configMock.testPublicKey}`
      );
    });
  });

  it('reassigned redirectToCheckout should execute stripe.redirectToCheckout', async () => {
    environments.clear();
    const redirectToCheckout = jest.fn();
    loadStripeMock.mockResolvedValue({
      redirectToCheckout,
    });
    const expected = 'mock error';
    redirectToCheckout.mockResolvedValue({ error: { message: expected } });
    const configMock: IPaymentsConfig = {
      publicKey: 'public-key',
      testPublicKey: 'test-public-key',
      experienceBaseUrl: 'base-url',
    };

    await initializePayments(configMock);
    const session: ICheckoutSessionInfo = {
      sessionId: 'sessionId mock',
      publicKey: configMock.publicKey,
    } as ICheckoutSessionInfo;
    await expect(() =>
      GuestExperiencePayments.redirectToCheckout(session)
    ).rejects.toThrowError('mock error');
    expect(redirectToCheckout).toHaveBeenNthCalledWith(1, {
      sessionId: session.sessionId,
    });
  });

  it('should use test public key when usepharmacy feature flag is true', async () => {
    environments.clear();
    const redirectToCheckout = jest.fn();
    loadStripeMock.mockResolvedValue({
      redirectToCheckout,
    });
    const configMock: IPaymentsConfig = {
      publicKey: 'public-key',
      testPublicKey: 'test-public-key',
      experienceBaseUrl: 'base-url',
    };

    await initializePayments(configMock);
    expect(loadStripe).toHaveBeenNthCalledWith(1, configMock.publicKey);
    expect(loadStripe).toHaveBeenNthCalledWith(2, configMock.testPublicKey);
  });
});
