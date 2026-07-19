import { AuthRepository } from "../../repositories/AuthRepository";

export class UploadAvatarUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(userId: string, imageFile: File): Promise<string> {
    return this.authRepository.uploadAvatar(userId, imageFile);
  }
}
