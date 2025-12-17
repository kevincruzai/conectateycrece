import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  ChartBarIcon, 
  AcademicCapIcon,
  SparklesIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const features = [
    {
      icon: UserGroupIcon,
      title: 'Identificación de Perfil',
      description: 'Conoce tu perfil emprendedor y conecta con oportunidades específicas para tu negocio.',
      color: 'text-primary-600 bg-primary-100'
    },
    {
      icon: AcademicCapIcon,
      title: 'Capacitación',
      description: 'Accede a programas de formación en digitalización, innovación y gestión empresarial.',
      color: 'text-success-600 bg-success-100'
    },
    {
      icon: SparklesIcon,
      title: 'Innovación',
      description: 'Fortalece tus capacidades en tecnología, IA y transformación digital.',
      color: 'text-danger-600 bg-danger-100'
    },
    {
      icon: GlobeAltIcon,
      title: 'Networking',
      description: 'Amplía tu red de contactos con otros emprendedores y mentores del ecosistema.',
      color: 'text-primary-600 bg-primary-100'
    },
    {
      icon: ChartBarIcon,
      title: 'Crecimiento',
      description: 'Recibe mentoría y acompañamiento para escalar tu emprendimiento.',
      color: 'text-success-600 bg-success-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6">
              Fortalece tu <span className="text-primary-600">Emprendimiento</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Únete al ecosistema emprendedor de El Salvador. Regístrate y accede a capacitación, 
              mentoría y oportunidades de crecimiento.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/formulario-emprendedores"
                className="px-8 py-4 bg-primary-600 text-white text-lg font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Registrar mi Emprendimiento
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              
              <a
                href="#como-funciona"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                ¿Cómo funciona?
              </a>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-success-600" />
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-success-600" />
                <span>10-15 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-success-600" />
                <span>Datos seguros</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-success-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      </div>

      {/* Features Section */}
      <div id="como-funciona" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿Qué obtendrás?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Al registrarte, tendrás acceso a un ecosistema completo de apoyo al emprendimiento
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Proceso Simple
            </h2>
            <p className="text-xl text-gray-600">
              Solo tres pasos para formar parte del ecosistema
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-success-400 to-warning-400 -z-0"></div>

            <div className="relative bg-white rounded-2xl p-8 shadow-lg border-2 border-primary-200">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Completa el Formulario
              </h3>
              <p className="text-gray-600 text-center">
                Comparte información sobre ti y tu emprendimiento. Solo toma 10-15 minutos.
              </p>
            </div>

            <div className="relative bg-white rounded-2xl p-8 shadow-lg border-2 border-success-200">
              <div className="w-16 h-16 bg-success-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Revisión y Análisis
              </h3>
              <p className="text-gray-600 text-center">
                Nuestro equipo analiza tu perfil para identificar las mejores oportunidades para ti.
              </p>
            </div>

            <div className="relative bg-white rounded-2xl p-8 shadow-lg border-2 border-warning-200">
              <div className="w-16 h-16 bg-warning-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Conexión y Apoyo
              </h3>
              <p className="text-gray-600 text-center">
                Te contactamos con programas, capacitaciones y recursos específicos para tu negocio.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para hacer crecer tu emprendimiento?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Únete a cientos de emprendedores que ya están transformando El Salvador
          </p>
          
          <Link
            to="/formulario-emprendedores"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 text-lg font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
          >
            Registrarme Ahora
            <ArrowRightIcon className="w-5 h-5" />
          </Link>

          <p className="text-primary-100 text-sm mt-6">
            Tus datos están protegidos según nuestra política de privacidad
          </p>
        </div>
      </div>

      {/* Partners Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm uppercase tracking-wider mb-8">
              Una iniciativa de
            </p>
            <div className="flex items-center justify-center gap-12">
              <div className="text-3xl font-bold text-primary-600">
                OEI El Salvador
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-3xl font-bold text-gray-700">
                Alice Lardé
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 OEI El Salvador & Alice Lardé - Sistema de Gestión Formativa</p>
          <p className="text-sm mt-2">Fortaleciendo el ecosistema emprendedor salvadoreño</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
