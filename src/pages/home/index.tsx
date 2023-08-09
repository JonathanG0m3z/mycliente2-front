import { useAuthMiddleware } from '@/utils/authMiddleware';

const Home = () => {
  useAuthMiddleware();
  return <h1>Home</h1>;
};

export default Home;
