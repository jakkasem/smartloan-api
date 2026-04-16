import { withMiddleware } from '../../../lib/withMiddleware';
import { updateLoanInfo } from '../../../controllers/loanController';

/**
 * @swagger
 * /api/loan/update-info:
 *   patch:
 *     summary: Update loan application status
 *     tags: [Loan]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoanUpdateInfoRequest'
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoanResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Loan application not found
 */
export default withMiddleware(updateLoanInfo);
