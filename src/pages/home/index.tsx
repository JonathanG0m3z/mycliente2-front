import { useAuthMiddleware } from '@/utils/authMiddleware';
import dynamic from 'next/dynamic';
import SalesTable, { SalesTableRef } from './SalesTable';
import SalesMenu, { SalesMenuRef } from './SalesMenu';
import { useRef } from 'react';
import { Paper } from '@mui/material';
import { Sale } from '@/types/Sales';

// Importa el componente que deseas renderizar solo en el lado del cliente
const Navbar = dynamic(() => import('../../components/Navbar'), {
  ssr: false, // Indica que este componente no debe renderizarse en el servidor
});

const Home = () => {
  useAuthMiddleware();
  const salesTableRef = useRef<SalesTableRef>(null);
  const salesMenuRef = useRef<SalesMenuRef>(null);
  const refreshTable = () => {
    salesTableRef.current?.refresh();
  };
  const onEditSale = (record: Sale) => {
    salesMenuRef.current?.onEditSale(record);
  };
  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden', height: '100vh' }}>
        <Navbar />
        <SalesMenu refreshTable={refreshTable} ref={salesMenuRef} />
        <SalesTable ref={salesTableRef} onEdit={onEditSale} />
      </Paper>
    </>
  );
};

export default Home;
