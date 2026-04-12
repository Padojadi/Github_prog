import * as dotenv from 'dotenv';

dotenv.config();

import {
  Setup,
  Store,
  DirectPay,
  CheckoutInvoice,
  OnsiteInvoice,
} from 'paydunya';

const setup = new Setup({
  masterKey: process.env.PAYDUNYA_MASTER_KEY,
  privateKey: process.env.PAYDUNYA_PRIVATE_KEY,
  // publicKey: process.env.PAYDUNYA_PUBLIC_KEY,
  token: process.env.PAYDUNYA_TOKEN,
  mode: 'live', // Optionnel. Utilisez cette option pour les paiements tests.
});

// Configuration des informations de votre service/entreprise
const store = new Store({
  name: 'Protosen',
  websiteURL: process.env.APP_URL,
  callbackURL:
    process.env.NODE_ENV === 'production'
      ? 'https://protosenback.gouv.sn/v1/paydunya-callback'
      : 'https://protosendev.gouv.sn/conferences-api/v1/paydunya-callback',
});

export const checkout = new CheckoutInvoice(setup, store);

export const payout = new DirectPay(setup);

export const onsiteInvoice = new OnsiteInvoice(setup, store);
