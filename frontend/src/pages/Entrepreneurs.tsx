import { useState, useEffect } from 'react';
import { Table } from '../components/Table';
import api from '../services/api';
import { 
  UserGroupIcon, 
  MapPinIcon, 
  BuildingStorefrontIcon,
  ChartBarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Entrepreneur {
  id: string;
  fullName: string;
  dui?: string;
  email: string;
  phone: string;
  department: string;
  municipality: string;
  businessName: string;
  businessStage: string;
  productiveSector: string;
  employeeCount: number;
  legalStatus: string;
  createdAt: string;
}

const Entrepreneurs = () => {
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    businessStage: '',
    productiveSector: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchEntrepreneurs();
    fetchStats();
  }, [filters, pagination.page]);

  const fetchEntrepreneurs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters,
      });

      const response = await api.get(`/entrepreneurs?${params}`);
      setEntrepreneurs(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching entrepreneurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/entrepreneurs/stats/overview');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const columns = [
    {
      key: 'fullName',
      label: 'Nombre',
      render: (item: Entrepreneur) => (
        <div>
          <div className="font-medium text-gray-900">{item.fullName}</div>
          <div className="text-sm text-gray-500">{item.email}</div>
          {item.dui && <div className="text-xs text-gray-400">DUI: {item.dui}</div>}
        </div>
      ),
    },
    {
      key: 'businessName',
      label: 'Emprendimiento',
      render: (item: Entrepreneur) => (
        <div>
          <div className="font-medium text-gray-900">{item.businessName}</div>
          <div className="text-xs text-gray-500">{item.productiveSector.replace('_', ' ')}</div>
        </div>
      ),
    },
    {
      key: 'businessStage',
      label: 'Etapa',
      render: (item: Entrepreneur) => {
        const stageColors: Record<string, string> = {
          IDEA: 'bg-gray-100 text-gray-800',
          EN_MARCHA: 'bg-primary-100 text-primary-800',
          EN_CRECIMIENTO: 'bg-success-100 text-success-800',
          CONSOLIDADO: 'bg-warning-100 text-warning-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageColors[item.businessStage]}`}>
            {item.businessStage.replace('_', ' ')}
          </span>
        );
      },
    },
    {
      key: 'location',
      label: 'Ubicación',
      render: (item: Entrepreneur) => (
        <div className="text-sm">
          <div className="text-gray-900">{item.municipality}</div>
          <div className="text-gray-500">{item.department}</div>
        </div>
      ),
    },
    {
      key: 'employeeCount',
      label: 'Empleados',
      render: (item: Entrepreneur) => (
        <span className="text-gray-900">{item.employeeCount}</span>
      ),
    },
    {
      key: 'legalStatus',
      label: 'Estado Legal',
      render: (item: Entrepreneur) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.legalStatus === 'FORMAL' 
            ? 'bg-success-100 text-success-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {item.legalStatus}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emprendedores Registrados</h1>
          <p className="text-gray-600 mt-1">Gestión de emprendedores del ecosistema</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Emprendedores</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <UserGroupIcon className="w-12 h-12 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Departamentos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.byDepartment.length}</p>
              </div>
              <MapPinIcon className="w-12 h-12 text-success-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sectores</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.bySector.length}</p>
              </div>
              <BuildingStorefrontIcon className="w-12 h-12 text-warning-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Etapas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.byStage.length}</p>
              </div>
              <ChartBarIcon className="w-12 h-12 text-danger-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre, email..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="input-field"
          />

          <select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            className="input-field"
          >
            <option value="">Todos los departamentos</option>
            <option value="San Salvador">San Salvador</option>
            <option value="La Libertad">La Libertad</option>
            <option value="Santa Ana">Santa Ana</option>
            <option value="San Miguel">San Miguel</option>
            {/* Agregar más departamentos */}
          </select>

          <select
            value={filters.businessStage}
            onChange={(e) => setFilters(prev => ({ ...prev, businessStage: e.target.value }))}
            className="input-field"
          >
            <option value="">Todas las etapas</option>
            <option value="IDEA">Idea</option>
            <option value="EN_MARCHA">En Marcha</option>
            <option value="EN_CRECIMIENTO">En Crecimiento</option>
            <option value="CONSOLIDADO">Consolidado</option>
          </select>

          <select
            value={filters.productiveSector}
            onChange={(e) => setFilters(prev => ({ ...prev, productiveSector: e.target.value }))}
            className="input-field"
          >
            <option value="">Todos los sectores</option>
            <option value="TECNOLOGIA">Tecnología</option>
            <option value="COMERCIO">Comercio</option>
            <option value="SERVICIOS">Servicios</option>
            <option value="AGROINDUSTRIA">Agroindustria</option>
            <option value="TURISMO">Turismo</option>
            <option value="MANUFACTURA">Manufactura</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <Table
          columns={columns}
          data={entrepreneurs}
          loading={loading}
          emptyMessage="No hay emprendedores registrados"
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                {pagination.total} resultados
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                <span className="px-4 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                  {pagination.page} / {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Entrepreneurs;
