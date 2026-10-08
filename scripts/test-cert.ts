import { getTLSCertificateManager } from '../lib/mail/tls-certificate-manager';

async function test() {
  const manager = getTLSCertificateManager();
  await manager.loadAllCertificates();
  
  const certs = manager.listCertificates();
  console.log('\n📋 Certificates loaded:');
  certs.forEach(cert => {
    console.log(`\n  Domain: ${cert.domain}`);
    console.log(`  Valid: ${cert.isValid}`);
    console.log(`  Expires: ${cert.expiresAt}`);
    console.log(`  Key: ${cert.keyPath}`);
    console.log(`  Cert: ${cert.certPath}`);
  });
  
  // Test SNI callback
  const cert = manager.getCertificate('mail.uaft.it');
  console.log('\n🔍 Certificate for mail.uaft.it:', cert ? 'FOUND ✅' : 'NOT FOUND ❌');
}

test().catch(console.error);
