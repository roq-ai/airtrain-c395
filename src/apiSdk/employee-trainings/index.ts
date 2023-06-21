import axios from 'axios';
import queryString from 'query-string';
import { EmployeeTrainingInterface, EmployeeTrainingGetQueryInterface } from 'interfaces/employee-training';
import { GetQueryInterface } from '../../interfaces';

export const getEmployeeTrainings = async (query?: EmployeeTrainingGetQueryInterface) => {
  const response = await axios.get(`/api/employee-trainings${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createEmployeeTraining = async (employeeTraining: EmployeeTrainingInterface) => {
  const response = await axios.post('/api/employee-trainings', employeeTraining);
  return response.data;
};

export const updateEmployeeTrainingById = async (id: string, employeeTraining: EmployeeTrainingInterface) => {
  const response = await axios.put(`/api/employee-trainings/${id}`, employeeTraining);
  return response.data;
};

export const getEmployeeTrainingById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/employee-trainings/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteEmployeeTrainingById = async (id: string) => {
  const response = await axios.delete(`/api/employee-trainings/${id}`);
  return response.data;
};
