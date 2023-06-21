import * as yup from 'yup';

export const trainingValidationSchema = yup.object().shape({
  name: yup.string().required(),
  content: yup.string().required(),
  company_id: yup.string().nullable(),
  template_id: yup.string().nullable(),
});
