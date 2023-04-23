import type { FC } from 'react';

const Home: FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-4xl font-bold text-indigo-500 mb-6">Descarga nuestro eBook gratuito</h1>
          <p className="text-xl text-gray-600 mb-6">Aprende las mejores prácticas y consejos para mejorar tus habilidades en programación con este eBook gratuito.</p>
          <form className="space-y-4">
            <input type="email" placeholder="Tu correo electrónico" className="block w-full p-4 text-lg rounded-md bg-gray-100 focus:outline-none focus:bg-white" required />
            <button type="submit" className="w-full flex items-center justify-center p-4 text-lg rounded-md bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-bold">
              Descargar eBook
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
