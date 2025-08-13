"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  titleVariants as createTitleVariants,
  inputVariants as createInputVariants,
  buttonVariants as createButtonVariants,
  errorVariants as createErrorVariants,
  loadingVariants as createLoadingVariants,
  type CubicBezier,
} from "../../utils/seo-variants";

export interface SEOFormProps {
  url: string;
  isValid: boolean;
  validationMsg: string | null;
  loading: boolean;
  error: string | null;
  statusMessage: string;

  inputRef: React.RefObject<HTMLInputElement | null>;
  submitRef: React.RefObject<HTMLButtonElement | null>;
  errorRef: React.RefObject<HTMLDivElement | null>;

  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onExampleSelect: (url: string) => void;

  prefersReducedMotion: boolean;
  ease: CubicBezier;
}

export default function SEOForm({
  url,
  isValid,
  validationMsg,
  loading,
  error,
  statusMessage,
  inputRef,
  submitRef,
  errorRef,
  onChange,
  onPaste,
  onKeyDown,
  onSubmit,
  onExampleSelect,
  prefersReducedMotion,
  ease,
}: SEOFormProps) {
  // Recreate motion variants using shared creators
  const titleVariants = createTitleVariants(prefersReducedMotion, ease);
  const inputVariants = createInputVariants(prefersReducedMotion, ease);
  const buttonVariants = createButtonVariants(prefersReducedMotion, ease);
  const errorVariants = createErrorVariants(prefersReducedMotion, ease);
  const loadingVariants = createLoadingVariants(prefersReducedMotion, ease);

  // A11y ids (must remain identical)
  const helperId = "seo-input-help";
  const errorId = "seo-error";
  const describedBy =
    [helperId, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  // Example URLs (moved unchanged)
  const exampleUrls = [
    "https://example.com",
    "https://www.wikipedia.org",
    "https://rte.ie",
  ];

  return (
    <>
      <form id="seo-form" onSubmit={onSubmit}>
        <div id="seo-fieldset" className="flex flex-col gap-3 sm:gap-4">
          <label
            id="seo-url-label"
            htmlFor="seo-url-input"
            className="text-sm font-medium text-[var(--text-100)]"
          >
            Website URL
          </label>

          <motion.div
            id="seo-input-wrap"
            className="flex-grow min-w-0"
            variants={inputVariants}
            style={{ willChange: "transform, opacity" }}
          >
            <input
              id="seo-url-input"
              ref={inputRef}
              type="text"
              value={url}
              onChange={onChange}
              onPaste={onPaste}
              onKeyDown={onKeyDown}
              placeholder="Enter website URL (e.g., https://example.com)"
              aria-describedby={describedBy}
              aria-invalid={!!validationMsg}
              className={`w-full px-6 py-3 sm:py-4 rounded-xl focus:outline-none text-base sm:text-lg transition-all duration-200 break-all bg-white border-2 border-[var(--bg-300)] text-[var(--text-100)] focus:border-[var(--primary-100)] focus:shadow-lg shadow-sm ${
                url.length > 48 ? "font-mono" : ""
              }`}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="url"
            />
          </motion.div>

          <div id={helperId} className="text-sm text-[var(--text-300)]">
            Accepts URLs with or without http/https. Example: example.com or
            https://example.com. We do not retain your URL after generating the
            report.
          </div>

          <div id="seo-examples" className="flex flex-wrap gap-2 mt-1">
            {exampleUrls.map((ex, i) => (
              <button
                id={`seo-example-chip-${i + 1}`}
                key={ex}
                type="button"
                onClick={() => {
                  onExampleSelect(ex);
                }}
                className="px-3 py-1.5 rounded-full text-sm border transition-colors bg-white text-[var(--text-100)] border-[var(--bg-400)]"
              >
                {ex}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {!isValid && validationMsg && (
              <motion.div
                id="seo-inline-validation"
                className="text-sm text-[var(--error-text)]"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={errorVariants}
              >
                {validationMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div id="seo-cta-wrap" className="sm:w-auto">
            <motion.button
              id="seo-cta"
              ref={submitRef}
              type="submit"
              disabled={!isValid || loading}
              className="w-full px-6 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap bg-gradient-to-r from-[var(--primary-100)] to-[var(--primary-200)] hover:scale-105 hover:shadow-2xl active:scale-100 active:shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-100)] focus:ring-offset-2"
              style={{
                color: "var(--white-color)",
                boxShadow: "0 4px 14px var(--primary-shadow)",
                willChange: "transform, opacity",
              }}
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              aria-busy={loading ? true : undefined}
            >
              {loading ? (
                <span id="seo-cta-loading" className="flex items-center justify-center">
                  {!prefersReducedMotion ? (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5"
                      style={{ color: "var(--white-color)" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : null}
                  Analyzing…
                </span>
              ) : (
                "Analyze SEO"
              )}
            </motion.button>
          </motion.div>
        </div>
      </form>

      <div id="seo-status" aria-live="polite" className="sr-only">
        {statusMessage}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            id={errorId}
            ref={errorRef}
            role="alert"
            tabIndex={-1}
            className="p-4 mt-4 rounded bg-[var(--error-bg)] border-l-4 border-l-[var(--error-border)]"
            style={{ willChange: "transform, opacity" }}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={errorVariants}
          >
            <div id="seo-error-inner" className="flex">
              <div id="seo-error-icon-wrap" className="flex-shrink-0">
                <svg
                  id="seo-error-icon"
                  className="h-5 w-5"
                  style={{ color: "var(--error-icon)" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div id="seo-error-text" className="ml-3">
                <p className="text-sm text-[var(--error-text)]">
                  {error}
                </p>
                <div id="seo-error-actions" className="mt-2">
                  <Link
                    id="seo-error-contact-link"
                    href="/contact"
                    className="underline text-[var(--primary-100)]"
                  >
                    Contact us
                  </Link>
                  <span className="ml-2 text-[var(--text-300)]">
                    for assistance if this keeps happening.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && (
          <motion.div
            id="seo-loading"
            className="mt-10"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={loadingVariants}
          >
            <div id="seo-loading-inner" className="text-center">
              {!prefersReducedMotion ? (
                <div
                  id="seo-loading-spinner"
                  className="rounded-full h-16 w-16 mx-auto border-4 border-t-[var(--primary-100)] border-b-[var(--bg-300)] border-l-transparent border-r-transparent"
                />
              ) : null}
              <motion.p
                id="seo-loading-text"
                className="mt-4 text-lg md:text-xl font-medium text-[var(--text-100)]"
                variants={titleVariants}
              >
                Analyzing your website…
              </motion.p>
              <motion.p
                id="seo-loading-subtext"
                className="mt-2 text-base md:text-lg text-[var(--text-200)]"
                variants={titleVariants}
              >
                This may take a few moments
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}