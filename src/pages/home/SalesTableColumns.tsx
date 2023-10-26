interface Column {
  id: string | string[];
  label: string;
  minWidth?: number;
  align?: 'right';
  // eslint-disable-next-line no-unused-vars
  format?: (value: number) => string;
}

const SalesTableColumns: () => readonly Column[] = () => [
  { id: ['client', 'name'], label: 'Nombre', minWidth: 170 },
  { id: 'code', label: 'Días restantes', minWidth: 100 },
  {
    id: 'expiration',
    label: 'Fecha de vencimiento',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'size',
    label: 'Servicio',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: ['account', 'email'],
    label: 'Email cuenta',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toFixed(2),
  },
  { id: ['account', 'password'], label: 'Contraseña', minWidth: 170 },
  { id: ['client', 'email'], label: 'Email cliente', minWidth: 170 },
  { id: ['client', 'phone'], label: 'Teléfono cliente', minWidth: 170 },
];

export default SalesTableColumns;
