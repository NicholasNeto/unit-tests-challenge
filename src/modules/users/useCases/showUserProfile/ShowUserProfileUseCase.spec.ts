import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let user: ICreateUserDTO



describe("User Profile", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        
        user = {
            name: "User Teste",
            password: "1234",
            email: "user@teste.com",
        }
    })


    it('should be able to get a user profile', async () => {

        const { id } = await createUserUseCase.execute(user)
        if (id) {
            const profile = await showUserProfileUseCase.execute(id)
            expect(profile).toHaveProperty("id")
            expect(profile).toHaveProperty("name")
            expect(profile).toHaveProperty("email")
        }
    })


    it('should not be able to get a user profile with id not exists', async () => {

        expect(async () => {

            await showUserProfileUseCase.execute("not exsits")

        }).rejects.toBeInstanceOf(ShowUserProfileError)

    })
})