import { AuthRepository } from "../../repositories/AuthRepository";
import { User } from "../../entities/User";

export class GetCurrentUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }
}
