import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { employeeTrainingValidationSchema } from 'validationSchema/employee-trainings';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.employee_training
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getEmployeeTrainingById();
    case 'PUT':
      return updateEmployeeTrainingById();
    case 'DELETE':
      return deleteEmployeeTrainingById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEmployeeTrainingById() {
    const data = await prisma.employee_training.findFirst(convertQueryToPrismaUtil(req.query, 'employee_training'));
    return res.status(200).json(data);
  }

  async function updateEmployeeTrainingById() {
    await employeeTrainingValidationSchema.validate(req.body);
    const data = await prisma.employee_training.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteEmployeeTrainingById() {
    const data = await prisma.employee_training.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
