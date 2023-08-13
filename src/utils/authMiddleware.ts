import { useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';

export interface TokenType {
  id: string;
  name: string;
  password: null;
  phone: null | string;
  email: string;
  picture: string | null;
  google_account: boolean;
  permission: null;
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
      Swal.fire({
        title: 'No se encontraron datos de sesión',
        text: 'Por favor ingresar',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        allowEnterKey: false,
        allowEscapeKey: false,
      }).then(() => {
        router.push('/login');
      });
      return;
    }

    const decodedToken: TokenType = jwt_decode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token');
      Swal.fire({
        title: 'Inicio de sesión expirado',
        text: 'Por favor ingresar de nuevo',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
        allowEnterKey: false,
        allowEscapeKey: false,
      }).then(() => {
        router.push('/login');
      });
    }
  }, []);
}
