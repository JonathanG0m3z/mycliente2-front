import { Alert, Avatar, Box, Button, Container, CssBaseline, Divider, Grid, InputLabel, Link, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { encryptValue } from '@/utils/cryptoHooks';
import dialCodes from '@/utils/dialCodes';
import { green } from '@mui/material/colors';
import QueryAutocomplete, { AutocompleteOptionType } from '@/components/QueryAutocomplete';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface SalesFormProps {
  handleCloseForm: () => void;
}

interface ClientsReponseType {
  name: string | null;
  phone?: string | null;
  id?: string | null;
  inputValue?: string;
}

interface AccountsReponseType {
  id?: string | null;
  email: string | null;
  inputValue?: string;
}

const SalesForm = ({ handleCloseForm }: SalesFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [selectedCode, setSelectedCode] = useState<string>(dialCodes[0].code);
  /***************CLIENT SELECT STATES */
  const [openClientSelect, setOpenClientSelect] = useState(false);
  const [inputClientValue, setInputClientValue] = useState<AutocompleteOptionType | null>(null);
  const [clientSelectOptions, setClientSelectOptions] = useState<AutocompleteOptionType[]>([]);
  const [loadingClientSelect, setLoadingClientSelect] = useState<boolean>(false);
  const [isNewClient, setIsNewClient] = useState<boolean>(false);
  /**************ACCOUNT SELECT STATATES */
  const [openAccountSelect, setOpenAccountSelect] = useState(false);
  const [inputAccountValue, setInputAccountValue] = useState<AutocompleteOptionType | null>(null);
  const [accountSelectOptions, setAccountSelectOptions] = useState<AutocompleteOptionType[]>([]);
  const [loadingAccountSelect, setLoadingAccountSelect] = useState<boolean>(false);
  const [isNewAccount, setIsNewAccount] = useState<boolean>(false);

  const handleChangeDial = (event: SelectChangeEvent<string>) => {
    setSelectedCode(event.target.value as string);
  };
  const onSubmit = (data: any) => {
    fetch(`${NEXT_PUBLIC_BACKEND_URL}users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        name: `${data.firstName} ${data.lastName}`,
        phone: `${selectedCode.replace(/\+/g, '')}${data.phone}`,
        password: encryptValue(data.password),
        passwordConfirm: true,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((res) => {
            handleCloseForm();
            Swal.fire({
              title: `${res.message}`,
              icon: 'success',
              customClass: {
                container: 'zindex-sweetalert',
              },
            });
          });
        } else {
          response.json().then((res) => {
            Swal.fire({
              title: 'Error al crear el usuario',
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

  React.useEffect(() => {
    if (openClientSelect) {
      setLoadingClientSelect(true);
      fetch(`${NEXT_PUBLIC_BACKEND_URL}clients/combobox`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${encryptValue(localStorage.getItem('token') ?? '')}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            response.json().then(({ clients }: { clients: ClientsReponseType[] }) => {
              setClientSelectOptions(
                clients.map((client) => {
                  return {
                    label: client.name,
                    id: client.id,
                  };
                })
              );
            });
          } else {
            response.json().then((res) => {
              Swal.fire({
                title: 'Token invalido',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                text: res.message,
                customClass: {
                  container: 'zindex-sweetalert',
                },
              });
            });
          }
          setLoadingClientSelect(false);
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
          setLoadingClientSelect(false);
        });
    }
  }, [openClientSelect]);
  React.useEffect(() => {
    if (openAccountSelect) {
      setLoadingAccountSelect(true);
      fetch(`${NEXT_PUBLIC_BACKEND_URL}accounts/combobox`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${encryptValue(localStorage.getItem('token') ?? '')}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            response.json().then(({ accounts }: { accounts: AccountsReponseType[] }) => {
              setAccountSelectOptions(
                accounts.map((account) => {
                  return {
                    label: account.email,
                    id: account.id,
                  };
                })
              );
            });
          } else {
            response.json().then((res) => {
              Swal.fire({
                title: 'Token invalido',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                text: res.message,
                customClass: {
                  container: 'zindex-sweetalert',
                },
              });
            });
          }
          setLoadingAccountSelect(false);
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
          setLoadingAccountSelect(false);
        });
    }
  }, [openAccountSelect]);
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: green[500] }}>
          <AttachMoneyOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registrar nueva venta
        </Typography>
        <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <QueryAutocomplete
                inputValue={inputClientValue}
                setInputValue={setInputClientValue}
                options={clientSelectOptions}
                setIsNewValue={setIsNewClient}
                loading={loadingClientSelect}
                open={openClientSelect}
                setOpen={setOpenClientSelect}
                placeholder="Nombre del cliente"
              />
            </Grid>
            {isNewClient ? (
              <>
                <Grid item xs={12}>
                  <InputLabel id="dial-code-label">País</InputLabel>
                  <Select fullWidth labelId="dial-code-label" id="dial-code" value={selectedCode} label="País" onChange={handleChangeDial}>
                    {dialCodes.map((item) => (
                      <MenuItem key={item.code} value={item.code}>
                        {item.country} - {item.code}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    helperText={`${errors.phone?.message || ''}`}
                    error={!!errors.phone}
                    {...register('phone', { required: false, pattern: { value: /^[0-9]+$/, message: 'El número de teléfono debe contener solo dígitos' } })}
                    fullWidth
                    id="phone"
                    label="Número telefónico"
                    type="number"
                    name="phone"
                    autoComplete="phone"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    helperText={`${errors.email?.message || ''}`}
                    error={!!errors.email}
                    {...register('email', { required: false, pattern: { value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'Dirección email invalida' } })}
                    fullWidth
                    id="email"
                    label="Correo electrónico del cliente"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Alert hidden={inputClientValue === null} severity="success">
                  Los datos de este cliente ya se encuentran almacenados
                </Alert>
              </Grid>
            )}
            <Grid item xs={12} sm={12}>
              <QueryAutocomplete
                inputValue={inputAccountValue}
                setInputValue={setInputAccountValue}
                options={accountSelectOptions}
                setIsNewValue={setIsNewAccount}
                loading={loadingAccountSelect}
                open={openAccountSelect}
                setOpen={setOpenAccountSelect}
                placeholder="Email de la cuenta"
              />
            </Grid>
            {isNewAccount ? (
              <>
                <Grid item xs={12}>
                  <InputLabel id="dial-code-label">País</InputLabel>
                  <Select fullWidth labelId="dial-code-label" id="dial-code" value={selectedCode} label="País" onChange={handleChangeDial}>
                    {dialCodes.map((item) => (
                      <MenuItem key={item.code} value={item.code}>
                        {item.country} - {item.code}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    helperText={`${errors.phone?.message || ''}`}
                    error={!!errors.phone}
                    {...register('phone', { required: false, pattern: { value: /^[0-9]+$/, message: 'El número de teléfono debe contener solo dígitos' } })}
                    fullWidth
                    id="phone"
                    label="Número telefónico"
                    type="number"
                    name="phone"
                    autoComplete="phone"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    helperText={`${errors.email?.message || ''}`}
                    error={!!errors.email}
                    {...register('email', { required: false, pattern: { value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'Dirección email invalida' } })}
                    fullWidth
                    id="email"
                    label="Correo electrónico del cliente"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Alert hidden={inputAccountValue === null} severity="success">
                  Los datos de esta cuenta ya se encuentran almacenados
                </Alert>
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                helperText={`${errors.lastName?.message || ''}`}
                error={!!errors.lastName}
                {...register('lastName', { required: 'Este campo es requerido', pattern: { value: /^[A-ZÁÉÍÓÚÜÑ]/, message: 'Los apellidos deben iniciar en mayúsculas' } })}
                fullWidth
                id="lastName"
                label="Apellidos"
                name="lastName"
                autoComplete="lastname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                helperText={`${errors.password?.message || ''}`}
                error={!!errors.password}
                {...register('password', {
                  required: 'Este campo es requerido',
                  pattern: { value: /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]+$/, message: 'La contraseña debe contener al menos una mayúscula, un número y un carácter especial' },
                  minLength: { value: 6, message: 'La contraseña debe ser de almenos 6 caracteres' },
                })}
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
              />
            </Grid>
            {/* <Grid item xs={12}>
              <FormControlLabel control={<Checkbox value="allowExtraEmails" color="primary" />} label="I want to receive inspiration, marketing promotions and updates via email." />
            </Grid> */}
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Crear
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link onClick={handleCloseForm} href="#" variant="body2">
                ¿Ya tienes una cuenta? Ingresa
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SalesForm;
