#!/usr/bin/env ts-node

/**
 * UAFT Mail Server - Verification Script
 *
 * Verifica la configurazione del mail server prima del deployment
 *
 * Usage:
 *   npm run mail:verify
 */

import 'dotenv/config';
import { prisma } from '../lib/prisma';
import dns from 'dns/promises';
import { isDKIMConfigured } from '../lib/mail/dkim-signer';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
}

async function main() {
  console.log('🔍 UAFT Mail Server - Configuration Verification\n');

  const results: CheckResult[] = [];

  // 1. Database Connection
  results.push(await checkDatabase());

  // 2. Environment Variables
  results.push(...checkEnvironment());

  // 3. TLS Certificates
  results.push(checkTLS());

  // 4. Mail Domains
  results.push(await checkMailDomains());

  // 5. DNS Records (se ci sono domini)
  const domains = await prisma.mailDomain.findMany({ where: { isActive: true } });
  for (const domain of domains.slice(0, 3)) {
    // Max 3 domini per non rallentare troppo
    results.push(...(await checkDNSRecords(domain.domain)));
  }

  // 6. DKIM Configuration
  for (const domain of domains.slice(0, 3)) {
    results.push(await checkDKIM(domain.domain));
  }

  // Print Results
  console.log('\n📊 Verification Results:\n');

  let passCount = 0;
  let failCount = 0;
  let warnCount = 0;

  for (const result of results) {
    const icon =
      result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️ ' : '❌';

    console.log(`${icon} ${result.name}`);
    console.log(`   ${result.message}\n`);

    if (result.status === 'pass') passCount++;
    else if (result.status === 'fail') failCount++;
    else warnCount++;
  }

  console.log('━'.repeat(60));
  console.log(`\n📈 Summary: ${passCount} passed, ${warnCount} warnings, ${failCount} failed\n`);

  if (failCount > 0) {
    console.log('❌ Some critical checks failed. Fix them before deploying to production.\n');
    process.exit(1);
  } else if (warnCount > 0) {
    console.log('⚠️  Some checks have warnings. Review them before deploying.\n');
    process.exit(0);
  } else {
    console.log('✅ All checks passed! Mail server is ready for production.\n');
    process.exit(0);
  }
}

async function checkDatabase(): Promise<CheckResult> {
  try {
    await prisma.$connect();
    const domainCount = await prisma.mailDomain.count();

    return {
      name: 'Database Connection',
      status: 'pass',
      message: `Connected to database. Found ${domainCount} domain(s).`,
    };
  } catch (error: any) {
    return {
      name: 'Database Connection',
      status: 'fail',
      message: `Failed to connect: ${error.message}`,
    };
  }
}

function checkEnvironment(): CheckResult[] {
  const results: CheckResult[] = [];

  // Required
  const required = ['DATABASE_URL', 'NEXTAUTH_SECRET'];
  for (const varName of required) {
    if (!process.env[varName]) {
      results.push({
        name: `Env: ${varName}`,
        status: 'fail',
        message: `Missing required variable: ${varName}`,
      });
    } else {
      results.push({
        name: `Env: ${varName}`,
        status: 'pass',
        message: 'Configured',
      });
    }
  }

  // Recommended
  const recommended = ['TLS_KEY_PATH', 'TLS_CERT_PATH', 'SMTP_SUBMISSION_PORT'];
  for (const varName of recommended) {
    if (!process.env[varName]) {
      results.push({
        name: `Env: ${varName}`,
        status: 'warn',
        message: `Recommended but not set: ${varName}`,
      });
    } else {
      results.push({
        name: `Env: ${varName}`,
        status: 'pass',
        message: 'Configured',
      });
    }
  }

  return results;
}

