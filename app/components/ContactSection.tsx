"use client";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-[var(--background)] py-20 md:py-32">
      <div className="w-full max-w-screen-md mx-auto px-4 lg:px-8 flex flex-col gap-10">
        <div className="text-center">
          <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">Contact</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[var(--foreground)]">Let's Connect</h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--foreground)] text-base md:text-lg opacity-80">
            Have a project in mind or just want to say hello? Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>
        <form className="space-y-6 bg-[var(--background-lighter)] p-8 md:p-10 rounded-xl border border-[var(--border-light)] shadow-lg" autoComplete="off" onSubmit={e => { e.preventDefault(); }}>
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-[var(--foreground)] mb-2">Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Jane Doe"
              required
              className="w-full border-b-2 border-[var(--border-medium)] bg-transparent py-3 text-[var(--foreground)] focus:border-[var(--accent-green)] focus:outline-none transition-colors"
              aria-required="true"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-[var(--foreground)] mb-2">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              required
              className="w-full border-b-2 border-[var(--border-medium)] bg-transparent py-3 text-[var(--foreground)] focus:border-[var(--accent-green)] focus:outline-none transition-colors"
              aria-required="true"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="contact-phone" className="block text-sm font-medium text-[var(--foreground)] mb-2">Phone</label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              placeholder="e.g. +353 87 123 4567"
              className="w-full border-b-2 border-[var(--border-medium)] bg-transparent py-3 text-[var(--foreground)] focus:border-[var(--accent-green)] focus:outline-none transition-colors"
              aria-required="false"
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="contact-description" className="block text-sm font-medium text-[var(--foreground)] mb-2">Description</label>
            <textarea
              id="contact-description"
              name="description"
              rows={4}
              placeholder="Tell us about your project or idea..."
              required
              className="w-full border-2 border-[var(--border-medium)] bg-transparent p-4 text-[var(--foreground)] focus:border-[var(--accent-green)] focus:outline-none transition-colors rounded-lg resize-none"
              aria-required="true"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--accent-green)] text-[var(--white-color)] px-6 py-4 rounded-lg font-semibold hover:bg-[var(--accent-green-base)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2 focus:ring-offset-[var(--background)]"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
