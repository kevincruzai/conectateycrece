import React, { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, FunnelIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { Card, Button, Select, Input } from '../components';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import api from '../services/api';

const Reports = () => {
  const [reportType, setReportType] = useState('general');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const [reportData, setReportData] = useState({
    companiesBySector: [],
    enrollmentsByProgram: [],
    attendanceByMonth: [],
    evaluationStats: [],
    topCompanies: [],
  });

  useEffect(() => {
    fetchReportData();
  }, [reportType, startDate, endDate]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports', {
        params: {
          type: reportType,
          startDate,
          endDate,
        },
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await api.get('/reports/export/pdf', {
        params: { type: reportType, startDate, endDate },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await api.get('/reports/export/excel', {
        params: { type: reportType, startDate, endDate },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reportes y Análisis</h1>
        <p className="text-gray-600 mt-2">Visualización de datos y estadísticas del sistema</p>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Tipo de Reporte"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            options={[
              { value: 'general', label: 'General' },
              { value: 'companies', label: 'Empresas' },
              { value: 'programs', label: 'Programas' },
              { value: 'attendance', label: 'Asistencia' },
              { value: 'evaluations', label: 'Evaluaciones' },
            ]}
          />

          <Input
            label="Fecha Inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            label="Fecha Fin"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <div className="flex items-end gap-2">
            <Button variant="secondary" onClick={fetchReportData}>
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filtrar
            </Button>
            <Button variant="secondary" onClick={handleExportExcel}>
              <ArrowDownTrayIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Empresas por Sector">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.companiesBySector}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reportData.companiesBySector.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Inscripciones por Programa">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.enrollmentsByProgram}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="inscripciones" fill="#3B82F6" />
              <Bar dataKey="completados" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Tendencia de Asistencia Mensual">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData.attendanceByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="asistencia" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="ausencias" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Estadísticas de Evaluaciones">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.evaluationStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="programa" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="promedio" fill="#8B5CF6" />
              <Bar dataKey="aprobados" fill="#10B981" />
              <Bar dataKey="reprobados" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Top 10 Empresas con Mejor Desempeño">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Programas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asistencia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promedio</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.topCompanies.map((company: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{company.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.programsCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.attendance}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.averageGrade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
