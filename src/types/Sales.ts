export type Sale = {
  id: number;
  price: number;
  expiration: string;
  profile: string;
  pin: string;
  accountId: number;
  userId: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  client: {
    name: string;
    phone: string;
    email: string;
  };
  account: {
    email: string;
    password: string;
    service: {
      name: string;
    };
  };
};

export type SaleTableResponse = {
  sales: Sale[];
  currentPage: string;
  totalPages: number;
  total: number;
};

export type AddSaleResponse = {
  message: string;
  sale: {
    id: number;
    userId: string;
    price: number;
    profile: string;
    pin: string;
    expiration: string;
    accountId: number;
    clientId: string;
    updatedAt: string;
    createdAt: string;
  };
  account: {
    id: number;
    email: string;
    password: string;
    expiration: string;
    profiles: number;
    serviceId: number;
    userId: string;
    service: {
      name: string;
    };
  };
  client: {
    id: string;
    name: string;
    phone: string;
    email: string;
    userId: string;
  };
};
