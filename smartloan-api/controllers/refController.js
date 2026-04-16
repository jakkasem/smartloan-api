import * as refService from '../services/refService';

const validTypes = ['maritalStatus', 'position', 'debtType', 'purpose', 'term', 'homeOwnership', 'incomeCate', 'applicationType', 'paymentType', 'loanCondition'];

export async function getRefList(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ success: false, message: 'Method not allowed' });

  const { type } = req.query;

  if (type) {
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid type. Allowed: ${validTypes.join(', ')}`,
      });
    }
    const data = await refService.getRefByType(type);
    return res.status(200).json({ success: true, type, data });
  }

  const data = await refService.getAllRefs();
  return res.status(200).json({ success: true, data });
}
