import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Table, Button, Card, Modal, Input, Select, Badge, Pagination } from '../components';
import api from '../services/api';

interface Program {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: number;
  modality: string;
  maxCapacity: number;
  status: string;
  sessionsCount: number;
  enrolledCount: number;
}

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    duration: 0,
    modality: 'PRESENCIAL',
    maxCapacity: 30,
    status: 'PLANIFICADO',
  });

  useEffect(() => {
    fetchPrograms();
  }, [currentPage, searchTerm]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await api.get('/programs', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
        },
      });
      setPrograms(response.data.programs);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProgram) {
        await api.put(`/programs/${editingProgram.id}`, formData);
      } else {
        await api.post('/programs', formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchPrograms();
    } catch (error) {
      console.error('Error saving program:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este programa?')) {
      try {
        await api.delete(`/programs/${id}`);
        fetchPrograms();
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description,
      startDate: program.startDate.split('T')[0],
      endDate: program.endDate.split('T')[0],
      duration: program.duration,
      modality: program.modality,
      maxCapacity: program.maxCapacity,
      status: program.status,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      duration: 0,
      modality: 'PRESENCIAL',
      maxCapacity: 30,
      status: 'PLANIFICADO',
    });
    setEditingProgram(null);
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'success' | 'warning' | 'danger' | 'info' } = {
      PLANIFICADO: 'info',
      EN_CURSO: 'warning',
      COMPLETADO: 'success',
      CANCELADO: 'danger',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const columns = [
    { key: 'name', label: 'Programa', render: (item: Program) => item.name },
    {
      key: 'dates',
      label: 'Fechas',
      render: (item: Program) => (
        <div className="text-sm">
          <div>{new Date(item.startDate).toLocaleDateString()}</div>
          <div className="text-gray-500">al {new Date(item.endDate).toLocaleDateString()}</div>
        </div>
      ),
    },
    { key: 'duration', label: 'Duración (hrs)', render: (item: Program) => item.duration },
    { key: 'modality', label: 'Modalidad', render: (item: Program) => item.modality },
    {
      key: 'capacity',
      label: 'Inscritos/Capacidad',
      render: (item: Program) => (
        <span>
          {item.enrolledCount}/{item.maxCapacity}
        </span>
      ),
    },
    { key: 'status', label: 'Estado', render: (item: Program) => getStatusBadge(item.status) },
    {
      key: 'actions',
      label: 'Acciones',
      render: (item: Program) => (
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
        <h1 className="text-3xl font-bold text-gray-900">Programas Formativos</h1>
        <p className="text-gray-600 mt-2">Gestión de programas y capacitaciones</p>
      </div>

      <Card
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Programa
          </Button>
        }
      >
        <div className="mb-4">
          <Input
            placeholder="Buscar programas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table columns={columns} data={programs} loading={loading} onRowClick={handleEdit} />

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
        title={editingProgram ? 'Editar Programa' : 'Nuevo Programa'}
        size="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del Programa"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha de Inicio"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="Fecha de Fin"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
            <Input
              label="Duración (horas)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              required
            />
            <Select
              label="Modalidad"
              value={formData.modality}
              onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
              options={[
                { value: 'PRESENCIAL', label: 'Presencial' },
                { value: 'VIRTUAL', label: 'Virtual' },
                { value: 'HIBRIDA', label: 'Híbrida' },
              ]}
              required
            />
            <Input
              label="Capacidad Máxima"
              type="number"
              value={formData.maxCapacity}
              onChange={(e) => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) })}
              required
            />
            <Select
              label="Estado"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'PLANIFICADO', label: 'Planificado' },
                { value: 'EN_CURSO', label: 'En Curso' },
                { value: 'COMPLETADO', label: 'Completado' },
                { value: 'CANCELADO', label: 'Cancelado' },
              ]}
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
            <Button type="submit">{editingProgram ? 'Actualizar' : 'Crear'} Programa</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Programs;
