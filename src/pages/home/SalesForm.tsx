import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  createFilterOptions,
} from '@mui/material';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
// import { encryptValue } from '@/utils/cryptoHooks';
import dialCodes from '@/utils/dialCodes';
import { green } from '@mui/material/colors';
import QueryAutocomplete, { AutocompleteOptionType } from '@/components/QueryAutocomplete';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import 'moment/locale/es';
import { useLazyFetch } from '@/utils/useFetch';

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
interface ServicesReponseType {
  id: string;
  name: string;
}

const SalesForm = ({ handleCloseForm }: SalesFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const [selectedCode, setSelectedCode] = useState<string>(dialCodes[0].code);
  /***************CLIENT SELECT STATES */
  const [clientSelected, setClientSelected] = useState<AutocompleteOptionType | null>(null);
  const [isNewClient, setIsNewClient] = useState<boolean>(false);
  /**************ACCOUNT SELECT STATATES */
  const [accountSelected, setAccountSelected] = useState<AutocompleteOptionType | null>(null);
  const [isNewAccount, setIsNewAccount] = useState<boolean>(false);

  const filter = createFilterOptions<AutocompleteOptionType>();

  const handleChangeDial = (event: SelectChangeEvent<string>) => {
    setSelectedCode(event.target.value as string);
  };
  const onSubmit = (data: any) => {
    console.log(data);
  };

  const { data: dataClients, error: errorClient, loading: loadingClients, fetchApiData: getClients } = useLazyFetch();
  const { data: dataAccounts, error: errorAccount, loading: loadingAccounts, fetchApiData: getAccounts } = useLazyFetch();
  const { data: dataServices, error: errorService, loading: loadingServices, fetchApiData: getServices } = useLazyFetch();

  const onOpenClientsCombo = () => {
    getClients('clients/combobox', 'GET');
  };
  const onOpenAccountsCombo = () => {
    getAccounts('accounts/combobox', 'GET');
  };
  const onOpenServicesCombo = () => {
    getServices('services', 'GET');
  };
  React.useEffect(() => {
    if (errorClient !== null) {
      Swal.fire({
        title: 'Algo salió mal',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        text: errorClient.message,
        customClass: {
          container: 'zindex-sweetalert',
        },
      });
    }
  }, [errorClient]);
  React.useEffect(() => {
    if (errorAccount !== null) {
      Swal.fire({
        title: 'Algo salió mal',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        text: errorAccount.message,
        customClass: {
          container: 'zindex-sweetalert',
        },
      });
    }
  }, [errorAccount]);
  React.useEffect(() => {
    if (errorService !== null) {
      Swal.fire({
        title: 'Algo salió mal',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        text: errorService.message,
        customClass: {
          container: 'zindex-sweetalert',
        },
      });
    }
  }, [errorService]);
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
              <Controller
                name="client"
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                render={({ field }) => (
                  <QueryAutocomplete
                    {...field}
                    onChangeControl={(value) => field.onChange(value)}
                    optionSelected={clientSelected}
                    setOptionSelected={setClientSelected}
                    options={dataClients?.clients.map((client: ClientsReponseType) => {
                      return {
                        label: client.name,
                        id: client.id,
                      };
                    })}
                    setIsNewValue={setIsNewClient}
                    loading={loadingClients}
                    onOpen={onOpenClientsCombo}
                    renderInput={(params) => <TextField {...params} label="Nombre del cliente" helperText={`${errors.client?.message || ''}`} error={!!errors.client} />}
                  />
                )}
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
                <Alert hidden={clientSelected === null} severity="success">
                  Los datos de este cliente ya se encuentran almacenados
                </Alert>
              </Grid>
            )}
            <Grid item xs={12} sm={12}>
              <Controller
                name="account"
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                render={({ field }) => (
                  <QueryAutocomplete
                    {...field}
                    onChangeControl={(value) => field.onChange(value)}
                    optionSelected={accountSelected}
                    setOptionSelected={setAccountSelected}
                    options={dataAccounts?.accounts?.map((account: AccountsReponseType) => {
                      return {
                        label: account.email,
                        id: account.id,
                      };
                    })}
                    setIsNewValue={setIsNewAccount}
                    loading={loadingAccounts}
                    onOpen={onOpenAccountsCombo}
                    renderInput={(params) => <TextField {...params} label="Email de la cuenta" helperText={`${errors.account?.message || ''}`} error={!!errors.account} />}
                  />
                )}
              />
            </Grid>
            {isNewAccount ? (
              <>
                <Grid item xs={12}>
                  <Controller
                    name="service"
                    control={control}
                    rules={{ required: 'Este campo es requerido' }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        filterOptions={(options, params) => filter(options, params)}
                        onChange={(event, value) => field.onChange(value)}
                        options={
                          dataServices?.services?.map((service: ServicesReponseType) => {
                            return {
                              label: service.name,
                              id: service.id,
                            };
                          }) ?? []
                        }
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        renderOption={(props, option) => <li {...props}>{option.label}</li>}
                        loading={loadingServices}
                        fullWidth
                        onOpen={onOpenServicesCombo}
                        freeSolo
                        renderInput={(params) => <TextField {...params} label="Servicio" helperText={`${errors.service?.message || ''}`} error={!!errors.service} />}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    helperText={`${errors.account_pass?.message || ''}`}
                    error={!!errors.account_pass}
                    {...register('account_pass', { required: 'Este campo es requerido' })}
                    fullWidth
                    id="account_pass"
                    label="Contraseña de la cuenta*"
                    name="account_pass"
                    autoComplete="account_pass"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    helperText={`${errors.account_profiles?.message || ''}`}
                    error={!!errors.account_profiles}
                    {...register('account_profiles', { required: 'Este campo es requerido' })}
                    fullWidth
                    id="account_profiles"
                    label="Cantidad perfiles cuenta*"
                    type="number"
                    name="account_profiles"
                    autoComplete="account_profiles"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="accountExpiration"
                    control={control}
                    rules={{ required: 'Este campo es requerido' }}
                    defaultValue={moment().add(1, 'month')}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        onChange={(date) => {
                          field.onChange(date);
                          setValue('renewDate', date);
                        }}
                        label="Fecha expiración cuenta*"
                        format="LL"
                        disablePast
                        slotProps={{ textField: { fullWidth: true, helperText: `${errors.accountExpiration?.message || ''}` } }}
                      />
                    )}
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Alert hidden={accountSelected === null} severity="success">
                  Los datos de esta cuenta ya se encuentran almacenados
                </Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <Controller
                name="expiration"
                control={control}
                rules={{ required: 'Este campo es requerido' }}
                defaultValue={moment().add(1, 'month')}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    onChange={(date) => field.onChange(date)}
                    label="Fecha de renovación cliente*"
                    format="LL"
                    disablePast
                    slotProps={{ textField: { fullWidth: true, helperText: `${errors.expiration?.message || ''}` } }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                helperText={`${errors.profile?.message || ''}`}
                error={!!errors.profile}
                {...register('profile', {
                  required: false,
                })}
                fullWidth
                name="profile"
                label="Perfil (Opcional)"
                id="profile"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                helperText={`${errors.pin?.message || ''}`}
                error={!!errors.pin}
                {...register('pin', {
                  required: false,
                  pattern: { value: /^[0-9]+$/, message: 'El número de teléfono debe contener solo dígitos' },
                })}
                fullWidth
                name="pin"
                label="PIN (Opcional)"
                id="pin"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                helperText={`${errors.price?.message || ''}`}
                error={!!errors.price}
                {...register('price', {
                  required: 'Este campo es requerido',
                  pattern: { value: /^[0-9]+$/, message: 'El precio de venta debe contener solo dígitos' },
                })}
                fullWidth
                name="price"
                label="Precio de Venta"
                id="price"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MonetizationOnIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Button type="submit" color="success" fullWidth variant="outlined" sx={{ mt: 3, mb: 2 }}>
            Registrar
          </Button>
          <Button onClick={handleCloseForm} color="error" fullWidth variant="outlined">
            Cancelar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SalesForm;
