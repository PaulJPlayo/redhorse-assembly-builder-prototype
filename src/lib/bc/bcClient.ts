import { mockCatalog } from "@/data/mockCatalog";
import type { Catalog } from "@/types/catalog";

export const bcClient = {
  getCatalog(): Catalog {
    return mockCatalog;
  },
};
