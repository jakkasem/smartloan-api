import { withMiddleware } from '../../../lib/withMiddleware';
import { searchLoans } from '../../../controllers/loanController';

/**
 * @swagger
 * /api/loans/search:
 *   get:
 *     summary: Search loan applications by id, name, or status
 *     tags: [Loans]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: Filter by loan application ID (exact match)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by customer name (partial, case-insensitive)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, REVIEW, APPROVED, REJECTED]
 *         description: Filter by status (exact match)
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized
 */
export default withMiddleware(searchLoans);
