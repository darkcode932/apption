import { AuthRepository } from "../../repositories/AuthRepository";
import { User } from "../../entities/User";

export class GetAllUsersUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(): Promise<User[]> {
    return this.authRepository.getAllUsers();
  }
}
