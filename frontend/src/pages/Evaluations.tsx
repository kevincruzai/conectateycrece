import React, { useState, useEffect } from 'react';
import { PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { Table, Button, Card, Modal, Select, Badge, Input } from '../components';
import api from '../services/api';

interface Evaluation {
  id: number;
  enrollment: {
    id: number;
    company: {
      name: string;
    };
    program: {
      name: string;
    };
  };
  evaluationType: string;
  evaluationDate: string;
  grade: number;
  maxGrade: number;
  passed: boolean;
  feedback: string;
  competencies: {
    name: string;
    score: number;
  }[];
}

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [competencies, setCompetencies] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    enrollmentId: '',
    evaluationType: 'DIAGNOSTICA',
    evaluationDate: new Date().toISOString().split('T')[0],
    grade: 0,
    maxGrade: 100,
    feedback: '',
    competencyScores: {} as { [key: number]: number },
  });

  useEffect(() => {
    fetchEvaluations();
    fetchEnrollments();
    fetchCompetencies();
  }, []);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/evaluations');
      setEvaluations(response.data.evaluations || []);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/enrollments?status=EN_CURSO&limit=1000');
      setEnrollments(response.data.enrollments || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  const fetchCompetencies = async () => {
    try {
      const response = await api.get('/catalogs?type=COMPETENCY');
      setCompetencies(response.data || []);
    } catch (error) {
      console.error('Error fetching competencies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/evaluations', {
        enrollmentId: parseInt(formData.enrollmentId),
        evaluationType: formData.evaluationType,
        evaluationDate: formData.evaluationDate,
        grade: formData.grade,
        maxGrade: formData.maxGrade,
        feedback: formData.feedback,
        competencyScores: Object.entries(formData.competencyScores).map(([id, score]) => ({
          competencyId: parseInt(id),
          score,
        })),
      });
      setIsModalOpen(false);
      resetForm();
      fetchEvaluations();
    } catch (error) {
      console.error('Error creating evaluation:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta evaluación?')) {
      try {
        await api.delete(`/evaluations/${id}`);
        fetchEvaluations();
      } catch (error) {
        console.error('Error deleting evaluation:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      enrollmentId: '',
      evaluationType: 'DIAGNOSTICA',
      evaluationDate: new Date().toISOString().split('T')[0],
      grade: 0,
      maxGrade: 100,
      feedback: '',
      competencyScores: {},
    });
  };

  const getGradeBadge = (grade: number, maxGrade: number, passed: boolean) => {
    const percentage = (grade / maxGrade) * 100;
    const variant = passed ? 'success' : 'danger';
    return <Badge variant={variant}>{percentage.toFixed(1)}%</Badge>;
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      DIAGNOSTICA: 'Diagnóstica',
      FORMATIVA: 'Formativa',
      SUMATIVA: 'Sumativa',
      FINAL: 'Final',
    };
    return labels[type] || type;
  };

  const columns = [
    {
      key: 'company',
      label: 'Empresa',
      render: (item: Evaluation) => item.enrollment.company.name,
    },
    {
      key: 'program',
      label: 'Programa',
      render: (item: Evaluation) => item.enrollment.program.name,
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (item: Evaluation) => getTypeLabel(item.evaluationType),
    },
    {
      key: 'date',
      label: 'Fecha',
      render: (item: Evaluation) => new Date(item.evaluationDate).toLocaleDateString(),
    },
    {
      key: 'grade',
      label: 'Calificación',
      render: (item: Evaluation) => (
        <div>
          <span className="font-semibold">
            {item.grade}/{item.maxGrade}
          </span>
          <div className="text-xs text-gray-500">
            {getGradeBadge(item.grade, item.maxGrade, item.passed)}
          </div>
        </div>
      ),
    },
    {
      key: 'competencies',
      label: 'Competencias',
      render: (item: Evaluation) => (
        <div className="text-sm">
          {item.competencies.length > 0 ? (
            <span className="text-gray-600">{item.competencies.length} evaluadas</span>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (item: Evaluation) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary">
            Ver Detalles
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const averageGrade =
    evaluations.length > 0
      ? evaluations.reduce((sum, e) => sum + (e.grade / e.maxGrade) * 100, 0) / evaluations.length
      : 0;
  const passedCount = evaluations.filter((e) => e.passed).length;
  const failedCount = evaluations.filter((e) => !e.passed).length;

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Evaluaciones</h1>
        <p className="text-gray-600 mt-2">Gestión de evaluaciones y calificaciones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Evaluaciones</p>
              <p className="text-2xl font-bold text-gray-900">{evaluations.length}</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Promedio General</p>
              <p className="text-2xl font-bold text-primary-600">{averageGrade.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprobados</p>
              <p className="text-2xl font-bold text-success-600">{passedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reprobados</p>
              <p className="text-2xl font-bold text-danger-600">{failedCount}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Evaluación
          </Button>
        }
      >
        <Table columns={columns} data={evaluations} loading={loading} />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Nueva Evaluación"
        size="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Inscripción (Empresa - Programa)"
            value={formData.enrollmentId}
            onChange={(e) => setFormData({ ...formData, enrollmentId: e.target.value })}
            options={[
              { value: '', label: 'Seleccione...' },
              ...enrollments.map((e) => ({
                value: e.id,
                label: `${e.company.name} - ${e.program.name}`,
              })),
            ]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Tipo de Evaluación"
              value={formData.evaluationType}
              onChange={(e) => setFormData({ ...formData, evaluationType: e.target.value })}
              options={[
                { value: 'DIAGNOSTICA', label: 'Diagnóstica' },
                { value: 'FORMATIVA', label: 'Formativa' },
                { value: 'SUMATIVA', label: 'Sumativa' },
                { value: 'FINAL', label: 'Final' },
              ]}
              required
            />

            <Input
              label="Fecha de Evaluación"
              type="date"
              value={formData.evaluationDate}
              onChange={(e) => setFormData({ ...formData, evaluationDate: e.target.value })}
              required
            />

            <Input
              label="Calificación Obtenida"
              type="number"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: parseFloat(e.target.value) })}
              required
              min="0"
              step="0.1"
            />

            <Input
              label="Calificación Máxima"
              type="number"
              value={formData.maxGrade}
              onChange={(e) => setFormData({ ...formData, maxGrade: parseFloat(e.target.value) })}
              required
              min="0"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Retroalimentación</label>
            <textarea
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Evaluación por Competencias</h4>
            <div className="grid grid-cols-2 gap-4">
              {competencies.map((comp) => (
                <Input
                  key={comp.id}
                  label={comp.name}
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.competencyScores[comp.id] || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      competencyScores: {
                        ...formData.competencyScores,
                        [comp.id]: parseInt(e.target.value),
                      },
                    })
                  }
                />
              ))}
            </div>
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
            <Button type="submit">Guardar Evaluación</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Evaluations;
