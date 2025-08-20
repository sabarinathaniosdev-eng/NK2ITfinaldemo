import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample invoice
  const sampleInvoice = await prisma.invoice.upsert({
    where: { id: 'NK2IT-1755677000000-SAMPLE' },
    update: {},
    create: {
      id: 'NK2IT-1755677000000-SAMPLE',
      userEmail: 'demo@nk2it.com.au',
      amountCents: 9999, // $99.99
      gstCents: 999,     // $9.99 GST
      licenseKey: 'SEP-DEMO-1234-5678-ABCD',
      pdfFileName: 'NK2IT-Invoice-NK2IT-1755677000000-SAMPLE.pdf',
      createdAt: new Date(),
    },
  });

  console.log('✅ Created sample invoice:', sampleInvoice.id);
  console.log('📧 Email:', sampleInvoice.userEmail);
  console.log('🔑 License Key:', sampleInvoice.licenseKey);
  console.log('💰 Amount: $' + (sampleInvoice.amountCents / 100).toFixed(2));
  console.log('🏷️  GST: $' + (sampleInvoice.gstCents / 100).toFixed(2));
  console.log('💯 Total: $' + ((sampleInvoice.amountCents + sampleInvoice.gstCents) / 100).toFixed(2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });