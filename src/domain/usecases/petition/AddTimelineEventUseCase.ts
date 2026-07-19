import { PetitionRepository } from "../../repositories/PetitionRepository";
import { TimelineEvent } from "../../entities/TimelineEvent";

export class AddTimelineEventUseCase {
  constructor(private petitionRepository: PetitionRepository) {}

  async execute(
    petitionId: string,
    event: Omit<TimelineEvent, "id" | "createdAt">
  ): Promise<TimelineEvent> {
    return this.petitionRepository.addTimelineEvent(petitionId, event);
  }
}
