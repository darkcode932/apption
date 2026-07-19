import { PetitionRepository } from "../../repositories/PetitionRepository";

export class DeclareVictoryUseCase {
  constructor(private petitionRepository: PetitionRepository) {}

  async execute(petitionId: string): Promise<void> {
    return this.petitionRepository.declareVictory(petitionId);
  }
}