function checkTLS(): CheckResult {
  const keyPath = process.env.TLS_KEY_PATH;
  const certPath = process.env.TLS_CERT_PATH;

  if (!keyPath || !certPath) {
    return {
      name: 'TLS Certificates',
      status: 'warn',
      message: 'TLS_KEY_PATH or TLS_CERT_PATH not set. TLS will be disabled.',
    };
  }

  const fs = require('fs');

  if (!fs.existsSync(keyPath)) {
    return {
      name: 'TLS Certificates',
      status: 'fail',
      message: `TLS key file not found: ${keyPath}`,
    };
  }

  if (!fs.existsSync(certPath)) {
    return {
      name: 'TLS Certificates',
      status: 'fail',
      message: `TLS cert file not found: ${certPath}`,
    };
  }

  return {
    name: 'TLS Certificates',
    status: 'pass',
    message: 'TLS key and certificate found',
  };
}

async function checkMailDomains(): Promise<CheckResult> {
  try {
    const domains = await prisma.mailDomain.findMany({
      where: { isActive: true },
    });

    if (domains.length === 0) {
      return {
        name: 'Mail Domains',
        status: 'warn',
        message: 'No active mail domains configured',
      };
    }

    const withDKIM = domains.filter((d) => d.dkimPrivateKey && d.dkimPublicKey).length;

    return {
      name: 'Mail Domains',
      status: 'pass',
      message: `${domains.length} active domain(s), ${withDKIM} with DKIM configured`,
    };
  } catch (error: any) {
    return {
      name: 'Mail Domains',
      status: 'fail',
      message: `Error checking domains: ${error.message}`,
    };
  }
}

async function checkDNSRecords(domain: string): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // MX Record
  try {
    const mx = await dns.resolveMx(domain);
    if (mx && mx.length > 0) {
      results.push({
        name: `DNS MX: ${domain}`,
        status: 'pass',
        message: `MX record found: ${mx[0].exchange}`,
      });
    } else {
      results.push({
        name: `DNS MX: ${domain}`,
        status: 'warn',
        message: 'No MX record found',
      });
    }
  } catch (error) {
    results.push({
      name: `DNS MX: ${domain}`,
      status: 'warn',
      message: 'Could not resolve MX record',
    });
  }

  // SPF Record
  try {
    const txt = await dns.resolveTxt(domain);
    const spf = txt.find((record) => record.join('').includes('v=spf1'));

    if (spf) {
      results.push({
        name: `DNS SPF: ${domain}`,
        status: 'pass',
        message: `SPF record found`,
      });
    } else {
      results.push({
        name: `DNS SPF: ${domain}`,
        status: 'warn',
        message: 'No SPF record found',
      });
    }
  } catch (error) {
    results.push({
      name: `DNS SPF: ${domain}`,
      status: 'warn',
      message: 'Could not resolve TXT records',
    });
  }

  // DMARC Record
  try {
    const txt = await dns.resolveTxt(`_dmarc.${domain}`);
    const dmarc = txt.find((record) => record.join('').includes('v=DMARC1'));

    if (dmarc) {
      results.push({
        name: `DNS DMARC: ${domain}`,
        status: 'pass',
        message: `DMARC record found`,
      });
    } else {
      results.push({
        name: `DNS DMARC: ${domain}`,
        status: 'warn',
        message: 'No DMARC record found',
      });
    }
  } catch (error) {
    results.push({
      name: `DNS DMARC: ${domain}`,
      status: 'warn',
      message: 'No DMARC record configured',
    });
  }

  return results;
}

async function checkDKIM(domain: string): Promise<CheckResult> {
  try {
    const configured = await isDKIMConfigured(domain);

    if (configured) {
      return {
        name: `DKIM: ${domain}`,
        status: 'pass',
        message: 'DKIM keys configured in database',
      };
    } else {
      return {
        name: `DKIM: ${domain}`,
        status: 'warn',
        message: 'DKIM not configured for this domain',
      };
    }
  } catch (error: any) {
    return {
      name: `DKIM: ${domain}`,
      status: 'fail',
      message: `Error checking DKIM: ${error.message}`,
    };
  }
}

main();
