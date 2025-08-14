/**
 * Business Planner Payment Utilities
 * Contains utility functions for payment processing, formatting, and validation
 * 
 * @fileoverview Payment utility functions for business planner feature
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */

import { PAYMENT_AMOUNT, PAID_CONVERSATIONS_COUNT, PAYMENT_CURRENCY } from './constants';

// =============================================================================
// PAYMENT REFERENCE GENERATION
// =============================================================================

/**
 * Generate a unique payment reference for wire transfers
 * Format: BP-YYYYMMDD-XXXX (where XXXX is a random 4-digit number)
 * 
 * @returns {string} Unique payment reference
 */
export function generatePaymentReference(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  // Generate random 4-digit number
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  
  return `BP-${dateStr}-${randomNum}`;
}

// =============================================================================
// BANK DETAILS FORMATTING
// =============================================================================

/**
 * Bank details for wire transfers
 */
export interface BankDetails {
  bankName: string;
  accountName: string;
  iban: string;
  bic: string;
  address: string;
  reference: string;
}

/**
 * Format bank details for display in payment instructions
 * 
 * @param {string} paymentReference - Unique payment reference
 * @returns {BankDetails} Formatted bank details
 */
export function formatBankDetails(paymentReference: string): BankDetails {
  return {
    bankName: 'Sharp Ireland Bank',
    accountName: 'Sharp Ireland Limited',
    iban: 'IE29 AIBK 9311 5212 3456 78',
    bic: 'AIBKIE2D',
    address: 'Dublin, Ireland',
    reference: paymentReference
  };
}

/**
 * Get copyable bank details as key-value pairs
 * 
 * @param {string} paymentReference - Unique payment reference
 * @returns {Record<string, string>} Bank details for copying
 */
export function getCopyableBankDetails(paymentReference: string): Record<string, string> {
  const details = formatBankDetails(paymentReference);
  
  return {
    'Bank Name': details.bankName,
    'Account Name': details.accountName,
    'IBAN': details.iban,
    'BIC/SWIFT': details.bic,
    'Bank Address': details.address,
    'Payment Reference': details.reference
  };
}

// =============================================================================
// CONVERSATION CALCULATION
// =============================================================================

/**
 * Calculate number of conversations based on payment amount
 * Currently fixed at 50 conversations for $5.00
 * 
 * @param {number} amount - Payment amount in USD
 * @returns {number} Number of conversations purchased
 */
export function calculateConversations(amount: number): number {
  // For now, we have a fixed pricing model
  if (amount >= PAYMENT_AMOUNT) {
    return PAID_CONVERSATIONS_COUNT;
  }
  
  // Could implement tiered pricing in the future
  // For example: Math.floor(amount * 10) for $0.10 per conversation
  
  return 0;
}

/**
 * Calculate the cost per conversation
 * 
 * @returns {number} Cost per conversation in USD
 */
export function getCostPerConversation(): number {
  return PAYMENT_AMOUNT / PAID_CONVERSATIONS_COUNT;
}

/**
 * Get pricing tiers (for future expansion)
 * 
 * @returns {Array} Available pricing tiers
 */
export function getPricingTiers() {
  return [
    {
      id: 'basic',
      name: 'Basic Package',
      amount: PAYMENT_AMOUNT,
      conversations: PAID_CONVERSATIONS_COUNT,
      currency: PAYMENT_CURRENCY,
      popular: true
    }
  ];
}

// =============================================================================
// PAYMENT VALIDATION
// =============================================================================

/**
 * Validate payment amount
 * 
 * @param {number} amount - Payment amount to validate
 * @returns {boolean} Whether the amount is valid
 */
export function validatePaymentAmount(amount: number): boolean {
  // Must be a positive number
  if (typeof amount !== 'number' || amount <= 0) {
    return false;
  }
  
  // Must be at least the minimum payment amount
  if (amount < PAYMENT_AMOUNT) {
    return false;
  }
  
  // Must be a reasonable amount (prevent extremely large payments)
  if (amount > 10000) {
    return false;
  }
  
  return true;
}

