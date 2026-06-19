export type TTeamItemData = {
  pics: Record<"thumb" | "webp", string>;
  depts_id: number[];
} & Record<"id" | "menuindex", number> &
  Record<"url" | "introtext" | "pagetitle" | "depts", string>;
