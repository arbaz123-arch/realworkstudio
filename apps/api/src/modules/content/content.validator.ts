// Content validation utilities for XSS prevention and structure validation

export class ContentValidator {
  // Patterns that indicate potential XSS attempts
  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onload, etc.
    /<iframe\b/gi,
    /<object\b/gi,
    /<embed\b/gi,
    /data:text\/html/gi,
  ];

  // Maximum allowed depth for nested objects
  private static readonly MAX_DEPTH = 10;

  // Maximum allowed size for JSON string (1MB)
  private static readonly MAX_SIZE_BYTES = 1024 * 1024;

  /**
   * Validate content value for XSS and structure
   * @throws Error if validation fails
   */
  static validate(value: Record<string, unknown>): void {
    // Check size
    const jsonString = JSON.stringify(value);
    if (jsonString.length > this.MAX_SIZE_BYTES) {
      throw new Error('Content exceeds maximum size of 1MB');
    }

    // Check depth
    const depth = this.calculateDepth(value);
    if (depth > this.MAX_DEPTH) {
      throw new Error(`Content nesting exceeds maximum depth of ${this.MAX_DEPTH}`);
    }

    // Check for XSS patterns
    if (this.containsXss(jsonString)) {
      throw new Error('Content contains potentially harmful patterns (XSS detected)');
    }
  }

  /**
   * Sanitize string values by removing potentially harmful content
   */
  static sanitize(value: Record<string, unknown>): Record<string, unknown> {
    return this.sanitizeObject(value) as Record<string, unknown>;
  }

  private static calculateDepth(obj: unknown, currentDepth = 0): number {
    if (currentDepth > this.MAX_DEPTH) {
      return currentDepth;
    }

    if (typeof obj !== 'object' || obj === null) {
      return currentDepth;
    }

    if (Array.isArray(obj)) {
      let maxDepth = currentDepth;
      for (const item of obj) {
        const depth = this.calculateDepth(item, currentDepth + 1);
        maxDepth = Math.max(maxDepth, depth);
      }
      return maxDepth;
    }

    let maxDepth = currentDepth;
    for (const key of Object.keys(obj)) {
      const depth = this.calculateDepth((obj as Record<string, unknown>)[key], currentDepth + 1);
      maxDepth = Math.max(maxDepth, depth);
    }
    return maxDepth;
  }

  private static containsXss(jsonString: string): boolean {
    for (const pattern of this.XSS_PATTERNS) {
      if (pattern.test(jsonString)) {
        return true;
      }
    }
    return false;
  }

  private static sanitizeObject(obj: unknown): unknown {
    if (typeof obj === 'string') {
      // Remove script tags and event handlers
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeObject(value);
      }
      return sanitized;
    }

    return obj;
  }
}
