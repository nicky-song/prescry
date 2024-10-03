# Security

> see the [README.md](./README.md) for Quick Start instructions

---

## TLS Encryption and Host Names

The PFX certificate for TLS Encryption and password for each environment is
stored in the keyvault. It is injected into the environment settings during the
release (like all other settings)

The Test enviroment uses a CERT for "https://test-api.prescryptive.io"

The Prod enviroment uses a CERT for "https://myrx.io"
