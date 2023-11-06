import { BottomNavigation, BottomNavigationAction, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Drawer, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useState } from 'react';
import SalesForm from './SalesForm';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import { AddSaleResponse } from '@/types/Sales';
import { decryptValue } from '@/utils/cryptoHooks';
import moment from 'moment';
import CheckIcon from '@mui/icons-material/Check';
import { deleteSpaces } from '@/utils/deleteSpaces';

const YOUTUBE_ACTIVATION = 'Activación youtube';

interface DialogStateType {
  open: boolean;
  res: AddSaleResponse | null;
}
interface SalesMenuProps {
  refreshTable: () => void;
}
const SalesMenu = ({ refreshTable }: SalesMenuProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [saleDrawer, setSaleDrawer] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<DialogStateType>({
    open: false,
    res: null,
  });
  const [copied, setCopied] = useState<boolean>(false);
  const onCloseDialog = () => {
    // setDialogState({
    //   open: false,
    //   res: null,
    // });
  };
  // eslint-disable-next-line no-undef
  const onOpenDialog = (res: AddSaleResponse) => {
    setDialogState({
      open: true,
      res,
    });
  };
  const onCopy = () => {
    const text = `
    Cliente: ${dialogState.res?.client.name}
    ${
      !dialogState.res?.account.service.name.includes(YOUTUBE_ACTIVATION)
        ? `
    Cuenta: ${dialogState.res?.account.email}
    Contraseña: ${decryptValue(dialogState.res?.account.password ?? '')}`
        : `Correo cliente: ${dialogState.res?.client.email}`
    }
    ${dialogState.res?.sale.pin ? 'Pin: ' + dialogState.res?.sale.pin : ''}
    ${dialogState.res?.sale.profile ? 'Perfil: ' + dialogState.res?.sale.profile : ''}
    Precio: $${dialogState.res?.sale.price}
    Fecha renovación: ${moment(dialogState.res?.sale.expiration).format('LL')}
    `;
    const textWithoutSpaces = deleteSpaces(text);
    navigator.clipboard.writeText(textWithoutSpaces);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  const sendByWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?phone=${dialogState.res?.client.phone}&text=😼Cliente%3A%20${dialogState.res?.client.name}%0A${
      !dialogState.res?.account.service.name.includes(YOUTUBE_ACTIVATION)
        ? `📝Cuenta%3A%20${dialogState.res?.account.email}%0A🔑Contraseña%3A%20${decryptValue(dialogState.res?.account.password ?? '')}%0A`
        : ''
    } ${dialogState.res?.sale.pin ? `*%EF%B8%8F⃣Pin%3A%20${dialogState.res?.sale.pin}%0A` : ''}${
      dialogState.res?.sale.profile ? `👤Perfil%3A%20${dialogState.res?.sale.profile}%0A` : ''
    }💵Precio%3A%20%24${dialogState.res?.sale.price}%0A🗓%EF%B8%8FFecha%20renovación%3A%20${moment(dialogState.res?.sale.expiration).format('LL')}`;
    // eslint-disable-next-line no-undef
    window.open(url, '_blank');
    // window.open('https://wa.me/5491130777777?text=Hola%20quiero%20hacer%20un%20pedido', '_blank');
  };
  return (
    <>
      <BottomNavigation
        showLabels
        // value={value}
        // onChange={(event, newValue) => {
        //   setValue(newValue);
        // }}
      >
        <BottomNavigationAction onClick={() => setSaleDrawer(true)} label="Registrar venta" icon={<MonetizationOnIcon />} />
      </BottomNavigation>
      <Drawer
        anchor="right"
        open={saleDrawer}
        onClose={() => setSaleDrawer(false)}
        sx={{
          width: isSmallScreen ? '100%' : 500,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isSmallScreen ? '100%' : 500,
            boxSizing: 'border-box',
          },
        }}
      >
        <SalesForm handleCloseForm={() => setSaleDrawer(false)} refreshTable={refreshTable} onOpenDialog={onOpenDialog} />
      </Drawer>
      <Dialog fullScreen={fullScreen} open={dialogState.open} onClose={onCloseDialog} aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{`Venta de ${dialogState.res?.account.service.name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <>
              Cliente: {dialogState.res?.client.name}
              <br />
              Cuenta: {dialogState.res?.account.email}
              <br />
              Contraseña: {decryptValue(dialogState.res?.account.password ?? '')}
              {dialogState.res?.sale.pin && (
                <>
                  <br />
                  Pin: {dialogState.res?.sale.pin}
                </>
              )}
              {dialogState.res?.sale.profile && (
                <>
                  <br />
                  Perfil: {dialogState.res?.sale.profile}
                </>
              )}
              <br />
              Precio: ${dialogState.res?.sale.price}
              <br />
              Fecha renovación: {moment(dialogState.res?.sale.expiration).format('LL')}
            </>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Tooltip title={copied ? '¡Copiado!' : 'Copiar'}>
            <IconButton onClick={onCopy}>{copied ? <CheckIcon /> : <ContentPasteIcon />}</IconButton>
          </Tooltip>
          <Tooltip title="Enviar por WhatsApp">
            <IconButton onClick={sendByWhatsApp}>
              <WhatsAppIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cerrar">
            <IconButton onClick={onCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SalesMenu;
