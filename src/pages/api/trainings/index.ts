import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { trainingValidationSchema } from 'validationSchema/trainings';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTrainings();
    case 'POST':
      return createTraining();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTrainings() {
    const data = await prisma.training
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'training'));
    return res.status(200).json(data);
  }

  async function createTraining() {
    await trainingValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.employee_training?.length > 0) {
      const create_employee_training = body.employee_training;
      body.employee_training = {
        create: create_employee_training,
      };
    } else {
      delete body.employee_training;
    }
    const data = await prisma.training.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
