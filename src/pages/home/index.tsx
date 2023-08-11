import { useAuthMiddleware } from '@/utils/authMiddleware';
import dynamic from 'next/dynamic';

// Importa el componente que deseas renderizar solo en el lado del cliente
const Navbar = dynamic(() => import('./Navbar'), {
  ssr: false, // Indica que este componente no debe renderizarse en el servidor
});

const Home = () => {
  useAuthMiddleware();
  return <Navbar />;
};

export default Home;
