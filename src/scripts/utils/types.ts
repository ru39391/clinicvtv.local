export type TTeamItemData = {
  pics: Record<"thumb" | "webp", string>;
  depts_id: number[];
} & Record<"id" | "menuindex", number> &
  Record<"url" | "introtext" | "pagetitle" | "depts", string>;

export type TPriceItemData = Record<'id' | 'price' | 'dept_id' | 'subdept_id', number> & Record<"name" | "createdAt" | "updatedAt", string> & Record<"isMinValue" | "is_hidden", 1 | 0>;

export type TCommonData = Partial<TTeamItemData & TPriceItemData>;
