import { PetitionRepository } from "../../repositories/PetitionRepository";
import { Petition } from "../../entities/Petition";
import { sanitizeText } from "../../../utils/sanitize";

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
    city?: string,
    targetGoal?: number,
    durationDays?: number | null,
    targetDecisionMaker?: string,
    impactScore?: number
  ): Promise<Petition> {
    return this.petitionRepository.createPetition(
      sanitizeText(title),
      sanitizeText(description),
      sanitizeText(scale),
      sanitizeText(category),
      creatorId,
      sanitizeText(creatorName),
      imageFile,
      latitude,
      longitude,
      country ? sanitizeText(country) : undefined,
      city ? sanitizeText(city) : undefined,
      targetGoal,
      durationDays,
      targetDecisionMaker ? sanitizeText(targetDecisionMaker) : undefined,
      impactScore
    );
  }
}
