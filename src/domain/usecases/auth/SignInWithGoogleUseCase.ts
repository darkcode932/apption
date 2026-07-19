import { AuthRepository } from "../../repositories/AuthRepository";
import { User } from "../../entities/User";

export class SignInWithGoogleUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<User> {
    return this.authRepository.signInWithGoogle();
  }
}
