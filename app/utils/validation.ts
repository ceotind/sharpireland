import validator from 'validator';
import sanitizeHtml from 'sanitize-html';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: ContactFormData | BookingFormData | undefined;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  description: string;
  csrfToken?: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  purpose: string;
  company?: string;
  phone?: string;
  csrfToken?: string;
}

export class InputValidator {
  // Sanitize HTML content
  private sanitizeHtml(input: string): string {
    return sanitizeHtml(input, {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: 'discard'
    });
  }

  // Sanitize and validate name
  private validateName(name: unknown): { isValid: boolean; error?: string; sanitized?: string } {
    if (!name || typeof name !== 'string') {
      return { isValid: false, error: 'Name is required' };
    }

    const sanitized = this.sanitizeHtml(name.trim());
    
    if (sanitized.length < 2) {
      return { isValid: false, error: 'Name must be at least 2 characters long' };
    }

    if (sanitized.length > 100) {
      return { isValid: false, error: 'Name must be less than 100 characters' };
    }

    // Check for valid name characters (letters, spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s\-'\.]+$/.test(sanitized)) {
      return { isValid: false, error: 'Name contains invalid characters' };
    }

    return { isValid: true, sanitized };
  }

  // Validate email
  private validateEmail(email: unknown): { isValid: boolean; error?: string; sanitized?: string } {
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: 'Email is required' };
    }

    const sanitized = validator.normalizeEmail(email.trim()) || '';
    
    if (!validator.isEmail(sanitized)) {
      return { isValid: false, error: 'Please provide a valid email address' };
    }

    if (sanitized.length > 254) {
      return { isValid: false, error: 'Email address is too long' };
    }

    return { isValid: true, sanitized };
  }

  // Validate phone number
  private validatePhone(phone: unknown): { isValid: boolean; error?: string; sanitized?: string | undefined } {
    if (!phone || typeof phone !== 'string' || phone.trim().length === 0) {
      return { isValid: true }; // Phone is optional
    }

    const sanitized = phone.trim().replace(/[\s\-\(\)]/g, '');
    
    if (!validator.isMobilePhone(sanitized, 'any', { strictMode: false })) {
      return { isValid: false, error: 'Please provide a valid phone number' };
    }

    if (sanitized.length > 20) {
      return { isValid: false, error: 'Phone number is too long' };
    }

    return { isValid: true, sanitized };
  }

  // Validate description
  private validateDescription(description: unknown): { isValid: boolean; error?: string; sanitized?: string } {
    if (!description || typeof description !== 'string') {
      return { isValid: false, error: 'Project description is required' };
    }

    const sanitized = this.sanitizeHtml(description.trim());
    
    if (sanitized.length < 10) {
      return { isValid: false, error: 'Project description must be at least 10 characters long' };
    }

    if (sanitized.length > 5000) {
      return { isValid: false, error: 'Project description must be less than 5000 characters' };
    }

    return { isValid: true, sanitized };
  }

  // Main validation function for contact form
  public validateContactForm(data: Record<string, unknown>): ValidationResult {
    const errors: string[] = [];
    const sanitizedData: Partial<ContactFormData> = {};

    // Validate name
    const nameResult = this.validateName(data.name);
    if (!nameResult.isValid) {
      errors.push(nameResult.error!);
    } else {
      sanitizedData.name = nameResult.sanitized!;
    }

    // Validate email
    const emailResult = this.validateEmail(data.email);
    if (!emailResult.isValid) {
      errors.push(emailResult.error!);
    } else {
      sanitizedData.email = emailResult.sanitized!;
    }

    // Validate phone (optional)
    const phoneResult = this.validatePhone(data.phone);
    if (!phoneResult.isValid) {
      errors.push(phoneResult.error!);
    } else if (phoneResult.sanitized !== undefined) {
      sanitizedData.phone = phoneResult.sanitized;
    }

    // Validate description
    const descriptionResult = this.validateDescription(data.description);
    if (!descriptionResult.isValid) {
      errors.push(descriptionResult.error!);
    } else {
      sanitizedData.description = descriptionResult.sanitized!;
    }

    // Check for potential spam patterns
    if (sanitizedData.description) {
      const spamPatterns = [
        /\b(viagra|cialis|casino|poker|lottery|winner|congratulations)\b/i,
        /\b(click here|visit now|act now|limited time)\b/i,
        /(http|https):\/\/[^\s]+/gi, // URLs in description
        /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card patterns
      ];

      const hasSpam = spamPatterns.some(pattern => pattern.test(sanitizedData.description!));
      if (hasSpam) {
        errors.push('Message contains suspicious content');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedData: errors.length === 0 ? sanitizedData as ContactFormData : undefined
    };
  }

  // Additional security checks
  public performSecurityChecks(data: Record<string, unknown>, userAgent?: string): string[] {
    const securityErrors: string[] = [];

    // Check for SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(--|\/\*|\*\/|;|'|")/,
      /(\bOR\b|\bAND\b).*[=<>]/i
    ];

    const allValues = Object.values(data).join(' ');
    if (sqlPatterns.some(pattern => pattern.test(allValues))) {
      securityErrors.push('Invalid input detected');
    }

    // Check for XSS patterns
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi
    ];

    if (xssPatterns.some(pattern => pattern.test(allValues))) {
      securityErrors.push('Invalid input detected');
    }

    // Check for bot-like behavior
    if (userAgent) {
      const botPatterns = [
        /bot|crawler|spider|scraper/i,
        /curl|wget|python|php/i
      ];

      if (botPatterns.some(pattern => pattern.test(userAgent))) {
        securityErrors.push('Automated requests not allowed');
      }
    }

    return securityErrors;
  }
}

