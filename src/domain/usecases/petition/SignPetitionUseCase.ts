import { PetitionRepository } from "../../repositories/PetitionRepository";

export class SignPetitionUseCase {
  constructor(private petitionRepository: PetitionRepository) {}

  execute(petitionId: string, userId: string, userName: string): Promise<void> {
    return this.petitionRepository.signPetition(petitionId, userId, userName);
  }
}
