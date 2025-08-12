"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { User, EnvelopeSimple, Phone, NotePencil } from "@phosphor-icons/react";
import { contactContainer, contactField, contactButton } from "../utils/motion-variants";

// Form data interface
interface FormData {
  name: string;
  email: string;
  phone: string;
  description: string;
}

// Form state type
type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactSection() {
  const searchParams = useSearchParams();
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    description: ''
  });
  const [formState, setFormState] = useState<FormState>('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [csrfToken, setCsrfToken] = useState<string>('');

  // Fetch CSRF token on mount and handle search params
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch('/api/contact', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.success && data.csrfToken) {
          setCsrfToken(data.csrfToken);
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };

    fetchCsrfToken();
    
    // Handle search params after component mount
    const messageParam = searchParams.get('message');
    if (messageParam) {
      setFormData(prev => ({ ...prev, description: messageParam }));
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [searchParams]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Client-side validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name is required and must be at least 2 characters long';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please provide a valid email address';
      }
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      newErrors.description = 'Project description is required and must be at least 10 characters long';
    }

    if (formData.phone.trim() && formData.phone.trim().length > 0) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
        newErrors.phone = 'Please provide a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setFormState('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({
          ...formData,
          csrfToken
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormState('success');
        setMessage(result.message);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          description: ''
        });
      } else {
        setFormState('error');
        setMessage(result.message || 'An error occurred while sending your message.');
        if (result.errors) {
          const errorObj: Record<string, string> = {};
          result.errors.forEach((error: string) => {
            if (error.toLowerCase().includes('name')) errorObj.name = error;
            else if (error.toLowerCase().includes('email')) errorObj.email = error;
            else if (error.toLowerCase().includes('phone')) errorObj.phone = error;
            else if (error.toLowerCase().includes('description')) errorObj.description = error;
          });
          setErrors(errorObj);
        }
      }
    } catch {
      setFormState('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  // Reset form state after success/error message
  useEffect(() => {
    if (formState === 'success' || formState === 'error') {
      const timer = setTimeout(() => {
        if (formState === 'error') {
          setFormState('idle');
          setMessage('');
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
    
    return () => {
      // Cleanup function for when condition is not met
    };
  }, [formState]);

  return (
    <motion.section 
      id="contact" 
      ref={sectionRef} 
      className="relative bg-[var(--bg-100)] py-20 md:py-32 overflow-hidden" 
      aria-labelledby="contact-heading"
      variants={contactContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="relative w-full max-w-screen-md mx-auto px-4 lg:px-8 flex flex-col gap-10 z-10">
        <motion.header className="text-center" variants={contactField}>
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--primary-100)]/10 text-[var(--primary-100)] text-xs uppercase tracking-wider font-semibold shadow-sm mb-2">Contact Sharp Digital Ireland</span>
          <h2 id="contact-heading" className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--text-100)] drop-shadow-lg">Get Your Web Development Quote</h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--text-100)] text-base md:text-lg opacity-80">
            Ready to transform your business with expert web development? Contact Sharp Digital Ireland today for a free consultation. We serve Dublin and all of Ireland with professional React, Next.js, and custom web solutions.
          </p>
        </motion.header>
        
        {/* Success Message */}
        {formState === 'success' && (
          <motion.div 
            className="mb-6 p-4 bg-[var(--primary-100)]/10 border border-[var(--primary-100)] rounded-lg shadow-md"
            variants={contactField}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
           <div className="flex items-center">
             <svg className="w-5 h-5 text-[var(--primary-100)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-[var(--text-100)] font-medium">{message}</p>
            </div>
          </motion.div>
        )}
        
        {/* Error Message */}
        {formState === 'error' && message && (
          <motion.div 
            className="mb-6 p-4 bg-[var(--error-bg)] border border-[var(--error-border)] rounded-lg shadow-md"
            variants={contactField}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
           <div className="flex items-center">
             <svg className="w-5 h-5 text-[var(--error-text)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-[var(--text-100)] font-medium">{message}</p>
            </div>
          </motion.div>
        )}
        
        <motion.form
          className="space-y-8 bg-[var(--bg-200)]/90 px-4 pt-6 pb-6 sm:px-6 sm:pt-8 sm:pb-8 md:px-10 md:pt-10 md:pb-10 rounded-2xl border border-[var(--bg-300)] shadow-2xl backdrop-blur-md"
          variants={contactField}
          autoComplete="on"
          onSubmit={handleSubmit}
          role="form"
          aria-label="Contact Sharp Digital Ireland for web development services"
          itemScope
          itemType="https://schema.org/ContactForm"
        >
          <motion.div className="relative" variants={contactField}>
            <label htmlFor="contact-name" className="block text-sm font-semibold text-[var(--text-100)] mb-2">
              Full Name
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[var(--primary-100)] opacity-80 flex items-center h-full pointer-events-none">
                <User size={20} weight="duotone" />
              </span>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
                required
                disabled={formState === 'submitting'}
                className={`w-full pl-10 border-2 bg-transparent py-3 px-2 text-[var(--text-100)] focus:outline-none transition-all duration-200 rounded-lg shadow-sm focus:shadow-lg focus:border-[var(--primary-100)] placeholder-[var(--text-200)] ${
                  errors.name
                    ? 'border-[var(--error-border)] focus:border-[var(--error-border)]'
                    : 'border-[var(--bg-300)]'
                } ${formState === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-required="true"
                aria-describedby="name-help"
                autoComplete="name"
                itemProp="name"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-[var(--error-text)]" role="alert">{errors.name}</p>
            )}
            <div id="name-help" className="sr-only">Enter your full name for our web development consultation</div>
          </motion.div>
          
          <motion.div className="relative" variants={contactField}>
            <label htmlFor="contact-email" className="block text-sm font-semibold text-[var(--text-100)] mb-2">
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[var(--primary-100)] opacity-80 flex items-center h-full pointer-events-none">
                <EnvelopeSimple size={20} weight="duotone" />
              </span>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
                disabled={formState === 'submitting'}
                className={`w-full pl-10 border-2 bg-transparent py-3 px-2 text-[var(--text-100)] focus:outline-none transition-all duration-200 rounded-lg shadow-sm focus:shadow-lg focus:border-[var(--primary-100)] placeholder-[var(--text-200)] ${
                  errors.email
                    ? 'border-[var(--error-border)] focus:border-[var(--error-border)]'
                    : 'border-[var(--bg-300)]'
                } ${formState === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-required="true"
                aria-describedby="email-help"
                autoComplete="email"
                itemProp="email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-[var(--error-text)]" role="alert">{errors.email}</p>
            )}
            <div id="email-help" className="sr-only">We&apos;ll use this email to send you our web development proposal</div>
          </motion.div>
          
          <motion.div className="relative" variants={contactField}>
            <label htmlFor="contact-phone" className="block text-sm font-semibold text-[var(--text-100)] mb-2">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[var(--primary-100)] opacity-80 flex items-center h-full pointer-events-none">
                <Phone size={20} weight="duotone" />
              </span>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+353 87 123 4567"
                disabled={formState === 'submitting'}
                className={`w-full pl-10 border-2 bg-transparent py-3 px-2 text-[var(--text-100)] focus:outline-none transition-all duration-200 rounded-lg shadow-sm focus:shadow-lg focus:border-[var(--primary-100)] placeholder-[var(--text-200)] ${
                  errors.phone
                    ? 'border-[var(--error-border)] focus:border-[var(--error-border)]'
                    : 'border-[var(--bg-300)]'
                } ${formState === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-describedby="phone-help"
                autoComplete="tel"
                itemProp="telephone"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-[var(--error-text)]" role="alert">{errors.phone}</p>
            )}
            <div id="phone-help" className="sr-only">Optional phone number for faster communication about your project</div>
          </motion.div>
          
          <motion.div className="relative" variants={contactField}>
            <label htmlFor="contact-description" className="block text-sm font-semibold text-[var(--text-100)] mb-2">
              Project Description
            </label>
            <div className="relative">
              <span className="absolute left-3 top-[18px] text-[var(--primary-100)] opacity-80 pointer-events-none">
                <NotePencil size={20} weight="duotone" />
              </span>
              <textarea
                id="contact-description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your web development project, goals, timeline, and any specific requirements..."
                required
                disabled={formState === 'submitting'}
                className={`w-full pl-10 border-2 bg-transparent p-4 text-[var(--text-100)] focus:outline-none transition-all duration-200 rounded-lg shadow-sm focus:shadow-lg focus:border-[var(--primary-100)] resize-none placeholder-[var(--text-200)] ${
                  errors.description
                    ? 'border-[var(--error-border)] focus:border-[var(--error-border)]'
                    : 'border-[var(--bg-300)]'
                } ${formState === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-required="true"
                aria-describedby="description-help"
                itemProp="description"
              />
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-[var(--error-text)]" role="alert">{errors.description}</p>
            )}
            <div id="description-help" className="sr-only">Tell us about your web development needs, budget, and timeline</div>
          </motion.div>
          
          <motion.button
            type="submit"
            disabled={formState === 'submitting' || formState === 'success'}
            className={`w-full px-6 py-4 rounded-xl font-semibold text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)] focus:ring-offset-2 focus:ring-offset-[var(--bg-100)] bg-gradient-to-r from-[var(--primary-100)] to-[var(--primary-200)] mb-0 ${
              formState === 'submitting' || formState === 'success'
                ? 'bg-[var(--bg-300)] text-[var(--text-200)] cursor-not-allowed opacity-70'
                : 'text-[var(--white-color)]'
            }`}
            variants={contactButton}
            {...(!(formState === 'submitting' || formState === 'success') && {
              whileHover: "hover",
              whileTap: "tap"
            })}
            aria-describedby="submit-help"
          >
            {formState === 'submitting' ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Message...
              </span>
            ) : formState === 'success' ? (
              'Message Sent Successfully!'
            ) : (
              'Get My Free Quote'
            )}
          </motion.button>
          <div id="submit-help" className="sr-only">Submit your project details to receive a free consultation from Sharp Digital Ireland</div>
        </motion.form>
      </div>
    </motion.section>
  );
}
