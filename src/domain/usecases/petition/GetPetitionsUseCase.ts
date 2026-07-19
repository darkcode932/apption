import { PetitionRepository } from "../../repositories/PetitionRepository";
import { Petition } from "../../entities/Petition";

export class GetPetitionsUseCase {
  constructor(private petitionRepository: PetitionRepository) {}

  execute(category?: string, scale?: string): Promise<Petition[]> {
    return this.petitionRepository.getAllPetitions(category, scale);
  }
}
