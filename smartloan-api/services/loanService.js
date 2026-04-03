import prisma from '../lib/prisma';

const include = {
  maritalStatus: true,
  position:      true,
  purpose:       true,
  term:          true,
  homeOwnership: true,
  debts: { include: { debtType: true } },
};

export async function createLoanApplication(data) {
  const { debtTypeIds = [], ...loanData } = data;
  return prisma.$transaction(async (tx) => {
    return tx.loanApplication.create({
      data: {
        ...loanData,
        dob:    new Date(loanData.dob),
        status: 'PENDING',
        debts: {
          create: debtTypeIds.map((id) => ({ debtTypeId: id })),
        },
      },
      include,
    });
  });
}

export async function updateLoanStatus(id, status) {
  const existing = await prisma.loanApplication.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error(`Loan application id ${id} not found`);
    err.statusCode = 404;
    throw err;
  }
  return prisma.loanApplication.update({
    where: { id },
    data:  { status },
    include,
  });
}

export async function updateLoanAiScore(id, aiScore, aiRisk) {
  const existing = await prisma.loanApplication.findUnique({ where: { id } });
  if (!existing) {
    const err = new Error(`Loan application id ${id} not found`);
    err.statusCode = 404;
    throw err;
  }
  return prisma.loanApplication.update({
    where: { id },
    data:  { aiScore, aiRisk, aiUpdatedAt: new Date() },
    include,
  });
}

export async function getAllLoans(filters = {}) {
  const where = {};
  if (filters.status) where.status = filters.status;
  return prisma.loanApplication.findMany({
    where,
    include,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getLoanById(id) {
  return prisma.loanApplication.findUnique({ where: { id }, include });
}

export async function searchLoans({ id, name, status }) {
  const where = {};
  if (id)     where.id     = id;
  if (status) where.status = status;
  if (name) {
    const tokens = name.trim().split(/\s+/).filter(Boolean);
    where.AND = tokens.map(token => ({
      customerName: { contains: token, mode: 'insensitive' },
    }));
  }
  return prisma.loanApplication.findMany({
    where,
    include,
    orderBy: { createdAt: 'desc' },
  });
}
