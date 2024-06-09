import { Project } from 'entities';
import { catchErrors } from 'errors';
import { findEntityOrThrow, updateEntity } from 'utils/typeorm';
// import { issuePartial } from 'serializers/issues';
import { AppDataSource } from '../database/createConnection';

const projectRepository = AppDataSource.getRepository(Project);

export const getProjectWithUsersAndIssues = catchErrors(async (req, res) => {
  const project = await findEntityOrThrow(
    projectRepository,
    req.currentUser.projectId,
    //   , {
    //   relations: ['users', 'issues'],
    // }
  );
  res.respond({
    project: {
      ...project,
      // issues: project.issues.map(issuePartial),
    },
  });
});

export const update = catchErrors(async (req, res) => {
  const project = await updateEntity(projectRepository, req.currentUser.projectId, req.body);
  res.respond({ project });
});
