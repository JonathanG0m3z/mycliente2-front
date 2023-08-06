import { Avatar, Box, Button, Checkbox, Container, CssBaseline, FormControlLabel, Grid, InputLabel, Link, MenuItem, Select, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import React, { useState } from 'react';

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

const RegisterForm = () => {
  const handleSubmit = (values: any) => {
    console.log(values);
  };
  const [selectedCode, setSelectedCode] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCode(event.target.value as string);
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
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField autoComplete="given-name" name="firstName" required fullWidth id="firstName" label="Nombres" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth id="lastName" label="Apellidos" name="lastName" autoComplete="family-name" />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField required fullWidth id="username" label="Usuario" name="username" autoComplete="username" />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth id="email" label="Correo electrónico" name="email" autoComplete="email" />
            </Grid>
            <Grid item xs={12}>
              <InputLabel id="dial-code-label">País</InputLabel>
              <Select labelId="dial-code-label" id="dial-code" value={selectedCode} label="País" onChange={handleChange}>
                {dialCodes.map((item) => (
                  <MenuItem key={item.code} value={item.code}>
                    {item.country} - {item.code}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth id="phone" label="Numero telefónico" type="number" name="phone" autoComplete="phone" />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth name="password" label="Contraseña" type="password" id="password" autoComplete="new-password" />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth name="passwordConfirm" label="Confirmar contraseña" type="password" id="passwordConfirm" autoComplete="new-password" />
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
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterForm;
