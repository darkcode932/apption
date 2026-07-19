import { AuthRepository } from "../../repositories/AuthRepository";
import { User } from "../../entities/User";

export class SignInUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(email: string, password: string): Promise<User> {
    return this.authRepository.signIn(email, password);
  }
}
