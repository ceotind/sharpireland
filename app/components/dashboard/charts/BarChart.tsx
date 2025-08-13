'use client';

import React from 'react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
  [key: string]: any;
}

interface BarChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  orientation?: 'horizontal' | 'vertical';
  showValues?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  className?: string;
  id?: string;
  colors?: string[];
}

export default function BarChart({
  data,
  width = 400,
  height = 300,
  orientation = 'vertical',
  showValues = true,
  showGrid = true,
  showTooltip = true,
  className = '',
  id,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
}: BarChartProps) {
  const [hoveredBar, setHoveredBar] = React.useState<DataPoint | null>(null);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  if (!data || data.length === 0) {
    return (
      <div 
        id={id}
        className={`flex items-center justify-center bg-gray-50 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  // Calculate chart dimensions with padding
  const padding = { top: 20, right: 20, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find max value for scaling
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(0, Math.min(...data.map(d => d.value)));
  const valueRange = maxValue - minValue || 1;

  // Calculate bar dimensions
  const barCount = data.length;
  const barSpacing = 0.1; // 10% spacing between bars
  const barWidth = orientation === 'vertical' 
    ? (chartWidth / barCount) * (1 - barSpacing)
    : chartHeight / barCount * (1 - barSpacing);

  // Handle mouse events
  const handleMouseMove = (event: React.MouseEvent<SVGElement>, dataPoint: DataPoint) => {
    if (!showTooltip) return;
    setHoveredBar(dataPoint);
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredBar(null);
  };

  // Format value for display
  const formatValue = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  // Truncate label if too long
  const truncateLabel = (label: string, maxLength: number = 12) => {
    return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
  };

  return (
    <div id={id} className={`relative ${className}`}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-20">
            {orientation === 'vertical' ? (
              // Horizontal grid lines for vertical bars
              [0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = padding.top + chartHeight - ratio * chartHeight;
                return (
                  <line
                    key={`grid-${index}`}
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + chartWidth}
                    y2={y}
                    stroke="#6b7280"
                    strokeWidth="1"
                  />
                );
              })
            ) : (
              // Vertical grid lines for horizontal bars
              [0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const x = padding.left + ratio * chartWidth;
                return (
                  <line
                    key={`grid-${index}`}
                    x1={x}
                    y1={padding.top}
                    x2={x}
                    y2={padding.top + chartHeight}
                    stroke="#6b7280"
                    strokeWidth="1"
                  />
                );
              })
            )}
          </g>
        )}

        {/* Bars */}
        {data.map((dataPoint, index) => {
          const color = dataPoint.color || colors[index % colors.length];
          const isHovered = hoveredBar === dataPoint;
          
          if (orientation === 'vertical') {
            const barHeight = Math.abs(dataPoint.value / valueRange) * chartHeight;
            const x = padding.left + (index * chartWidth / barCount) + (chartWidth / barCount) * barSpacing / 2;
            const y = dataPoint.value >= 0 
              ? padding.top + chartHeight - barHeight
              : padding.top + chartHeight;
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  className={`transition-all duration-200 cursor-pointer ${
                    isHovered ? 'opacity-80 drop-shadow-md' : 'opacity-90'
                  }`}
                  onMouseMove={(e) => handleMouseMove(e, dataPoint)}
                  onMouseLeave={handleMouseLeave}
                />
                
                {/* Value labels */}
                {showValues && (
                  <text
                    x={x + barWidth / 2}
                    y={dataPoint.value >= 0 ? y - 5 : y + barHeight + 15}
                    textAnchor="middle"
                    className="text-xs fill-gray-600 font-medium"
                  >
                    {formatValue(dataPoint.value)}
                  </text>
                )}
              </g>
            );
          } else {
            // Horizontal bars
            const barLength = Math.abs(dataPoint.value / valueRange) * chartWidth;
            const x = dataPoint.value >= 0 ? padding.left : padding.left - barLength;
            const y = padding.top + (index * chartHeight / barCount) + (chartHeight / barCount) * barSpacing / 2;
            
            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barLength}
                  height={barWidth}
                  fill={color}
                  className={`transition-all duration-200 cursor-pointer ${
                    isHovered ? 'opacity-80 drop-shadow-md' : 'opacity-90'
                  }`}
                  onMouseMove={(e) => handleMouseMove(e, dataPoint)}
                  onMouseLeave={handleMouseLeave}
                />
                
                {/* Value labels */}
                {showValues && (
                  <text
                    x={dataPoint.value >= 0 ? x + barLength + 5 : x - 5}
                    y={y + barWidth / 2 + 3}
                    textAnchor={dataPoint.value >= 0 ? 'start' : 'end'}
                    className="text-xs fill-gray-600 font-medium"
                  >
                    {formatValue(dataPoint.value)}
                  </text>
                )}
              </g>
            );
          }
        })}

        {/* Axes */}
        <g>
          {/* X-axis */}
          <line
            x1={padding.left}
            y1={padding.top + chartHeight}
            x2={padding.left + chartWidth}
            y2={padding.top + chartHeight}
            stroke="#374151"
            strokeWidth="1"
          />
          
          {/* Y-axis */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + chartHeight}
            stroke="#374151"
            strokeWidth="1"
          />
        </g>

        {/* Axis labels */}
        <g className="text-xs fill-gray-600">
          {orientation === 'vertical' ? (
            <>
              {/* X-axis labels (categories) */}
              {data.map((dataPoint, index) => {
                const x = padding.left + (index * chartWidth / barCount) + (chartWidth / barCount) / 2;
                return (
                  <text
                    key={`x-label-${index}`}
                    x={x}
                    y={padding.top + chartHeight + 15}
                    textAnchor="middle"
                    className="text-xs"
                    transform={data.length > 6 ? `rotate(-45, ${x}, ${padding.top + chartHeight + 15})` : undefined}
                  >
                    {truncateLabel(dataPoint.label, data.length > 6 ? 8 : 12)}
                  </text>
                );
              })}
              
              {/* Y-axis labels (values) */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = padding.top + chartHeight - ratio * chartHeight;
                const value = minValue + ratio * valueRange;
                return (
                  <text
                    key={`y-label-${index}`}
                    x={padding.left - 10}
                    y={y + 3}
                    textAnchor="end"
                    className="text-xs"
                  >
                    {formatValue(value)}
                  </text>
                );
              })}
            </>
          ) : (
            <>
              {/* Y-axis labels (categories) */}
              {data.map((dataPoint, index) => {
                const y = padding.top + (index * chartHeight / barCount) + (chartHeight / barCount) / 2;
                return (
                  <text
                    key={`y-label-${index}`}
                    x={padding.left - 10}
                    y={y + 3}
                    textAnchor="end"
                    className="text-xs"
                  >
                    {truncateLabel(dataPoint.label)}
                  </text>
                );
              })}
              
              {/* X-axis labels (values) */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const x = padding.left + ratio * chartWidth;
                const value = minValue + ratio * valueRange;
                return (
                  <text
                    key={`x-label-${index}`}
                    x={x}
                    y={padding.top + chartHeight + 15}
                    textAnchor="middle"
                    className="text-xs"
                  >
                    {formatValue(value)}
                  </text>
                );
              })}
            </>
          )}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredBar && showTooltip && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="font-medium">{hoveredBar.label}</div>
          <div className="text-gray-300">{formatValue(hoveredBar.value)}</div>
          {hoveredBar.percentage && (
            <div className="text-gray-300">{hoveredBar.percentage}%</div>
          )}
        </div>
      )}
    </div>
  );
}