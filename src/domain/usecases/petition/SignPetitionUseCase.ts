import { PetitionRepository } from "../../repositories/PetitionRepository";

export class SignPetitionUseCase {
  constructor(private petitionRepository: PetitionRepository) {}

  execute(
    petitionId: string,
    userId: string,
    userName: string,
    reason?: string,
    city?: string,
    country?: string
  ): Promise<void> {
    return this.petitionRepository.signPetition(
      petitionId,
      userId,
      userName,
      reason,
      city,
      country
    );
  }
}
