import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

function sanitizeNumber(value, fallback = 0, { min } = {}) {
  let sanitized = typeof value === 'number' && Number.isFinite(value) ? value : fallback

  if (typeof min === 'number') {
    sanitized = Math.max(min, sanitized)
  }

  return sanitized
}

function sanitizeInteger(value, fallback = 0, options = {}) {
  return Math.trunc(sanitizeNumber(value, fallback, options))
}

function sanitizeDate(value, fallback = new Date()) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  const parsed = value ? new Date(value) : null
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : fallback
}

function getCompanySanitizationData(company) {
  const createdAt = sanitizeDate(company.createdAt)

  return {
    liquidCash: sanitizeNumber(company.liquidCash, 100000, { min: 0 }),
    programmers: sanitizeInteger(company.programmers, 0, { min: 0 }),
    analysts: sanitizeInteger(company.analysts, 0, { min: 0 }),
    saboteurs: sanitizeInteger(company.saboteurs, 0, { min: 0 }),
    officeCount: sanitizeInteger(company.officeCount, 0, { min: 0 }),
    datacenterCount: sanitizeInteger(company.datacenterCount, 0, { min: 0 }),
    basementCount: sanitizeInteger(company.basementCount, 0, { min: 0 }),
    hqLevel: sanitizeInteger(company.hqLevel, 1, { min: 1 }),
    officeLevel: sanitizeInteger(company.officeLevel, 1, { min: 1 }),
    datacenterLevel: sanitizeInteger(company.datacenterLevel, 1, { min: 1 }),
    basementLevel: sanitizeInteger(company.basementLevel, 1, { min: 1 }),
    createdAt,
    lastUpdated: sanitizeDate(company.lastUpdated, new Date())
  }
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is required to sanitize company data.')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

try {
  const companies = await prisma.company.findMany()
  let updatedCount = 0

  for (const company of companies) {
    const sanitizedData = getCompanySanitizationData(company)
    const changed = Object.entries(sanitizedData).some(([key, value]) => {
      const currentValue = company[key]

      if (currentValue instanceof Date && value instanceof Date) {
        return currentValue.getTime() !== value.getTime()
      }

      return currentValue !== value
    })

    if (!changed) continue

    await prisma.company.update({
      where: { id: company.id },
      data: sanitizedData
    })

    updatedCount += 1
  }

  console.log(`Sanitized ${updatedCount} compan${updatedCount === 1 ? 'y' : 'ies'}.`)
} finally {
  await prisma.$disconnect()
  await pool.end()
}
