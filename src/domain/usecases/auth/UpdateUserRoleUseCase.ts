import { AuthRepository } from "../../repositories/AuthRepository";

export class UpdateUserRoleUseCase {
  constructor(private authRepository: AuthRepository) {}

  execute(
    targetUserId: string,
    newRole: "user" | "admin" | "super_admin"
  ): Promise<void> {
    return this.authRepository.updateUserRole(targetUserId, newRole);
  }
}