// Create singleton instance
const inputValidator = new InputValidator();

export default inputValidator;

export function validateBookingForm(data: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];
  const sanitizedData: Partial<BookingFormData> = {};

  // Validate name
  const nameResult = inputValidator['validateName'](data.name);
  if (!nameResult.isValid) {
    errors.push(nameResult.error!);
  } else {
    sanitizedData.name = nameResult.sanitized!;
  }

  // Validate email
  const emailResult = inputValidator['validateEmail'](data.email);
  if (!emailResult.isValid) {
    errors.push(emailResult.error!);
  } else {
    sanitizedData.email = emailResult.sanitized!;
  }

  // Validate purpose (new field for booking)
  const purpose = data.purpose;
  if (!purpose || typeof purpose !== 'string' || purpose.trim().length === 0) {
    errors.push('Purpose of meeting is required');
  } else {
    const sanitizedPurpose = inputValidator['sanitizeHtml'](purpose.trim());
    if (sanitizedPurpose.length < 10 || sanitizedPurpose.length > 1000) {
      errors.push('Purpose must be between 10 and 1000 characters');
    }
    sanitizedData.purpose = sanitizedPurpose;
  }

  // Validate company (optional)
  if (data.company) {
    const company = data.company;
    if (typeof company !== 'string' || company.trim().length === 0) {
      errors.push('Company name must be a string');
    } else {
      const sanitizedCompany = inputValidator['sanitizeHtml'](company.trim());
      if (sanitizedCompany.length > 200) {
        errors.push('Company name must be less than 200 characters');
      }
      sanitizedData.company = sanitizedCompany;
    }
  }

  // Validate phone (optional)
  const phoneResult = inputValidator['validatePhone'](data.phone);
  if (!phoneResult.isValid) {
    errors.push(phoneResult.error!);
  } else if (phoneResult.sanitized !== undefined) {
    sanitizedData.phone = phoneResult.sanitized;
  }

  // Basic spam check for purpose
  if (sanitizedData.purpose) {
    const spamPatterns = [
      /\b(viagra|cialis|casino|poker|lottery|winner|congratulations)\b/i,
      /(http|https):\/\/[^\s]+/gi, // URLs in purpose
    ];
    if (spamPatterns.some(pattern => pattern.test(sanitizedData.purpose!))) {
      errors.push('Purpose contains suspicious content');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizedData as BookingFormData : undefined
  };
}