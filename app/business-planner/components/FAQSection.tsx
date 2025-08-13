"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { viewportFadeIn, staggerContainer, listItem } from "../../utils/motion-variants";

const faqs = [
  {
    id: "faq-how-it-works",
    question: "How does the AI Business Planner work?",
    answer: "Our AI Business Planner uses advanced language models trained on business strategy, market analysis, and entrepreneurship best practices. Simply describe your business idea or challenge, and our AI will provide personalized advice, strategic recommendations, and actionable insights tailored to your specific situation and industry.",
  },
  {
    id: "faq-data-security",
    question: "Is my business information secure and confidential?",
    answer: "Absolutely. We take data security seriously and implement enterprise-grade security measures. All conversations are encrypted in transit and at rest. We never share your business information with third parties, and you maintain full ownership of your data. Our platform is GDPR compliant and follows industry best practices for data protection.",
  },
  {
    id: "faq-free-vs-paid",
    question: "What's the difference between the free and paid plans?",
    answer: "The free tier includes 10 AI conversations per month with basic business planning features. The Pro plan (€5/month) offers 50 conversations, advanced planning tools, detailed financial modeling, comprehensive market analysis, priority support, and export capabilities. Both plans provide high-quality AI advice - the Pro plan simply offers more depth and volume.",
  },
  {
    id: "faq-conversation-limits",
    question: "What counts as a conversation?",
    answer: "A conversation is a back-and-forth exchange with our AI about a specific business topic. Each time you ask a question and receive a response, that counts as one conversation. You can have multiple exchanges within the same session, and each response counts toward your monthly limit. Conversations reset at the beginning of each billing cycle.",
  },
  {
    id: "faq-business-types",
    question: "What types of businesses can benefit from this tool?",
    answer: "Our AI Business Planner is designed for solo entrepreneurs, freelancers, startups, and small businesses across all industries. Whether you're launching a tech startup, opening a local service business, starting an e-commerce store, or scaling a consulting practice, our AI can provide relevant insights and strategies tailored to your specific business model and market.",
  },
  {
    id: "faq-accuracy-reliability",
    question: "How accurate and reliable is the AI advice?",
    answer: "Our AI is trained on extensive business knowledge and best practices, but it should be used as a strategic thinking partner rather than a replacement for professional advice. The insights are based on proven business principles and market data, but we recommend validating recommendations with industry experts, mentors, or professional advisors for critical business decisions.",
  },
  {
    id: "faq-getting-started",
    question: "How quickly can I get started?",
    answer: "You can start using the AI Business Planner immediately after signing up. The free tier requires no credit card and gives you instant access to 10 conversations per month. Simply create an account, describe your business or challenge, and start receiving personalized advice within seconds. The setup process takes less than 2 minutes.",
  },
  {
    id: "faq-cancellation",
    question: "Can I cancel or change my plan anytime?",
    answer: "Yes, you have complete flexibility. You can upgrade, downgrade, or cancel your subscription at any time. If you cancel a paid plan, you'll continue to have access to Pro features until the end of your current billing period, then automatically switch to the free tier. No long-term contracts or cancellation fees.",
  },
];

export default function FAQSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section
      id="business-planner-faq-section"
      ref={ref}
      className="py-24 bg-[var(--bg-100)]"
      aria-labelledby="faq-heading"
    >
      <div id="business-planner-faq-container" className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          id="business-planner-faq-header"
          className="text-center mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={viewportFadeIn}
        >
          <h2
            id="faq-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-light text-[var(--text-100)] mb-6"
          >
            Frequently Asked
            <br />
            <span className="font-semibold text-[var(--primary-100)]">Questions</span>
          </h2>
          <p
            id="business-planner-faq-description"
            className="max-w-2xl mx-auto text-lg text-[var(--text-200)] leading-relaxed"
          >
            Everything you need to know about our AI Business Planner. 
            Can't find what you're looking for? <a href="/contact" className="link-primary">Contact us</a>.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          id="business-planner-faq-list"
          className="space-y-4"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              id={faq.id}
              className="group"
              variants={listItem}
            >
              <div
                className="border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                style={{
                  background: "var(--bg-100)",
                  borderColor: "var(--bg-300)",
                }}
              >
                {/* Question Button */}
                <button
                  id={`${faq.id}-button`}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-[var(--bg-200)] transition-colors duration-200"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={openItems.has(faq.id)}
                  aria-controls={`${faq.id}-answer`}
                >
                  <h3
                    id={`${faq.id}-question`}
                    className="text-lg font-semibold text-[var(--text-100)] pr-4"
                  >
                    {faq.question}
                  </h3>
                  <motion.div
                    id={`${faq.id}-icon`}
                    className="flex-shrink-0"
                    animate={{ rotate: openItems.has(faq.id) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      className="w-5 h-5 text-[var(--primary-100)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {openItems.has(faq.id) && (
                    <motion.div
                      id={`${faq.id}-answer`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        id={`${faq.id}-answer-content`}
                        className="px-6 pb-6 pt-0"
                        style={{ borderTop: "1px solid var(--bg-300)" }}
                      >
                        <p className="text-[var(--text-200)] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          id="business-planner-faq-cta"
          className="text-center mt-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={viewportFadeIn}
        >
          <div
            id="business-planner-faq-cta-card"
            className="p-8 rounded-2xl border"
            style={{
              background: "linear-gradient(135deg, var(--bg-200), var(--bg-100))",
              borderColor: "var(--bg-300)",
            }}
          >
            <h3
              id="business-planner-faq-cta-title"
              className="text-2xl font-semibold text-[var(--text-100)] mb-4"
            >
              Ready to Start Planning?
            </h3>
            <p
              id="business-planner-faq-cta-description"
              className="text-[var(--text-200)] mb-6 max-w-2xl mx-auto"
            >
              Join thousands of entrepreneurs who are already using our AI Business Planner 
              to build better businesses. Start your free trial today.
            </p>
            <div id="business-planner-faq-cta-buttons" className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                id="business-planner-faq-cta-start"
                className="btn-primary px-8 py-4 rounded-xl text-base font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = "/login?redirect=/business-planner/chat"}
              >
                Start Free Trial
              </motion.button>
              <motion.button
                id="business-planner-faq-cta-contact"
                className="btn-secondary px-8 py-4 rounded-xl text-base font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = "/contact"}
              >
                Contact Sales
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}