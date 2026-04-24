export const BUILDINGS = {
  HQ: {
    id: "HQ",
    type: "HQ", // Añadido para retrocompatibilidad con el motor
    name: "Headquarters",
    description: "Centro neurálgico de la corporación. Cada HQ habilita espacio administrativo para nuevas oficinas.",
    emoji: "🏛️",
    basePrice: 500000,
    
    // 🌍 Buffs Globales (El HQ afecta a toda la empresa)
    globalHiringDiscountPerLevel: 0.05, // -5% costo de contratación por nivel
    globalRevenueBonusPerLevel: 0.02,   // +2% generación bruta global por nivel

    levels: {
      1: { upgradeCost: 0, maintenance: 3500, revenue: 9000, capacity: 50 },
      2: { upgradeCost: 100000, maintenance: 6000, revenue: 18000, capacity: 100 },
      3: { upgradeCost: 200000, maintenance: 10000, revenue: 36000, capacity: 200 },
      4: { upgradeCost: 400000, maintenance: 17000, revenue: 65000, capacity: 400 },
      5: { upgradeCost: 800000, maintenance: 28000, revenue: 110000, capacity: 800 },
    },
    
    // 🛒 Placeholders para el Mercado de Módulos
    modules: {
      AI_ASSISTANT: { id: "AI_ASSISTANT", name: "Asistente Ejecutiva IA", requiredLevel: 3, effectDesc: "-5% Mantenimiento Global" }
    }
  },
  
  OFFICE: {
    id: "OFFICE",
    type: "OFFICE",
    name: "Centro de Operaciones",
    description: "Espacio vital para tus programadores. Donde la magia sucede y el código cobra vida.",
    emoji: "🏢",
    basePrice: 25000,
    
    // ⚖️ El Exprimidor Económico para Programadores
    revenueBonusPerLevel: 0.15,   // +15% producción del empleado por nivel
    salaryIncreasePerLevel: 0.05, // +5% costo del salario por nivel

    levels: {
      1: { upgradeCost: 0, maintenance: 100, revenue: 250, capacity: 50 },
      2: { upgradeCost: 300000, maintenance: 1500, revenue: 6000, capacity: 100 },
      3: { upgradeCost: 600000, maintenance: 2500, revenue: 12000, capacity: 200 },
      4: { upgradeCost: 1200000, maintenance: 4000, revenue: 25000, capacity: 400 },
      5: { upgradeCost: 2400000, maintenance: 7000, revenue: 50000, capacity: 800 },
    },

    modules: {
      ESPRESSO_MACHINE: { id: "ESPRESSO_MACHINE", name: "Máquina de Espresso", requiredLevel: 2, effectDesc: "+5% Ingresos de Programadores" },
      ERGONOMIC_CHAIRS: { id: "ERGONOMIC_CHAIRS", name: "Sillas Ergonómicas", requiredLevel: 4, effectDesc: "Mitiga el aumento de salario" }
    }, 
    
    staffModules: {
      JUNIOR_BOOTCAMP: { 
        id: "JUNIOR_BOOTCAMP", 
        name: "Intensive Bootcamp", 
        requiredLevel: 1, 
        cost: 50000, 
        maintenancePerStaff: 50, // Costo extra por cada empleado
        revenueMultiplier: 1.05, // +5% de ingresos
        desc: "Increases basic coding efficiency for all Juniors."
      },
      CLOUD_ARCHITECTURE: { 
        id: "CLOUD_ARCHITECTURE", 
        name: "Cloud Architecture Cert.", 
        requiredLevel: 3, 
        cost: 250000, 
        maintenancePerStaff: 150, 
        revenueMultiplier: 1.15, // +15% de ingresos
        desc: "Scales deployment capabilities significantly."
      },
      AI_COPILOT: { 
        id: "AI_COPILOT", 
        name: "Neural Copilot v2", 
        requiredLevel: 5, 
        cost: 1200000, 
        maintenancePerStaff: 500, 
        revenueMultiplier: 1.40, // +40% de ingresos
        desc: "AI-driven code generation. Massive productivity boost."
      }
    }
  },

  DATACENTER: {
    id: "DATACENTER",
    type: "DATACENTER",
    name: "Centro de Datos (I+D)",
    description: "Servidores de alto rendimiento para tus Analistas e investigación.",
    emoji: "🗄️",
    basePrice: 25000,
    
    // ⚖️ El Exprimidor Económico para Analistas
    revenueBonusPerLevel: 0.20,
    salaryIncreasePerLevel: 0.08,

    levels: {
      1: { upgradeCost: 0, maintenance: 2000, revenue: 5000, capacity: 30  },
      2: { upgradeCost: 500000, maintenance: 3500, revenue: 12000, capacity: 60 },
      3: { upgradeCost: 1000000, maintenance: 6000, revenue: 30000, capacity: 120 },
      4: { upgradeCost: 2000000, maintenance: 10000, revenue: 70000, capacity: 250 },
      5: { upgradeCost: 4000000, maintenance: 15000, revenue: 150000, capacity: 500 },
    },

    modules: {
      LIQUID_COOLING: { id: "LIQUID_COOLING", name: "Refrigeración Líquida", requiredLevel: 3, effectDesc: "-15% Mantenimiento del Edificio" }
    },

    staffModules: {
      BIG_DATA_PRO: { 
        id: "BIG_DATA_PRO", 
        name: "Big Data Processing", 
        requiredLevel: 2, 
        cost: 100000, 
        maintenancePerStaff: 200, 
        efficiencyBoost: 1.10, // Afectará a los PT (Puntos de Tecnología)
        desc: "Optimizes data ingestion pipelines."
      }
    }
  },

  BASEMENT: {
    id: "BASEMENT",
    type: "BASEMENT",
    name: "Operaciones Encubiertas",
    description: "Búnker irrastreable. El hogar perfecto para tus Saboteadores.",
    emoji: "☢️",
    basePrice: 40000,
    
    // ⚖️ El Exprimidor Económico para Saboteadores
    revenueBonusPerLevel: 0.25,
    salaryIncreasePerLevel: 0.10,

    levels: {
      1: { upgradeCost: 0, maintenance: 500, revenue: 1000, capacity: 10 },
      2: { upgradeCost: 800000, maintenance: 8000, revenue: 25000, capacity: 200 },
      3: { upgradeCost: 1600000, maintenance: 12000, revenue: 60000, capacity: 400 },
      4: { upgradeCost: 3200000, maintenance: 20000, revenue: 150000, capacity: 800 },
      5: { upgradeCost: 6400000, maintenance: 35000, revenue: 400000, capacity: 1600 },
    },

    modules: {
      QUANTUM_VPN: { id: "QUANTUM_VPN", name: "VPN Cuántica", requiredLevel: 2, effectDesc: "Mejora el sigilo de las operaciones" }
    },

    staffModules: {
      ENCRYPTION_BYPASS: { 
        id: "ENCRYPTION_BYPASS", 
        name: "Quantum Decryptor", 
        requiredLevel: 3, 
        cost: 500000, 
        maintenancePerStaff: 1000, 
        successRateBoost: 0.10, // +10% probabilidad de éxito en ataques
        desc: "Military-grade hardware for cracking rival nodes."
      }
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
    revenuePerHour: 0, // Genera otra moneda en el futuro. Nota: La sinergia matemática se aplicará cuando exista esta métrica.
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