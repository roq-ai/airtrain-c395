import * as yup from 'yup';

export const employeeTrainingValidationSchema = yup.object().shape({
  progress: yup.number().integer().required(),
  completed: yup.boolean().required(),
  user_id: yup.string().nullable(),
  training_id: yup.string().nullable(),
});
