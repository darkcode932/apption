import { PetitionRepository } from "../../repositories/PetitionRepository";

export class UpdatePetitionFeaturedUseCase {
  constructor(private petitionRepository: PetitionRepository) {}

  execute(petitionId: string, isFeatured: boolean): Promise<void> {
    return this.petitionRepository.updatePetitionFeatured(petitionId, isFeatured);
  }
}
