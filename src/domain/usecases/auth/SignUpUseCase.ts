import { AuthRepository } from "../../repositories/AuthRepository";
import { User } from "../../entities/User";

export class SignUpUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    username: string
  ): Promise<User> {
    return this.authRepository.signUp(email, password, firstname, lastname, username);
  }
}
