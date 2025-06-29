export const NOTE_TYPE_TEXT = "text" as const;
export const NOTE_TYPE_RICH = "rich" as const;
export const NOTE_TYPE_CHECKLIST = "checklist" as const;
export const NOTE_TYPE_MD = "md" as const;
export const NOTE_TYPE_CODE = "code" as const;

export const NOTE_TYPES = [
  NOTE_TYPE_TEXT,
  NOTE_TYPE_RICH,
  NOTE_TYPE_CHECKLIST,
  NOTE_TYPE_MD,
  NOTE_TYPE_CODE
] as const;

export type NoteType = (typeof NOTE_TYPES)[number];

export function usesRichEditor(type: NoteType): boolean {
  return type === "rich" || type === "checklist";
}

export function isChecklist(type: NoteType): boolean {
  return type === "checklist";
}

export function codeLike(type: NoteType | string): boolean {
  return type === "md" || type === "code";
}
