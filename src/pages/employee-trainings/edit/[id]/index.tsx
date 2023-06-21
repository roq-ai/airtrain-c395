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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getEmployeeTrainingById, updateEmployeeTrainingById } from 'apiSdk/employee-trainings';
import { Error } from 'components/error';
import { employeeTrainingValidationSchema } from 'validationSchema/employee-trainings';
import { EmployeeTrainingInterface } from 'interfaces/employee-training';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { UserInterface } from 'interfaces/user';
import { TrainingInterface } from 'interfaces/training';
import { getUsers } from 'apiSdk/users';
import { getTrainings } from 'apiSdk/trainings';

function EmployeeTrainingEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<EmployeeTrainingInterface>(
    () => (id ? `/employee-trainings/${id}` : null),
    () => getEmployeeTrainingById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: EmployeeTrainingInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateEmployeeTrainingById(id, values);
      mutate(updated);
      resetForm();
      router.push('/employee-trainings');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<EmployeeTrainingInterface>({
    initialValues: data,
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
            Edit Employee Training
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
            <FormControl
              id="completed"
              display="flex"
              alignItems="center"
              mb="4"
              isInvalid={!!formik.errors?.completed}
            >
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'employee_training',
  operation: AccessOperationEnum.UPDATE,
})(EmployeeTrainingEditPage);
