/**
 * Small shared helpers. Add domain helpers in later phases.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
