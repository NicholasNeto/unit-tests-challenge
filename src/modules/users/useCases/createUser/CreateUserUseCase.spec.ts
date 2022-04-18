
// import { CarsRepositoryInMemory } from "@modeles/cars/repositories/in-memory/CarsRepositoryInMemory"
// import { AppError } from "@shared/errors/AppError";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase"


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;


describe("Create User", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    })

    it("should be able to create a new user", async () => {
        const user = await createUserUseCase.execute(
            {
                name: "Nome Test ",
                email: "teste@teste.com",
                password: "12345"
            }
        )

        expect(user).toHaveProperty('id')

    })

    it("should not be able to create a car with exists email", () => {
        expect(async () => {
            await createUserUseCase.execute(
                {
                    name: "Nome Test ",
                    email: "teste@teste.com",
                    password: "12345"
                }
            )

            await createUserUseCase.execute(
                {
                    name: "Nome Test ",
                    email: "teste@teste.com",
                    password: "12345"
                }
            )

        }).rejects.toBeInstanceOf(AppError)
    })
})