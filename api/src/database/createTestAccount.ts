import { Comment, Issue, Project, User } from 'entities';
import { ProjectCategory } from 'constants/projects';
import { IssueType, IssueStatus, IssuePriority } from 'constants/issues';
import { createEntity } from 'utils/typeorm';
import { AppDataSource } from './createConnection';

const userRepo = AppDataSource.getRepository(User);
const projectRepo = AppDataSource.getRepository(Project);
const commentRepo = AppDataSource.getRepository(Comment);
const issueRepo = AppDataSource.getRepository(Issue);
const seedUsers = (): Promise<User[]> => {
  const users = [
    createEntity(userRepo, {
      email: 'gaben@jira.test',
      name: 'Gaben',
      avatarUrl: 'https://i.ibb.co/6RJ5hq6/gaben.jpg',
    }),
    createEntity(userRepo, {
      email: 'yoda@jira.test',
      name: 'Yoda',
      avatarUrl: 'https://i.ibb.co/6n0hLML/baby-yoda.jpg',
    }),
  ];
  return Promise.all(users);
};

const seedProject = (users: User[]): Promise<Project> =>
  createEntity(projectRepo, {
    name: 'Project name',
    url: 'https://www.testurl.com',
    description: 'Project description',
    category: ProjectCategory.SOFTWARE,
    users,
  });

const seedIssues = (project: Project): Promise<Issue[]> => {
  const { users } = project;

  const issues = [
    createEntity(issueRepo, {
      title: 'Issue title 1',
      type: IssueType.TASK,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.LOWEST,
      listPosition: 1,
      reporterId: users[0].id,
      project,
    }),
    createEntity(issueRepo, {
      title: 'Issue title 2',
      type: IssueType.TASK,
      status: IssueStatus.BACKLOG,
      priority: IssuePriority.MEDIUM,
      listPosition: 2,
      estimate: 5,
      description: 'Issue description 2',
      reporterId: users[0].id,
      users: [users[0]],
      project,
    }),
    createEntity(issueRepo, {
      title: 'Issue title 3',
      type: IssueType.STORY,
      status: IssueStatus.SELECTED,
      priority: IssuePriority.HIGH,
      listPosition: 3,
      estimate: 10,
      description: 'Issue description 3',
      reporterId: users[0].id,
      users: [users[0], users[1]],
      project,
    }),
  ];
  return Promise.all(issues);
};

const seedComments = (issue: Issue, user: User): Promise<Comment> =>
  createEntity(commentRepo, {
    body: 'Comment body',
    issueId: issue.id,
    userId: user.id,
  });

const createTestAccount = async (): Promise<User> => {
  const users = await seedUsers();
  const project = await seedProject(users);
  const issues = await seedIssues(project);
  await seedComments(issues[0], project.users[0]);
  return users[0];
};

export default createTestAccount;
