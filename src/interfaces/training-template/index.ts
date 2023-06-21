import { TrainingInterface } from 'interfaces/training';
import { GetQueryInterface } from 'interfaces';

export interface TrainingTemplateInterface {
  id?: string;
  name: string;
  content: string;
  created_at?: any;
  updated_at?: any;
  training?: TrainingInterface[];

  _count?: {
    training?: number;
  };
}

export interface TrainingTemplateGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  content?: string;
}
