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
    id:                   String(loan.id),
    annual_inc:           data.annualIncome ?? null,
    application_type_cat: data.applicationTypeId ?? null,
    dti:                  data.debtIncRatio ?? null,
    emp_length_int:       data.employmentPeriod ?? null,
    final_d:              data.finalDate ?? null,
    grade:                data.grade ?? null,
    home_ownership_cat:   data.homeOwnershipId,
    income_cat:           data.incomeCateId ?? null,
    installment:          data.installment ?? null,
    interest_payment_cat: data.interestPayTypeId ?? null,
    interest_rate:        data.interestRate ?? null,
    loan_amount:          data.loanAmount,
    purpose_cat:          data.purposeId,
    recoveries:           data.recoveries ?? null,
    term_cat:             data.termId,
    total_pymnt:          data.totalPayment ?? null,
    total_rec_prncp:      data.totalRecPrincipal ?? null,
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
