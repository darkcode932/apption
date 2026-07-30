import { petitionRepository } from "../ServiceLocator";
import { Petition } from "../../domain/entities/Petition";

export interface SearchResultPetition {
  type: "petition";
  id: string;
  title: string;
  category: string;
  signaturesCount: number;
  status: string;
  city?: string;
  country?: string;
}

export interface SearchResultComment {
  type: "comment";
  id: string;
  petitionId: string;
  petitionTitle: string;
  authorName: string;
  text: string;
}

export interface SearchResultCategory {
  type: "category";
  name: string;
  count: number;
}

export interface SearchResults {
  petitions: SearchResultPetition[];
  comments: SearchResultComment[];
  categories: SearchResultCategory[];
}

export class SearchEngine {
  private static ALL_CATEGORIES = [
    "Politique",
    "Education",
    "Sport",
    "Art",
    "Santé",
    "Droits de l'homme",
    "Environnement",
    "Autres...",
  ];

  public static async search(term: string): Promise<SearchResults> {
    const cleanTerm = term.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (!cleanTerm) {
      return { petitions: [], comments: [], categories: [] };
    }

    // Fetch all cached petitions
    const allPetitions = await petitionRepository.getAllPetitions();

    // 1. Search Petitions
    const matchingPetitions: SearchResultPetition[] = [];
    allPetitions.forEach((pet) => {
      const matchTitle = pet.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(cleanTerm);
      const matchDesc = pet.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(cleanTerm);
      const matchCategory = pet.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(cleanTerm);
      const matchLocation = (pet.city || "").toLowerCase().includes(cleanTerm) || (pet.country || "").toLowerCase().includes(cleanTerm);
      const matchCreator = (pet.creatorName || "").toLowerCase().includes(cleanTerm);

      if (matchTitle || matchDesc || matchCategory || matchLocation || matchCreator) {
        matchingPetitions.push({
          type: "petition",
          id: pet.id,
          title: pet.title,
          category: pet.category,
          signaturesCount: pet.signaturesCount,
          status: pet.status || "active",
          city: pet.city,
          country: pet.country,
        });
      }
    });

    // 2. Search Categories / Tags
    const matchingCategories: SearchResultCategory[] = [];
    this.ALL_CATEGORIES.forEach((cat) => {
      const catClean = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (catClean.includes(cleanTerm)) {
        const count = allPetitions.filter((p) => p.category === cat).length;
        matchingCategories.push({
          type: "category",
          name: cat,
          count,
        });
      }
    });

    // Limit petitions to top 6
    const petitionsResult = matchingPetitions.slice(0, 6);

    return {
      petitions: petitionsResult,
      comments: [], // Comments are queried per petition when selected
      categories: matchingCategories,
    };
  }
}
