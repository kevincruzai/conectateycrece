import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4">Página no encontrada</h2>
        <p className="text-gray-600 mt-2 mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link to="/dashboard" className="btn-primary">
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
