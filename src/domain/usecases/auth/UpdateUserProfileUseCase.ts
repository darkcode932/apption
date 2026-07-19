import { AuthRepository } from "../../repositories/AuthRepository";

export class UpdateUserProfileUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(
    userId: string,
    data: {
      firstname?: string;
      lastname?: string;
      username?: string;
      bio?: string;
      location?: string;
      avatarUrl?: string;
      latitude?: number;
      longitude?: number;
      country?: string;
      city?: string;
    }
  ): Promise<void> {
    return this.authRepository.updateUserProfile(userId, data);
  }
}
