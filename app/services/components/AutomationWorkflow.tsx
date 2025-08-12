"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AutomationContent } from "../data/services-content";
import { CheckCircle, Circle, Play } from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

interface AutomationWorkflowProps {
  content: AutomationContent;
}

export default function AutomationWorkflow({ content }: AutomationWorkflowProps) {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [, setActiveTemplate] = useState(0);

  useEffect(() => {
    if (!dashboardRef.current) return;

    // Animate dashboard elements
    const elements = dashboardRef.current.querySelectorAll(".animate-element");
    if (elements.length > 0) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: dashboardRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    // Animate template cards with hover effects
    const templateCards = dashboardRef.current.querySelectorAll(".template-card");
    templateCards.forEach((card) => {
      const handleMouseEnter = () => {
        gsap.to(card, { scale: 1.02, duration: 0.3, ease: "power2.out" });
      };
      
      const handleMouseLeave = () => {
        gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
      };

      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    });
  }, []);

  return (
    <div
      id="automation-workflow-dashboard"
      ref={dashboardRef}
      className="bg-[var(--bg-200)] p-4 sm:p-6 md:p-8 rounded-xl border border-[var(--bg-300)] shadow-md"
      aria-labelledby="automation-dashboard-title"
    >
      {/* Dashboard Header */}
      <div id="automation-dashboard-header" className="animate-element mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h3 id="automation-dashboard-title" className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-100)]">
          Workflow Automation Dashboard
        </h3>
        <div id="automation-dashboard-status" className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[var(--accent-green)] rounded-full animate-pulse" aria-hidden="true"></span>
          <span className="text-xs sm:text-sm text-[var(--text-200)]">Active Workflows</span>
        </div>
      </div>

      {/* Automation Metrics */}
      <div id="automation-metrics-grid" className="animate-element grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {content.automationMetrics.map((metric) => (
          <div
            key={metric.id}
            id={`automation-metric-${metric.id}`}
            className="bg-[var(--bg-100)] p-3 sm:p-4 rounded-xl border border-[var(--bg-300)] shadow-sm transition-all duration-300 hover:shadow-md hover:scale-102"
          >
            <div id={`automation-metric-${metric.id}-header`} className="flex items-center justify-between mb-2">
              <div className="text-xs text-[var(--text-200)] uppercase tracking-wide">
                {metric.label}
              </div>
              {metric.change && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    metric.changeType === "positive"
                      ? "bg-[var(--accent-green)] bg-opacity-10 text-[var(--accent-green)]"
                      : "bg-[var(--accent-red)] bg-opacity-10 text-[var(--accent-red)]"
                  }`}
                >
                  {metric.change}
                </span>
              )}
            </div>
            <div id={`automation-metric-${metric.id}-value`} className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-100)]">
              {metric.prefix || ""}{metric.value.toLocaleString()}{metric.suffix || ""}
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Templates */}
      <div id="automation-workflow-templates" className="animate-element mb-6 sm:mb-8">
        <h4 className="text-base sm:text-lg font-bold text-[var(--text-100)] mb-3 sm:mb-4">Workflow Templates</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {content.workflowTemplates.map((template, index) => (
            <div
              key={template.id}
              id={`workflow-template-${template.id}`}
              className={`template-card relative p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                template.active
                  ? "bg-[var(--bg-100)] border-[var(--accent-green)] shadow-lg"
                  : "bg-[var(--bg-100)] border-[var(--bg-300)] hover:border-[var(--bg-300)] hover:shadow-md"
              }`}
              onClick={() => setActiveTemplate(index)}
            >
              {/* Active indicator */}
              <div className="absolute top-4 right-4">
                {template.active ? (
                  <CheckCircle size={20} weight="fill" className="text-[var(--accent-green)]" />
                ) : (
                  <Circle size={20} className="text-[var(--text-200)]" />
                )}
              </div>

              {/* Template info */}
              <div className="mb-3 sm:mb-4">
                <h5 className="text-sm sm:text-base font-bold text-[var(--text-100)] mb-1 sm:mb-2">{template.name}</h5>
                <p className="text-xs sm:text-sm text-[var(--text-200)] mb-2 sm:mb-3">{template.description}</p>
              </div>

              {/* Template metrics */}
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-200)]">Steps</span>
                  <span className="text-[var(--text-100)] font-medium">{template.steps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-200)]">Impact</span>
                  <span className="text-[var(--accent-green)] font-medium">{template.conversions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-200)]">Time Saved</span>
                  <span className="text-[var(--text-100)] font-medium">{template.timesSaved}</span>
                </div>
              </div>

              {/* Action button */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[var(--bg-300)]">
                <button
                  className={`w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                    template.active
                      ? "bg-[var(--accent-green)] text-[var(--white-color)] hover:bg-[var(--accent-green-base)]"
                      : "bg-[var(--bg-200)] text-[var(--text-100)] hover:bg-[var(--bg-300)]"
                  }`}
                >
                  <Play size={16} weight="fill" />
                  {template.active ? "Active" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Status */}
      <div id="automation-integrations" className="animate-element">
        <h4 className="text-base sm:text-lg font-bold text-[var(--text-100)] mb-3 sm:mb-4">Integration Status</h4>
        <div className="bg-[var(--bg-100)] p-4 sm:p-6 rounded-xl border border-[var(--bg-300)]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {content.integrations.map((integration) => (
              <div
                key={integration.name}
                id={`integration-${integration.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-center p-2 sm:p-3 bg-[var(--bg-200)] rounded-xl border border-[var(--bg-300)] transition-all duration-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-center mb-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      integration.connected ? "bg-[var(--accent-green)]" : "bg-[var(--bg-300)]"
                    }`}
                    aria-hidden="true"
                  ></div>
                </div>
                <div className="text-xs sm:text-sm font-medium text-[var(--text-100)] mb-1">
                  {integration.name}
                </div>
                <div className="text-xs text-[var(--text-200)]">
                  {integration.category}
                </div>
                <div
                  className={`text-xs mt-1 px-2 py-1 rounded-full ${
                    integration.connected
                      ? "bg-[var(--accent-green)] bg-opacity-10 text-[var(--accent-green)]"
                      : "bg-[var(--bg-300)] text-[var(--text-200)]"
                  }`}
                >
                  {integration.connected ? "Connected" : "Available"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}