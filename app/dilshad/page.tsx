"use client";

import HeroSection from "./components/HeroSection";
import TechnicalExpertise from "./components/TechnicalExpertise";
import ContactSection from "./components/ContactSection";

export default function DilshadPage() {

  return (
    <>
      {/* Enhanced SEO Schema for Personal Portfolio */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "https://sharpdigital.ie/dilshad/#person",
            "name": "Dilshad Ireland",
            "jobTitle": "Senior Full Stack Developer",
            "description": "Experienced full stack developer specializing in React, Next.js, Node.js, and modern web technologies. Based in Ireland with expertise in building scalable web applications.",
            "url": "https://sharpdigital.ie/dilshad",
            "image": "https://sharpdigital.ie/images/dilshad-profile.jpg",
            "sameAs": [
              "https://github.com/dilshad",
              "https://linkedin.com/in/dilshad-ireland",
              "https://twitter.com/dilshad_dev"
            ],
            "worksFor": {
              "@type": "Organization",
              "@id": "https://sharpdigital.ie/#organization"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IE",
              "addressRegion": "Dublin"
            },
            "knowsAbout": [
              "React",
              "Next.js",
              "Node.js",
              "TypeScript",
              "Full Stack Development",
              "Web Development",
              "JavaScript",
              "PostgreSQL",
              "MongoDB",
              "AWS"
            ]
          })
        }}
      />

      <main className="min-h-screen bg-[var(--gradient-background)] bg-no-repeat bg-fixed" role="main">
        <HeroSection />

        {/* Skills Section - Replaced by TechnicalExpertise Component */}
        {/*
        <section className="py-20 md:py-32 bg-[var(--bg-200)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-100)] mb-4">
                Technical Skills
              </h2>
              <p className="text-xl text-[var(--text-100)] opacity-90 max-w-3xl mx-auto">
                I work with modern technologies to build scalable, performant applications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Frontend Skills */}
              {/*
              <div className="bg-[var(--bg-100)] p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-[var(--text-100)] mb-4 flex items-center">
                  <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full mr-3"></span>
                  Frontend
                </h3>
                <div className="space-y-2">
                  {['React', 'Next.js', 'TypeScript', 'JavaScript ES6+', 'Tailwind CSS', 'GSAP', 'HTML5', 'CSS3'].map(skill => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-[var(--text-100)]">{skill}</span>
                      <div className="w-16 h-2 bg-[var(--bg-300)] rounded-full">
                        <div className="h-full bg-[var(--accent-green)] rounded-full" style={{width: '90%'}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              */}

              {/* Backend Skills */}
              {/*
              <div className="bg-[var(--bg-100)] p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-[var(--text-100)] mb-4 flex items-center">
                  <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full mr-3"></span>
                  Backend
                </h3>
                <div className="space-y-2">
                  {['Node.js', 'Express.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'REST APIs', 'GraphQL'].map(skill => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-[var(--text-100)]">{skill}</span>
                      <div className="w-16 h-2 bg-[var(--bg-300)] rounded-full">
                        <div className="h-full bg-[var(--accent-green)] rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              */}

              {/* DevOps & Tools */}
              {/*
              <div className="bg-[var(--bg-100)] p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-[var(--text-100)] mb-4 flex items-center">
                  <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full mr-3"></span>
                  DevOps & Tools
                </h3>
                <div className="space-y-2">
                  {['AWS', 'Docker', 'Git', 'CI/CD', 'Linux', 'Nginx', 'PM2', 'Vercel'].map(skill => (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-[var(--text-100)]">{skill}</span>
                      <div className="w-16 h-2 bg-[var(--bg-300)] rounded-full">
                        <div className="h-full bg-[var(--accent-green)] rounded-full" style={{width: '80%'}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              */}
            {/* </div>
          </div>
        </section> */}
        <TechnicalExpertise />

        <ContactSection />
      </main>
    </>
  );
}