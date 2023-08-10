import { Avatar, Box, Button, Container, CssBaseline, Grid, InputLabel, Link, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { encryptValue } from '@/utils/cryptoHooks';

const dialCodes = [
  { code: '+57', country: 'Colombia' },
  { code: '+54', country: 'Argentina' },
  { code: '+591', country: 'Bolivia' },
  { code: '+55', country: 'Brazil' },
  { code: '+56', country: 'Chile' },
  { code: '+506', country: 'Costa Rica' },
  { code: '+53', country: 'Cuba' },
  { code: '+1809', country: 'Dominican Republic' },
  { code: '+593', country: 'Ecuador' },
  { code: '+503', country: 'El Salvador' },
  { code: '+502', country: 'Guatemala' },
  { code: '+509', country: 'Haiti' },
  { code: '+504', country: 'Honduras' },
  { code: '+52', country: 'Mexico' },
  { code: '+505', country: 'Nicaragua' },
  { code: '+507', country: 'Panama' },
  { code: '+595', country: 'Paraguay' },
  { code: '+51', country: 'Peru' },
  { code: '+1', country: 'Puerto Rico' },
  { code: '+598', country: 'Uruguay' },
  { code: '+58', country: 'Venezuela' },
];

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface RegisterFormProps {
  handleCloseForm: () => void;
}

const RegisterForm = ({ handleCloseForm }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [selectedCode, setSelectedCode] = useState<string>(dialCodes[0].code);
  const password = React.useRef({});
  password.current = watch('password', '');

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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Crear cuenta
        </Typography>
        <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                helperText={`${errors.firstName?.message || ''}`}
                error={!!errors.firstName}
                {...register('firstName', { required: 'Este campo es requerido', pattern: { value: /^[A-ZÁÉÍÓÚÜÑ]/, message: 'Los nombres deben iniciar en mayúsculas' } })}
                autoComplete="name"
                name="firstName"
                fullWidth
                id="firstName"
                label="Nombres"
              />
            </Grid>
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
                helperText={`${errors.email?.message || ''}`}
                error={!!errors.email}
                {...register('email', { required: 'Este campo es requerido', pattern: { value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'Dirección email invalida' } })}
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                autoComplete="email"
              />
            </Grid>
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
                {...register('phone', { required: 'Este campo es requerido', pattern: { value: /^[0-9]+$/, message: 'El número de teléfono debe contener solo dígitos' } })}
                fullWidth
                id="phone"
                label="Numero telefónico"
                type="number"
                name="phone"
                autoComplete="phone"
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
            <Grid item xs={12}>
              <TextField
                helperText={`${errors.passwordConfirm?.message || ''}`}
                error={!!errors.passwordConfirm}
                {...register('passwordConfirm', {
                  required: 'Este campo es requerido',
                  validate: (value) => value === password.current || 'Las contraseñas no coinciden',
                })}
                fullWidth
                name="passwordConfirm"
                label="Confirmar contraseña"
                type="password"
                id="passwordConfirm"
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

export default RegisterForm;
