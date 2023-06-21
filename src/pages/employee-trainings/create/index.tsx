import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createEmployeeTraining } from 'apiSdk/employee-trainings';
import { Error } from 'components/error';
import { employeeTrainingValidationSchema } from 'validationSchema/employee-trainings';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { TrainingInterface } from 'interfaces/training';
import { getUsers } from 'apiSdk/users';
import { getTrainings } from 'apiSdk/trainings';
import { EmployeeTrainingInterface } from 'interfaces/employee-training';

function EmployeeTrainingCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: EmployeeTrainingInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createEmployeeTraining(values);
      resetForm();
      router.push('/employee-trainings');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<EmployeeTrainingInterface>({
    initialValues: {
      progress: 0,
      completed: false,
      user_id: (router.query.user_id as string) ?? null,
      training_id: (router.query.training_id as string) ?? null,
    },
    validationSchema: employeeTrainingValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Employee Training
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="progress" mb="4" isInvalid={!!formik.errors?.progress}>
            <FormLabel>Progress</FormLabel>
            <NumberInput
              name="progress"
              value={formik.values?.progress}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('progress', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.progress && <FormErrorMessage>{formik.errors?.progress}</FormErrorMessage>}
          </FormControl>
          <FormControl id="completed" display="flex" alignItems="center" mb="4" isInvalid={!!formik.errors?.completed}>
            <FormLabel htmlFor="switch-completed">Completed</FormLabel>
            <Switch
              id="switch-completed"
              name="completed"
              onChange={formik.handleChange}
              value={formik.values?.completed ? 1 : 0}
            />
            {formik.errors?.completed && <FormErrorMessage>{formik.errors?.completed}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<TrainingInterface>
            formik={formik}
            name={'training_id'}
            label={'Select Training'}
            placeholder={'Select Training'}
            fetcher={getTrainings}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'employee_training',
  operation: AccessOperationEnum.CREATE,
})(EmployeeTrainingCreatePage);
