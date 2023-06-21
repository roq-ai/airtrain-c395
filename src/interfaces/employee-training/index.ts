import { UserInterface } from 'interfaces/user';
import { TrainingInterface } from 'interfaces/training';
import { GetQueryInterface } from 'interfaces';

export interface EmployeeTrainingInterface {
  id?: string;
  user_id?: string;
  training_id?: string;
  progress: number;
  completed: boolean;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  training?: TrainingInterface;
  _count?: {};
}

export interface EmployeeTrainingGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  training_id?: string;
}
