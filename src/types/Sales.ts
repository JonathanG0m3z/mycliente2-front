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
  };
};
