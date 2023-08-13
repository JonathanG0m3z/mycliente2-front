import { Box, Modal } from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import { useState, type FC, ChangeEvent, useEffect, FormEvent } from 'react';
import RegisterForm from './RegisterForm';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { TokenType } from '@/utils/authMiddleware';
import jwt_decode from 'jwt-decode';
import { decryptValue, encryptValue } from '@/utils/cryptoHooks';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '600px',
  width: '100%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface GoogleAuthData {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
  jti: string;
}

const Login: FC = () => {
  const router = useRouter();
  const [registerForm, setRegisterForm] = useState(false);
  const onClickRegister = () => setRegisterForm(true);
  const onClickCloseRegister = () => setRegisterForm(false);
  const [loginFormValues, setLoginFormValues] = useState({
    email: '',
    password: '',
  });
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const onChangeLoginValues = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginFormValues((prevState) => {
      return {
        ...prevState,
        [e.target.id]: e.target.value,
      };
    });
  };
  const onValidateData = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`${NEXT_PUBLIC_BACKEND_URL}users/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...loginFormValues,
        password: encryptValue(loginFormValues.password),
        keepLoggedIn,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((res) => {
            localStorage.setItem('token', decryptValue(res.token));
            router.push('/home');
          });
        } else {
          response.json().then((res) => {
            Swal.fire({
              title: 'Credenciales incorrectas',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              text: res.message,
              customClass: {
                container: 'zindex-sweetalert',
              },
            });
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: 'Algo salió mal',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          text: error.message,
          customClass: {
            container: 'zindex-sweetalert',
          },
        });
      });
  };

  const handleErrorGoogle = () => {
    Swal.fire({
      title: 'Algo salió mal',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      text: 'Algo salió mal con Google',
      customClass: {
        container: 'zindex-sweetalert',
      },
    });
  };
  const handleSuccesGoogle = (credentialResponse: CredentialResponse) => {
    const token: GoogleAuthData = jwt_decode(credentialResponse.credential ?? '');
    console.log('token:', token);
    fetch(`${NEXT_PUBLIC_BACKEND_URL}users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: token.name,
        email: token.email,
        picture: token.picture,
        password: encryptValue(token.sub),
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((res) => {
            localStorage.setItem('token', decryptValue(res.token));
            router.push('/home');
          });
        } else {
          response.json().then((res) => {
            Swal.fire({
              title: 'Credenciales incorrectas',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              text: res.message,
              customClass: {
                container: 'zindex-sweetalert',
              },
            });
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          title: 'Algo salió mal',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          text: error.message,
          customClass: {
            container: 'zindex-sweetalert',
          },
        });
      });
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: TokenType = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp > currentTime) {
        router.push('/home');
      }
    }
  }, []);
  return (
    <>
      <Head>
        <title>Ingresar a MyCliente</title>
      </Head>
      <div className="bg-white dark:bg-gray-900">
        <div className="flex justify-center h-screen">
          <div
            className="hidden bg-cover lg:block lg:w-2/3"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/5082567/pexels-photo-5082567.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
            }}
          >
            <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
              <div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">MyCliente2</h2>
                <p className="max-w-xl mt-3 text-gray-300">La mejor aplicación de registro de ventas para cuentas de streaming y entretenimiento. Estás a un paso de cambiar tu forma de trabajar.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
            <div className="flex-1">
              <div className="text-center">
                <div className="flex justify-center mx-auto">
                  <Image src="https://merakiui.com/images/logo.svg" alt="" width={1000} height={500} className="w-auto h-7 sm:h-8" />
                </div>
                <p className="mt-3 text-gray-500 dark:text-gray-300">Ingresa para acceder a tu cuenta</p>
              </div>
              <div className="mt-8">
                <form onSubmit={onValidateData}>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                      Correo electrónico
                    </label>
                    <input
                      value={loginFormValues.email}
                      onChange={onChangeLoginValues}
                      type="email"
                      name="email"
                      id="email"
                      required
                      placeholder="example@example.com"
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-indigo-400 dark:focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between mb-2">
                      <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-200">
                        Contraseña
                      </label>
                      <button className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline">¿Olvidaste tu contraseña?</button>
                    </div>
                    <input
                      value={loginFormValues.password}
                      onChange={onChangeLoginValues}
                      type="password"
                      name="password"
                      id="password"
                      required
                      className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-indigo-400 dark:focus:border-indigo-400 focus:ring-indigo-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    />
                  </div>
                  <div className="flex items-center justify-between my-4">
                    <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
                    <div className="flex items-center gap-x-2">
                      <input
                        type="checkbox"
                        id="keepLoggedIn"
                        className="text-indigo-500 border-gray-300 dark:border-gray-700 focus:ring-indigo-400"
                        checked={keepLoggedIn}
                        onChange={(e) => setKeepLoggedIn(e.target.checked)}
                      />
                      <label htmlFor="keepLoggedIn" className="text-sm text-gray-600 dark:text-gray-200">
                        Mantener sesión
                      </label>
                    </div>
                    <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-indigo-500 rounded-lg hover:bg-indigo-400 focus:outline-none focus:bg-indigo-400 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
                    >
                      Ingresar
                    </button>
                  </div>
                  <div className="flex items-center justify-between my-4">
                    <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
                    <button className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline">o ingresa con Gmail</button>
                    <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
                  </div>
                  <GoogleLogin useOneTap onError={handleErrorGoogle} onSuccess={handleSuccesGoogle} theme="filled_black" width="100%" />
                </form>
                <p className="mt-6 text-sm text-center text-gray-400">
                  ¿Aún no tienes una cuenta?{' '}
                  <button onClick={onClickRegister} className="text-blue-500 focus:outline-none focus:underline hover:underline">
                    Registrate con tu correo electrónico
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal open={registerForm} onClose={onClickCloseRegister} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <RegisterForm handleCloseForm={onClickCloseRegister} />
        </Box>
      </Modal>
    </>
  );
};

export default Login;
