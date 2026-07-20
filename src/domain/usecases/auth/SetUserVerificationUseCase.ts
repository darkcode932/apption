import { AuthRepository } from "../../repositories/AuthRepository";

export class SetUserVerificationUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(
    targetUserId: string,
    isVerified: boolean,
    officialTitle?: string
  ): Promise<void> {
    return this.authRepository.setUserVerification(
      targetUserId,
      isVerified,
      officialTitle
    );
  }
}
