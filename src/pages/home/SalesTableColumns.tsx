import { Sale } from '@/types/Sales';
import { decryptValue } from '@/utils/cryptoHooks';
import { MoreVert } from '@mui/icons-material';
import { Chip, IconButton, Tooltip } from '@mui/material';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React from 'react';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Swal from 'sweetalert2';

const YOUTUBE_ACTIVATION = 'Activación youtube';

const ChipColors: any = {
  '-3': 'error',
  '-2': 'error',
  '-1': 'error',
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'warning',
  4: 'info',
};

interface SalesTableColumnsProps {
  // eslint-disable-next-line no-unused-vars
  openMenu: (event: React.MouseEvent<HTMLButtonElement>, record: Sale) => void;
  isMenuOpen: boolean;
}

const onClickSendReminder = (record: Sale) => {
  if (!record.client.phone) {
    Swal.fire({
      title: 'No se puede enviar recordatorio',
      text: 'El cliente no tiene un teléfono registrado',
      icon: 'error',
      confirmButtonText: 'Aceptar',
    });
    return;
  }
  let url = '';
  if (moment(record.expiration).diff(moment(), 'days') >= 0) {
    url = `https://api.whatsapp.com/send?phone=${record.client.phone}&text=Hola%20${record.client.name}%20👋%2C%0Apaso%20a%20recordarte%20que%20a%20tú%20servicio%20de%20${
      record.account.service.name
    }%20con%20${!record.account.service.name.includes(YOUTUBE_ACTIVATION) ? `cuenta:%20${record.account.email}` : `correo:%20${record.client.email}`} %20le%20quedan%20${moment(record.expiration).diff(
      moment(),
      'days'
    )}%20días%20para%20vencer.%20🗓${moment(record.expiration).format(
      'DD/MM/YYYY'
    )}.%20Queremos%20seguir%20brindandote%20el%20servicio%20así%20que%20cuentanos%2C%20¿te%20gustaría%20renovar%20u%20obtener%20una%20nueva%20cuenta%3F.%20😃`;
  } else {
    url = `https://api.whatsapp.com/send?phone=${record.client.phone}&text=🚨SUSCRIPCIÓN%20VENCIDA%20🚨%0AHola%20${
      record.client.name
    }%20👋%2C%0Apaso%20a%20recordarte%20que%20a%20tú%20servicio%20de%20Netflix%20con%20${
      !record.account.service.name.includes(YOUTUBE_ACTIVATION) ? `cuenta:%20${record.account.email}` : `correo:%20${record.client.email}`
    }%20venció%20el%20pasado%2006%2F11%2F2023%20.%20Queremos%20seguir%20brindandote%20el%20servicio%20así%20que%20cuentanos%2C%20¿te%20gustaría%20renovar%20u%20obtener%20una%20nueva%20cuenta%3F.%20😃`;
  }
  window.open(url, '_blank');
};
// eslint-disable-next-line no-unused-vars
const SalesTableColumns: (props: SalesTableColumnsProps) => ColumnsType<Sale> = ({ openMenu, isMenuOpen }: SalesTableColumnsProps) => [
  {
    title: 'Nombre',
    dataIndex: ['client', 'name'],
    key: 'client',
    align: 'center',
  },
  {
    title: 'Días restantes',
    dataIndex: 'expiration',
    key: 'expiration',
    align: 'center',
    render: (expiration: string, record) => {
      const daysRemaining = moment(expiration).diff(moment(), 'days');
      if (daysRemaining >= 5) return daysRemaining;
      else
        return (
          <Chip
            label={daysRemaining}
            variant={daysRemaining >= 1 ? 'outlined' : 'filled'}
            icon={
              <Tooltip title="Envíar recordatorio Whatsapp">
                <IconButton onClick={() => onClickSendReminder(record)}>
                  <WhatsAppIcon />
                </IconButton>
              </Tooltip>
            }
            color={ChipColors[daysRemaining] ?? 'success'}
          />
        );
    },
  },
  {
    title: 'Fecha de vencimiento',
    dataIndex: 'expiration',
    key: 'expiration',
    align: 'center',
    render: (expiration: string) => moment(expiration).format('DD/MM/YYYY'),
  },
  {
    title: 'Servicio',
    dataIndex: ['account', 'service', 'name'],
    key: 'service',
    align: 'center',
  },
  {
    title: 'Perfil',
    dataIndex: 'profile',
    key: 'profile',
    align: 'center',
  },
  {
    title: 'PIN',
    dataIndex: 'pin',
    key: 'pin',
    align: 'center',
  },
  {
    title: 'Email cuenta',
    dataIndex: ['account', 'email'],
    key: 'account',
    align: 'center',
  },
  {
    title: 'Contraseña',
    dataIndex: ['account', 'password'],
    key: 'account',
    align: 'center',
    render: (password: string) => decryptValue(password),
  },
  {
    title: 'Email cliente',
    dataIndex: ['client', 'email'],
    key: 'client',
    align: 'center',
  },
  {
    title: 'Teléfono cliente',
    dataIndex: ['client', 'phone'],
    key: 'client',
    align: 'center',
  },
  {
    title: 'Acciones',
    dataIndex: 'id',
    key: 'record',
    align: 'center',
    render: (_, record: Sale) => (
      <>
        <Tooltip title="Opciones">
          <IconButton
            color="primary"
            aria-label="Opciones"
            aria-controls={isMenuOpen ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={isMenuOpen ? 'true' : undefined}
            onClick={(event) => openMenu(event, record)}
          >
            <MoreVert />
          </IconButton>
        </Tooltip>
      </>
    ),
  },
];

export default SalesTableColumns;
