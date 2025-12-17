import { useState } from 'react';
import { 
  UserIcon, 
  BuildingStorefrontIcon, 
  LightBulbIcon, 
  BanknotesIcon,
  SparklesIcon,
  HeartIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const EntrepreneurForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // 1. Datos Generales
    fullName: '',
    dui: '',
    age: '',
    sex: '',
    email: '',
    phone: '',
    municipality: '',
    department: '',
    zone: '',

    // 2. Información del Emprendimiento
    businessName: '',
    startYear: '',
    businessStage: '',
    productiveSector: '',
    sectorOther: '',
    employeeCount: '',
    legalStatus: '',
    website: '',

    // 3. Motivaciones
    motivation: '',
    mission: '',
    desiredImpact: '',

    // 4. Aspectos Financieros
    fundingSources: [] as string[],
    hasTaxId: false,
    monthlySales: '',
    challenges: [] as string[],
    challengesOther: '',

    // 5. Innovación
    usesDigitalTools: false,
    digitalToolsList: '',
    interestedInTraining: false,
    hasInnovation: false,
    innovationDescription: '',

    // 6. Expectativas
    supportNeeded: [] as string[],
    willingToParticipate: false,
    trainingTopics: '',

    // 7. Declaración
    acceptsTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxGroup = (name: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[name as keyof typeof prev] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [name]: newArray };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Convertir strings a números
      const dataToSend = {
        ...formData,
        age: parseInt(formData.age),
        startYear: parseInt(formData.startYear),
        employeeCount: parseInt(formData.employeeCount),
      };

      await axios.post(`${API_URL}/entrepreneurs/public`, dataToSend);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al enviar el formulario');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const steps = [
    { number: 1, title: 'Datos Generales', icon: UserIcon },
    { number: 2, title: 'Tu Emprendimiento', icon: BuildingStorefrontIcon },
    { number: 3, title: 'Motivaciones', icon: HeartIcon },
    { number: 4, title: 'Aspectos Financieros', icon: BanknotesIcon },
    { number: 5, title: 'Innovación', icon: SparklesIcon },
    { number: 6, title: 'Apoyo Requerido', icon: LightBulbIcon },
    { number: 7, title: 'Confirmación', icon: CheckCircleIcon },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-success-50 to-primary-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="w-24 h-24 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-16 h-16 text-success-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Registro Exitoso!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Gracias por compartir tu información. Tu emprendimiento ha sido registrado exitosamente.
          </p>
          <p className="text-gray-500">
            El equipo Alice Lardé se pondrá en contacto contigo próximamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-success-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Formulario de Emprendedores
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Este formulario tiene como objetivo identificar y analizar el perfil de emprendedores salvadoreños 
            para fortalecer sus capacidades, fomentar la innovación y conectar sus iniciativas con oportunidades 
            de apoyo y formación.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep >= step.number
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs mt-2 text-center hidden md:block">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      currentStep > step.number ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-4 bg-danger-50 border-l-4 border-danger-500 rounded-lg">
                <p className="text-danger-800">{error}</p>
              </div>
            )}

            {/* Step 1: Datos Generales */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Datos Generales del Emprendedor</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      DUI (Documento Único de Identidad)
                    </label>
                    <input
                      type="text"
                      name="dui"
                      value={formData.dui}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="00000000-0"
                      maxLength={10}
                    />
                    <p className="text-xs text-gray-500 mt-1">Formato: 12345678-9 (Opcional)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Edad *
                    </label>
                    <input
                      type="number"
                      name="age"
                      required
                      min="18"
                      max="100"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sexo *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="sex"
                          value="MUJER"
                          checked={formData.sex === 'MUJER'}
                          onChange={handleInputChange}
                          required
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">Mujer</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="sex"
                          value="HOMBRE"
                          checked={formData.sex === 'HOMBRE'}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">Hombre</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="7890-1234"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Departamento *
                    </label>
                    <select
                      name="department"
                      required
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    >
                      <option value="">Selecciona tu departamento...</option>
                      <option value="Ahuachapán">Ahuachapán</option>
                      <option value="Santa Ana">Santa Ana</option>
                      <option value="Sonsonate">Sonsonate</option>
                      <option value="La Libertad">La Libertad</option>
                      <option value="San Salvador">San Salvador</option>
                      <option value="Chalatenango">Chalatenango</option>
                      <option value="Cuscatlán">Cuscatlán</option>
                      <option value="La Paz">La Paz</option>
                      <option value="Cabañas">Cabañas</option>
                      <option value="San Vicente">San Vicente</option>
                      <option value="Usulután">Usulután</option>
                      <option value="San Miguel">San Miguel</option>
                      <option value="Morazán">Morazán</option>
                      <option value="La Unión">La Unión</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Municipio *
                    </label>
                    <input
                      type="text"
                      name="municipality"
                      required
                      value={formData.municipality}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Ej: San Salvador, Santa Tecla, Soyapango..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Zona *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="zone"
                          value="URBANA"
                          checked={formData.zone === 'URBANA'}
                          onChange={handleInputChange}
                          required
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">Urbana</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="zone"
                          value="RURAL"
                          checked={formData.zone === 'RURAL'}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">Rural</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Información del Emprendimiento */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Información del Emprendimiento</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre del emprendimiento *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      required
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Ej: Café El Salvador, TechSolutions SV, Artesanías La Palma..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Año de inicio *
                    </label>
                    <input
                      type="number"
                      name="startYear"
                      required
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.startYear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Ej: 2023"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de empleados *
                    </label>
                    <input
                      type="number"
                      name="employeeCount"
                      required
                      min="0"
                      value={formData.employeeCount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Ej: 3"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Etapa actual del negocio *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['IDEA', 'EN_MARCHA', 'EN_CRECIMIENTO', 'CONSOLIDADO'].map(stage => (
                        <label key={stage} className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all">
                          <input
                            type="radio"
                            name="businessStage"
                            value={stage}
                            checked={formData.businessStage === stage}
                            onChange={handleInputChange}
                            required
                            className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {stage.replace('_', ' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Sector productivo *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { value: 'ARTES_VISUALES', label: 'Artes Visuales, Artesanías y Diseño' },
                        { value: 'MUSICA_ESCENICAS', label: 'Música y Artes Escénicas' },
                        { value: 'AUDIOVISUALES', label: 'Audiovisuales, Fotografía y Multimedia' },
                        { value: 'VIDEOJUEGOS', label: 'Videojuegos y Tecnologías Creativas' },
                        { value: 'EDITORIAL', label: 'Editorial y Medios Digitales' },
                        { value: 'PUBLICIDAD', label: 'Publicidad, Marketing y Servicios Creativos' },
                        { value: 'TURISMO_CULTURAL', label: 'Turismo Cultural y Patrimonio' },
                        { value: 'OTROS_SECTORES', label: 'Otros Sectores Económicos' },
                      ].map(sector => (
                        <label key={sector.value} className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all">
                          <input
                            type="radio"
                            name="productiveSector"
                            value={sector.value}
                            checked={formData.productiveSector === sector.value}
                            onChange={handleInputChange}
                            required
                            className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{sector.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.productiveSector === 'OTRO' && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Especifica el sector
                      </label>
                      <input
                        type="text"
                        name="sectorOther"
                        value={formData.sectorOther}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="Ej: Logística, Construcción, Salud y bienestar, Educación..."
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Forma legal *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all">
                        <input
                          type="radio"
                          name="legalStatus"
                          value="NO_FORMALIZADO"
                          checked={formData.legalStatus === 'NO_FORMALIZADO'}
                          onChange={handleInputChange}
                          required
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Sector no formalizado</span>
                      </label>
                      <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all">
                        <input
                          type="radio"
                          name="legalStatus"
                          value="PERSONA_NATURAL"
                          checked={formData.legalStatus === 'PERSONA_NATURAL'}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Persona Natural</span>
                      </label>
                      <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all">
                        <input
                          type="radio"
                          name="legalStatus"
                          value="SOCIEDAD_ANONIMA"
                          checked={formData.legalStatus === 'SOCIEDAD_ANONIMA'}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Sociedad anónima</span>
                      </label>
                      <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all">
                        <input
                          type="radio"
                          name="legalStatus"
                          value="ASOCIACION_COOPERATIVA"
                          checked={formData.legalStatus === 'ASOCIACION_COOPERATIVA'}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Asociación o cooperativa</span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Página web o redes sociales
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Ej: https://facebook.com/minegocio, https://instagram.com/minegocio"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Motivaciones */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Motivaciones y Objetivos</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿Qué te motivó a emprender? *
                    </label>
                    <textarea
                      name="motivation"
                      required
                      rows={4}
                      value={formData.motivation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Ej: Vi una oportunidad en el mercado local para ofrecer productos orgánicos de calidad. Quería generar empleo en mi comunidad y crear un negocio sostenible que beneficie a productores locales..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿Cuál es la misión de tu emprendimiento? *
                    </label>
                    <textarea
                      name="mission"
                      required
                      rows={4}
                      value={formData.mission}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Ej: Ofrecer productos artesanales de alta calidad que preserven las tradiciones salvadoreñas, mientras generamos oportunidades económicas para artesanos locales y promovemos el consumo responsable..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿Qué impacto deseas generar en tu comunidad o país? *
                    </label>
                    <textarea
                      name="desiredImpact"
                      required
                      rows={4}
                      value={formData.desiredImpact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Ej: Crear empleos dignos en mi comunidad, rescatar técnicas artesanales tradicionales, reducir la migración al ofrecer oportunidades locales, y posicionar los productos salvadoreños en el mercado internacional..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Aspectos Financieros */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Aspectos Financieros y Operativos</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Fuentes de financiamiento actuales * (selecciona todas las que apliquen)
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        { value: 'AHORROS_PROPIOS', label: 'Ahorros propios' },
                        { value: 'FAMILIARES', label: 'Familiares/amigos' },
                        { value: 'FONDOS_NO_REEMBOLSABLES', label: 'Fondos no reembolsables (capital semilla)' },
                        { value: 'CREDITOS', label: 'Créditos' },
                        { value: 'PRESTAMOS_INFORMALES', label: 'Préstamos informales' },
                        { value: 'INVERSIONISTAS', label: 'Inversionistas' },
                      ].map(source => (
                        <label key={source.value} className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all">
                          <input
                            type="checkbox"
                            checked={formData.fundingSources.includes(source.value)}
                            onChange={() => handleCheckboxGroup('fundingSources', source.value)}
                            className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded"
                          />
                          <span className="ml-3 text-gray-700">{source.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿Tu emprendimiento cuenta con registro tributario (NIT)? *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all flex-1">
                        <input
                          type="radio"
                          name="hasTaxId"
                          value="true"
                          checked={formData.hasTaxId === true}
                          onChange={() => setFormData(prev => ({ ...prev, hasTaxId: true }))}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">Sí</span>
                      </label>
                      <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all flex-1">
                        <input
                          type="radio"
                          name="hasTaxId"
                          value="false"
                          checked={formData.hasTaxId === false}
                          onChange={() => setFormData(prev => ({ ...prev, hasTaxId: false }))}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ventas promedio mensuales (USD) *
                    </label>
                    <select
                      name="monthlySales"
                      required
                      value={formData.monthlySales}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    >
                      <option value="">Selecciona...</option>
                      <option value="<100">Menos de $100</option>
                      <option value="100-500">$100 - $500</option>
                      <option value="500-2000">$500 - $2,000</option>
                      <option value=">2000">Más de $2,000</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Principales desafíos que enfrentas * (selecciona todos los que apliquen)
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        { value: 'FINANCIAMIENTO', label: 'Financiamiento' },
                        { value: 'COMERCIALIZACION', label: 'Comercialización' },
                        { value: 'TECNOLOGIA', label: 'Tecnología' },
                        { value: 'CAPACITACION', label: 'Capacitación' },
                        { value: 'FORMALIZACION', label: 'Formalización' },
                        { value: 'RRHH', label: 'Recursos humanos' },
                        { value: 'OTRO', label: 'Otro' },
                      ].map(challenge => (
                        <label key={challenge.value} className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all">
                          <input
                            type="checkbox"
                            checked={formData.challenges.includes(challenge.value)}
                            onChange={() => handleCheckboxGroup('challenges', challenge.value)}
                            className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded"
                          />
                          <span className="ml-3 text-gray-700">{challenge.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {formData.challenges.includes('OTRO') && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Especifica otros desafíos
                      </label>
                      <input
                        type="text"
                        name="challengesOther"
                        value={formData.challengesOther}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="Ej: Logística de distribución, acceso a materia prima, etc."
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Innovación */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Innovación y Tecnología</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿Utilizas herramientas digitales o tecnológicas en tu negocio? *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all flex-1">
                        <input
                          type="radio"
                          name="usesDigitalTools"
                          value="true"
                          checked={formData.usesDigitalTools === true}
                          onChange={() => setFormData(prev => ({ ...prev, usesDigitalTools: true }))}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">Sí</span>
                      </label>
                      <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all flex-1">
                        <input
                          type="radio"
                          name="usesDigitalTools"
                          value="false"
                          checked={formData.usesDigitalTools === false}
                          onChange={() => setFormData(prev => ({ ...prev, usesDigitalTools: false }))}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  {formData.usesDigitalTools && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ¿Cuáles herramientas digitales utilizas?
                      </label>
                      <textarea
                        name="digitalToolsList"
                        rows={3}
                        value={formData.digitalToolsList}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="Ej: Facebook e Instagram para marketing, WhatsApp Business para atención al cliente, Excel para inventarios, Canva para diseños..."
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿Te interesa recibir capacitación en IA, marketing digital o transformación tecnológica? *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all flex-1">
                        <input
                          type="radio"
                          name="interestedInTraining"
                          value="true"
                          checked={formData.interestedInTraining === true}
                          onChange={() => setFormData(prev => ({ ...prev, interestedInTraining: true }))}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">Sí</span>
                      </label>
                      <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all flex-1">
                        <input
                          type="radio"
                          name="interestedInTraining"
                          value="false"
                          checked={formData.interestedInTraining === false}
                          onChange={() => setFormData(prev => ({ ...prev, interestedInTraining: false }))}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿Has desarrollado algún producto o servicio innovador? *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all flex-1">
                        <input
                          type="radio"
                          name="hasInnovation"
                          value="true"
                          checked={formData.hasInnovation === true}
                          onChange={() => setFormData(prev => ({ ...prev, hasInnovation: true }))}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">Sí</span>
                      </label>
                      <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all flex-1">
                        <input
                          type="radio"
                          name="hasInnovation"
                          value="false"
                          checked={formData.hasInnovation === false}
                          onChange={() => setFormData(prev => ({ ...prev, hasInnovation: false }))}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  {formData.hasInnovation && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descríbelo brevemente
                      </label>
                      <textarea
                        name="innovationDescription"
                        rows={4}
                        value={formData.innovationDescription}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                        placeholder="Ej: Desarrollamos un empaque biodegradable hecho de hojas de plátano que mantiene frescos los alimentos sin usar plástico. Es el primero de su tipo en Centroamérica y ha reducido costos de empaque en un 30%..."
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 6: Expectativas */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Expectativas y Apoyo Requerido</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      ¿Qué tipo de apoyo consideras más necesario? * (selecciona todos los que apliquen)
                    </label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        { value: 'CAPACITACION', label: 'Capacitación' },
                        { value: 'MENTORIA', label: 'Mentoría' },
                        { value: 'FINANCIAMIENTO', label: 'Financiamiento' },
                        { value: 'NETWORKING', label: 'Networking' },
                        { value: 'DIGITALIZACION', label: 'Digitalización' },
                        { value: 'ACCESO_MERCADOS', label: 'Acceso a mercados' },
                      ].map(support => (
                        <label key={support.value} className="flex items-center cursor-pointer p-3 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all">
                          <input
                            type="checkbox"
                            checked={formData.supportNeeded.includes(support.value)}
                            onChange={() => handleCheckboxGroup('supportNeeded', support.value)}
                            className="w-5 h-5 text-primary-600 focus:ring-primary-500 rounded"
                          />
                          <span className="ml-3 text-gray-700">{support.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿Estarías dispuesto a participar en talleres o programas presenciales/virtuales? *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all flex-1">
                        <input
                          type="radio"
                          name="willingToParticipate"
                          value="true"
                          checked={formData.willingToParticipate === true}
                          onChange={() => setFormData(prev => ({ ...prev, willingToParticipate: true }))}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">Sí</span>
                      </label>
                      <label className="flex items-center cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-all flex-1">
                        <input
                          type="radio"
                          name="willingToParticipate"
                          value="false"
                          checked={formData.willingToParticipate === false}
                          onChange={() => setFormData(prev => ({ ...prev, willingToParticipate: false }))}
                          className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿Qué temas te gustaría que se aborden en futuras capacitaciones?
                    </label>
                    <textarea
                      name="trainingTopics"
                      rows={4}
                      value={formData.trainingTopics}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="Ej: Marketing digital en redes sociales, finanzas para emprendedores, cómo usar inteligencia artificial en mi negocio, liderazgo y gestión de equipos, estrategias de ventas..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Confirmación */}
            {currentStep === 7 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Declaración y Confirmación</h2>
                
                <div className="bg-primary-50 border-2 border-primary-200 rounded-2xl p-6 mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    Declaro que los datos proporcionados son verídicos y autorizo a la{' '}
                    <strong>OEI (Organización de Estados Iberoamericanos)</strong> a utilizarlos únicamente con fines de diagnóstico, 
                    vinculación y fortalecimiento del ecosistema emprendedor en El Salvador.
                  </p>
                </div>

                <label className="flex items-start cursor-pointer p-6 border-2 border-gray-300 rounded-2xl hover:border-primary-500 transition-all bg-white">
                  <input
                    type="checkbox"
                    name="acceptsTerms"
                    checked={formData.acceptsTerms}
                    onChange={handleInputChange}
                    required
                    className="w-6 h-6 text-primary-600 focus:ring-primary-500 rounded mt-1"
                  />
                  <span className="ml-4 text-gray-700 font-medium">
                    Acepto los términos y condiciones, y autorizo el uso de mis datos según lo descrito. *
                  </span>
                </label>

                <div className="bg-success-50 border-2 border-success-200 rounded-2xl p-6">
                  <p className="text-success-800 font-medium mb-2">
                    ¡Estás a punto de completar tu registro!
                  </p>
                  <p className="text-success-700 text-sm">
                    Al enviar este formulario, tu información será registrada y el equipo Alice Lardé se pondrá 
                    en contacto contigo para brindarte el apoyo que necesitas para hacer crecer tu emprendimiento.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t-2 border-gray-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  ← Anterior
                </button>
              )}
              
              {currentStep < 7 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !formData.acceptsTerms}
                  className="ml-auto px-8 py-4 bg-success-600 text-white font-bold text-lg rounded-xl hover:bg-success-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-6 h-6" />
                      Enviar Formulario
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2025 OEI El Salvador & Alice Lardé - Sistema de Gestión Formativa</p>
        </div>
      </div>
    </div>
  );
};

export default EntrepreneurForm;
