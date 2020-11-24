import "reflect-metadata"
import { Container } from "inversify"
import { TYPES } from "./types"

import { Repository } from "../model/data/repository"
import { RepositoryImpl } from "../model/data/repositoryImpl"

const DIContainer = new Container();
DIContainer.bind<Repository>(TYPES.Repository).to(RepositoryImpl);

export { DIContainer }