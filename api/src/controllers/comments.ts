import { AppDataSource } from 'database/createConnection';
import { Comment } from 'entities';
import { catchErrors } from 'errors';
import { createEntity, deleteEntity, updateEntity } from 'utils/typeorm';

const commentRepo = AppDataSource.getRepository(Comment);
export const create = catchErrors(async (req, res) => {
  const comment = await createEntity(commentRepo, req.body);
  res.respond({ comment });
});

export const update = catchErrors(async (req, res) => {
  const comment = await updateEntity(commentRepo, req.params.commentId, req.body);
  res.respond({ comment });
});

export const remove = catchErrors(async (req, res) => {
  const comment = await deleteEntity(commentRepo, req.params.commentId);
  res.respond({ comment });
});
