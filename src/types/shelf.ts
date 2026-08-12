/**
 * itemCategoryId is always null in v1 — the UI only collects free text.
 * Reserved so v2's category picker can populate it without a migration.
 * See types/reserved-v2.ts.
 */
export interface ShelfLabel {
  id: string;
  shelfId: string;
  text: string;
  itemCategoryId?: string | null;
  createdAt: string;
}

/**
 * levelIndex is counted bottom-up (0 = lowest shelf). This isn't arbitrary —
 * v3 food-safety rules ("raw protein below ready-to-eat") are inherently
 * about vertical order, so the field already means the right thing.
 */
export interface Shelf {
  id: string;
  shelvingUnitId: string;
  levelIndex: number;
  heightFromFloorIn?: number | null;
  labels: ShelfLabel[];
}
