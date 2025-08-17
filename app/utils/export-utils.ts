/**
 * Export Utilities
 * 
 * Provides comprehensive data export functionality including CSV export,
 * PDF generation, Excel export, and various data formatting options.
 */

interface ExportOptions {
  filename?: string;
  format?: 'csv' | 'json' | 'xlsx' | 'pdf';
  headers?: string[];
  delimiter?: string;
  includeHeaders?: boolean;
  dateFormat?: string;
  timezone?: string;
}

interface PDFOptions {
  title?: string;
  author?: string;
  subject?: string;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'A4' | 'A3' | 'letter';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  fontSize?: number;
  includeTimestamp?: boolean;
  logo?: string;
}

interface AnalyticsData {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface ProjectData {
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
}

interface UserData {
  email: string;
  name: string;
  role: string;
  createdAt: string;
  lastLogin: string;
}

interface FinancialData {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
  currency: string;
}

interface TableColumn {
  key: string;
  label: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: unknown) => string;
}

interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  data: unknown[];
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
}

/**
 * CSV Export Utilities
 */
export class CSVExporter {
  /**
   * Convert array of objects to CSV string
   */
  static arrayToCSV<T extends Record<string, unknown>>(
    data: T[],
    options: ExportOptions = {}
  ): string {
    if (!data || data.length === 0) {
      return '';
    }

    const {
      headers = data[0] ? Object.keys(data[0]) : [],
      delimiter = ',',
      includeHeaders = true,
      dateFormat = 'YYYY-MM-DD HH:mm:ss'
    } = options;

    const csvRows: string[] = [];

    // Add headers if requested
    if (includeHeaders) {
      csvRows.push(headers.map(header => this.escapeCSVField(header)).join(delimiter));
    }

    // Add data rows
    data.forEach(row => {
      const values = headers.map(header => {
        let value = row[header];
        
        // Format dates
        if (value instanceof Date) {
          value = this.formatDate(value, dateFormat);
        }
        
        // Handle null/undefined
        if (value === null || value === undefined) {
          value = '';
        }
        
        // Convert to string and escape
        return this.escapeCSVField(String(value));
      });
      
      csvRows.push(values.join(delimiter));
    });

    return csvRows.join('\n');
  }

