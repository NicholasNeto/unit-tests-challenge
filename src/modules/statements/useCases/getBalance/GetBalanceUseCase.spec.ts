import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let getBalanceUseCase: GetBalanceUseCase
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase;
let user: ICreateUserDTO



describe("Get Balance", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        
        user = {
            name: "User Teste",
            password: "1234",
            email: "user@teste.com",
        }
    })


    it('should be able to get a balance user', async () => {

        const { id } = await createUserUseCase.execute(user)
        if (id) {
            const profile = await getBalanceUseCase.execute({ user_id: id})
            expect(profile).toHaveProperty("statement")
            expect(profile).toHaveProperty("balance")
        }
    })

    it('should not be able to get a balance user with id not exists', async () => {

        expect(async () => {

            await getBalanceUseCase.execute({ user_id: "not_    exist"})

        }).rejects.toBeInstanceOf(GetBalanceError)

    })

})