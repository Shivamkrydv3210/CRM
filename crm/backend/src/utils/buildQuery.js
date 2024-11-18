// backend/src/utils/buildQuery.js
const buildQuery = (criteria) => {
  const query = {};

  if (criteria.totalSpending) {
      query.totalSpending = {};
      if (criteria.totalSpending.gt) query.totalSpending.$gt = criteria.totalSpending.gt;
      if (criteria.totalSpending.lt) query.totalSpending.$lt = criteria.totalSpending.lt;
  }

  if (criteria.visits) {
      query.visits = {};
      if (criteria.visits.gte) query.visits.$gte = criteria.visits.gte;
      if (criteria.visits.lte) query.visits.$lte = criteria.visits.lte;
  }

  if (criteria.lastVisitDate) {
      query.lastVisitDate = {};
      if (criteria.lastVisitDate.after) query.lastVisitDate.$gt = new Date(criteria.lastVisitDate.after);
      if (criteria.lastVisitDate.before) query.lastVisitDate.$lt = new Date(criteria.lastVisitDate.before);
  }

  // Implement AND/OR logic if necessary
  // For simplicity, this example uses AND logic across all conditions

  return query;
};

module.exports = buildQuery;
