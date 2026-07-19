import { PetitionRepository } from "../../repositories/PetitionRepository";
import { Petition } from "../../entities/Petition";

export class CreatePetitionUseCase {
  constructor(private petitionRepository: PetitionRepository) {}

  execute(
    title: string,
    description: string,
    scale: string,
    category: string,
    creatorId: string,
    creatorName: string,
    imageFile?: File | null
  ): Promise<Petition> {
    return this.petitionRepository.createPetition(
      title,
      description,
      scale,
      category,
      creatorId,
      creatorName,
      imageFile
    );
  }
}
