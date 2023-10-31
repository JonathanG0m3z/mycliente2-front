import { useAuthMiddleware } from '@/utils/authMiddleware';
import dynamic from 'next/dynamic';
import SalesTable, { SalesTableRef } from './SalesTable';
import SalesMenu from './SalesMenu';
import { useRef } from 'react';
import { Paper } from '@mui/material';

// Importa el componente que deseas renderizar solo en el lado del cliente
const Navbar = dynamic(() => import('../../components/Navbar'), {
  ssr: false, // Indica que este componente no debe renderizarse en el servidor
});

const Home = () => {
  useAuthMiddleware();
  const saleTableRef = useRef<SalesTableRef>(null);
  const refreshTable = () => {
    saleTableRef.current?.refresh();
  };
  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden', height: '100vh' }}>
        <Navbar />
        <SalesMenu refreshTable={refreshTable} />
        <SalesTable ref={saleTableRef} />
      </Paper>
    </>
  );
};

export default Home;
