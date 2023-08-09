import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';

export interface TokenType {
  id: string;
  name: string;
  password: string;
  phone: string;
  email: string;
  permission: null | string;
  createdAt: string;
  updatedAt: string;
  iat: number;
  exp: number;
}

export function useAuthMiddleware() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const decodedToken: TokenType = jwt_decode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, []);
}
