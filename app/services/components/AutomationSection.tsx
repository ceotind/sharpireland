"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeader from "./SectionHeader";
import FeatureGrid from "./FeatureGrid";
import ServiceCTA from "./ServiceCTA";
import { AutomationContent, commonCtaContent } from "../data/services-content";

gsap.registerPlugin(ScrollTrigger);

interface AutomationSectionProps {
  content: AutomationContent;
}

export default function AutomationSection({ content }: AutomationSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Helper function to determine if a node is connected to the hovered node
  const isConnected = (nodeId: string) => {
    if (!hoveredNode) return false;
    
    // Check if this node is directly connected to the hovered node
    const hoveredNodeData = content.workflowNodes.find(node => node.id === hoveredNode);
    if (hoveredNodeData?.connections.includes(nodeId)) return true;
    
    // Check if the hovered node is connected to this node
    const thisNodeData = content.workflowNodes.find(node => node.id === nodeId);
    if (thisNodeData?.connections.includes(hoveredNode)) return true;
    
    return false;
  };
  
  // Get all nodes in the path (for highlighting the entire flow)
  const getConnectedPath = (startNodeId: string, visited = new Set<string>()): string[] => {
    if (visited.has(startNodeId)) return Array.from(visited);
    
    visited.add(startNodeId);
    
    const node = content.workflowNodes.find(n => n.id === startNodeId);
    if (!node) return Array.from(visited);
    
    // Add all directly connected nodes
    node.connections.forEach(connectedId => {
      getConnectedPath(connectedId, visited);
    });
    
    // Also check for nodes that connect to this one (reverse connections)
    content.workflowNodes.forEach(n => {
      if (n.connections.includes(startNodeId)) {
        getConnectedPath(n.id, visited);
      }
    });
    
    return Array.from(visited);
  };
  
  // Get all nodes in the path when hovering
  const getHighlightedNodes = () => {
    if (!hoveredNode) return [];
    return getConnectedPath(hoveredNode);
  };
  
  const highlightedNodes = getHighlightedNodes();

  // Function to draw connection lines between nodes
  const drawConnectionLines = () => {
    if (!pipelineRef.current) return;
    
    const svg = pipelineRef.current.querySelector('#pipeline-connections-svg');
    if (!svg) return;
    
    // Get all node elements
    const nodeElements = pipelineRef.current.querySelectorAll('[data-node-id]');
    const nodePositions = new Map();
    
    // Store the position of each node
    nodeElements.forEach((el) => {
      const nodeId = el.getAttribute('data-node-id');
      if (!nodeId) return;
      
      const rect = el.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      
      // Calculate position relative to the SVG
      nodePositions.set(nodeId, {
        left: rect.left - svgRect.left,
        right: rect.right - svgRect.left,
        top: rect.top - svgRect.top + rect.height / 2,
        bottom: rect.bottom - svgRect.top,
        width: rect.width,
        height: rect.height,
        centerX: rect.left - svgRect.left + rect.width / 2,
        centerY: rect.top - svgRect.top + rect.height / 2
      });
    });
    
    // Draw each connection
    content.workflowNodes.forEach(node => {
      node.connections.forEach(targetId => {
        const sourcePos = nodePositions.get(node.id);
        const targetPos = nodePositions.get(targetId);
        
        if (!sourcePos || !targetPos) return;
        
        // Get the path element
        const pathElement = svg.querySelector(`#connection-${node.id}-to-${targetId}`) as SVGPathElement;
        if (!pathElement) return;
        
        // Calculate control points for a nice curve
        const sourceX = sourcePos.right;
        const sourceY = sourcePos.centerY;
        const targetX = targetPos.left;
        const targetY = targetPos.centerY;
        
        // Calculate control points (for a bezier curve)
        const controlPointX1 = sourceX + (targetX - sourceX) * 0.4;
        const controlPointX2 = sourceX + (targetX - sourceX) * 0.6;
        
        // Create the path
        const path = `M ${sourceX} ${sourceY} C ${controlPointX1} ${sourceY}, ${controlPointX2} ${targetY}, ${targetX} ${targetY}`;
        
        // Set the path
        pathElement.setAttribute('d', path);
        
        // Set the length for animation
        const length = pathElement.getTotalLength();
        pathElement.style.strokeDasharray = `${length}`;
        pathElement.style.strokeDashoffset = `${length}`;
      });
    });
  };

  useEffect(() => {
    // Draw connection lines when component mounts and on window resize
    drawConnectionLines();
    
    // Add resize listener
    window.addEventListener('resize', drawConnectionLines);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', drawConnectionLines);
    };
  }, []);

  useEffect(() => {
    if (sectionRef.current) {
      // Animate section elements
      gsap.fromTo(
        sectionRef.current.querySelectorAll(".animate-element"),
        { opacity: 0, y: 30 },
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
      
      // Animate pipeline connections (flow lines)
      if (pipelineRef.current) {
        const connections = pipelineRef.current.querySelectorAll(".pipeline-connection");
        
        gsap.fromTo(
          connections,
          {
            strokeDashoffset: (i, el) => el.getTotalLength(),
            strokeDasharray: (i, el) => el.getTotalLength()
          },
          {
            strokeDashoffset: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: pipelineRef.current,
              start: "top 70%",
              once: true,
            },
          }
        );
      }
    }
  }, []);

  return (
    <section id="services-automation-root" ref={sectionRef} className="bg-[var(--bg-100)] py-20 md:py-32">
      <div id="automation-container" className="w-full max-w-screen-xl mx-auto px-4 lg:px-8 flex flex-col gap-12">
        <div id="automation-header-wrapper" className="animate-element">
          <SectionHeader
            id="services-automation"
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </div>
        
        {/* Workflow Pipeline Visualization */}
        <div id="automation-pipeline-wrapper" className="animate-element">
          <div 
            id="automation-pipeline" 
            ref={pipelineRef}
            className="relative bg-[var(--bg-200)] p-6 md:p-8 rounded-xl border border-[var(--bg-300)] shadow-md overflow-hidden min-h-[400px]"
          >
            <h3 id="pipeline-title" className="text-xl md:text-2xl font-bold text-[var(--text-100)] font-anton mb-8 text-center">
              Workflow Automation Pipeline
            </h3>
            
            {/* SVG for connection lines */}
            <svg 
              id="pipeline-connections-svg" 
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
              aria-hidden="true"
            >
              {content.workflowNodes.map(node => (
                node.connections.map((targetId, idx) => {
                  const targetNode = content.workflowNodes.find(n => n.id === targetId);
                  if (!targetNode) return null;
                  
                  // Determine if this connection should be highlighted
                  const isHighlighted = hoveredNode && 
                    highlightedNodes.includes(node.id) && 
                    highlightedNodes.includes(targetId);
                  
                  return (
                    <path
                      key={`${node.id}-to-${targetId}-${idx}`}
                      id={`connection-${node.id}-to-${targetId}`}
                      className={`pipeline-connection ${isHighlighted ? 'stroke-[var(--accent-green)]' : 'stroke-[var(--bg-300)]'}`}
                      d={`M 0 0 C 100 0, 200 0, 300 0`} // Placeholder - will be set by JS
                      fill="none"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      strokeLinecap="round"
                    />
                  );
                })
              ))}
            </svg>
            
            {/* Workflow Nodes */}
            <div id="pipeline-nodes-container" className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-20">
              {content.workflowNodes.map((node) => {
                // Determine if this node should be highlighted
                const isHighlighted = hoveredNode && highlightedNodes.includes(node.id);
                const isDirectlyConnected = hoveredNode && isConnected(node.id);
                
                return (
                  <div
                    key={node.id}
                    id={`node-${node.id}`}
                    data-node-id={node.id}
                    className={`
                      relative bg-[var(--bg-100)] p-5 rounded-lg border-2 transition-all duration-300
                      ${isHighlighted ? 'border-[var(--accent-green)] shadow-lg scale-105' : 'border-[var(--bg-300)] shadow-sm'}
                      ${node.position === 'start' ? 'md:col-start-1' : ''}
                      ${node.position === 'end' ? 'md:col-start-3' : ''}
                      ${node.position === 'middle' ? 'md:col-start-2' : ''}
                    `}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <div id={`node-${node.id}-icon`} className={`
                      text-3xl mb-3 transition-colors duration-300
                      ${isHighlighted ? 'text-[var(--accent-green)]' : 'text-[var(--text-200)]'}
                    `}>
                      {node.icon}
                    </div>
                    <h4 id={`node-${node.id}-title`} className="text-lg font-bold text-[var(--text-100)] font-anton mb-2">
                      {node.title}
                    </h4>
                    <p id={`node-${node.id}-description`} className="text-sm text-[var(--text-200)] font-inter">
                      {node.description}
                    </p>
                    
                    {/* Connection indicators */}
                    {node.connections.length > 0 && (
                      <div 
                        id={`node-${node.id}-connection-indicator`}
                        className={`
                          absolute -right-1 top-1/2 w-3 h-3 rounded-full transition-colors duration-300
                          ${isHighlighted ? 'bg-[var(--accent-green)]' : 'bg-[var(--bg-300)]'}
                        `}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div id="automation-features-wrapper" className="animate-element">
          <FeatureGrid id="automation-features-grid" features={content.features} />
        </div>
        
        {/* Industry Use Cases */}
        <div id="automation-use-cases-wrapper" className="animate-element">
          <h3 id="use-cases-title" className="text-xl md:text-2xl font-bold text-[var(--text-100)] font-anton mb-6 text-center">
            Industry-Specific Automation Solutions
          </h3>
          
          <div id="use-cases-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.industryUseCases.map((useCase) => (
              <div
                key={useCase.id}
                id={`use-case-${useCase.id}`}
                className="bg-[var(--bg-200)] p-6 rounded-lg border border-[var(--bg-300)] shadow-sm"
              >
                <h4 id={`use-case-${useCase.id}-industry`} className="text-lg font-bold text-[var(--text-100)] font-anton mb-2">
                  {useCase.industry}
                </h4>
                <p id={`use-case-${useCase.id}-description`} className="text-sm text-[var(--text-200)] font-inter mb-4">
                  {useCase.description}
                </p>
                <ul id={`use-case-${useCase.id}-benefits-list`} className="space-y-2">
                  {useCase.benefits.map((benefit, index) => (
                    <li 
                      key={index}
                      id={`use-case-${useCase.id}-benefit-${index}`}
                      className="flex items-start"
                    >
                      <span className="text-[var(--accent-green)] mr-2">✓</span>
                      <span className="text-sm text-[var(--text-200)] font-inter">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <div id="automation-cta-wrapper" className="animate-element text-center mt-8">
          <ServiceCTA
            id="automation-cta-section"
            primaryText={commonCtaContent.primaryText}
            secondaryText={commonCtaContent.secondaryText}
            primaryLink={commonCtaContent.primaryLink}
            secondaryLink={commonCtaContent.secondaryLink}
          />
        </div>
      </div>
    </section>
  );
}