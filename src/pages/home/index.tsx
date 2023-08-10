import { useAuthMiddleware } from '@/utils/authMiddleware';
import Navbar from './Navbar';

const Home = () => {
  useAuthMiddleware();
  return <Navbar />;
};

export default Home;
