import { withMiddleware } from '../../../lib/withMiddleware';
import { getLoans } from '../../../controllers/loanController';

/**
 * @swagger
 * /api/loans:
 *   get:
 *     summary: Get all loan applications
 *     tags: [Loan]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, REVIEW, APPROVED, REJECTED]
 *         description: Filter by status (optional)
 *     responses:
 *       200:
 *         description: List of loan applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LoanApplication'
 *       401:
 *         description: Unauthorized
 */
export default withMiddleware(getLoans);
