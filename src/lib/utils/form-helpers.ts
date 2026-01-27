/**
 * Generate aria attributes for form fields
 */
export function getAriaAttributes(
  fieldId: string,
  hasError: boolean,
  hasDescription: boolean,
): Record<string, string | undefined> {
  const describedBy = [hasDescription && `${fieldId}-description`, hasError && `${fieldId}-error`]
    .filter(Boolean)
    .join(' ');

  return {
    'aria-invalid': hasError ? 'true' : undefined,
    'aria-describedby': describedBy || undefined,
  };
}

/**
 * Format validation error for display
 */
export function formatValidationError(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'Invalid value';
}

/**
 * Generate unique field ID
 */
export function generateFieldId(formId: string, fieldName: string): string {
  return `${formId}-${fieldName.replace(/\./g, '-')}`;
}

/**
 * Slugify a string for use in URLs or IDs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
