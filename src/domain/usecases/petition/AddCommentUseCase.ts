import { PetitionRepository } from "../../repositories/PetitionRepository";
import { Comment } from "../../entities/Comment";

export class AddCommentUseCase {
  constructor(private petitionRepository: PetitionRepository) {}

  async execute(
    petitionId: string,
    userId: string,
    userName: string,
    text: string
  ): Promise<Comment> {
    return this.petitionRepository.addComment(petitionId, userId, userName, text);
  }
}
