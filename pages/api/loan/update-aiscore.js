import { withMiddleware } from '../../../lib/withMiddleware';
import { updateLoanAiScore } from '../../../controllers/loanController';

/**
 * @swagger
 * /api/loan/update-aiscore:
 *   patch:
 *     summary: Update AI score and risk for a loan application
 *     tags: [Loan]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoanUpdateAiScoreRequest'
 *     responses:
 *       200:
 *         description: AI score updated successfully
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
export default withMiddleware(updateLoanAiScore);
