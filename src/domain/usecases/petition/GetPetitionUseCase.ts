import { PetitionRepository } from "../../repositories/PetitionRepository";
import { Petition } from "../../entities/Petition";

export class GetPetitionUseCase {
  constructor(private petitionRepository: PetitionRepository) {}

  execute(id: string): Promise<Petition | null> {
    return this.petitionRepository.getPetitionById(id);
  }
}
