import React, { useState, useEffect } from 'react';
import { PlusIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Table, Button, Card, Modal, Input, Select, Badge, Pagination } from '../components';
import api from '../services/api';

interface Company {
  id: number;
  name: string;
  nit: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  department: string;
  sector: string;
  size: string;
  employeesCount: number;
  createdAt: string;
}

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  // Catálogos
  const [sectors, setSectors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nit: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    department: '',
    sector: '',
    size: '',
    employeesCount: 0,
  });

  useEffect(() => {
    fetchCompanies();
    fetchCatalogs();
  }, [currentPage, searchTerm]);

  const fetchCatalogs = async () => {
    try {
      const [sectorsRes, depsRes, sizesRes] = await Promise.all([
        api.get('/catalogs?type=SECTOR'),
        api.get('/catalogs?type=DEPARTMENT'),
        api.get('/catalogs?type=COMPANY_SIZE'),
      ]);
      setSectors(sectorsRes.data);
      setDepartments(depsRes.data);
      setSizes(sizesRes.data);
    } catch (error) {
      console.error('Error fetching catalogs:', error);
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await api.get('/companies', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
        },
      });
      setCompanies(response.data.companies);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await api.put(`/companies/${editingCompany.id}`, formData);
      } else {
        await api.post('/companies', formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchCompanies();
    } catch (error) {
      console.error('Error saving company:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta empresa?')) {
      try {
        await api.delete(`/companies/${id}`);
        fetchCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
      }
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      nit: company.nit,
      phone: company.phone,
      email: company.email,
      address: company.address,
      city: company.city,
      department: company.department,
      sector: company.sector,
      size: company.size,
      employeesCount: company.employeesCount,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nit: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      department: '',
      sector: '',
      size: '',
      employeesCount: 0,
    });
    setEditingCompany(null);
  };

  const handleExportExcel = async () => {
    try {
      const response = await api.get('/companies/export/excel', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `empresas_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };

  const columns = [
    { key: 'name', label: 'Nombre', render: (item: Company) => item.name },
    { key: 'nit', label: 'NIT', render: (item: Company) => item.nit },
    { key: 'sector', label: 'Sector', render: (item: Company) => item.sector },
    { key: 'size', label: 'Tamaño', render: (item: Company) => <Badge variant="info">{item.size}</Badge> },
    { key: 'department', label: 'Departamento', render: (item: Company) => item.department },
    { key: 'employeesCount', label: 'Empleados', render: (item: Company) => item.employeesCount },
    {
      key: 'actions',
      label: 'Acciones',
      render: (item: Company) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleEdit(item)}>
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
        <p className="text-gray-600 mt-2">Gestión de empresas participantes MIPYME+E</p>
      </div>

      <Card
        actions={
          <>
            <Button variant="secondary" onClick={handleExportExcel}>
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Exportar Excel
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusIcon className="h-5 w-5 mr-2" />
              Nueva Empresa
            </Button>
          </>
        }
      >
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar empresas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="secondary">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filtros
          </Button>
        </div>

        <Table columns={columns} data={companies} loading={loading} onRowClick={handleEdit} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingCompany ? 'Editar Empresa' : 'Nueva Empresa'}
        size="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre de la Empresa"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="NIT"
              value={formData.nit}
              onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
              required
            />
            <Input
              label="Teléfono"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Dirección"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
            <Input
              label="Ciudad"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
            <Select
              label="Departamento"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={[
                { value: '', label: 'Seleccione...' },
                ...departments.map((d) => ({ value: d.name, label: d.name })),
              ]}
              required
            />
            <Select
              label="Sector"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              options={[
                { value: '', label: 'Seleccione...' },
                ...sectors.map((s) => ({ value: s.name, label: s.name })),
              ]}
              required
            />
            <Select
              label="Tamaño"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              options={[
                { value: '', label: 'Seleccione...' },
                ...sizes.map((s) => ({ value: s.name, label: s.name })),
              ]}
              required
            />
            <Input
              label="Número de Empleados"
              type="number"
              value={formData.employeesCount}
              onChange={(e) => setFormData({ ...formData, employeesCount: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">{editingCompany ? 'Actualizar' : 'Crear'} Empresa</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Companies;
