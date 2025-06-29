"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const sectionRef = useRef<HTMLElement | null>(null);
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

  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll(".animate-element");
    if (elements && sectionRef.current) {
      const animation = gsap.fromTo(
        elements,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
      
      return () => {
        const currentSection = sectionRef.current;
        animation.kill();
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === currentSection) {
            trigger.kill();
          }
        });
      };
    }
    
    return () => {
      // Cleanup function for when elements are not found
    };
  }, []);

  // Fetch CSRF token on mount
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
  }, []);

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
    <section id="contact" ref={sectionRef} className="bg-[var(--background)] py-20 md:py-32" aria-labelledby="contact-heading">
      <div className="w-full max-w-screen-md mx-auto px-4 lg:px-8 flex flex-col gap-10">
        <header className="text-center animate-element">
          <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">Contact Sharp Digital Ireland</span>
          <h2 id="contact-heading" className="mt-4 text-4xl md:text-5xl font-bold text-[var(--foreground)]">Get Your Web Development Quote</h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--foreground)] text-base md:text-lg opacity-80">
            Ready to transform your business with expert web development? Contact Sharp Digital Ireland today for a free consultation. We serve Dublin and all of Ireland with professional React, Next.js, and custom web solutions.
          </p>
        </header>
        
        {/* Success Message */}
        {formState === 'success' && (
          <div className="animate-element mb-6 p-4 bg-[var(--accent-green-light)] border border-[var(--accent-green)] rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[var(--accent-green)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-[var(--foreground)] font-medium">{message}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {formState === 'error' && message && (
          <div className="animate-element mb-6 p-4 bg-[var(--accent-red-light)] border border-[var(--accent-red)] rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[var(--accent-red)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-[var(--foreground)] font-medium">{message}</p>
            </div>
          </div>
        )}

        <form
          className="animate-element space-y-6 bg-[var(--background-lighter)] p-8 md:p-10 rounded-xl border border-[var(--border-light)] shadow-lg"
          autoComplete="on"
          onSubmit={handleSubmit}
          role="form"
          aria-label="Contact Sharp Digital Ireland for web development services"
          itemScope
          itemType="https://schema.org/ContactForm"
        >
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Full Name <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your full name"
              required
              disabled={formState === 'submitting'}
              className={`w-full border-b-2 bg-transparent py-3 px-2 text-[var(--foreground)] focus:outline-none transition-colors ${
                errors.name
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[var(--border-medium)] focus:border-[var(--accent-green)]'
              } ${formState === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-required="true"
              aria-describedby="name-help"
              autoComplete="name"
              itemProp="name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600" role="alert">{errors.name}</p>
            )}
            <div id="name-help" className="sr-only">Enter your full name for our web development consultation</div>
          </div>
          
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Email Address <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
              disabled={formState === 'submitting'}
              className={`w-full border-b-2 bg-transparent py-3 px-2 text-[var(--foreground)] focus:outline-none transition-colors ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[var(--border-medium)] focus:border-[var(--accent-green)]'
              } ${formState === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-required="true"
              aria-describedby="email-help"
              autoComplete="email"
              itemProp="email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600" role="alert">{errors.email}</p>
            )}
            <div id="email-help" className="sr-only">We&apos;ll use this email to send you our web development proposal</div>
          </div>
          
          <div>
            <label htmlFor="contact-phone" className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Phone Number <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+353 87 123 4567"
              disabled={formState === 'submitting'}
              className={`w-full border-b-2 bg-transparent py-3 px-2 text-[var(--foreground)] focus:outline-none transition-colors ${
                errors.phone
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[var(--border-medium)] focus:border-[var(--accent-green)]'
              } ${formState === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-describedby="phone-help"
              autoComplete="tel"
              itemProp="telephone"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600" role="alert">{errors.phone}</p>
            )}
            <div id="phone-help" className="sr-only">Optional phone number for faster communication about your project</div>
          </div>
          
          <div>
            <label htmlFor="contact-description" className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Project Description <span className="text-red-500" aria-label="required">*</span>
            </label>
            <textarea
              id="contact-description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your web development project, goals, timeline, and any specific requirements..."
              required
              disabled={formState === 'submitting'}
              className={`w-full border-2 bg-transparent p-4 text-[var(--foreground)] focus:outline-none transition-colors rounded-lg resize-none ${
                errors.description
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[var(--border-medium)] focus:border-[var(--accent-green)]'
              } ${formState === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-required="true"
              aria-describedby="description-help"
              itemProp="description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600" role="alert">{errors.description}</p>
            )}
            <div id="description-help" className="sr-only">Tell us about your web development needs, budget, and timeline</div>
          </div>
          
          <button
            type="submit"
            disabled={formState === 'submitting' || formState === 'success'}
            className={`w-full px-6 py-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--background)] ${
              formState === 'submitting' || formState === 'success'
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-[var(--accent-green)] text-[var(--white-color)] hover:bg-[var(--accent-green-base)]'
            }`}
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
              'Get Free Web Development Quote'
            )}
          </button>
          <div id="submit-help" className="sr-only">Submit your project details to receive a free consultation from Sharp Digital Ireland</div>
        </form>
      </div>
    </section>
  );
}
