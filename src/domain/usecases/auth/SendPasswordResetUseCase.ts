import { AuthRepository } from "../../repositories/AuthRepository";

export class SendPasswordResetUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string): Promise<void> {
    return this.authRepository.sendPasswordReset(email);
  }
}
