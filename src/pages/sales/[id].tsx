import { useRouter } from 'next/router';

const EditSale = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Página de ventas con ID: {id}</h1>
    </div>
  );
};

export default EditSale;
