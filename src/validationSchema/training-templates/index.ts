import * as yup from 'yup';

export const trainingTemplateValidationSchema = yup.object().shape({
  name: yup.string().required(),
  content: yup.string().required(),
});
