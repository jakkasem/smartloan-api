import { withMiddleware } from '../../../lib/withMiddleware';
import { applyLoan } from '../../../controllers/loanController';

/**
 * @swagger
 * /api/loan/apply:
 *   post:
 *     summary: Submit a new loan application
 *     tags: [Loan]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoanApplyRequest'
 *     responses:
 *       201:
 *         description: Loan application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoanResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 */
export default withMiddleware(applyLoan);
