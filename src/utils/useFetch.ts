import { useState, useEffect, useCallback } from 'react';
import { encryptValue } from './cryptoHooks';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useFetch = (endPoint: string, method: string, body: any = undefined) => {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const request = await fetch(`${NEXT_PUBLIC_BACKEND_URL}${endPoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${encryptValue(localStorage.getItem('token') ?? '')}`,
        },
        body: JSON.stringify(body),
      });
      if (request.status === 401) {
        Swal.fire({
          title: 'Token invalido',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          text: 'Favor iniciar sesión de nuevo',
          customClass: {
            container: 'zindex-sweetalert',
          },
        }).then(() => {
          localStorage.removeItem('token');
          router.push('/login');
        });
        return;
      }
      const response = await request.json();
      if (request.ok) {
        setData(response);
        setLoading(false);
      } else {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          text: response.message,
          customClass: {
            container: 'zindex-sweetalert',
          },
        });
      }
    } catch (err: any) {
      setError(err);
      setLoading(false);
    }
  }, [endPoint, method, body, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    setLoading(true);
    await fetchData();
    return data;
  }, [fetchData, data]);

  return { data, error, loading, refetch };
};

export const useLazyFetch = () => {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const fetchApiData = async (endPoint: string, method: string, body: any = undefined) => {
    try {
      const request = await fetch(`${NEXT_PUBLIC_BACKEND_URL}${endPoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${encryptValue(localStorage.getItem('token') ?? '')}`,
        },
        body: JSON.stringify(body),
      });
      if (request.status === 401) {
        Swal.fire({
          title: 'Token invalido',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          text: 'Favor iniciar sesión de nuevo',
          customClass: {
            container: 'zindex-sweetalert',
          },
        }).then(() => {
          localStorage.removeItem('token');
          router.push('/login');
        });
        return;
      }
      const response = await request.json();
      if (request.ok) {
        setData(response);
        setLoading(false);
      } else {
        Swal.fire({
          title: 'Error',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          text: response.message,
          customClass: {
            container: 'zindex-sweetalert',
          },
        });
      }
      return response;
    } catch (err: any) {
      setError(err);
      setLoading(false);
    }
  };

  return { data, error, loading, fetchApiData };
};
