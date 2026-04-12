const COMPANY_NUMERIC_DEFAULTS = {
  liquidCash: 100000,
  programmers: 0,
  analysts: 0,
  saboteurs: 0,
  officeCount: 0,
  datacenterCount: 0,
  basementCount: 0,
  hqLevel: 1,
  officeLevel: 1,
  datacenterLevel: 1,
  basementLevel: 1
}

function toFiniteNumber(value, fallback) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function sanitizeNumber(value, fallback = 0, { min } = {}) {
  let sanitized = toFiniteNumber(value, fallback)

  if (typeof min === 'number') {
    sanitized = Math.max(min, sanitized)
  }

  return sanitized
}

export function sanitizeInteger(value, fallback = 0, options = {}) {
  return Math.trunc(sanitizeNumber(value, fallback, options))
}

export function sanitizeDate(value, fallback = new Date()) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  const parsed = value ? new Date(value) : null
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : fallback
}

export function sanitizeCompany(company) {
  if (!company) return null

  const createdAt = sanitizeDate(company.createdAt)
  const now = new Date()

  return {
    ...company,
    liquidCash: sanitizeNumber(company.liquidCash, COMPANY_NUMERIC_DEFAULTS.liquidCash, { min: 0 }),
    programmers: sanitizeInteger(company.programmers, COMPANY_NUMERIC_DEFAULTS.programmers, { min: 0 }),
    analysts: sanitizeInteger(company.analysts, COMPANY_NUMERIC_DEFAULTS.analysts, { min: 0 }),
    saboteurs: sanitizeInteger(company.saboteurs, COMPANY_NUMERIC_DEFAULTS.saboteurs, { min: 0 }),
    officeCount: sanitizeInteger(company.officeCount, COMPANY_NUMERIC_DEFAULTS.officeCount, { min: 0 }),
    datacenterCount: sanitizeInteger(company.datacenterCount, COMPANY_NUMERIC_DEFAULTS.datacenterCount, { min: 0 }),
    basementCount: sanitizeInteger(company.basementCount, COMPANY_NUMERIC_DEFAULTS.basementCount, { min: 0 }),
    hqLevel: sanitizeInteger(company.hqLevel, COMPANY_NUMERIC_DEFAULTS.hqLevel, { min: 1 }),
    officeLevel: sanitizeInteger(company.officeLevel, COMPANY_NUMERIC_DEFAULTS.officeLevel, { min: 1 }),
    datacenterLevel: sanitizeInteger(company.datacenterLevel, COMPANY_NUMERIC_DEFAULTS.datacenterLevel, { min: 1 }),
    basementLevel: sanitizeInteger(company.basementLevel, COMPANY_NUMERIC_DEFAULTS.basementLevel, { min: 1 }),
    createdAt,
    lastUpdated: sanitizeDate(company.lastUpdated, now)
  }
}

export function getCompanySanitizationData(company) {
  const sanitized = sanitizeCompany(company)

  if (!sanitized) return null

  return {
    liquidCash: sanitized.liquidCash,
    programmers: sanitized.programmers,
    analysts: sanitized.analysts,
    saboteurs: sanitized.saboteurs,
    officeCount: sanitized.officeCount,
    datacenterCount: sanitized.datacenterCount,
    basementCount: sanitized.basementCount,
    hqLevel: sanitized.hqLevel,
    officeLevel: sanitized.officeLevel,
    datacenterLevel: sanitized.datacenterLevel,
    basementLevel: sanitized.basementLevel,
    lastUpdated: sanitized.lastUpdated
  }
}
