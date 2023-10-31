import { Sale } from '@/types/Sales';
import { decryptValue } from '@/utils/cryptoHooks';
import { MoreVert } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React from 'react';

interface SalesTableColumnsProps {
  // eslint-disable-next-line no-unused-vars
  openMenu: (event: React.MouseEvent<HTMLButtonElement>, record: Sale) => void;
  isMenuOpen: boolean;
}
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
    render: (expiration: string) => {
      const daysRemaining = moment(expiration).diff(moment(), 'days');
      return daysRemaining;
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
