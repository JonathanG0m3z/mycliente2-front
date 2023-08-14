import { useAuthMiddleware } from '@/utils/authMiddleware';
import dynamic from 'next/dynamic';
import SalesTable from './SalesTable';
import SalesMenu from './SalesMenu';

// Importa el componente que deseas renderizar solo en el lado del cliente
const Navbar = dynamic(() => import('../../components/Navbar'), {
  ssr: false, // Indica que este componente no debe renderizarse en el servidor
});

const Home = () => {
  useAuthMiddleware();
  return (
    <>
      <Navbar />
      <SalesMenu />
      <SalesTable />
    </>
  );
};

export default Home;
