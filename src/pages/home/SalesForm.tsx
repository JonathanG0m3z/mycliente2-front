import { Autocomplete, Avatar, Box, Button, Container, CssBaseline, Grid, InputLabel, Link, MenuItem, Select, SelectChangeEvent, TextField, Typography, createFilterOptions } from '@mui/material';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { encryptValue } from '@/utils/cryptoHooks';
import dialCodes from '@/utils/dialCodes';
import { green } from '@mui/material/colors';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface SalesFormProps {
  handleCloseForm: () => void;
}

interface OptionType {
  name: string | null;
  phone?: string | null;
  id?: string | null;
  email?: string | null;
  inputValue?: string;
}

const SalesForm = ({ handleCloseForm }: SalesFormProps) => {
  const filter = createFilterOptions<OptionType>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [selectedCode, setSelectedCode] = useState<string>(dialCodes[0].code);
  const [openNameSelect, setOpenNameSelect] = useState(false);
  const [inputNameValue, setInputNameValue] = useState<OptionType | null>(null);
  const [clientsSelectOptions, setClientsSelectOptions] = useState<OptionType[]>([]);
  const [loadingClientSelect, setLoadingClientSelect] = useState<boolean>(false);
  const [isNewClient, setIsNewClient] = useState<boolean>(false);

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
    if (openNameSelect) {
      setLoadingClientSelect(true);
      fetch(`${NEXT_PUBLIC_BACKEND_URL}clients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${encryptValue(localStorage.getItem('token') ?? '')}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              setClientsSelectOptions(data.clients);
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
  }, [openNameSelect]);
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
              <Autocomplete
                value={inputNameValue}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'string') {
                    setInputNameValue({
                      name: newValue,
                    });
                    setIsNewClient(true);
                  } else if (newValue && newValue.id) {
                    setInputNameValue({
                      ...newValue,
                    });
                    setIsNewClient(false);
                  } else if (newValue && newValue.inputValue) {
                    setInputNameValue({
                      name: newValue.inputValue,
                    });
                    setIsNewClient(true);
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const { inputValue } = params;
                  const isExisting = options.some((option) => inputValue === option.name);
                  if (inputValue !== '' && !isExisting) {
                    filtered.push({
                      inputValue,
                      name: `Agregar "${inputValue}"`,
                    });
                  }
                  return filtered;
                }}
                selectOnFocus
                loading={loadingClientSelect}
                clearOnBlur
                handleHomeEndKeys
                id="client-name"
                options={clientsSelectOptions}
                open={openNameSelect}
                onOpen={() => {
                  setOpenNameSelect(true);
                }}
                onClose={() => {
                  setOpenNameSelect(false);
                }}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') {
                    return option;
                  }
                  if (option.name) {
                    return option.name;
                  }
                  return option.name ?? '';
                }}
                renderOption={(props, option) => <li {...props}>{option.name}</li>}
                fullWidth
                freeSolo
                renderInput={(params) => <TextField {...params} label="Nombre del cliente" />}
              />
            </Grid>
            {isNewClient && (
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
              </>
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
