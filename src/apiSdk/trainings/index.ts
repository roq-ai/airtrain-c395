import axios from 'axios';
import queryString from 'query-string';
import { TrainingInterface, TrainingGetQueryInterface } from 'interfaces/training';
import { GetQueryInterface } from '../../interfaces';

export const getTrainings = async (query?: TrainingGetQueryInterface) => {
  const response = await axios.get(`/api/trainings${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTraining = async (training: TrainingInterface) => {
  const response = await axios.post('/api/trainings', training);
  return response.data;
};

export const updateTrainingById = async (id: string, training: TrainingInterface) => {
  const response = await axios.put(`/api/trainings/${id}`, training);
  return response.data;
};

export const getTrainingById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/trainings/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTrainingById = async (id: string) => {
  const response = await axios.delete(`/api/trainings/${id}`);
  return response.data;
};
