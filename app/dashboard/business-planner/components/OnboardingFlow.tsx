'use client';

import React, { useState } from 'react';
import { BusinessPlannerOnboardingData } from '@/app/types/business-planner';
import { BUSINESS_TYPES, INDUSTRIES, BUSINESS_STAGES } from '@/app/utils/business-planner/constants';

interface OnboardingFlowProps {
  onComplete: (data: BusinessPlannerOnboardingData) => void;
  initialData?: Partial<BusinessPlannerOnboardingData>;
  isLoading?: boolean;
}

/**
 * OnboardingFlow Component
 * Multi-step wizard for collecting business information
 * - Step 1: Business type and stage
 * - Step 2: Target market description
 * - Step 3: Main challenges and additional context
 */
const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  initialData = {},
  isLoading = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BusinessPlannerOnboardingData>>({
    business_type: initialData.business_type || '',
    business_stage: initialData.business_stage || 'idea',
    industry: initialData.industry || '',
    target_market: initialData.target_market || '',
    challenge: initialData.challenge || '',
    additional_context: initialData.additional_context || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof BusinessPlannerOnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.business_type?.trim()) {
          newErrors.business_type = 'Please select a business type';
        }
        if (!formData.business_stage) {
          newErrors.business_stage = 'Please select a business stage';
        }
        if (!formData.industry?.trim()) {
          newErrors.industry = 'Please select an industry';
        }
        break;
      case 2:
        if (!formData.target_market?.trim()) {
          newErrors.target_market = 'Please describe your target market';
        } else if (formData.target_market.length < 10) {
          newErrors.target_market = 'Please provide a more detailed description (at least 10 characters)';
        }
        break;
      case 3:
        if (!formData.challenge?.trim()) {
          newErrors.challenge = 'Please describe your main challenge';
        } else if (formData.challenge.length < 10) {
          newErrors.challenge = 'Please provide a more detailed description (at least 10 characters)';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      await onComplete(formData as BusinessPlannerOnboardingData);
    } catch (error) {
      console.error('Error submitting onboarding:', error);
      setErrors({ submit: 'Failed to save your information. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <div id="onboarding-progress-bar" className="mb-8">
      <div id="progress-bar-container" className="flex items-center justify-between mb-2">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            id={`progress-step-${step}`}
            className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                id={`progress-connector-${step}`}
                className={`flex-1 h-0.5 mx-4 transition-colors ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div id="progress-labels" className="flex justify-between text-xs text-gray-500">
        <span>Business Info</span>
        <span>Target Market</span>
        <span>Challenges</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div id="onboarding-step-1" className="space-y-6">
      <div id="step-1-header" className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your business</h2>
        <p className="text-gray-600">This helps us provide more relevant planning advice</p>
      </div>

      <div id="business-type-section" className="space-y-3">
        <label htmlFor="business-type-select" className="block text-sm font-medium text-gray-700">
          What type of business are you planning or running?
        </label>
        <select
          id="business-type-select"
          value={formData.business_type || ''}
          onChange={(e) => updateFormData('business_type', e.target.value)}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.business_type ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select a business type</option>
          {BUSINESS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.business_type && (
          <p className="text-sm text-red-600">{errors.business_type}</p>
        )}
      </div>

      <div id="business-stage-section" className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          What stage is your business in?
        </label>
        <div id="business-stage-options" className="grid grid-cols-2 gap-3">
          {BUSINESS_STAGES.map((stage) => (
            <label
              key={stage}
              id={`business-stage-${stage}`}
              className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-colors ${
                formData.business_stage === stage
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="business_stage"
                value={stage}
                checked={formData.business_stage === stage}
                onChange={(e) => updateFormData('business_stage', e.target.value)}
                className="sr-only"
              />
              <div className="flex flex-col">
                <span className="block text-sm font-medium text-gray-900 capitalize">
                  {stage}
                </span>
                <span className="block text-xs text-gray-500">
                  {stage === 'idea' && 'Just an idea or concept'}
                  {stage === 'startup' && 'Early stage, getting started'}
                  {stage === 'growth' && 'Growing and scaling'}
                  {stage === 'established' && 'Mature and established'}
                </span>
              </div>
            </label>
          ))}
        </div>
        {errors.business_stage && (
          <p className="text-sm text-red-600">{errors.business_stage}</p>
        )}
      </div>

      <div id="industry-section" className="space-y-3">
        <label htmlFor="industry-select" className="block text-sm font-medium text-gray-700">
          Which industry best describes your business?
        </label>
        <select
          id="industry-select"
          value={formData.industry || ''}
          onChange={(e) => updateFormData('industry', e.target.value)}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.industry ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select an industry</option>
          {INDUSTRIES.map((industry) => (
            <option key={industry} value={industry}>
              {industry}
            </option>
          ))}
        </select>
        {errors.industry && (
          <p className="text-sm text-red-600">{errors.industry}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div id="onboarding-step-2" className="space-y-6">
      <div id="step-2-header" className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Who is your target market?</h2>
        <p className="text-gray-600">Help us understand who you're trying to reach</p>
      </div>

      <div id="target-market-section" className="space-y-3">
        <label htmlFor="target-market-textarea" className="block text-sm font-medium text-gray-700">
          Describe your target customers or market
        </label>
        <textarea
          id="target-market-textarea"
          rows={4}
          value={formData.target_market || ''}
          onChange={(e) => updateFormData('target_market', e.target.value)}
          placeholder="e.g., Small business owners in the healthcare industry who need help with digital marketing..."
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.target_market ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        <div id="target-market-counter" className="flex justify-between text-xs text-gray-500">
          <span>{formData.target_market?.length || 0} characters</span>
          <span>Be as specific as possible</span>
        </div>
        {errors.target_market && (
          <p className="text-sm text-red-600">{errors.target_market}</p>
        )}
      </div>

      <div id="target-market-tips" className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Tips for describing your target market:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Include demographics (age, location, income level)</li>
          <li>• Mention their pain points or needs</li>
          <li>• Describe their behavior or preferences</li>
          <li>• Consider company size if B2B</li>
        </ul>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div id="onboarding-step-3" className="space-y-6">
      <div id="step-3-header" className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your main challenge?</h2>
        <p className="text-gray-600">Tell us what you need help with most</p>
      </div>

      <div id="challenge-section" className="space-y-3">
        <label htmlFor="challenge-textarea" className="block text-sm font-medium text-gray-700">
          Describe your biggest business challenge or goal
        </label>
        <textarea
          id="challenge-textarea"
          rows={4}
          value={formData.challenge || ''}
          onChange={(e) => updateFormData('challenge', e.target.value)}
          placeholder="e.g., I'm struggling to find customers and generate consistent revenue. I need help with marketing strategies and pricing..."
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
            errors.challenge ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        <div id="challenge-counter" className="flex justify-between text-xs text-gray-500">
          <span>{formData.challenge?.length || 0} characters</span>
          <span>The more detail, the better advice we can provide</span>
        </div>
        {errors.challenge && (
          <p className="text-sm text-red-600">{errors.challenge}</p>
        )}
      </div>

      <div id="additional-context-section" className="space-y-3">
        <label htmlFor="additional-context-textarea" className="block text-sm font-medium text-gray-700">
          Additional context (optional)
        </label>
        <textarea
          id="additional-context-textarea"
          rows={3}
          value={formData.additional_context || ''}
          onChange={(e) => updateFormData('additional_context', e.target.value)}
          placeholder="Any other information that might help us provide better advice..."
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <div id="additional-context-counter" className="text-xs text-gray-500 text-right">
          {formData.additional_context?.length || 0} characters
        </div>
      </div>

      {errors.submit && (
        <div id="submit-error" className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}
    </div>
  );

  const renderNavigationButtons = () => (
    <div id="onboarding-navigation" className="flex justify-between pt-6 border-t border-gray-200">
      <button
        id="previous-button"
        onClick={handlePrevious}
        disabled={currentStep === 1}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          currentStep === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        Previous
      </button>

      {currentStep < 3 ? (
        <button
          id="next-button"
          onClick={handleNext}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      ) : (
        <button
          id="complete-button"
          onClick={handleSubmit}
          disabled={isSubmitting || isLoading}
          className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            'Complete Setup'
          )}
        </button>
      )}
    </div>
  );

  return (
    <div id="onboarding-flow-container" className="max-w-2xl mx-auto">
      {renderProgressBar()}
      
      <div id="onboarding-content" className="min-h-[400px]">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {renderNavigationButtons()}
    </div>
  );
};

export default OnboardingFlow;