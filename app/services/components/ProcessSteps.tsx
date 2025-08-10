import React from "react";

interface ProcessStep {
  id: string;
  icon: React.ReactNode; // Or string for image path
  title: string;
  description: string;
}

interface ProcessStepsProps {
  id: string;
  steps: ProcessStep[];
}

export default function ProcessSteps({ id, steps }: ProcessStepsProps) {
  return (
    <div id={id} className="relative flex flex-col items-center">
      {steps.map((step, index) => (
        <div
          key={step.id}
          id={step.id}
          className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left mb-12 last:mb-0"
        >
          <div
            id={`${step.id}-icon-container`}
            className="flex-shrink-0 w-20 h-20 rounded-full bg-[var(--accent-green)] flex items-center justify-center text-[var(--white-color)] text-3xl font-bold font-anton mb-4 md:mb-0 md:mr-8"
          >
            {index + 1}
          </div>
          <div id={`${step.id}-content`}>
            <h3 id={`${step.id}-title`} className="text-2xl font-semibold text-[var(--text-100)] font-anton">
              {step.title}
            </h3>
            <p id={`${step.id}-description`} className="mt-2 text-[var(--text-200)] font-inter">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}