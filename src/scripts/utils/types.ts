export type TPicsData = Record<"thumb" | "webp", string>;

export type TItemData = Record<'id' | 'dept_id' | 'subdept_id', number> & Record<"is_hidden", 1 | 0> & Record<"name" | "createdAt" | "updatedAt", string>;

export type TTeamItemData = {
  pics: TPicsData;
  depts_id: number[];
} & Record<"id" | "menuindex", number> &
  Record<"url" | "introtext" | "pagetitle" | "depts", string>;

export type TPriceItemData = TItemData & Record<'price', number> & Record<"isMinValue", 1 | 0>;

export type TExampleItemData = TItemData & Record<'spec_id', number> & Record<"img_before" | "img_after", TPicsData> & Record<'desc' | 'introtext', string>;

export type TCommonData = Partial<TTeamItemData & TPriceItemData & TExampleItemData>;
