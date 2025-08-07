import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  FaReact, 
  FaNodeJs, 
  FaDocker, 
  FaPython,
  FaServer,
  FaCode,
  FaLinux
} from 'react-icons/fa';
import { 
  SiTypescript, 
  SiTailwindcss, 
  SiExpress, 
  SiKubernetes, 
  SiPostgresql, 
  SiMongodb, 
  SiRedis, 
  SiMysql, 
  SiFirebase, 
  SiGraphql, 
  SiNextdotjs,
  SiDotnet,
  SiTensorflow,
  SiPandas,
  SiNumpy,
  SiOpenai,
  SiAmazon,
  SiGit
} from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

interface ExpertiseCardProps {
  title: string;
  category: string;
  techStack: string[];
}

const techIconMap: { [key: string]: React.ElementType } = {
  'React': FaReact,
  'Next.js': SiNextdotjs,
  'TypeScript': SiTypescript,
  'Tailwind CSS': SiTailwindcss,
  'GSAP': FaCode,
  'Node.js': FaNodeJs,
  'Express': SiExpress,
  'Python': FaPython,
  '.NET': SiDotnet,
  'REST APIs': FaServer,
  'Docker': FaDocker,
  'AWS': SiAmazon,
  'CI/CD': SiGit,
  'Kubernetes': SiKubernetes,
  'Linux': FaLinux,
  'PostgreSQL': SiPostgresql,
  'MongoDB': SiMongodb,
  'Redis': SiRedis,
  'MySQL': SiMysql,
  'Firebase': SiFirebase,
  'REST': FaServer,
  'GraphQL': SiGraphql,
  'WebSockets': FaCode,
  'OAuth': FaCode,
  'Microservices': FaServer,
  'TensorFlow': SiTensorflow,
  'Pandas': SiPandas,
  'NumPy': SiNumpy,
  'OpenAI': SiOpenai
};

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({ title, category, techStack }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
            once: true,
          }
        }
      );

      // Hover animations
      cardRef.current.addEventListener('mouseenter', () => {
        gsap.to(cardRef.current, { scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.1)", duration: 0.3, ease: "power2.out" });
      });
      cardRef.current.addEventListener('mouseleave', () => {
        gsap.to(cardRef.current, { scale: 1, boxShadow: "none", duration: 0.3, ease: "power2.out" });
      });
    }
  }, []);

  return (
    <div
      ref={cardRef}
      id={`expertise-card-${title.toLowerCase().replace(/\s/g, '-')}`}
      className="bg-[var(--bg-200)] p-6 md:p-8 rounded-xl shadow-lg border border-[var(--bg-300)] flex flex-col items-center text-center transform transition-all duration-300 ease-out hover:shadow-xl hover:scale-105"
    >
      <h3 className="text-xl md:text-2xl font-semibold text-[var(--foreground)] mb-2">{title}</h3>
      <p className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium mb-4 md:mb-6">{category}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {techStack.map((tech, index) => {
          const IconComponent = techIconMap[tech] || FaCode;
          return (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent-green-base)] bg-opacity-40 text-white flex items-center gap-1"
            >
              <IconComponent className="w-3 h-3 text-white" />
              {tech}
            </span>
          );
        })}
      </div>
    </div>
  );
};

const expertiseData = [
  {
    title: "Frontend",
    category: "Development",
    techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
  },
  {
    title: "Backend",
    category: "Development",
    techStack: ["Node.js", "Express", "Python", ".NET", "REST APIs"],
  },
  {
    title: "DevOps & Infrastructure",
    category: "Operations",
    techStack: ["Docker", "AWS", "CI/CD", "Kubernetes", "Linux"],
  },
  {
    title: "Databases",
    category: "Data Management",
    techStack: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Firebase"],
  },
  {
    title: "APIs & Integration",
    category: "Connectivity",
    techStack: ["REST", "GraphQL", "WebSockets", "OAuth", "Microservices"],
  },
  {
    title: "Data/AI Tools",
    category: "Intelligence",
    techStack: ["Python", "TensorFlow", "Pandas", "NumPy", "OpenAI"],
  },
];

export default function TechnicalExpertise() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(sectionRef.current.querySelectorAll(".animate-element"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          }
        }
      );
    }
  }, []);

  return (
    <section id="technical-expertise" ref={sectionRef} className="bg-[var(--background)] py-20 md:py-32">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Pattern */}
        <div className="text-center animate-element mb-12 md:mb-16">
          <span className="text-sm uppercase tracking-wide text-[var(--accent-green)] font-medium">
            Our Capabilities
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-[var(--foreground)]">
            Technical Expertise
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-[var(--foreground)] text-base md:text-lg opacity-80">
            Leveraging a diverse stack of modern technologies to build robust and innovative solutions.
          </p>
        </div>

        {/* 2x3 Grid Layout with industry-standard spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-element">
          {expertiseData.map((expertise, index) => (
            <ExpertiseCard key={index} {...expertise} />
          ))}
        </div>
      </div>
    </section>
  );
}