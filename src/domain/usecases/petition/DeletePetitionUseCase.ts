import { PetitionRepository } from "../../repositories/PetitionRepository";

export class DeletePetitionUseCase {
  constructor(private petitionRepository: PetitionRepository) {}

  execute(petitionId: string): Promise<void> {
    return this.petitionRepository.deletePetition(petitionId);
  }
}
