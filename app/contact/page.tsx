import { Metadata } from 'next';
import ContactSectionWrapper from '../components/ContactSectionWrapper';
import ContactInfoGrid from '../components/ContactInfoGrid';

export const metadata: Metadata = {
  title: 'Contact Sharp Digital Ireland - Web Development Services',
  description: 'Get in touch with Sharp Digital Ireland for professional web development services. We offer custom web solutions, React development, and Next.js expertise.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-100)]">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-[var(--bg-100)]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-100)] mb-6">
            Let&apos;s Build Something Amazing Together
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-200)] max-w-2xl mx-auto">
            Whether you have a specific project in mind or just want to explore possibilities,
            we&apos;re here to help turn your vision into reality.
          </p>
        </div>
      </section>

      {/* Contact Information Grid */}
      <ContactInfoGrid />

      {/* Contact Form Section */}
      <ContactSectionWrapper />

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-[var(--bg-100)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[var(--text-100)] text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {[
              {
                question: "What services do you offer?",
                answer: "We specialize in web development services including custom web applications, React development, Next.js solutions, full-stack development, and UI/UX design. Our team can handle projects of any scale, from simple websites to complex web applications."
              },
              {
                question: "How long does a typical project take?",
                answer: "Project timelines vary depending on complexity and requirements. A simple website might take 2-4 weeks, while a complex web application could take 2-3 months or more. We'll provide a detailed timeline during our initial consultation."
              },
              {
                question: "Do you offer ongoing support and maintenance?",
                answer: "Yes, we provide comprehensive support and maintenance services for all our projects. This includes regular updates, security patches, performance optimization, and technical support to ensure your website runs smoothly."
              },
              {
                question: "What is your pricing structure?",
                answer: "Our pricing is project-based and depends on your specific requirements, complexity, and timeline. We provide detailed quotes after understanding your project needs during the initial consultation."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-[var(--bg-200)] p-6 rounded-xl border border-[var(--bg-300)]">
                <h3 className="text-lg font-semibold text-[var(--text-100)] mb-3">
                  {faq.question}
                </h3>
                <p className="text-[var(--text-200)]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
} 