const ApiError = require('../utils/ApiError');

/**
 * Generic body validator. Pass a schema of { field: { required, type } }.
 * Kept dependency-free (no zod/joi) to match the requested minimal stack,
 * but centralizes validation so controllers stay thin.
 */
function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      if (value !== undefined && rules.type && typeof value !== rules.type) {
        errors.push(`${field} must be of type ${rules.type}`);
      }
    }
    if (errors.length) {
      return next(ApiError.badRequest('Validation failed', errors));
    }
    next();
  };
}

module.exports = { validateBody };