  /**
   * Download CSV file
   */
  static downloadCSV<T extends Record<string, unknown>>(
    data: T[],
    filename: string = 'export.csv',
    options: ExportOptions = {}
  ): void {
    const csvContent = this.arrayToCSV(data, options);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, filename);
  }

  /**
   * Escape CSV field (handle commas, quotes, newlines)
   */
  private static escapeCSVField(field: string): string {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }

  /**
   * Format date according to specified format
   */
  private static formatDate(date: Date, format: string): string {
    // Simple date formatting - in production, use a library like date-fns
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  /**
   * Download blob as file
   */
  private static downloadBlob(blob: Blob, filename: string): void {
    if (typeof window === 'undefined') return;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

/**
 * PDF Export Utilities
 */
export class PDFExporter {
  /**
   * Generate PDF from table data
   */
  static async generateTablePDF<T extends Record<string, unknown>>(
    data: T[],
    columns: TableColumn[],
    options: PDFOptions = {}
  ): Promise<Blob> {
    // This is a simplified PDF generation
    // In production, use libraries like jsPDF, PDFKit, or Puppeteer
    
    const {
      title = 'Data Export',
      orientation = 'portrait',
      pageSize = 'A4',
      fontSize = 12,
      includeTimestamp = true
    } = options;

    // Create HTML content for PDF
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            font-size: ${fontSize}px; 
            margin: 20px;
          }
          .header { 
            text-align: center; 
            margin-bottom: 20px; 
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          .timestamp { 
            text-align: right; 
            font-size: 10px; 
            color: #666; 
            margin-bottom: 20px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left;
          }
          th { 
            background-color: #f2f2f2; 
            font-weight: bold;
          }
          tr:nth-child(even) { 
            background-color: #f9f9f9; 
          }
          .page-break { 
            page-break-before: always; 
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${title}</h1>
        </div>
    `;

    if (includeTimestamp) {
      htmlContent += `
        <div class="timestamp">
          Generated on: ${new Date().toLocaleString()}
        </div>
      `;
    }

    // Add table
    htmlContent += '<table>';
    
    // Add headers
    htmlContent += '<thead><tr>';
    columns.forEach(col => {
      htmlContent += `<th style="text-align: ${col.align || 'left'}">${col.label}</th>`;
    });
    htmlContent += '</tr></thead>';

    // Add data rows
    htmlContent += '<tbody>';
    data.forEach((row, index) => {
      htmlContent += '<tr>';
      columns.forEach(col => {
        let value = row[col.key];
        if (col.format) {
          value = col.format(value);
        }
        htmlContent += `<td style="text-align: ${col.align || 'left'}">${value || ''}</td>`;
      });
      htmlContent += '</tr>';
    });
    htmlContent += '</tbody>';

    htmlContent += '</table></body></html>';

    // Convert HTML to PDF (simplified - use proper PDF library in production)
    return new Blob([htmlContent], { type: 'text/html' });
  }

  /**
   * Generate PDF report with charts and tables
   */
  static async generateReport<T extends Record<string, unknown>>(
    title: string,
    sections: Array<{
      title: string;
      type: 'table' | 'chart' | 'text';
      data: T[] | string | ChartData;
      columns?: TableColumn[];
      chartData?: ChartData;
    }>,
    options: PDFOptions = {}
  ): Promise<Blob> {
    // Simplified report generation
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .report-header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 30px; page-break-inside: avoid; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; }
          .chart-placeholder { 
            border: 2px dashed #ccc; 
            height: 300px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <h1>${title}</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
    `;

    sections.forEach(section => {
      htmlContent += `<div class="section">`;
      htmlContent += `<h2 class="section-title">${section.title}</h2>`;

      switch (section.type) {
        case 'table':
          if (section.columns && section.data) {
            htmlContent += '<table>';
            htmlContent += '<thead><tr>';
            section.columns.forEach(col => {
              htmlContent += `<th>${col.label}</th>`;
            });
            htmlContent += '</tr></thead><tbody>';
            
            (section.data as T[]).forEach((row: T) => {
              htmlContent += '<tr>';
              section.columns!.forEach(col => {
                let displayValue: unknown = row[col.key as keyof T];
                if (col.format) {
                  displayValue = col.format(displayValue);
                }
                htmlContent += `<td>${String(displayValue || '')}</td>`;
              });
              htmlContent += '</tr>';
            });
            htmlContent += '</tbody></table>';
          }
          break;

        case 'chart':
          htmlContent += `
            <div class="chart-placeholder">
              Chart: ${section.chartData?.title || 'Untitled Chart'}
              <br>Type: ${section.chartData?.type || 'Unknown'}
            </div>
          `;
          break;

        case 'text':
          htmlContent += `<p>${section.data}</p>`;
          break;
      }

      htmlContent += '</div>';
    });

    htmlContent += '</body></html>';

    return new Blob([htmlContent], { type: 'text/html' });
  }

  /**
   * Download PDF file
   */
  static downloadPDF(blob: Blob, filename: string = 'report.pdf'): void {
    if (typeof window === 'undefined') return;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

/**
 * Excel Export Utilities
 */
export class ExcelExporter {
  /**
   * Generate Excel file from data
   */
  static generateExcel<T extends Record<string, unknown>>(
    data: T[],
    worksheetName: string = 'Sheet1',
    options: ExportOptions = {}
  ): Blob {
    // Simplified Excel generation - use libraries like SheetJS in production
    const csvContent = CSVExporter.arrayToCSV(data, options);
    
    // Create a simple Excel-compatible format
    const excelContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:x="urn:schemas-microsoft-com:office:excel" 
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="ProgId" content="Excel.Sheet">
        <meta name="Generator" content="Microsoft Excel 11">
        <style>
          .number { mso-number-format:"0.00"; }
          .text { mso-number-format:"\\@"; }
        </style>
      </head>
      <body>
        <table>
          ${csvContent.split('\n').map(row => 
            `<tr>${row.split(',').map(cell => 
              `<td class="text">${cell.replace(/"/g, '')}</td>`
            ).join('')}</tr>`
          ).join('')}
        </table>
      </body>
      </html>
    `;

    return new Blob([excelContent], { 
      type: 'application/vnd.ms-excel;charset=utf-8;' 
    });
  }

  /**
   * Download Excel file
   */
  static downloadExcel<T extends Record<string, unknown>>(
    data: T[],
    filename: string = 'export.xlsx',
    worksheetName?: string,
    options: ExportOptions = {}
  ): void {
    const blob = this.generateExcel(data, worksheetName, options);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

/**
 * JSON Export Utilities
 */
export class JSONExporter {
  /**
   * Download JSON file
   */
  static downloadJSON(
    data: unknown,
    filename: string = 'export.json',
    pretty: boolean = true
  ): void {
    const jsonContent = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    
    if (typeof window === 'undefined') return;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.json') ? filename : `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Export with metadata
   */
  static downloadJSONWithMetadata(
    data: unknown,
    metadata: Record<string, unknown> = {},
    filename: string = 'export.json'
  ): void {
    const exportData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        ...metadata
      },
      data
    };

    this.downloadJSON(exportData, filename);
  }
}

/**
 * Universal Export Manager
 */
export class ExportManager {
  /**
   * Export data in specified format
   */
  static async exportData<T extends Record<string, unknown>>(
    data: T[],
    format: 'csv' | 'json' | 'xlsx' | 'pdf',
    filename: string,
    options: ExportOptions & PDFOptions = {}
  ): Promise<void> {
    switch (format) {
      case 'csv':
        CSVExporter.downloadCSV(data, filename, options);
        break;

      case 'json':
        JSONExporter.downloadJSON(data, filename);
        break;

      case 'xlsx':
        ExcelExporter.downloadExcel(data, filename, undefined, options);
        break;

      case 'pdf':
        if (options.headers) {
          const columns: TableColumn[] = options.headers.map(header => ({
            key: header,
            label: header
          }));
          const blob = await PDFExporter.generateTablePDF(data, columns, options);
          PDFExporter.downloadPDF(blob, filename);
        }
        break;

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Get export preview
   */
  static getExportPreview<T extends Record<string, unknown>>(
    data: T[],
    format: 'csv' | 'json',
    options: ExportOptions = {}
  ): string {
    switch (format) {
      case 'csv':
        return CSVExporter.arrayToCSV(data.slice(0, 10), options); // Preview first 10 rows

      case 'json':
        return JSON.stringify(data.slice(0, 5), null, 2); // Preview first 5 items

      default:
        return 'Preview not available for this format';
    }
  }

  /**
   * Validate export data
   */
  static validateExportData<T extends Record<string, unknown>>(
    data: T[],
    requiredFields?: string[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!Array.isArray(data)) {
      errors.push('Data must be an array');
      return { valid: false, errors };
    }

    if (data.length === 0) {
      errors.push('Data array is empty');
      return { valid: false, errors };
    }

    if (requiredFields) {
      const firstItem = data[0];
      const missingFields = requiredFields.filter(field => !firstItem || !(field in firstItem));
      if (missingFields.length > 0) {
        errors.push(`Missing required fields: ${missingFields.join(', ')}`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Get export statistics
   */
  static getExportStats<T extends Record<string, unknown>>(data: T[]): {
    totalRows: number;
    totalColumns: number;
    columnNames: string[];
    dataTypes: Record<string, string>;
    estimatedSize: string;
  } {
    if (!data || data.length === 0) {
      return {
        totalRows: 0,
        totalColumns: 0,
        columnNames: [],
        dataTypes: {},
        estimatedSize: '0 B'
      };
    }

    const firstItem = data[0];
    if (!firstItem) {
      return {
        totalRows: 0,
        totalColumns: 0,
        columnNames: [],
        dataTypes: {},
        estimatedSize: '0 B'
      };
    }

    const columnNames = Object.keys(firstItem);
    const dataTypes: Record<string, string> = {};

    // Analyze data types
    columnNames.forEach(col => {
      const value = firstItem?.[col];
      if (value === null || value === undefined) {
        dataTypes[col] = 'null';
      } else if (typeof value === 'number') {
        dataTypes[col] = 'number';
      } else if (typeof value === 'boolean') {
        dataTypes[col] = 'boolean';
      } else if (value instanceof Date) {
        dataTypes[col] = 'date';
      } else {
        dataTypes[col] = 'string';
      }
    });

    // Estimate size
    const jsonSize = JSON.stringify(data).length;
    const estimatedSize = this.formatBytes(jsonSize);

    return {
      totalRows: data.length,
      totalColumns: columnNames.length,
      columnNames,
      dataTypes,
      estimatedSize
    };
  }

  /**
   * Format bytes to human readable string
   */
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

/**
 * Export utilities for common dashboard data
 */
export const DashboardExportUtils = {
  /**
   * Export analytics data
   */
  exportAnalytics: (data: AnalyticsData[], format: 'csv' | 'xlsx' | 'pdf' = 'csv') => {
    const filename = `analytics-${new Date().toISOString().split('T')[0]}`;
    return ExportManager.exportData(data, format, filename, {
      headers: ['date', 'pageViews', 'uniqueVisitors', 'bounceRate', 'avgSessionDuration']
    });
  },

  /**
   * Export project data
   */
  exportProjects: (data: ProjectData[], format: 'csv' | 'xlsx' | 'pdf' = 'csv') => {
    const filename = `projects-${new Date().toISOString().split('T')[0]}`;
    return ExportManager.exportData(data, format, filename, {
      headers: ['name', 'status', 'createdAt', 'updatedAt', 'owner']
    });
  },

  /**
   * Export user data
   */
  exportUsers: (data: UserData[], format: 'csv' | 'xlsx' | 'pdf' = 'csv') => {
    const filename = `users-${new Date().toISOString().split('T')[0]}`;
    return ExportManager.exportData(data, format, filename, {
      headers: ['email', 'name', 'role', 'createdAt', 'lastLogin']
    });
  },

  /**
   * Export financial data
   */
  exportFinancials: (data: FinancialData[], format: 'csv' | 'xlsx' | 'pdf' = 'csv') => {
    const filename = `financials-${new Date().toISOString().split('T')[0]}`;
    return ExportManager.exportData(data, format, filename, {
      headers: ['date', 'revenue', 'expenses', 'profit', 'currency']
    });
  }
};

export default ExportManager;