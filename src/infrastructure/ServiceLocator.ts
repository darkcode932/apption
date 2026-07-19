import { FirebaseAuthRepository } from "./firebase/FirebaseAuthRepository";
import { FirebasePetitionRepository } from "./firebase/FirebasePetitionRepository";
import { SignInUseCase } from "../domain/usecases/auth/SignInUseCase";
import { SignUpUseCase } from "../domain/usecases/auth/SignUpUseCase";
import { SignOutUseCase } from "../domain/usecases/auth/SignOutUseCase";
import { GetCurrentUserUseCase } from "../domain/usecases/auth/GetCurrentUserUseCase";
import { SignInWithGoogleUseCase } from "../domain/usecases/auth/SignInWithGoogleUseCase";
import { SignInWithFacebookUseCase } from "../domain/usecases/auth/SignInWithFacebookUseCase";
import { UpdateUserProfileUseCase } from "../domain/usecases/auth/UpdateUserProfileUseCase";
import { CreatePetitionUseCase } from "../domain/usecases/petition/CreatePetitionUseCase";
import { GetPetitionUseCase } from "../domain/usecases/petition/GetPetitionUseCase";
import { GetPetitionsUseCase } from "../domain/usecases/petition/GetPetitionsUseCase";
import { GetPetitionsByUserIdUseCase } from "../domain/usecases/petition/GetPetitionsByUserIdUseCase";
import { SignPetitionUseCase } from "../domain/usecases/petition/SignPetitionUseCase";

const authRepository = new FirebaseAuthRepository();
const petitionRepository = new FirebasePetitionRepository();

export const signInUseCase = new SignInUseCase(authRepository);
export const signUpUseCase = new SignUpUseCase(authRepository);
export const signOutUseCase = new SignOutUseCase(authRepository);
export const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);
export const signInWithGoogleUseCase = new SignInWithGoogleUseCase(authRepository);
export const signInWithFacebookUseCase = new SignInWithFacebookUseCase(authRepository);
export const updateUserProfileUseCase = new UpdateUserProfileUseCase(authRepository);

export const createPetitionUseCase = new CreatePetitionUseCase(petitionRepository);
export const getPetitionUseCase = new GetPetitionUseCase(petitionRepository);
export const getPetitionsUseCase = new GetPetitionsUseCase(petitionRepository);
export const getPetitionsByUserIdUseCase = new GetPetitionsByUserIdUseCase(petitionRepository);
export const signPetitionUseCase = new SignPetitionUseCase(petitionRepository);

export { authRepository, petitionRepository };
export type { AuthRepository } from "../domain/repositories/AuthRepository";
export type { PetitionRepository } from "../domain/repositories/PetitionRepository";
