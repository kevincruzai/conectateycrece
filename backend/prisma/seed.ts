import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Crear usuario admin por defecto
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@oei.sv' },
    update: {},
    create: {
      email: 'admin@oei.sv',
      username: 'admin',
      password: hashedPassword,
      fullName: 'Administrador OEI',
      role: 'ADMIN_OEI',
      isActive: true,
      isApproved: true,
    },
  });

  console.log('✅ Usuario admin creado:', admin.email);

  // Crear catálogos de sectores económicos
  const sectores = [
    'Tecnología e Innovación',
    'Agroindustria',
    'Manufactura',
    'Comercio y Servicios',
    'Turismo y Gastronomía',
    'Textil y Confección',
    'Construcción',
    'Salud y Bienestar',
    'Educación y Formación',
    'Otro',
  ];

  for (let i = 0; i < sectores.length; i++) {
    await prisma.catalog.upsert({
      where: { id: `sector-${i + 1}` },
      update: {},
      create: {
        id: `sector-${i + 1}`,
        category: 'SECTOR_ECONOMICO',
        value: sectores[i].toLowerCase().replace(/\s+/g, '_'),
        label: sectores[i],
        order: i + 1,
      },
    });
  }

  console.log(`✅ ${sectores.length} sectores económicos creados`);

  // Crear catálogos de departamentos
  const departamentos = [
    'Ahuachapán',
    'Cabañas',
    'Chalatenango',
    'Cuscatlán',
    'La Libertad',
    'La Paz',
    'La Unión',
    'Morazán',
    'San Miguel',
    'San Salvador',
    'San Vicente',
    'Santa Ana',
    'Sonsonate',
    'Usulután',
  ];

  for (let i = 0; i < departamentos.length; i++) {
    await prisma.catalog.upsert({
      where: { id: `dept-${i + 1}` },
      update: {},
      create: {
        id: `dept-${i + 1}`,
        category: 'DEPARTAMENTO',
        value: departamentos[i].toLowerCase().replace(/\s+/g, '_'),
        label: departamentos[i],
        order: i + 1,
      },
    });
  }

  console.log(`✅ ${departamentos.length} departamentos creados`);

  // Crear catálogos de tamaño de empresa
  const tamaños = [
    { value: 'MICRO', label: 'Microempresa (1-10 empleados)' },
    { value: 'PEQUEÑA', label: 'Pequeña Empresa (11-50 empleados)' },
    { value: 'MEDIANA', label: 'Mediana Empresa (51-100 empleados)' },
    { value: 'EMPRENDIMIENTO', label: 'Emprendimiento (Inicio)' },
  ];

  for (let i = 0; i < tamaños.length; i++) {
    await prisma.catalog.upsert({
      where: { id: `size-${i + 1}` },
      update: {},
      create: {
        id: `size-${i + 1}`,
        category: 'TAMANO_EMPRESA',
        value: tamaños[i].value,
        label: tamaños[i].label,
        order: i + 1,
      },
    });
  }

  console.log(`✅ ${tamaños.length} tamaños de empresa creados`);

  // Crear catálogos de competencias
  const competencias = [
    'Transformación Digital',
    'Marketing Digital',
    'E-commerce',
    'Gestión Financiera',
    'Liderazgo y Gestión',
    'Innovación y Creatividad',
    'Comunicación Efectiva',
    'Trabajo en Equipo',
    'Planificación Estratégica',
    'Servicio al Cliente',
  ];

  for (let i = 0; i < competencias.length; i++) {
    await prisma.catalog.upsert({
      where: { id: `comp-${i + 1}` },
      update: {},
      create: {
        id: `comp-${i + 1}`,
        category: 'COMPETENCIA',
        value: competencias[i].toLowerCase().replace(/\s+/g, '_'),
        label: competencias[i],
        order: i + 1,
      },
    });
  }

  console.log(`✅ ${competencias.length} competencias creadas`);

  // Crear configuraciones del sistema
  await prisma.systemConfig.upsert({
    where: { key: 'organization_name' },
    update: {},
    create: {
      key: 'organization_name',
      value: 'OEI El Salvador - Proyecto ALICE LARDÉ',
      description: 'Nombre de la organización',
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'min_attendance_percentage' },
    update: {},
    create: {
      key: 'min_attendance_percentage',
      value: '80',
      description: 'Porcentaje mínimo de asistencia requerido',
    },
  });

  await prisma.systemConfig.upsert({
    where: { key: 'min_passing_score' },
    update: {},
    create: {
      key: 'min_passing_score',
      value: '7.0',
      description: 'Calificación mínima para aprobar (sobre 10)',
    },
  });

  console.log('✅ Configuraciones del sistema creadas');

  // Crear emprendedores de ejemplo
  const entrepreneursData = [
    {
      fullName: 'María Elena García López',
      dui: '12345678-9',
      age: 32,
      sex: 'FEMENINO',
      email: 'maria.garcia@example.com',
      phone: '7890-1234',
      municipality: 'San Salvador',
      department: 'San Salvador',
      zone: 'URBANA',
      businessName: 'Café Orgánico El Salvador',
      startYear: 2021,
      businessStage: 'EN_CRECIMIENTO',
      productiveSector: 'AGROINDUSTRIA',
      employeeCount: 8,
      legalStatus: 'FORMAL',
      website: 'https://instagram.com/cafeorganicosv',
      motivation: 'Vi una oportunidad en el mercado local para ofrecer productos orgánicos de calidad. Quería generar empleo en mi comunidad y crear un negocio sostenible.',
      mission: 'Ofrecer café 100% orgánico salvadoreño de alta calidad, apoyando a productores locales y promoviendo prácticas agrícolas sostenibles.',
      desiredImpact: 'Crear empleos dignos en zonas rurales, preservar técnicas tradicionales de cultivo de café y posicionar el café salvadoreño en mercados internacionales.',
      fundingSources: JSON.stringify(['AHORROS_PROPIOS', 'FAMILIARES', 'CREDITOS']),
      hasTaxId: true,
      monthlySales: '500-2000',
      challenges: JSON.stringify(['COMERCIALIZACION', 'TECNOLOGIA', 'ACCESO_MERCADOS']),
      usesDigitalTools: true,
      digitalToolsList: 'Instagram, Facebook, WhatsApp Business, Excel para inventarios',
      interestedInTraining: true,
      hasInnovation: true,
      innovationDescription: 'Implementamos un sistema de trazabilidad con QR que permite a clientes conocer el origen exacto de su café y al productor que lo cultivó.',
      supportNeeded: JSON.stringify(['CAPACITACION', 'DIGITALIZACION', 'ACCESO_MERCADOS']),
      willingToParticipate: true,
      trainingTopics: 'Marketing digital, exportaciones, uso de redes sociales',
      acceptsTerms: true,
    },
    {
      fullName: 'Carlos Alberto Martínez',
      dui: '23456789-0',
      age: 28,
      sex: 'MASCULINO',
      email: 'carlos.martinez@example.com',
      phone: '7123-4567',
      municipality: 'Santa Tecla',
      department: 'La Libertad',
      zone: 'URBANA',
      businessName: 'TechSolutions SV',
      startYear: 2022,
      businessStage: 'EN_MARCHA',
      productiveSector: 'TECNOLOGIA',
      employeeCount: 5,
      legalStatus: 'FORMAL',
      website: 'https://techsolutionssv.com',
      motivation: 'Identifiqué que muchas MIPYMES necesitan soluciones tecnológicas accesibles para digitalizar sus negocios.',
      mission: 'Democratizar el acceso a tecnología ofreciendo soluciones web y móviles de calidad a precios accesibles para pequeñas empresas.',
      desiredImpact: 'Contribuir a la transformación digital de El Salvador ayudando a MIPYMES a competir en la era digital y generar empleo en el sector tecnológico.',
      fundingSources: JSON.stringify(['AHORROS_PROPIOS', 'INVERSIONISTAS']),
      hasTaxId: true,
      monthlySales: '500-2000',
      challenges: JSON.stringify(['FINANCIAMIENTO', 'COMERCIALIZACION', 'RRHH']),
      usesDigitalTools: true,
      digitalToolsList: 'Google Workspace, Trello, Figma, GitHub, LinkedIn para marketing B2B',
      interestedInTraining: true,
      hasInnovation: true,
      innovationDescription: 'Desarrollamos una plataforma SaaS que permite a negocios locales crear su tienda online en menos de 24 horas sin conocimientos técnicos.',
      supportNeeded: JSON.stringify(['FINANCIAMIENTO', 'MENTORIA', 'NETWORKING']),
      willingToParticipate: true,
      trainingTopics: 'Inteligencia artificial, gestión de proyectos, ventas B2B, pitch de inversión',
      acceptsTerms: true,
    },
    {
      fullName: 'Ana Sofía Ramírez',
      dui: '34567890-1',
      age: 35,
      sex: 'FEMENINO',
      email: 'ana.ramirez@example.com',
      phone: '7234-5678',
      municipality: 'Sonsonate',
      department: 'Sonsonate',
      zone: 'RURAL',
      businessName: 'Artesanías La Palma',
      startYear: 2019,
      businessStage: 'CONSOLIDADO',
      productiveSector: 'ECONOMIA_CREATIVA',
      employeeCount: 15,
      legalStatus: 'FORMAL',
      website: 'https://facebook.com/artesaniaslapalma',
      motivation: 'Quería preservar las técnicas artesanales de mi comunidad y crear oportunidades para artesanos locales.',
      mission: 'Producir artesanías salvadoreñas de alta calidad que preserven tradiciones culturales y generen ingresos sostenibles para artesanos.',
      desiredImpact: 'Rescatar técnicas artesanales en peligro de desaparecer, reducir migración creando empleos locales y promover cultura salvadoreña.',
      fundingSources: JSON.stringify(['AHORROS_PROPIOS', 'PROGRAMAS_GOB', 'COOPERATIVAS']),
      hasTaxId: true,
      monthlySales: '>2000',
      challenges: JSON.stringify(['TECNOLOGIA', 'DIGITALIZACION', 'ACCESO_MERCADOS']),
      usesDigitalTools: true,
      digitalToolsList: 'Facebook, Instagram, WhatsApp para pedidos',
      interestedInTraining: true,
      hasInnovation: false,
      supportNeeded: JSON.stringify(['CAPACITACION', 'DIGITALIZACION', 'ACCESO_MERCADOS', 'NETWORKING']),
      willingToParticipate: true,
      trainingTopics: 'E-commerce, fotografía de productos, redes sociales, envíos internacionales',
      acceptsTerms: true,
    },
    {
      fullName: 'José Roberto Hernández',
      dui: '45678901-2',
      age: 42,
      sex: 'MASCULINO',
      email: 'jose.hernandez@example.com',
      phone: '7345-6789',
      municipality: 'Santa Ana',
      department: 'Santa Ana',
      zone: 'URBANA',
      businessName: 'Restaurante Típico Cuscatleco',
      startYear: 2015,
      businessStage: 'CONSOLIDADO',
      productiveSector: 'TURISMO',
      employeeCount: 22,
      legalStatus: 'FORMAL',
      website: 'https://instagram.com/cuscatlecorestaurante',
      motivation: 'Pasión por la gastronomía salvadoreña y deseo de compartir nuestra cultura a través de la comida tradicional.',
      mission: 'Ofrecer experiencias gastronómicas auténticas que celebren la cocina salvadoreña y apoyen a productores locales de ingredientes.',
      desiredImpact: 'Promover turismo local, preservar recetas tradicionales y crear empleos en el sector gastronómico.',
      fundingSources: JSON.stringify(['AHORROS_PROPIOS', 'CREDITOS', 'FAMILIARES']),
      hasTaxId: true,
      monthlySales: '>2000',
      challenges: JSON.stringify(['TECNOLOGIA', 'RRHH', 'COMERCIALIZACION']),
      usesDigitalTools: true,
      digitalToolsList: 'Instagram, Facebook, sistema POS, reservaciones online',
      interestedInTraining: true,
      hasInnovation: true,
      innovationDescription: 'Creamos un menú digital interactivo con códigos QR que cuenta la historia de cada platillo y su origen cultural.',
      supportNeeded: JSON.stringify(['CAPACITACION', 'DIGITALIZACION', 'MENTORIA']),
      willingToParticipate: true,
      trainingTopics: 'Marketing turístico, gestión de personal, innovación en menús, sostenibilidad',
      acceptsTerms: true,
    },
    {
      fullName: 'Patricia Isabel Flores',
      age: 29,
      sex: 'FEMENINO',
      email: 'patricia.flores@example.com',
      phone: '7456-7890',
      municipality: 'San Miguel',
      department: 'San Miguel',
      zone: 'URBANA',
      businessName: 'EcoEmpaques Verdes',
      startYear: 2023,
      businessStage: 'EN_MARCHA',
      productiveSector: 'MANUFACTURA',
      employeeCount: 4,
      legalStatus: 'INFORMAL',
      motivation: 'Preocupación por el medio ambiente y oportunidad de crear empaques biodegradables accesibles.',
      mission: 'Producir empaques 100% biodegradables que ayuden a reducir la contaminación plástica en El Salvador.',
      desiredImpact: 'Reducir uso de plásticos, educar sobre sostenibilidad y crear empleos verdes en la zona oriental.',
      fundingSources: JSON.stringify(['AHORROS_PROPIOS']),
      hasTaxId: false,
      monthlySales: '100-500',
      challenges: JSON.stringify(['FINANCIAMIENTO', 'FORMALIZACION', 'COMERCIALIZACION', 'TECNOLOGIA']),
      usesDigitalTools: false,
      interestedInTraining: true,
      hasInnovation: true,
      innovationDescription: 'Desarrollamos empaques de hojas de plátano que mantienen alimentos frescos sin usar plástico, primeros en Centroamérica.',
      supportNeeded: JSON.stringify(['FINANCIAMIENTO', 'CAPACITACION', 'FORMALIZACION', 'MENTORIA']),
      willingToParticipate: true,
      trainingTopics: 'Formalización de negocios, contabilidad básica, marketing, financiamiento',
      acceptsTerms: true,
    },
    {
      fullName: 'Luis Fernando Castillo',
      dui: '56789012-3',
      age: 38,
      sex: 'MASCULINO',
      email: 'luis.castillo@example.com',
      phone: '7567-8901',
      municipality: 'Antiguo Cuscatlán',
      department: 'La Libertad',
      zone: 'URBANA',
      businessName: 'Gimnasio FitLife',
      startYear: 2020,
      businessStage: 'EN_CRECIMIENTO',
      productiveSector: 'SERVICIOS',
      employeeCount: 12,
      legalStatus: 'FORMAL',
      website: 'https://instagram.com/fitlifesv',
      motivation: 'Promover estilos de vida saludables y crear espacios de bienestar accesibles en mi comunidad.',
      mission: 'Ofrecer servicios fitness de calidad que transformen vidas a través del ejercicio y la nutrición.',
      desiredImpact: 'Mejorar salud pública, reducir enfermedades relacionadas con sedentarismo y crear cultura fitness.',
      fundingSources: JSON.stringify(['CREDITOS', 'AHORROS_PROPIOS', 'INVERSIONISTAS']),
      hasTaxId: true,
      monthlySales: '>2000',
      challenges: JSON.stringify(['RRHH', 'TECNOLOGIA', 'COMERCIALIZACION']),
      usesDigitalTools: true,
      digitalToolsList: 'Instagram, app de reservaciones, sistema de membresías, Zoom para clases virtuales',
      interestedInTraining: true,
      hasInnovation: true,
      innovationDescription: 'Implementamos clases híbridas (presencial y virtual) con seguimiento personalizado vía app.',
      supportNeeded: JSON.stringify(['CAPACITACION', 'DIGITALIZACION', 'NETWORKING']),
      willingToParticipate: true,
      trainingTopics: 'Aplicaciones móviles, retención de clientes, marketing fitness',
      acceptsTerms: true,
    },
    {
      fullName: 'Carmen Lucía Morales',
      age: 26,
      sex: 'FEMENINO',
      email: 'carmen.morales@example.com',
      phone: '7678-9012',
      municipality: 'Chalatenango',
      department: 'Chalatenango',
      zone: 'RURAL',
      businessName: 'Miel de Montaña',
      startYear: 2024,
      businessStage: 'IDEA',
      productiveSector: 'AGROINDUSTRIA',
      employeeCount: 2,
      legalStatus: 'INFORMAL',
      motivation: 'Aprovechar recursos naturales de mi comunidad y crear una fuente de ingresos sostenible.',
      mission: 'Producir miel 100% natural y orgánica mientras conservamos el medio ambiente y apoyamos la apicultura local.',
      desiredImpact: 'Conservar biodiversidad, crear empleos rurales y posicionar productos apícolas salvadoreños.',
      fundingSources: JSON.stringify(['AHORROS_PROPIOS', 'FAMILIARES']),
      hasTaxId: false,
      monthlySales: '<100',
      challenges: JSON.stringify(['FINANCIAMIENTO', 'CAPACITACION', 'COMERCIALIZACION', 'FORMALIZACION', 'TECNOLOGIA']),
      challengesOther: 'Acceso a equipamiento apícola',
      usesDigitalTools: false,
      interestedInTraining: true,
      hasInnovation: false,
      supportNeeded: JSON.stringify(['FINANCIAMIENTO', 'CAPACITACION', 'MENTORIA', 'FORMALIZACION']),
      willingToParticipate: true,
      trainingTopics: 'Apicultura, formalización, etiquetado, permisos sanitarios, ventas',
      acceptsTerms: true,
    },
    {
      fullName: 'Roberto Carlos Sandoval',
      dui: '67890123-4',
      age: 45,
      sex: 'MASCULINO',
      email: 'roberto.sandoval@example.com',
      phone: '7789-0123',
      municipality: 'Ahuachapán',
      department: 'Ahuachapán',
      zone: 'URBANA',
      businessName: 'Carpintería Moderna',
      startYear: 2010,
      businessStage: 'CONSOLIDADO',
      productiveSector: 'MANUFACTURA',
      employeeCount: 18,
      legalStatus: 'FORMAL',
      website: 'https://facebook.com/carpinteriamoderna',
      motivation: 'Tradición familiar en carpintería y deseo de modernizar el oficio con nuevas técnicas.',
      mission: 'Crear muebles de alta calidad combinando técnicas artesanales tradicionales con diseño contemporáneo.',
      desiredImpact: 'Preservar oficios tradicionales, generar empleos calificados y exportar muebles salvadoreños.',
      fundingSources: JSON.stringify(['AHORROS_PROPIOS', 'CREDITOS', 'COOPERATIVAS']),
      hasTaxId: true,
      monthlySales: '>2000',
      challenges: JSON.stringify(['TECNOLOGIA', 'DIGITALIZACION', 'ACCESO_MERCADOS']),
      usesDigitalTools: true,
      digitalToolsList: 'Facebook, WhatsApp, software de diseño CAD',
      interestedInTraining: true,
      hasInnovation: true,
      innovationDescription: 'Usamos tecnología CNC para cortes precisos combinados con acabados artesanales, logrando productos únicos.',
      supportNeeded: JSON.stringify(['CAPACITACION', 'DIGITALIZACION', 'ACCESO_MERCADOS']),
      willingToParticipate: true,
      trainingTopics: 'Marketing digital, fotografía de productos, exportaciones, diseño 3D',
      acceptsTerms: true,
    },
  ];

  for (const data of entrepreneursData) {
    await prisma.entrepreneur.create({ data });
  }

  console.log(`✅ ${entrepreneursData.length} emprendedores de ejemplo creados`);

  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║  ✅ SEED COMPLETADO EXITOSAMENTE                          ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📧 Credenciales de acceso:');
  console.log('   Email: admin@oei.sv');
  console.log('   Contraseña: admin123');
  console.log('');
  console.log(`📊 Datos creados: ${entrepreneursData.length} emprendedores de ejemplo`);
  console.log('');
  console.log('⚠️  IMPORTANTE: Cambiar la contraseña del admin en producción');
  console.log('');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error en seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
