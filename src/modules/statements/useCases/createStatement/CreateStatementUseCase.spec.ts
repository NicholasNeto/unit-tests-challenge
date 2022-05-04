import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository

let createUserUseCase: CreateUserUseCase;
let user: ICreateUserDTO


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}


describe("Statement deposit and withdraw", () => {

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

        user = {
            name: "User Teste",
            password: "1234",
            email: "user@teste.com",
        }
    })

    it('should be able to statement deposit', async () => {

        const { id } = await createUserUseCase.execute(user)

        await createStatementUseCase.execute(
            {
                type: 'deposit' as OperationType,
                user_id: id as string,
                amount: 300,
                description: "Job frelancer",
            })


        const statement = await createStatementUseCase.execute(
            {
                type: 'deposit' as OperationType,
                user_id: id as string,
                amount: 200,
                description: "Job frelancer",
            })

        expect(statement).toHaveProperty("id")
        expect(statement).toHaveProperty("user_id")
        expect(statement).toHaveProperty("description")
        expect(statement).toHaveProperty("amount")
        expect(statement).toHaveProperty("type")
    })


    it('should be able to statement withdraw', async () => {

        const { id } = await createUserUseCase.execute(user)

        await createStatementUseCase.execute(
            {
                type: 'deposit' as OperationType,
                user_id: id as string,
                amount: 300,
                description: "Job frelancer",
            })


        const statement = await createStatementUseCase.execute(
            {
                type: 'withdraw' as OperationType,
                user_id: id as string,
                amount: 200,
                description: "Job frelancer",
            })

        expect(statement).toHaveProperty("id")
        expect(statement).toHaveProperty("user_id")
        expect(statement).toHaveProperty("description")
        expect(statement).toHaveProperty("amount")
        expect(statement).toHaveProperty("type")
    })


    it('should not be able to statement withdraw without insufficient funds ', async () => {

        expect(async () => {
            const { id } = await createUserUseCase.execute(user)
            await createStatementUseCase.execute(
                {
                    type: 'withdraw' as OperationType,
                    user_id: id as string,
                    amount: 200,
                    description: "Job frelancer",
                })
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
    })

    it('should not be able to statement deposit without valid user', async () => {

        expect(async () => {
            await createStatementUseCase.execute(
                {
                    type: 'deposit' as OperationType,
                    user_id: '',
                    amount: 200,
                    description: "Job frelancer",
                })
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
    })

})

