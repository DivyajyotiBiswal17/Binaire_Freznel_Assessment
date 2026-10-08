export const LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "hi-IN", label: "हिन्दी (Hindi)" },
  { code: "es-ES", label: "Español" },
  { code: "fr-FR", label: "Français" },
  { code: "de-DE", label: "Deutsch" },
  { code: "ja-JP", label: "日本語 (Japanese)" },
];

export class LanguageStore {
  private static readonly key = "freznel-lang";
  static get(): string {
    try { return localStorage.getItem(this.key) ?? "en-US"; } catch { return "en-US"; }
  }
  static set(code: string): void {
    try { localStorage.setItem(this.key, code); } catch { /* storage unavailable */ }
  }
}