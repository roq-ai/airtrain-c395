import axios from 'axios';
import queryString from 'query-string';
import { TrainingTemplateInterface, TrainingTemplateGetQueryInterface } from 'interfaces/training-template';
import { GetQueryInterface } from '../../interfaces';

export const getTrainingTemplates = async (query?: TrainingTemplateGetQueryInterface) => {
  const response = await axios.get(`/api/training-templates${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTrainingTemplate = async (trainingTemplate: TrainingTemplateInterface) => {
  const response = await axios.post('/api/training-templates', trainingTemplate);
  return response.data;
};

export const updateTrainingTemplateById = async (id: string, trainingTemplate: TrainingTemplateInterface) => {
  const response = await axios.put(`/api/training-templates/${id}`, trainingTemplate);
  return response.data;
};

export const getTrainingTemplateById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/training-templates/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTrainingTemplateById = async (id: string) => {
  const response = await axios.delete(`/api/training-templates/${id}`);
  return response.data;
};
