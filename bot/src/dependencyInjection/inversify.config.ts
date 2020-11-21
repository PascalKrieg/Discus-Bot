import "reflect-metadata"
import { Container } from "inversify"
import { TYPES } from "./types"

import { Repository } from "../model/data/repository"
import { RepositoryImpl } from "../model/data/repositoryImpl"

import { DbAccess } from "../model/persistence/dbAccess"
import { MariaDbAccess } from "../model/persistence/mariaDBAccess"

const DIContainer = new Container();
DIContainer.bind<Repository>(TYPES.Repository).to(RepositoryImpl);
DIContainer.bind<DbAccess>(TYPES.DbAccess).to(MariaDbAccess);

export { DIContainer }