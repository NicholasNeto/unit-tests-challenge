import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase : CreateUserUseCase;
let user : ICreateUserDTO


describe("Authenticate User", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

        user = {
            name: "User Teste",
            password: "1234",
            email: "user@teste.com",
        }
    })


    it('should be able to authenticate an user', async () => {

        await createUserUseCase.execute(user)
        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        })

        expect(result).toHaveProperty("token")
    })

    it('should not be able to authenticate an nonexistent user', async () => {
        
        expect( async () => {
            const result = await authenticateUserUseCase.execute({
                email: "false@email.com",
                password: '12345'
            })
        }).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to authenticate with incorrect password', () => {
        expect( async () => {

            await createUserUseCase.execute(user)    
            await authenticateUserUseCase.execute({
                email: user.email,
                password: "0000"
            })

        }).rejects.toBeInstanceOf(AppError)

    })




})