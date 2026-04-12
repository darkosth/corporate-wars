
export const BUILDINGS = {
  OFFICE: {
    id: "OFFICE",
    name: "Centro de Operaciones",
    description: "Espacio vital para tus programadores. Donde la magia sucede y el código cobra vida.",
    basePrice: 15000,
    baseMaintenance: 100, 
    baseRevenue: 250,     
    capacityPerLevel: 5,  
    emoji: "🏢"
  },
  DATACENTER: {
    id: "DATACENTER",
    name: "Centro de Datos (I+D)",
    description: "Servidores de alto rendimiento para tus Analistas e investigación.",
    basePrice: 25000,
    baseMaintenance: 200,
    baseRevenue: 600,     
    capacityPerLevel: 5,
    emoji: "🗄️"
  },
  BASEMENT: {
    id: "BASEMENT",
    name: "Operaciones Encubiertas",
    description: "Búnker irrastreable. El hogar perfecto para tus Saboteadores.",
    basePrice: 40000,
    baseMaintenance: 500,
    baseRevenue: 1000,    
    capacityPerLevel: 10,
    emoji: "☢️"
  }
}

export const EMPLOYEES = {
  PROGRAMMER: {
    id: "PROGRAMMER",
    name: "Programador",
    description: "Escribe código de alta frecuencia. El pilar de tus ingresos.",
    costToHire: 1500,     
    salaryPerHour: 800,   
    revenuePerHour: 2000, 
    requiredBuilding: "OFFICE",
    emoji: "👨‍💻"
  },
  ANALYST: {
    id: "ANALYST",
    name: "Analista de Datos",
    description: "Genera Puntos de Tecnología (PT) en lugar de dinero líquido.",
    costToHire: 3000,
    salaryPerHour: 1200,
    revenuePerHour: 0, // Genera otra moneda en el futuro
    requiredBuilding: "DATACENTER",
    emoji: "📊"
  },
  SABOTEUR: {
    id: "SABOTEUR",
    name: "Saboteador",
    description: "Infiltra y destruye activos de corporaciones rivales.",
    costToHire: 10000,
    salaryPerHour: 2500,
    revenuePerHour: 0, // Solo ataca
    requiredBuilding: "BASEMENT",
    emoji: "🥷"
  }
}