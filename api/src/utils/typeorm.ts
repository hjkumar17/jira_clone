// import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

import { DeepPartial, DeleteResult, Repository } from 'typeorm';

import { Project, User, Issue, Comment } from 'entities';
import { EntityNotFoundError, BadUserInputError } from 'errors';
import { generateErrors } from 'utils/validation';
// import { Repository } from 'typeorm';

// type EntityConstructor =
//   | Repository<Project>
//   | Repository<User>
//   | Repository<Issue>
//   | Repository<Comment>;
type EntityConstructor<T extends EntityInstance> = Repository<T>;
type EntityInstance = Project | User | Issue | Comment;

const entities: { [key: string]: any } = { Comment, Issue, Project, User };

export const findEntityOrThrow = async <T extends EntityInstance>(
  Entity: EntityConstructor<T>,
  id: any,
  options?: any,
): Promise<EntityInstance> => {
  const instance = await Entity.findOne({ where: { id }, relations: [...options] });
  if (!instance) {
    throw new EntityNotFoundError(Entity.constructor.name);
  }
  return instance;
};

export const validateAndSaveEntity = async <T extends EntityInstance>(
  Entity: EntityConstructor<T>,
  instance: T,
): Promise<T> => {
  const Constructor = entities[instance.constructor.name];

  if ('validations' in Constructor) {
    const errorFields = generateErrors(instance, Constructor.validations);

    if (Object.keys(errorFields).length > 0) {
      throw new BadUserInputError({ fields: errorFields });
    }
  }
  return Entity.save(instance);
};

export const createEntity = async <T extends EntityInstance>(
  Entity: EntityConstructor<T>,
  input: DeepPartial<T>,
): Promise<T> => {
  const instance = Entity.create(input);
  return validateAndSaveEntity(Entity, instance);
};

export const updateEntity = async <T extends EntityInstance>(
  Entity: EntityConstructor<T>,
  id: any,
  input: DeepPartial<T>,
): Promise<T> => {
  const instance = await Entity.findOneBy({ id });
  if (!instance) {
    throw new EntityNotFoundError(Entity.constructor.name);
  }
  Entity.merge(instance, input);
  console.log(input, instance);
  return validateAndSaveEntity(Entity, instance);
};

export const deleteEntity = async <T extends EntityInstance>(
  Entity: EntityConstructor<T>,
  id: any,
): Promise<DeleteResult> => {
  const removedEntity = await Entity.delete(id);
  return removedEntity;
};
