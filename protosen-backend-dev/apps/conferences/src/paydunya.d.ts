declare module 'paydunya' {
  export interface PayDunyaSetupOptions {
    masterKey?: string;
    privateKey?: string;
    token?: string;
    mode?: 'test' | 'live';
  }

  export class Setup {
    constructor(data?: PayDunyaSetupOptions);
    config: Record<string, string>;
    baseURL: string;
  }

  export interface PayDunyaStoreOptions {
    name: string;
    tagline?: string;
    phoneNumber?: string;
    postalAddress?: string;
    logoURL?: string;
    websiteURL?: string;
    cancelURL?: string;
    returnURL?: string;
    callbackURL?: string;
  }

  export class Store {
    constructor(data: PayDunyaStoreOptions);
    name: string;
    tagline?: string;
    phone_number?: string;
    postal_address?: string;
    logo_url?: string;
    website_url?: string;
    cancel_url?: string;
    return_url?: string;
    callback_url?: string;
  }

  interface InvoiceItem {
    name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    description?: string;
  }

  interface TaxItem {
    name: string;
    amount: number;
  }

  export class Invoice {
    constructor(setup: Setup, store: Store);
    baseURL: string;
    config: Record<string, string>;
    store: Store;
    description: string;
    items: Record<string, InvoiceItem>;
    customData: Record<string, string>;
    taxes: Record<string, TaxItem>;
    channels: string[];
    totalAmount: number;

    addItem(
      name: string,
      quantity: number,
      unitPrice: number,
      totalPrice: number,
      description?: string,
    ): void;

    addTax(name: string, amount: number): void;

    addChannel(channel: string): void;

    addChannels(channels: string[]): void;

    addCustomData(title: string, value: string): void;

    generateRequestBody(): any;
  }

  export class CheckoutInvoice extends Invoice {
    token?: string;
    url?: string;
    status?: string;
    responseText?: string;
    customer?: any;
    receiptURL?: string;
    receipt_identifier?: string;
    provider_reference?: string;

    constructor(setup: Setup, store: Store);

    create(): Promise<void>;

    confirm(givenToken?: string): Promise<void>;
  }

  export class OnsiteInvoice extends Invoice {
    token?: string;
    oprToken?: string;
    responseText?: string;
    status?: string;
    receiptURL?: string;
    customer?: any;

    constructor(setup: Setup, store: Store);

    create(customer: string): Promise<void>;

    charge(oprToken: string, confirmToken: string): Promise<void>;
  }

  export class DirectPay {
    config: Record<string, string>;
    baseURL: string;
    responseText?: string;
    description?: string;
    transactionID?: string;

    constructor(setup: Setup);

    creditAccount(account: string, amount: number): Promise<void>;
  }

  export const setup: typeof Setup;
  export const store: typeof Store;
  export const checkoutInvoice: typeof CheckoutInvoice;
  export const onsiteInvoice: typeof OnsiteInvoice;
  export const directPay: typeof DirectPay;
}
