import { getDirectSmtpClient } from '../lib/mail/direct-smtp-client';

async function test() {
  console.log('🧪 Testing Direct SMTP Client...\n');
  
  const client = getDirectSmtpClient();
  
  // Test 1: Risolvi MX per trim.it
  console.log('Test 1: Resolve MX for trim.it');
  const mx = await client.resolveMX('trim.it');
  console.log(`Result: ${mx}\n`);
  
  // Test 2: Invia email di test
  console.log('Test 2: Send test email to l.bazzani@trim.it');
  const result = await client.sendDirect({
    from: 'lorenzo@uaft.it',
    to: 'l.bazzani@trim.it',
    subject: 'Test Direct SMTP from UAFT Mail Server',
    text: 'This is a test email sent directly to the MX server without relay.',
    html: '<p>This is a <strong>test email</strong> sent directly to the MX server without relay.</p>',
  });
  
  console.log('\nResult:', result);
  
  if (result.success) {
    console.log('\n✅ Direct SMTP delivery successful!');
  } else {
    console.log('\n❌ Direct SMTP delivery failed:', result.error);
  }
}

test().catch(console.error);
