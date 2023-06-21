const mapping: Record<string, string> = {
  companies: 'company',
  'employee-trainings': 'employee_training',
  trainings: 'training',
  'training-templates': 'training_template',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
