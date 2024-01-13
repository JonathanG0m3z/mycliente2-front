import { AddSaleResponse } from '@/types/Sales';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import moment from 'moment';
import { decryptValue } from '@/utils/cryptoHooks';
import CheckIcon from '@mui/icons-material/Check';
import { deleteSpaces } from '@/utils/deleteSpaces';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

const YOUTUBE_ACTIVATION = 'Activación youtube';

interface SaleInformationDialogProps {
  dialogState: {
    open: boolean;
    res: AddSaleResponse | null;
  };
  onCloseDialog: () => void;
}

const SaleInformationDialog = ({ dialogState, onCloseDialog }: SaleInformationDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [copied, setCopied] = useState<boolean>(false);

  const sendByWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?phone=${dialogState.res?.client.phone}&text=😼Cliente%3A%20${dialogState.res?.client.name}%0A${
      !dialogState.res?.account.service.name.includes(YOUTUBE_ACTIVATION)
        ? `📝Cuenta%3A%20${dialogState.res?.account.email}%0A🔑Contraseña%3A%20${decryptValue(dialogState.res?.account.password ?? '')}%0A`
        : ''
    } ${dialogState.res?.sale.pin ? `*%EF%B8%8F⃣Pin%3A%20${dialogState.res?.sale.pin}%0A` : ''}${
      dialogState.res?.sale.profile ? `👤Perfil%3A%20${dialogState.res?.sale.profile}%0A` : ''
    }💵Precio%3A%20%24${dialogState.res?.sale.price}%0A🗓%EF%B8%8FFecha%20renovación%3A%20${moment(dialogState.res?.sale.expiration).format('LL')}`;
    window.open(url, '_blank');
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
  return (
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
  );
};

export default SaleInformationDialog;
