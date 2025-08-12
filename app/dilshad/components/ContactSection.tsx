"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { User, EnvelopeSimple, Phone, NotePencil, MapPin, Globe } from "@phosphor-icons/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Form data interface
interface FormData {
  name: string;
  email: string;
  subject: string; // Added subject field
  message: string; // Renamed description to message
}

// Form state type
type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
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
        const response = await fetch('/api/csrf-token', { // Using dedicated CSRF endpoint
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

    if (!formData.subject.trim() || formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject is required and must be at least 5 characters long';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Message is required and must be at least 10 characters long';
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
          name: formData.name,
          email: formData.email,
          subject: formData.subject, // Include subject
          description: formData.message, // Map message to description for API
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
          subject: '',
          message: ''
        });
      } else {
        setFormState('error');
        setMessage(result.message || 'An error occurred while sending your message.');
        if (result.errors) {
          const errorObj: Record<string, string> = {};
          result.errors.forEach((error: string) => {
            if (error.toLowerCase().includes('name')) errorObj.name = error;
            else if (error.toLowerCase().includes('email')) errorObj.email = error;
            else if (error.toLowerCase().includes('subject')) errorObj.subject = error; // Handle subject error
            else if (error.toLowerCase().includes('description') || error.toLowerCase().includes('message')) errorObj.message = error; // Handle message/description error
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
    <section id="dilshad-contact" ref={sectionRef} className="relative bg-[var(--bg-100)] py-20 md:py-32 overflow-hidden" aria-labelledby="contact-heading">
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <header className="text-center animate-element mb-12 md:mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--accent-green-light)] text-[var(--accent-green)] text-xs uppercase tracking-wider font-semibold shadow-sm mb-2">Get in Touch</span>
          <h2 id="contact-heading" className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--text-100)] drop-shadow-lg">Let's Work Together</h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--text-100)] text-base md:text-lg opacity-80">
            Have a project in mind or just want to say hello? Feel free to reach out!
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 animate-element">
          {/* Left Column: Contact Information */}
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Email */}
            <div className="flex items-start gap-4 bg-[var(--bg-200)] p-6 rounded-xl border border-[var(--bg-300)] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-[var(--accent-green)] flex-shrink-0 mt-1">
                <EnvelopeSimple size={32} weight="duotone" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-100)] mb-1">Email Us</h3>
                <p className="text-[var(--text-200)] mb-2 text-sm md:text-base">Drop us a line anytime</p>
                <a
                  href="mailto:dilshad@sharpdigital.in"
                  className="text-[var(--accent-green)] hover:underline text-base"
                >
                  dilshad@sharpdigital.in
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 bg-[var(--bg-200)] p-6 rounded-xl border border-[var(--bg-300)] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-[var(--accent-green)] flex-shrink-0 mt-1">
                <Phone size={32} weight="duotone" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-100)] mb-1">Call Us</h3>
                <p className="text-[var(--text-200)] mb-2 text-sm md:text-base">Mon-Fri from 9am to 6pm</p>
                <a
                  href="tel:+353871234567"
                  className="text-[var(--accent-green)] hover:underline text-base"
                >
                  +353 87 123 4567
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4 bg-[var(--bg-200)] p-6 rounded-xl border border-[var(--bg-300)] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-[var(--accent-green)] flex-shrink-0 mt-1">
                <MapPin size={32} weight="duotone" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-100)] mb-1">Our Locations</h3>
                <p className="text-[var(--text-200)] mb-2 text-sm md:text-base">Find us here</p>
                <p className="text-[var(--text-100)] text-base">Ireland & India</p>
              </div>
            </div>

            {/* Website/Social */}
            <div className="flex items-start gap-4 bg-[var(--bg-200)] p-6 rounded-xl border border-[var(--bg-300)] shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-[var(--accent-green)] flex-shrink-0 mt-1">
                <Globe size={32} weight="duotone" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-100)] mb-1">Follow Us</h3>
                <p className="text-[var(--text-200)] mb-2 text-sm md:text-base">Stay connected</p>
                <a
                  href="https://sharpdigital.ie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-green)] hover:underline text-base"
                >
                  sharpdigital.ie
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-[var(--bg-200)]/90 px-4 pt-6 pb-6 sm:px-6 sm:pt-8 sm:pb-8 md:px-10 md:pt-10 md:pb-10 rounded-2xl border border-[var(--bg-300)] shadow-2xl backdrop-blur-md">
            {/* Success Message */}
            {formState === 'success' && (
              <div className="mb-6 p-4 bg-[var(--accent-green-light)] border border-[var(--accent-green)] rounded-lg shadow-md transition-all duration-500 ease-in-out animate-fade-in">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-[var(--accent-green)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-[var(--text-100)] font-medium">{message}</p>
                </div>
              </div>
            )}
            {/* Error Message */}
            {formState === 'error' && message && (
              <div className="mb-6 p-4 bg-[var(--accent-red-light)] border border-[var(--accent-red)] rounded-lg shadow-md transition-all duration-500 ease-in-out animate-fade-in">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-[var(--accent-red)] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-[var(--text-100)] font-medium">{message}</p>
                </div>
              </div>
            )}
            <form
              className="space-y-8"
              autoComplete="on"
              onSubmit={handleSubmit}
              role="form"
              aria-label="Contact form for Dilshad"
              itemScope
              itemType="https://schema.org/ContactForm"
            >
              <div className="relative">
                <label htmlFor="dilshad-contact-name" className="block text-sm font-semibold text-[var(--text-100)] mb-2">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[var(--accent-green)] opacity-80 flex items-center h-full pointer-events-none">
                    <User size={20} weight="duotone" />
                  </span>
                  <input
                    id="dilshad-contact-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                    disabled={formState === 'submitting'}
                    className={`w-full pl-10 border-2 bg-transparent py-3 px-2 text-[var(--text-100)] focus:outline-none transition-all duration-200 rounded-lg shadow-sm focus:shadow-lg focus:border-[var(--accent-green)] placeholder-[var(--text-200)] ${
                      errors.name
                        ? 'border-[var(--accent-red)] focus:border-[var(--accent-red)]'
                        : 'border-[var(--bg-300)]'
                    } ${formState === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-required="true"
                    aria-describedby="dilshad-name-help"
                    autoComplete="name"
                    itemProp="name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-[var(--error-text)] animate-fade-in" role="alert">{errors.name}</p>
                )}
                <div id="dilshad-name-help" className="sr-only">Enter your full name</div>
              </div>
              <div className="relative">
                <label htmlFor="dilshad-contact-email" className="block text-sm font-semibold text-[var(--text-100)] mb-2">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[var(--accent-green)] opacity-80 flex items-center h-full pointer-events-none">
                    <EnvelopeSimple size={20} weight="duotone" />
                  </span>
                  <input
                    id="dilshad-contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    disabled={formState === 'submitting'}
                    className={`w-full pl-10 border-2 bg-transparent py-3 px-2 text-[var(--text-100)] focus:outline-none transition-all duration-200 rounded-lg shadow-sm focus:shadow-lg focus:border-[var(--accent-green)] placeholder-[var(--text-200)] ${
                      errors.email
                        ? 'border-[var(--accent-red)] focus:border-[var(--accent-red)]'
                        : 'border-[var(--bg-300)]'
                    } ${formState === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-required="true"
                    aria-describedby="dilshad-email-help"
                    autoComplete="email"
                    itemProp="email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-[var(--error-text)] animate-fade-in" role="alert">{errors.email}</p>
                )}
                <div id="dilshad-email-help" className="sr-only">We'll use this email to respond to your inquiry</div>
              </div>
              <div className="relative">
                <label htmlFor="dilshad-contact-subject" className="block text-sm font-semibold text-[var(--text-100)] mb-2">
                  Subject
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[var(--accent-green)] opacity-80 flex items-center h-full pointer-events-none">
                    <NotePencil size={20} weight="duotone" />
                  </span>
                  <input
                    id="dilshad-contact-subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Subject of your message"
                    required
                    disabled={formState === 'submitting'}
                    className={`w-full pl-10 border-2 bg-transparent py-3 px-2 text-[var(--text-100)] focus:outline-none transition-all duration-200 rounded-lg shadow-sm focus:shadow-lg focus:border-[var(--accent-green)] placeholder-[var(--text-200)] ${
                      errors.subject
                        ? 'border-[var(--accent-red)] focus:border-[var(--accent-red)]'
                        : 'border-[var(--bg-300)]'
                    } ${formState === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-required="true"
                    aria-describedby="dilshad-subject-help"
                    itemProp="subject"
                  />
                </div>
                {errors.subject && (
                  <p className="mt-1 text-sm text-[var(--error-text)] animate-fade-in" role="alert">{errors.subject}</p>
                )}
                <div id="dilshad-subject-help" className="sr-only">Enter the subject of your message</div>
              </div>
              <div className="relative">
                <label htmlFor="dilshad-contact-message" className="block text-sm font-semibold text-[var(--text-100)] mb-2">
                  Message
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-[18px] text-[var(--accent-green)] opacity-80 pointer-events-none">
                    <NotePencil size={20} weight="duotone" />
                  </span>
                  <textarea
                    id="dilshad-contact-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Your message here..."
                    required
                    disabled={formState === 'submitting'}
                    className={`w-full pl-10 border-2 bg-transparent p-4 text-[var(--text-100)] focus:outline-none transition-all duration-200 rounded-lg shadow-sm focus:shadow-lg focus:border-[var(--accent-green)] resize-none placeholder-[var(--text-200)] ${
                      errors.message
                        ? 'border-[var(--accent-red)] focus:border-[var(--accent-red)]'
                        : 'border-[var(--bg-300)]'
                    } ${formState === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-required="true"
                    aria-describedby="dilshad-message-help"
                    itemProp="message"
                  />
                </div>
                {errors.message && (
                  <p className="mt-1 text-sm text-[var(--error-text)] animate-fade-in" role="alert">{errors.message}</p>
                )}
                <div id="dilshad-message-help" className="sr-only">Type your message or inquiry here</div>
              </div>
              <button
                type="submit"
                disabled={formState === 'submitting' || formState === 'success'}
                className={`w-full px-6 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--bg-100)] bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-green-base)] hover:scale-105 hover:shadow-2xl active:scale-100 active:shadow-lg mb-0 ${
                  formState === 'submitting' || formState === 'success'
                    ? 'bg-[var(--bg-300)] text-[var(--text-200)] cursor-not-allowed opacity-70'
                    : 'text-[var(--white-color)]'
                }`}
                aria-describedby="dilshad-submit-help"
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
                  'Send Message'
                )}
              </button>
              <div id="dilshad-submit-help" className="sr-only">Submit your message</div>
            </form>
          </div>
        </div>
      </div>
      {/* Fade-in animation keyframes */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }
      `}</style>
    </section>
  );
}