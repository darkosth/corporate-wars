
export const BUILDINGS = {
  OFFICE: {
    id: "OFFICE",
    name: "Centro de Operaciones",
    description: "Espacio vital para tus programadores. Donde la magia sucede y el código cobra vida.",
    emoji: "🏢",
    basePrice: 15000,
    levels: {
      1: { upgradeCost: 0, maintenance: 100, revenue: 250, capacity: 5 },
      2: { upgradeCost: 30000, maintenance: 150, revenue: 600, capacity: 10 },
      3: { upgradeCost: 60000, maintenance: 250, revenue: 1200, capacity: 20 },
      4: { upgradeCost: 120000, maintenance: 400, revenue: 2500, capacity: 40 },
      5: { upgradeCost: 240000, maintenance: 700, revenue: 5000, capacity: 80 },
    } 
  },
  DATACENTER: {
    id: "DATACENTER",
    name: "Centro de Datos (I+D)",
    description: "Servidores de alto rendimiento para tus Analistas e investigación.",
    emoji: "🗄️",
    basePrice: 25000,
    levels: {
      1: { upgradeCost: 0, maintenance: 200, revenue: 500, capacity: 3 },
      2: { upgradeCost: 50000, maintenance: 350, revenue: 1200, capacity: 6 },
      3: { upgradeCost: 100000, maintenance: 600, revenue: 3000, capacity: 12 },
      4: { upgradeCost: 200000, maintenance: 1000, revenue: 7000, capacity: 25 },
      5: { upgradeCost: 400000, maintenance: 1500, revenue: 15000, capacity: 50 },
    }
  },
  BASEMENT: {
    id: "BASEMENT",
    name: "Operaciones Encubiertas",
    description: "Búnker irrastreable. El hogar perfecto para tus Saboteadores.",
    emoji: "☢️",
    basePrice: 40000,
    levels: {
      1: { upgradeCost: 0, maintenance: 500, revenue: 1000, capacity: 10 },
      2: { upgradeCost: 80000, maintenance: 800, revenue: 2500, capacity: 20 },
      3: { upgradeCost: 160000, maintenance: 1200, revenue: 6000, capacity: 40 },
      4: { upgradeCost: 320000, maintenance: 2000, revenue: 15000, capacity: 80 },
      5: { upgradeCost: 640000, maintenance: 3500, revenue: 40000, capacity: 160 },
    }
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
