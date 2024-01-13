import { BottomNavigation, BottomNavigationAction, Drawer, useMediaQuery, useTheme } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { forwardRef, useImperativeHandle, useState } from 'react';
import SalesForm from './SalesForm';
import { AddSaleResponse, Sale } from '@/types/Sales';
import SaleInformationDialog from './SaleInformationDialog';

interface DialogStateType {
  open: boolean;
  res: AddSaleResponse | null;
}

export interface SalesMenuRef {
  // eslint-disable-next-line no-unused-vars
  onEditSale: (record: Sale) => void;
}
interface SalesMenuProps {
  refreshTable: () => void;
}
const SalesMenu = forwardRef<SalesMenuRef, SalesMenuProps>(function SalesMenu({ refreshTable }, ref) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [saleDrawer, setSaleDrawer] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<DialogStateType>({
    open: false,
    res: null,
  });
  const [recordSale, setRecordSale] = useState<Sale | null>(null);
  const onCloseDialog = () => {
    setDialogState({
      open: false,
      res: null,
    });
  };
  // eslint-disable-next-line no-undef
  const onOpenDialog = (res: AddSaleResponse) => {
    setDialogState({
      open: true,
      res,
    });
  };
  const onCloseDrawer = () => {
    setSaleDrawer(false);
    setRecordSale(null);
  };
  const onOpenDrawer = () => {
    setSaleDrawer(true);
  };
  const onEditSale = (record: Sale) => {
    setRecordSale(record);
    onOpenDrawer();
  };

  useImperativeHandle(ref, () => ({
    onEditSale(record: Sale) {
      onEditSale(record);
    },
  }));
  return (
    <>
      <BottomNavigation
        showLabels
        // value={value}
        // onChange={(event, newValue) => {
        //   setValue(newValue);
        // }}
      >
        <BottomNavigationAction onClick={onOpenDrawer} label="Registrar venta" icon={<MonetizationOnIcon />} />
      </BottomNavigation>
      <Drawer
        anchor="right"
        open={saleDrawer}
        onClose={onCloseDrawer}
        sx={{
          width: isSmallScreen ? '100%' : 500,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isSmallScreen ? '100%' : 500,
            boxSizing: 'border-box',
          },
        }}
      >
        <SalesForm handleCloseForm={onCloseDrawer} refreshTable={refreshTable} onOpenDialog={onOpenDialog} record={recordSale} />
      </Drawer>
      <SaleInformationDialog dialogState={dialogState} onCloseDialog={onCloseDialog} />
    </>
  );
});

export default SalesMenu;
