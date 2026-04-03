import { withMiddleware } from '../../lib/withMiddleware';
import { getRefList } from '../../controllers/refController';

/**
 * @swagger
 * /api/reflist:
 *   get:
 *     summary: Get reference data for dropdown lists
 *     tags: [Reference]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [maritalStatus, position, debtType, purpose, term, homeOwnership]
 *         description: Specific ref type (omit to get all)
 *     responses:
 *       200:
 *         description: Reference data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid type
 *       401:
 *         description: Unauthorized
 */
export default withMiddleware(getRefList);
