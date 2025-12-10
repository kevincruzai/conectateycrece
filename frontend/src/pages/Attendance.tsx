import React, { useState, useEffect } from 'react';
import { CalendarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Table, Button, Card, Modal, Select, Badge } from '../components';
import api from '../services/api';

interface AttendanceRecord {
  id: number;
  session: {
    id: number;
    title: string;
    date: string;
    program: {
      name: string;
    };
  };
  enrollment: {
    id: number;
    company: {
      name: string;
    };
  };
  status: string;
  notes: string;
}

interface Session {
  id: number;
  title: string;
  date: string;
  program: {
    id: number;
    name: string;
  };
}

const Attendance = () => {
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      fetchAttendanceForSession(selectedSession);
    }
  }, [selectedSession]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/sessions?limit=1000');
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceForSession = async (sessionId: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/attendance/session/${sessionId}`);
      setAttendances(response.data.attendances || []);
      
      // Obtener inscripciones del programa de esta sesión
      const sessionData = sessions.find(s => s.id === sessionId);
      if (sessionData) {
        const enrollmentsRes = await api.get(`/enrollments?programId=${sessionData.program.id}`);
        setEnrollments(enrollmentsRes.data.enrollments || []);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (enrollmentId: number, status: string) => {
    try {
      await api.post('/attendance', {
        sessionId: selectedSession,
        enrollmentId,
        status,
      });
      if (selectedSession) {
        fetchAttendanceForSession(selectedSession);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const handleUpdateAttendance = async (id: number, status: string) => {
    try {
      await api.put(`/attendance/${id}`, { status });
      if (selectedSession) {
        fetchAttendanceForSession(selectedSession);
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'success' | 'warning' | 'danger' } = {
      PRESENTE: 'success',
      TARDE: 'warning',
      AUSENTE: 'danger',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const attendanceColumns = [
    {
      key: 'company',
      label: 'Empresa',
      render: (item: AttendanceRecord) => item.enrollment.company.name,
    },
    {
      key: 'status',
      label: 'Estado',
      render: (item: AttendanceRecord) => getStatusBadge(item.status),
    },
    {
      key: 'notes',
      label: 'Notas',
      render: (item: AttendanceRecord) => item.notes || '-',
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (item: AttendanceRecord) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="success"
            onClick={() => handleUpdateAttendance(item.id, 'PRESENTE')}
          >
            Presente
          </Button>
          <Button
            size="sm"
            variant="warning"
            onClick={() => handleUpdateAttendance(item.id, 'TARDE')}
          >
            Tarde
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleUpdateAttendance(item.id, 'AUSENTE')}
          >
            Ausente
          </Button>
        </div>
      ),
    },
  ];

  const enrollmentColumns = [
    {
      key: 'company',
      label: 'Empresa',
      render: (item: any) => item.company.name,
    },
    {
      key: 'status',
      label: 'Estado Inscripción',
      render: (item: any) => <Badge variant="info">{item.status}</Badge>,
    },
    {
      key: 'actions',
      label: 'Marcar Asistencia',
      render: (item: any) => {
        const hasAttendance = attendances.find(a => a.enrollment.id === item.id);
        if (hasAttendance) {
          return <span className="text-sm text-gray-500">Ya registrado</span>;
        }
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="success"
              onClick={() => handleMarkAttendance(item.id, 'PRESENTE')}
            >
              <CheckCircleIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleMarkAttendance(item.id, 'AUSENTE')}
            >
              <XCircleIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const presentCount = attendances.filter((a) => a.status === 'PRESENTE').length;
  const lateCount = attendances.filter((a) => a.status === 'TARDE').length;
  const absentCount = attendances.filter((a) => a.status === 'AUSENTE').length;
  const totalCount = attendances.length;
  const attendanceRate = totalCount > 0 ? ((presentCount + lateCount) / totalCount) * 100 : 0;

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Control de Asistencia</h1>
        <p className="text-gray-600 mt-2">Registro de asistencia a sesiones de capacitación</p>
      </div>

      <div className="mb-6">
        <Card>
          <Select
            label="Seleccionar Sesión"
            value={selectedSession || ''}
            onChange={(e) => setSelectedSession(parseInt(e.target.value))}
            options={[
              { value: '', label: 'Seleccione una sesión...' },
              ...sessions.map((s) => ({
                value: s.id,
                label: `${s.program.name} - ${s.title} (${new Date(s.date).toLocaleDateString()})`,
              })),
            ]}
          />
        </Card>
      </div>

      {selectedSession && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Registros</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-gray-400" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Presentes</p>
                  <p className="text-2xl font-bold text-success-600">{presentCount}</p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-success-600" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tardanzas</p>
                  <p className="text-2xl font-bold text-warning-600">{lateCount}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">% Asistencia</p>
                  <p className="text-2xl font-bold text-primary-600">{attendanceRate.toFixed(1)}%</p>
                </div>
              </div>
            </Card>
          </div>

          <Card title="Registros de Asistencia" className="mb-6">
            <Table columns={attendanceColumns} data={attendances} loading={loading} />
          </Card>

          <Card title="Inscripciones sin Registrar">
            <Table 
              columns={enrollmentColumns} 
              data={enrollments.filter(e => !attendances.find(a => a.enrollment.id === e.id))} 
              loading={loading}
              emptyMessage="Todos los inscritos tienen asistencia registrada"
            />
          </Card>
        </>
      )}

      {!selectedSession && (
        <Card>
          <div className="text-center py-12">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Seleccione una sesión para ver y registrar asistencia</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Attendance;
