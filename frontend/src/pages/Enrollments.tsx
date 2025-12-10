import React, { useState, useEffect } from 'react';
import { PlusIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Table, Button, Card, Modal, Select, Badge, Pagination } from '../components';
import api from '../services/api';

interface Enrollment {
  id: number;
  company: {
    id: number;
    name: string;
    nit: string;
  };
  program: {
    id: number;
    name: string;
    startDate: string;
  };
  enrollmentDate: string;
  status: string;
  completionPercentage: number;
  attendancePercentage: number;
  finalGrade: number | null;
}

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [companies, setCompanies] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    companyId: '',
    programId: '',
    status: 'INSCRITO',
  });

  useEffect(() => {
    fetchEnrollments();
    fetchCompanies();
    fetchPrograms();
  }, [currentPage]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/enrollments', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      });
      setEnrollments(response.data.enrollments);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.total);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies?limit=1000');
      setCompanies(response.data.companies);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/programs?limit=1000');
      setPrograms(response.data.programs);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/enrollments', {
        companyId: parseInt(formData.companyId),
        programId: parseInt(formData.programId),
        status: formData.status,
      });
      setIsModalOpen(false);
      resetForm();
      fetchEnrollments();
    } catch (error) {
      console.error('Error creating enrollment:', error);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.put(`/enrollments/${id}`, { status: newStatus });
      fetchEnrollments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta inscripción?')) {
      try {
        await api.delete(`/enrollments/${id}`);
        fetchEnrollments();
      } catch (error) {
        console.error('Error deleting enrollment:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      companyId: '',
      programId: '',
      status: 'INSCRITO',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'success' | 'warning' | 'danger' | 'info' } = {
      INSCRITO: 'info',
      EN_CURSO: 'warning',
      COMPLETADO: 'success',
      RETIRADO: 'danger',
      SUSPENDIDO: 'danger',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const columns = [
    { key: 'company', label: 'Empresa', render: (item: Enrollment) => item.company.name },
    { key: 'nit', label: 'NIT', render: (item: Enrollment) => item.company.nit },
    { key: 'program', label: 'Programa', render: (item: Enrollment) => item.program.name },
    {
      key: 'enrollmentDate',
      label: 'Fecha Inscripción',
      render: (item: Enrollment) => new Date(item.enrollmentDate).toLocaleDateString(),
    },
    {
      key: 'attendance',
      label: 'Asistencia',
      render: (item: Enrollment) => (
        <div className="flex items-center">
          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
            <div
              className="bg-primary-600 h-2 rounded-full"
              style={{ width: `${item.attendancePercentage}%` }}
            ></div>
          </div>
          <span className="text-sm">{item.attendancePercentage}%</span>
        </div>
      ),
    },
    {
      key: 'completion',
      label: 'Avance',
      render: (item: Enrollment) => (
        <div className="flex items-center">
          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
            <div
              className="bg-success-600 h-2 rounded-full"
              style={{ width: `${item.completionPercentage}%` }}
            ></div>
          </div>
          <span className="text-sm">{item.completionPercentage}%</span>
        </div>
      ),
    },
    { key: 'status', label: 'Estado', render: (item: Enrollment) => getStatusBadge(item.status) },
    {
      key: 'actions',
      label: 'Acciones',
      render: (item: Enrollment) => (
        <div className="flex gap-2">
          {item.status === 'INSCRITO' && (
            <Button size="sm" variant="success" onClick={() => handleStatusChange(item.id, 'EN_CURSO')}>
              <CheckCircleIcon className="h-4 w-4" />
            </Button>
          )}
          {item.status === 'EN_CURSO' && (
            <Button size="sm" variant="warning" onClick={() => handleStatusChange(item.id, 'COMPLETADO')}>
              Completar
            </Button>
          )}
          <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>
            <XCircleIcon className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inscripciones</h1>
        <p className="text-gray-600 mt-2">Gestión de inscripciones de empresas a programas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Inscripciones</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-lg">
              <CheckCircleIcon className="h-8 w-8 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Curso</p>
              <p className="text-2xl font-bold text-warning-600">
                {enrollments.filter((e) => e.status === 'EN_CURSO').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-success-600">
                {enrollments.filter((e) => e.status === 'COMPLETADO').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Retirados</p>
              <p className="text-2xl font-bold text-danger-600">
                {enrollments.filter((e) => e.status === 'RETIRADO').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Inscripción
          </Button>
        }
      >
        <Table columns={columns} data={enrollments} loading={loading} />

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
        title="Nueva Inscripción"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Empresa"
            value={formData.companyId}
            onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
            options={[
              { value: '', label: 'Seleccione una empresa...' },
              ...companies.map((c) => ({ value: c.id, label: `${c.name} - ${c.nit}` })),
            ]}
            required
          />

          <Select
            label="Programa"
            value={formData.programId}
            onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
            options={[
              { value: '', label: 'Seleccione un programa...' },
              ...programs.map((p) => ({ value: p.id, label: p.name })),
            ]}
            required
          />

          <Select
            label="Estado Inicial"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: 'INSCRITO', label: 'Inscrito' },
              { value: 'EN_CURSO', label: 'En Curso' },
            ]}
            required
          />

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
            <Button type="submit">Crear Inscripción</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Enrollments;
