import { AppDataSource } from 'database/createConnection';
import { Issue } from 'entities';
import { catchErrors } from 'errors';
import { createEntity, deleteEntity, findEntityOrThrow, updateEntity } from 'utils/typeorm';

const issueRepo = AppDataSource.getRepository(Issue);
export const getProjectIssues = catchErrors(async (req, res) => {
  const { projectId } = req.currentUser;
  const { searchTerm } = req.query;

  let whereSQL = 'issue.projectId = :projectId';

  if (searchTerm) {
    whereSQL += ' AND (issue.title ILIKE :searchTerm OR issue.descriptionText ILIKE :searchTerm)';
  }

  const issues = await issueRepo
    .createQueryBuilder('issue')
    .select()
    .where(whereSQL, { projectId, searchTerm: `%${searchTerm}%` })
    .getMany();

  res.respond({ issues });
});

export const create = catchErrors(async (req, res) => {
  const listPosition = await calculateListPosition(req.body);
  const issue = await createEntity(issueRepo, { ...req.body, listPosition });
  res.respond({ issue });
});

export const update = catchErrors(async (req, res) => {
  const issue = await updateEntity(issueRepo, req.params.issueId, req.body);
  res.respond({ issue });
});

export const remove = catchErrors(async (req, res) => {
  const issue = await deleteEntity(issueRepo, req.params.issueId);
  res.respond({ issue });
});

const calculateListPosition = async ({ projectId, status }: Issue): Promise<number> => {
  const issues = await issueRepo.find({
    where: {
      projectId,
      status,
    },
  });

  const listPositions = issues.map(({ listPosition }) => listPosition);

  if (listPositions.length > 0) {
    return Math.min(...listPositions) - 1;
  }
  return 1;
};
export const getIssueWithUsersAndComments = catchErrors(async (req, res) => {
  const issue = await findEntityOrThrow(
    issueRepo,
    req.params.issueId,
    //     , {
    //     // relations: ['users', 'comments', 'comments.user'],
    //   }
  );
  res.respond({ issue });
});
