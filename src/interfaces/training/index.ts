import { EmployeeTrainingInterface } from 'interfaces/employee-training';
import { CompanyInterface } from 'interfaces/company';
import { TrainingTemplateInterface } from 'interfaces/training-template';
import { GetQueryInterface } from 'interfaces';

export interface TrainingInterface {
  id?: string;
  name: string;
  content: string;
  company_id?: string;
  template_id?: string;
  created_at?: any;
  updated_at?: any;
  employee_training?: EmployeeTrainingInterface[];
  company?: CompanyInterface;
  training_template?: TrainingTemplateInterface;
  _count?: {
    employee_training?: number;
  };
}

export interface TrainingGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  content?: string;
  company_id?: string;
  template_id?: string;
}
