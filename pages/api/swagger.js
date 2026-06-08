import { createSwaggerSpec } from 'next-swagger-doc';

export default function handler(req, res) {
  const spec = createSwaggerSpec({
    apiFolder: 'pages/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'SmartLoan API',
        version: '1.0.0',
        description: 'Loan Management REST API — Node.js + Next.js + Prisma + PostgreSQL',
      },
      servers: [
        {
          url: process.env.RENDER_EXTERNAL_URL || 'http://localhost:9000',
          description: process.env.RENDER_EXTERNAL_URL ? 'Production (Render)' : 'Local dev',
        },
      ],
      components: {
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'x-api-key',
          },
        },
        schemas: {
          LoanApplyRequest: {
            type: 'object',
            required: ['customerName','nationalId','dob','address','phoneNumber','email',
                       'maritalStatusId','loanAmount','purposeId','termId','homeOwnershipId'],
            properties: {
              customerName:     { type: 'string', example: 'สมชาย ใจดี' },
              nationalId:       { type: 'string', example: '1234567890123' },
              dob:              { type: 'string', format: 'date', example: '1990-05-15' },
              address:          { type: 'string', example: '123 ถนนสุขุมวิท กรุงเทพฯ' },
              phoneNumber:      { type: 'string', example: '0812345678' },
              email:            { type: 'string', format: 'email', example: 'somchai@example.com' },
              maritalStatusId:  { type: 'integer', example: 1 },
              companyName:      { type: 'string', example: 'บริษัท ตัวอย่าง จำกัด' },
              positionId:       { type: 'integer', example: 7 },
              employmentPeriod: { type: 'number', example: 3.5 },
              annualIncome:     { type: 'number', example: 360000 },
              officeNumber:     { type: 'string', example: '021234567' },
              loanAmount:       { type: 'number', example: 100000 },
              purposeId:        { type: 'integer', example: 6 },
              termId:           { type: 'integer', example: 1 },
              homeOwnershipId:    { type: 'integer', example: 1 },
              applicationTypeId:  { type: 'integer', example: 1 },
              incomeCateId:       { type: 'integer', example: 2 },
              debtIncRatio:       { type: 'number', example: 0.35 },
              interestRate:       { type: 'number', example: 12.5 },
              grade:              { type: 'string', example: 'B' },
              loanCondition:      { type: 'integer', example: 0 },
              installment:        { type: 'number', example: 3500.75 },
              interestPayTypeId:  { type: 'integer', example: 1 },
              totalPayment:       { type: 'number', example: 126027 },
              totalRecPrincipal:  { type: 'number', example: 100000 },
              recoveries:         { type: 'number', example: 0 },
              finalDate:          { type: 'string', format: 'date', example: '2028-06-15' },
              debtTypeIds:        { type: 'array', items: { type: 'integer' }, example: [4, 5] },
            },
          },
          LoanUpdateInfoRequest: {
            type: 'object',
            required: ['id', 'status'],
            properties: {
              id:     { type: 'integer', example: 1 },
              status: { type: 'string', enum: ['PENDING', 'REVIEW', 'APPROVED', 'REJECTED'] },
            },
          },
          LoanUpdateAiScoreRequest: {
            type: 'object',
            required: ['id', 'aiScore', 'aiRisk'],
            properties: {
              id:      { type: 'integer', example: 1 },
              aiScore: { type: 'number', minimum: 0, maximum: 100, example: 72.5 },
              aiRisk:  { type: 'string', example: 'LOW' },
            },
          },
          LoanApplication: {
            type: 'object',
            properties: {
              id:               { type: 'integer' },
              customerName:     { type: 'string' },
              nationalId:       { type: 'string' },
              dob:              { type: 'string', format: 'date-time' },
              address:          { type: 'string' },
              phoneNumber:      { type: 'string' },
              email:            { type: 'string' },
              loanAmount:         { type: 'number' },
              applicationTypeId:  { type: 'integer', nullable: true },
              incomeCateId:       { type: 'integer', nullable: true },
              debtIncRatio:       { type: 'number', nullable: true },
              interestRate:       { type: 'number', nullable: true },
              grade:              { type: 'string', nullable: true },
              loanCondition:      { type: 'integer', nullable: true },
              installment:        { type: 'number', nullable: true },
              interestPayTypeId:  { type: 'integer', nullable: true },
              totalPayment:       { type: 'number', nullable: true },
              totalRecPrincipal:  { type: 'number', nullable: true },
              recoveries:         { type: 'number', nullable: true },
              finalDate:          { type: 'string', format: 'date-time', nullable: true },
              status:             { type: 'string', enum: ['PENDING','REVIEW','APPROVED','REJECTED'] },
              aiScore:            { type: 'number', nullable: true },
              aiRisk:             { type: 'string', nullable: true },
              aiUpdatedAt:        { type: 'string', format: 'date-time', nullable: true },
              createdAt:          { type: 'string', format: 'date-time' },
              updatedAt:          { type: 'string', format: 'date-time' },
            },
          },
          LoanResponse: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data:    { $ref: '#/components/schemas/LoanApplication' },
            },
          },
          ErrorResponse: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              message: { type: 'string' },
              errors:  { type: 'object' },
            },
          },
        },
      },
      security: [{ ApiKeyAuth: [] }],
    },
  });
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(spec);
}
