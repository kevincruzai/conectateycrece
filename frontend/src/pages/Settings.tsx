import React, { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Card, Button, Table, Modal, Input, Select } from '../components';
import api from '../services/api';

interface Catalog {
  id: number;
  type: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface SystemConfig {
  id: number;
  key: string;
  value: string;
  description: string;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'catalogs' | 'config'>('catalogs');
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [catalogType, setCatalogType] = useState('SECTOR');

  const [catalogForm, setCatalogForm] = useState({
    type: 'SECTOR',
    name: '',
    description: '',
    isActive: true,
  });

  const [configForm, setConfigForm] = useState({
    key: '',
    value: '',
    description: '',
  });

  useEffect(() => {
    if (activeTab === 'catalogs') {
      fetchCatalogs();
    } else {
      fetchConfigs();
    }
  }, [activeTab, catalogType]);

  const fetchCatalogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/catalogs', {
        params: { type: catalogType },
      });
      setCatalogs(response.data);
    } catch (error) {
      console.error('Error fetching catalogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/system-config');
      setConfigs(response.data);
    } catch (error) {
      console.error('Error fetching configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/catalogs/${editingItem.id}`, catalogForm);
      } else {
        await api.post('/catalogs', catalogForm);
      }
      setIsModalOpen(false);
      resetForms();
      fetchCatalogs();
    } catch (error) {
      console.error('Error saving catalog:', error);
    }
  };

  const handleSubmitConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/system-config/${editingItem.id}`, configForm);
      } else {
        await api.post('/system-config', configForm);
      }
      setIsModalOpen(false);
      resetForms();
      fetchConfigs();
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  const handleDeleteCatalog = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este catálogo?')) {
      try {
        await api.delete(`/catalogs/${id}`);
        fetchCatalogs();
      } catch (error) {
        console.error('Error deleting catalog:', error);
      }
    }
  };

  const handleDeleteConfig = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta configuración?')) {
      try {
        await api.delete(`/system-config/${id}`);
        fetchConfigs();
      } catch (error) {
        console.error('Error deleting config:', error);
      }
    }
  };

  const handleEditCatalog = (catalog: Catalog) => {
    setEditingItem(catalog);
    setCatalogForm({
      type: catalog.type,
      name: catalog.name,
      description: catalog.description,
      isActive: catalog.isActive,
    });
    setIsModalOpen(true);
  };

  const handleEditConfig = (config: SystemConfig) => {
    setEditingItem(config);
    setConfigForm({
      key: config.key,
      value: config.value,
      description: config.description,
    });
    setIsModalOpen(true);
  };

  const resetForms = () => {
    setCatalogForm({
      type: 'SECTOR',
      name: '',
      description: '',
      isActive: true,
    });
    setConfigForm({
      key: '',
      value: '',
      description: '',
    });
    setEditingItem(null);
  };

  const catalogColumns = [
    { key: 'name', label: 'Nombre', render: (item: Catalog) => item.name },
    { key: 'description', label: 'Descripción', render: (item: Catalog) => item.description },
    {
      key: 'isActive',
      label: 'Estado',
      render: (item: Catalog) => (
        <span className={`px-2 py-1 rounded text-xs ${item.isActive ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'}`}>
          {item.isActive ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (item: Catalog) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleEditCatalog(item)}>
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDeleteCatalog(item.id)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const configColumns = [
    { key: 'key', label: 'Clave', render: (item: SystemConfig) => item.key },
    { key: 'value', label: 'Valor', render: (item: SystemConfig) => item.value },
    { key: 'description', label: 'Descripción', render: (item: SystemConfig) => item.description },
    {
      key: 'actions',
      label: 'Acciones',
      render: (item: SystemConfig) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleEditConfig(item)}>
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDeleteConfig(item.id)}>
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-600 mt-2">Gestión de catálogos y parámetros del sistema</p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('catalogs')}
              className={`${
                activeTab === 'catalogs'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Catálogos
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`${
                activeTab === 'config'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Configuración
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'catalogs' && (
        <Card
          actions={
            <>
              <Select
                value={catalogType}
                onChange={(e) => setCatalogType(e.target.value)}
                options={[
                  { value: 'SECTOR', label: 'Sectores' },
                  { value: 'DEPARTMENT', label: 'Departamentos' },
                  { value: 'COMPANY_SIZE', label: 'Tamaños de Empresa' },
                  { value: 'COMPETENCY', label: 'Competencias' },
                ]}
              />
              <Button onClick={() => setIsModalOpen(true)}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Nuevo Catálogo
              </Button>
            </>
          }
        >
          <Table columns={catalogColumns} data={catalogs} loading={loading} />
        </Card>
      )}

      {activeTab === 'config' && (
        <Card
          actions={
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Nueva Configuración
            </Button>
          }
        >
          <Table columns={configColumns} data={configs} loading={loading} />
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForms();
        }}
        title={
          activeTab === 'catalogs'
            ? editingItem
              ? 'Editar Catálogo'
              : 'Nuevo Catálogo'
            : editingItem
            ? 'Editar Configuración'
            : 'Nueva Configuración'
        }
        size="lg"
      >
        {activeTab === 'catalogs' ? (
          <form onSubmit={handleSubmitCatalog} className="space-y-4">
            <Select
              label="Tipo"
              value={catalogForm.type}
              onChange={(e) => setCatalogForm({ ...catalogForm, type: e.target.value })}
              options={[
                { value: 'SECTOR', label: 'Sector' },
                { value: 'DEPARTMENT', label: 'Departamento' },
                { value: 'COMPANY_SIZE', label: 'Tamaño de Empresa' },
                { value: 'COMPETENCY', label: 'Competencia' },
              ]}
              required
            />

            <Input
              label="Nombre"
              value={catalogForm.name}
              onChange={(e) => setCatalogForm({ ...catalogForm, name: e.target.value })}
              required
            />

            <Input
              label="Descripción"
              value={catalogForm.description}
              onChange={(e) => setCatalogForm({ ...catalogForm, description: e.target.value })}
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={catalogForm.isActive}
                onChange={(e) => setCatalogForm({ ...catalogForm, isActive: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Activo
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editingItem ? 'Actualizar' : 'Crear'}</Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitConfig} className="space-y-4">
            <Input
              label="Clave"
              value={configForm.key}
              onChange={(e) => setConfigForm({ ...configForm, key: e.target.value })}
              required
              disabled={!!editingItem}
            />

            <Input
              label="Valor"
              value={configForm.value}
              onChange={(e) => setConfigForm({ ...configForm, value: e.target.value })}
              required
            />

            <Input
              label="Descripción"
              value={configForm.description}
              onChange={(e) => setConfigForm({ ...configForm, description: e.target.value })}
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">{editingItem ? 'Actualizar' : 'Crear'}</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Settings;
