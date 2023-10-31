import { Alert, BottomNavigation, BottomNavigationAction, Drawer, Snackbar, useMediaQuery, useTheme } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useState } from 'react';
import SalesForm from './SalesForm';

interface SalesMenuProps {
  refreshTable: () => void;
}

const SalesMenu = ({ refreshTable }: SalesMenuProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [saleDrawer, setSaleDrawer] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const onOpenDialog = () => {
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
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
      <Snackbar open={dialogOpen} autoHideDuration={5000} onClose={handleCloseDialog} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert onClose={handleCloseDialog} severity="success" sx={{ width: '100%' }}>
          Venta registrada con éxito
        </Alert>
      </Snackbar>
    </>
  );
};

export default SalesMenu;
