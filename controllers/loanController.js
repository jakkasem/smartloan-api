import { loanApplySchema, loanUpdateInfoSchema, loanUpdateAiScoreSchema, parseBody } from '../lib/validate';
import * as loanService from '../services/loanService';
import logger from '../lib/logger';

const WEBHOOK_URL = process.env.WEBHOOK_URL;

export async function applyLoan(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ success: false, message: 'Method not allowed' });

  const data = parseBody(loanApplySchema, req.body);
  const loan = await loanService.createLoanApplication(data);

  // Fire-and-forget webhook
  const webhookPayload = {
    id:                String(loan.id),
    customerName:      data.customerName,
    nationalId:        data.nationalId,
    dob:               data.dob,
    address:           data.address,
    phoneNumber:       data.phoneNumber,
    email:             data.email,
    maritalStatusId:   String(data.maritalStatusId),
    companyName:       data.companyName ?? '',
    positionId:        data.positionId != null ? String(data.positionId) : '',
    employmentPeriod:  data.employmentPeriod != null ? String(data.employmentPeriod) : '',
    annualIncome:      data.annualIncome != null ? String(data.annualIncome) : '',
    officeNumber:      data.officeNumber ?? '',
    loanAmount:        String(data.loanAmount),
    purposeId:         String(data.purposeId),
    termId:            String(data.termId),
    homeOwnershipId:   String(data.homeOwnershipId),
    applicationTypeId: data.applicationTypeId != null ? String(data.applicationTypeId) : '',
    incomeCateId:      data.incomeCateId != null ? String(data.incomeCateId) : '',
    debtIncRatio:      data.debtIncRatio != null ? String(data.debtIncRatio) : '',
    interestRate:      data.interestRate != null ? String(data.interestRate) : '',
    grade:             data.grade ?? '',
    loanCondition:     data.loanCondition != null ? String(data.loanCondition) : '',
    installment:       data.installment != null ? String(data.installment) : '',
    interestPayTypeId: data.interestPayTypeId != null ? String(data.interestPayTypeId) : '',
    totalPayment:      data.totalPayment != null ? String(data.totalPayment) : '',
    totalRecPrincipal: data.totalRecPrincipal != null ? String(data.totalRecPrincipal) : '',
    recoveries:        data.recoveries != null ? String(data.recoveries) : '',
    finalDate:         data.finalDate ?? '',
  };

  if (WEBHOOK_URL) {
    logger.info({ event: 'webhook_before', url: WEBHOOK_URL, payload: webhookPayload });
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    }).then(res => {
      logger.info({ event: 'webhook_after', url: WEBHOOK_URL, status: res.status });
    }).catch(err => {
      logger.error({ event: 'webhook_error', url: WEBHOOK_URL, message: err.message });
    });
  } else {
    logger.warn({ event: 'webhook_skipped', message: 'WEBHOOK_URL is not configured' });
  }

  return res.status(201).json({ success: true, data: loan });
}

export async function updateLoanInfo(req, res) {
  if (req.method !== 'PATCH')
    return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { id, status } = parseBody(loanUpdateInfoSchema, req.body);
  const loan = await loanService.updateLoanStatus(id, status);
  return res.status(200).json({ success: true, data: loan });
}

export async function updateLoanAiScore(req, res) {
  if (req.method !== 'PATCH')
    return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { id, aiScore, aiRisk } = parseBody(loanUpdateAiScoreSchema, req.body);
  const loan = await loanService.updateLoanAiScore(id, aiScore, aiRisk);
  return res.status(200).json({ success: true, data: loan });
}

const VALID_STATUSES = ['PENDING', 'REVIEW', 'APPROVED', 'REJECTED'];

export async function getLoans(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { status } = req.query;
  if (status && !VALID_STATUSES.includes(status))
    return res.status(400).json({ success: false, message: `status must be one of: ${VALID_STATUSES.join(', ')}` });

  const loans = await loanService.getAllLoans({ status });
  return res.status(200).json({ success: true, total: loans.length, data: loans });
}

export async function searchLoans(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { id, name, status } = req.query;

  if (status && !VALID_STATUSES.includes(status))
    return res.status(400).json({ success: false, message: `status must be one of: ${VALID_STATUSES.join(', ')}` });

  const parsedId = id ? parseInt(id, 10) : undefined;
  if (id && isNaN(parsedId))
    return res.status(400).json({ success: false, message: 'id must be a valid integer' });

  const loans = await loanService.searchLoans({ id: parsedId, name, status });
  return res.status(200).json({ success: true, total: loans.length, data: loans });
}

export async function getLoanById(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ success: false, message: 'Method not allowed' });

  const id = parseInt(req.query.id, 10);
  if (isNaN(id))
    return res.status(400).json({ success: false, message: 'id must be a valid integer' });

  const loan = await loanService.getLoanById(id);
  if (!loan)
    return res.status(404).json({ success: false, message: `Loan application id ${id} not found` });

  return res.status(200).json({ success: true, data: loan });
}
