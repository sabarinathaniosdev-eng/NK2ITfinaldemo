// Environment validation for email services
export function validateEmailEnvironment() {
  const required = [
    'SMTP_HOST',
    'SMTP_PORT', 
    'SMTP_USER',
    'SMTP_PASS',
    'EMAIL_FROM'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required email environment variables: ${missing.join(', ')}\n` +
      `Please add these to your environment:\n` +
      `SMTP_HOST=your-smtp-server.com\n` +
      `SMTP_PORT=587\n` +
      `SMTP_USER=your-username\n` +
      `SMTP_PASS=your-password\n` +
      `EMAIL_FROM=noreply@your-domain.com`
    );
  }
}

// Environment validation for database
export function validateDatabaseEnvironment() {
  if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable is required in production.\n' +
      'Please add DATABASE_URL=your-database-connection-string to your environment.'
    );
  }
}