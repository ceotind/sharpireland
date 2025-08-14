'use client';

import React, { useState, useEffect } from 'react';
import { 
  generatePaymentReference, 
  formatBankDetails, 
  getCopyableBankDetails,
  formatCurrency,
  BankDetails
} from '@/app/utils/business-planner/payment';
import { PAYMENT_AMOUNT, PAID_CONVERSATIONS_COUNT } from '@/app/utils/business-planner/constants';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentInitiated?: (paymentReference: string) => void;
}

/**
 * PaymentModal Component
 * Displays payment instructions for wire transfer payments
 * Shows bank details with copy-to-clipboard functionality
 */
const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentInitiated
}) => {
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'instructions' | 'confirmation'>('instructions');

  // Generate payment reference when modal opens
  useEffect(() => {
    if (isOpen && !paymentReference) {
      const reference = generatePaymentReference();
      setPaymentReference(reference);
      setBankDetails(formatBankDetails(reference));
    }
  }, [isOpen, paymentReference]);

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setStep('instructions');
      setIsProcessing(false);
      setCopiedField(null);
    }
  }, [isOpen]);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handlePaymentInitiated = async () => {
    setIsProcessing(true);
    
    try {
      // Here you would typically create a payment record in the database
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onPaymentInitiated) {
        onPaymentInitiated(paymentReference);
      }
      
      setStep('confirmation');
    } catch (error) {
      console.error('Error initiating payment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      // Reset state after a delay to prevent flash
      setTimeout(() => {
        setPaymentReference('');
        setBankDetails(null);
        setStep('instructions');
      }, 300);
    }
  };

  if (!isOpen) return null;

  const copyableDetails = bankDetails ? getCopyableBankDetails(paymentReference) : {};

  return (
    <div id="payment-modal-overlay" className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div id="payment-modal-container" className="relative top-20 mx-auto p-5 border w-full max-w-2xl bg-white rounded-lg shadow-lg">
        {/* Modal Header */}
        <div id="payment-modal-header" className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 'instructions' ? 'Payment Instructions' : 'Payment Initiated'}
          </h2>
          <button
            id="payment-modal-close-button"
            onClick={handleClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div id="payment-modal-content" className="py-6">
          {step === 'instructions' ? (
            <div id="payment-instructions-content" className="space-y-6">
              {/* Payment Summary */}
              <div id="payment-summary-section" className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Payment Summary</h3>
                <div id="payment-summary-details" className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Amount:</span>
                    <span className="font-medium text-blue-900">{formatCurrency(PAYMENT_AMOUNT)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Conversations:</span>
                    <span className="font-medium text-blue-900">{PAID_CONVERSATIONS_COUNT}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Payment Reference:</span>
                    <span className="font-medium text-blue-900 font-mono">{paymentReference}</span>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div id="bank-details-section">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Bank Transfer Details</h3>
                <div id="bank-details-grid" className="space-y-3">
                  {Object.entries(copyableDetails).map(([label, value]) => (
                    <div key={label} id={`bank-detail-${label.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div id={`bank-detail-info-${label.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1">
                        <div className="text-sm font-medium text-gray-700">{label}</div>
                        <div className="text-sm text-gray-900 font-mono mt-1">{value}</div>
                      </div>
                      <button
                        id={`copy-button-${label.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => copyToClipboard(value, label)}
                        className="ml-3 p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        title={`Copy ${label}`}
                      >
                        {copiedField === label ? (
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Instructions */}
              <div id="payment-instructions-section" className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div id="payment-instructions-header" className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div id="payment-instructions-content" className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">Important Instructions</h4>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Include the payment reference <strong>{paymentReference}</strong> in your transfer</li>
                        <li>Transfer the exact amount: <strong>{formatCurrency(PAYMENT_AMOUNT)}</strong></li>
                        <li>Processing typically takes 1-3 business days</li>
                        <li>You'll receive email confirmation once verified</li>
                        <li>Your conversations will be credited automatically</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div id="payment-modal-actions" className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  id="payment-cancel-button"
                  onClick={handleClose}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="payment-confirm-button"
                  onClick={handlePaymentInitiated}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    'I\'ve Made the Transfer'
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Confirmation Step */
            <div id="payment-confirmation-content" className="text-center space-y-6">
              <div id="payment-confirmation-icon" className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div id="payment-confirmation-text">
                <h3 className="text-lg font-medium text-gray-900">Payment Submitted</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Thank you! We've recorded your payment with reference <strong className="font-mono">{paymentReference}</strong>.
                </p>
              </div>

              <div id="payment-confirmation-details" className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">What happens next?</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• We'll verify your payment within 1-3 business days</p>
                  <p>• You'll receive an email confirmation once approved</p>
                  <p>• Your {PAID_CONVERSATIONS_COUNT} conversations will be credited automatically</p>
                  <p>• You can track the status in your billing page</p>
                </div>
              </div>

              <div id="payment-confirmation-actions" className="flex justify-center space-x-3">
                <button
                  id="payment-confirmation-close-button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;