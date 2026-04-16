import prisma from '../lib/prisma';

const activeOnly = { where: { isActive: true }, orderBy: { id: 'asc' } };

const refMap = {
  maritalStatus:   () => prisma.refMaritalStatus.findMany(activeOnly),
  position:        () => prisma.refPosition.findMany(activeOnly),
  debtType:        () => prisma.refDebtType.findMany(activeOnly),
  purpose:         () => prisma.refPurpose.findMany(activeOnly),
  term:            () => prisma.refTerm.findMany(activeOnly),
  homeOwnership:   () => prisma.refHomeOwnership.findMany(activeOnly),
  incomeCate:      () => prisma.refIncomeCate.findMany(activeOnly),
  applicationType: () => prisma.refApplicationType.findMany(activeOnly),
  paymentType:     () => prisma.refPaymentType.findMany(activeOnly),
  loanCondition:   () => prisma.refLoanCondition.findMany(activeOnly),
};

export async function getRefByType(type) {
  const fn = refMap[type];
  if (!fn) return null;
  return fn();
}

export async function getAllRefs() {
  const [maritalStatuses, positions, debtTypes, purposes, terms, homeOwnerships, incomeCates, applicationTypes, paymentTypes, loanConditions] =
    await Promise.all(Object.values(refMap).map((fn) => fn()));
  return { maritalStatuses, positions, debtTypes, purposes, terms, homeOwnerships, incomeCates, applicationTypes, paymentTypes, loanConditions };
}
