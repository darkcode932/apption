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
    imageFile?: File | null,
    latitude?: number,
    longitude?: number,
    country?: string,
    city?: string
  ): Promise<Petition> {
    return this.petitionRepository.createPetition(
      title,
      description,
      scale,
      category,
      creatorId,
      creatorName,
      imageFile,
      latitude,
      longitude,
      country,
      city
    );
  }
}
