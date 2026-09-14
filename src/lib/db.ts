import mysql, { type Pool, type PoolOptions } from 'mysql2/promise';

const requiredDatabaseVariables = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'] as const;

type DatabaseEnvironmentVariable = (typeof requiredDatabaseVariables)[number];

export function isDatabaseConfigured(): boolean {
  return requiredDatabaseVariables.every((name) => {
    const value = process.env[name];
    return value !== undefined && (name === 'DB_PASSWORD' || value.trim() !== '');
  });
}

declare global {
  // Reuse the pool when Next.js reloads modules during local development.
  var tenaBookingDatabasePool: Pool | undefined;
}

function getRequiredEnvironmentVariable(name: DatabaseEnvironmentVariable, allowEmpty = false): string {
  const value = process.env[name];

  if (value === undefined || (!allowEmpty && value.trim() === '')) {
    throw new Error(`Missing required database environment variable: ${name}`);
  }

  return value;
}

function getDatabaseConfig(): PoolOptions {
  const portValue = getRequiredEnvironmentVariable('DB_PORT');
  const port = Number(portValue);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('DB_PORT must be an integer between 1 and 65535.');
  }

  return {
    host: getRequiredEnvironmentVariable('DB_HOST'),
    port,
    user: getRequiredEnvironmentVariable('DB_USER'),
    // Passwordless local MySQL instances are valid as long as the variable is defined.
    password: getRequiredEnvironmentVariable('DB_PASSWORD', true),
    database: getRequiredEnvironmentVariable('DB_NAME'),
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
  };
}

/**
 * Returns the application's shared MySQL connection pool.
 *
 * Configuration is read lazily so builds that do not access the database do
 * not require runtime secrets. The first database operation validates every
 * required environment variable.
 */
export function getDatabasePool(): Pool {
  if (!globalThis.tenaBookingDatabasePool) {
    globalThis.tenaBookingDatabasePool = mysql.createPool(getDatabaseConfig());
  }

  return globalThis.tenaBookingDatabasePool;
}

/** Verifies that the configured database accepts connections and queries. */
export async function testDatabaseConnection(): Promise<void> {
  await getDatabasePool().query('SELECT 1');
}
