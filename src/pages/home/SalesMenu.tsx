import { BottomNavigation, BottomNavigationAction, Drawer, useMediaQuery, useTheme } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useState } from 'react';
import SalesForm from './SalesForm';

const SalesMenu = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [saleDrawer, setSaleDrawer] = useState<boolean>(false);
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
        <SalesForm handleCloseForm={() => setSaleDrawer(false)} />
      </Drawer>
    </>
  );
};

export default SalesMenu;