/**
 * Validate payment reference format
 * 
 * @param {string} reference - Payment reference to validate
 * @returns {boolean} Whether the reference is valid
 */
export function validatePaymentReference(reference: string): boolean {
  if (!reference || typeof reference !== 'string') {
    return false;
  }
  
  // Check format: BP-YYYYMMDD-XXXX
  const referencePattern = /^BP-\d{8}-\d{4}$/;
  return referencePattern.test(reference);
}

/**
 * Validate payment method
 * 
 * @param {string} method - Payment method to validate
 * @returns {boolean} Whether the method is valid
 */
export function validatePaymentMethod(method: string): boolean {
  const validMethods = ['wire', 'bank_transfer'];
  return validMethods.includes(method);
}

// =============================================================================
// CURRENCY FORMATTING
// =============================================================================

/**
 * Format currency amount for display
 * 
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = PAYMENT_CURRENCY): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    // Fallback formatting if Intl is not available
    return `$${amount.toFixed(2)}`;
  }
}

/**
 * Format amount for display without currency symbol
 * 
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount string
 */
export function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Parse currency string to number
 * 
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed amount
 */
export function parseCurrency(currencyString: string): number {
  // Remove currency symbols and parse
  const cleanString = currencyString.replace(/[$,\s]/g, '');
  const amount = parseFloat(cleanString);
  
  return isNaN(amount) ? 0 : amount;
}

// =============================================================================
// PAYMENT STATUS HELPERS
// =============================================================================

/**
 * Get payment status display information
 * 
 * @param {string} status - Payment status
 * @returns {object} Status display information
 */
export function getPaymentStatusInfo(status: string) {
  const statusMap = {
    pending: {
      label: 'Pending',
      color: 'yellow',
      description: 'Payment is being processed'
    },
    completed: {
      label: 'Completed',
      color: 'green',
      description: 'Payment has been verified and processed'
    },
    failed: {
      label: 'Failed',
      color: 'red',
      description: 'Payment could not be processed'
    }
  };
  
  return statusMap[status as keyof typeof statusMap] || {
    label: 'Unknown',
    color: 'gray',
    description: 'Unknown payment status'
  };
}

/**
 * Check if payment status allows refund
 * 
 * @param {string} status - Payment status
 * @returns {boolean} Whether refund is possible
 */
export function canRefundPayment(status: string): boolean {
  return status === 'completed';
}

/**
 * Check if payment can be retried
 * 
 * @param {string} status - Payment status
 * @returns {boolean} Whether payment can be retried
 */
export function canRetryPayment(status: string): boolean {
  return status === 'failed';
}

// =============================================================================
// DATE FORMATTING
// =============================================================================

/**
 * Format date for payment display
 * 
 * @param {string | Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatPaymentDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get relative time for payment
 * 
 * @param {string | Date} date - Date to format
 * @returns {string} Relative time string
 */
export function getRelativePaymentTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}

// =============================================================================
// EXPORT UTILITIES
// =============================================================================

/**
 * All payment utilities grouped together
 */
export const PaymentUtils = {
  // Reference generation
  generatePaymentReference,
  
  // Bank details
  formatBankDetails,
  getCopyableBankDetails,
  
  // Calculations
  calculateConversations,
  getCostPerConversation,
  getPricingTiers,
  
  // Validation
  validatePaymentAmount,
  validatePaymentReference,
  validatePaymentMethod,
  
  // Formatting
  formatCurrency,
  formatAmount,
  parseCurrency,
  
  // Status helpers
  getPaymentStatusInfo,
  canRefundPayment,
  canRetryPayment,
  
  // Date formatting
  formatPaymentDate,
  getRelativePaymentTime
};

export default PaymentUtils;