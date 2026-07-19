import { PetitionRepository } from "../../repositories/PetitionRepository";
import { Petition } from "../../entities/Petition";

export class GetPetitionsByUserIdUseCase {
  constructor(private petitionRepository: PetitionRepository) {}

  execute(userId: string): Promise<Petition[]> {
    return this.petitionRepository.getPetitionsByUserId(userId);
  }
}
