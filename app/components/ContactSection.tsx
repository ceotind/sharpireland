
"use client";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-[var(--background)] py-16 md:py-24 px-4">
      <div className="w-full max-w-screen-md mx-auto flex flex-col gap-10">
        <div className="text-center">
          <span className="text-sm uppercase tracking-wide text-[var(--accent-green)]">Contact</span>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--foreground)]">Let's Connect</h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--foreground)] text-base md:text-lg opacity-80">
            Have a project in mind or just want to say hello? Fill out the form below and we’ll get back to you as soon as possible.
          </p>
        </div>
        <form className="space-y-6 bg-[var(--background-lighter)] p-8 rounded-xl shadow-md" autoComplete="off" onSubmit={e => { e.preventDefault(); }}>
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium text-[var(--foreground)]">Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Jane Doe"
              required
              className="mt-1 w-full border-b border-[var(--border-medium)] bg-transparent py-2 text-[var(--foreground)] focus:border-[var(--accent-green)] focus:outline-none transition-colors"
              aria-required="true"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium text-[var(--foreground)]">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="jane@example.com"
              required
              className="mt-1 w-full border-b border-[var(--border-medium)] bg-transparent py-2 text-[var(--foreground)] focus:border-[var(--accent-green)] focus:outline-none transition-colors"
              aria-required="true"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="contact-phone" className="block text-sm font-medium text-[var(--foreground)]">Phone</label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              placeholder="e.g. +353 87 123 4567"
              className="mt-1 w-full border-b border-[var(--border-medium)] bg-transparent py-2 text-[var(--foreground)] focus:border-[var(--accent-green)] focus:outline-none transition-colors"
              aria-required="false"
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="contact-description" className="block text-sm font-medium text-[var(--foreground)]">Description</label>
            <textarea
              id="contact-description"
              name="description"
              rows={4}
              placeholder="Tell us about your project or idea..."
              required
              className="mt-1 w-full border border-[var(--border-medium)] bg-transparent p-3 text-[var(--foreground)] focus:border-[var(--accent-green)] focus:outline-none transition-colors rounded-md"
              aria-required="true"
            ></textarea>
          </div>
          <button
            type="submit"
            className="mt-4 bg-[var(--accent-green)] text-[var(--white-color)] px-6 py-3 rounded-md font-medium hover:bg-[var(--accent-green-base)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] focus:ring-offset-2"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
