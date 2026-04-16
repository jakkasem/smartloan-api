import { withMiddleware } from '../../../lib/withMiddleware';
import { getLoanById } from '../../../controllers/loanController';

/**
 * @swagger
 * /api/loans/{id}:
 *   get:
 *     summary: Get loan application by ID
 *     tags: [Loan]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Loan application ID
 *     responses:
 *       200:
 *         description: Loan application detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoanResponse'
 *       400:
 *         description: Invalid ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
export default withMiddleware(getLoanById);
