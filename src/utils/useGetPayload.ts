import jwtDecode from 'jwt-decode';
import Swal from 'sweetalert2';
import { TokenType } from './authMiddleware';
import { useRouter } from 'next/router';

export const useGetPayload = () => {
  const router = useRouter();
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken: TokenType = jwtDecode(token);
    return decodedToken;
  } else {
    Swal.fire({
      title: 'Sesión expirada',
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
};
