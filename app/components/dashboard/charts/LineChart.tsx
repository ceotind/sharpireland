'use client';

import React from 'react';

interface DataPoint {
  date: string;
  value: number;
  [key: string]: any;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showGrid?: boolean;
  showDots?: boolean;
  showTooltip?: boolean;
  className?: string;
  id?: string;
}

export default function LineChart({
  data,
  width = 400,
  height = 200,
  color = '#3b82f6',
  strokeWidth = 2,
  showGrid = true,
  showDots = false,
  showTooltip = true,
  className = '',
  id
}: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = React.useState<DataPoint | null>(null);
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
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Find min and max values
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  // Create path for the line
  const createPath = () => {
    return data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Create area path (for gradient fill)
  const createAreaPath = () => {
    const linePath = createPath();
    const firstPoint = data[0];
    const lastPoint = data[data.length - 1];
    
    const firstX = padding;
    const lastX = padding + chartWidth;
    const bottomY = padding + chartHeight;
    
    return `${linePath} L ${lastX} ${bottomY} L ${firstPoint ? firstX : 0} ${bottomY} Z`;
  };

  // Handle mouse events
  const handleMouseMove = (event: React.MouseEvent<SVGElement>) => {
    if (!showTooltip) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - padding;
    const y = event.clientY - rect.top;

    // Find closest data point
    const pointIndex = Math.round((x / chartWidth) * (data.length - 1));
    const clampedIndex = Math.max(0, Math.min(pointIndex, data.length - 1));
    
    const point = data[clampedIndex];
    if (point) {
      setHoveredPoint(point);
    }
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  // Format value for display
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div id={id} className={`relative ${className}`}>
      <svg
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="overflow-visible"
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gradient-${id || 'default'}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-20">
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = padding + chartHeight - ratio * chartHeight;
              return (
                <line
                  key={`h-grid-${index}`}
                  x1={padding}
                  y1={y}
                  x2={padding + chartWidth}
                  y2={y}
                  stroke="#6b7280"
                  strokeWidth="1"
                />
              );
            })}
            {/* Vertical grid lines */}
            {data.map((_, index) => {
              if (index % Math.ceil(data.length / 5) !== 0) return null;
              const x = padding + (index / (data.length - 1)) * chartWidth;
              return (
                <line
                  key={`v-grid-${index}`}
                  x1={x}
                  y1={padding}
                  x2={x}
                  y2={padding + chartHeight}
                  stroke="#6b7280"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        )}

        {/* Area fill */}
        <path
          d={createAreaPath()}
          fill={`url(#gradient-${id || 'default'})`}
          className="opacity-50"
        />

        {/* Line */}
        <path
          d={createPath()}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-sm"
        />

        {/* Data points */}
        {showDots && data.map((point, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth;
          const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
          
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={color}
              stroke="white"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
          );
        })}

        {/* Hover indicator */}
        {hoveredPoint && showTooltip && (
          <g>
            {data.map((point, index) => {
              if (point !== hoveredPoint) return null;
              
              const x = padding + (index / (data.length - 1)) * chartWidth;
              const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
              
              return (
                <g key="hover-indicator">
                  <line
                    x1={x}
                    y1={padding}
                    x2={x}
                    y2={padding + chartHeight}
                    stroke={color}
                    strokeWidth="1"
                    strokeDasharray="4,4"
                    className="opacity-50"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                    className="drop-shadow-md"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* Y-axis labels */}
        <g className="text-xs fill-gray-500">
          {[0, 0.5, 1].map((ratio, index) => {
            const y = padding + chartHeight - ratio * chartHeight;
            const value = minValue + ratio * valueRange;
            return (
              <text
                key={`y-label-${index}`}
                x={padding - 5}
                y={y + 3}
                textAnchor="end"
                className="text-xs"
              >
                {formatValue(value)}
              </text>
            );
          })}
        </g>

        {/* X-axis labels */}
        <g className="text-xs fill-gray-500">
          {data.map((point, index) => {
            if (index % Math.ceil(data.length / 4) !== 0 && index !== data.length - 1) return null;
            const x = padding + (index / (data.length - 1)) * chartWidth;
            return (
              <text
                key={`x-label-${index}`}
                x={x}
                y={padding + chartHeight + 15}
                textAnchor="middle"
                className="text-xs"
              >
                {formatDate(point.date)}
              </text>
            );
          })}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredPoint && showTooltip && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="font-medium">{formatValue(hoveredPoint.value)}</div>
          <div className="text-gray-300">{formatDate(hoveredPoint.date)}</div>
        </div>
      )}
    </div>
  );
}