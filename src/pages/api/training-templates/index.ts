import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { trainingTemplateValidationSchema } from 'validationSchema/training-templates';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getTrainingTemplates();
    case 'POST':
      return createTrainingTemplate();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTrainingTemplates() {
    const data = await prisma.training_template
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'training_template'));
    return res.status(200).json(data);
  }

  async function createTrainingTemplate() {
    await trainingTemplateValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.training?.length > 0) {
      const create_training = body.training;
      body.training = {
        create: create_training,
      };
    } else {
      delete body.training;
    }
    const data = await prisma.training_template.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
