'use client';

import React, { useState, useEffect } from 'react';
import InvoiceTable from './InvoiceTable';
import { Invoice } from '../../types/dashboard';

interface BillingSectionProps {
  onNewInvoice?: () => void;
  onEditInvoice?: (invoice: Invoice) => void;
  className?: string;
}

interface BillingSummary {
  total_amount: number;
  pending_amount: number;
  paid_amount: number;
  overdue_amount: number;
  total_count: number;
  pending_count: number;
  paid_count: number;
  overdue_count: number;
}

export default function BillingSection({
  onNewInvoice,
  onEditInvoice,
  className = ''
}: BillingSectionProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue' | 'cancelled'>('all');
  const [summary, setSummary] = useState<BillingSummary>({
    total_amount: 0,
    pending_amount: 0,
    paid_amount: 0,
    overdue_amount: 0,
    total_count: 0,
    pending_count: 0,
    paid_count: 0,
    overdue_count: 0
  });

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await fetch(`/api/invoices?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }

      const data = await response.json();
      setInvoices(data.invoices || []);
      setSummary(data.summary || summary);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = (invoiceId: string) => {
    // Open invoice in new tab/window
    window.open(`/dashboard/billing/invoice/${invoiceId}`, '_blank');
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/download`);
      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      // Get the filename from the response headers or use a default
      const contentDisposition = response.headers.get('content-disposition');
      let filename = `invoice-${invoiceId}.html`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Failed to download invoice. Please try again.');
    }
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    if (!confirm('Mark this invoice as paid?')) {
      return;
    }

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'paid',
          paid_at: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark invoice as paid');
      }

      // Refresh invoices
      await fetchInvoices();
    } catch (err) {
      console.error('Error marking invoice as paid:', err);
      alert('Failed to mark invoice as paid. Please try again.');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusCounts = () => {
    return {
      all: summary.total_count,
      pending: summary.pending_count,
      paid: summary.paid_count,
      overdue: summary.overdue_count,
      cancelled: invoices.filter(i => i.status === 'cancelled').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (error) {
    return (
      <div id="billing-section-error" className={`bg-white rounded-lg shadow-sm border border-red-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-600 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Invoices</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchInvoices}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="billing-section" className={`space-y-6 ${className}`}>
      {/* Header */}
      <div id="billing-header" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Billing & Invoices</h2>
          {onNewInvoice && (
            <button
              onClick={onNewInvoice}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Invoice</span>
            </button>
          )}
        </div>

        {/* Summary Stats */}
        <div id="billing-stats" className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">Total Revenue</div>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(summary.total_amount)}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {summary.total_count} invoices
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-sm text-yellow-600 font-medium">Pending</div>
            <div className="text-2xl font-bold text-yellow-900">
              {formatCurrency(summary.pending_amount)}
            </div>
            <div className="text-xs text-yellow-600 mt-1">
              {summary.pending_count} invoices
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">Paid</div>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(summary.paid_amount)}
            </div>
            <div className="text-xs text-green-600 mt-1">
              {summary.paid_count} invoices
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-sm text-red-600 font-medium">Overdue</div>
            <div className="text-2xl font-bold text-red-900">
              {formatCurrency(summary.overdue_amount)}
            </div>
            <div className="text-xs text-red-600 mt-1">
              {summary.overdue_count} invoices
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div id="billing-filters" className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'paid', 'overdue', 'cancelled'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)} 
              <span className="ml-2 text-xs">({statusCounts[status]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <InvoiceTable
        invoices={invoices}
        loading={loading}
        onViewInvoice={handleViewInvoice}
        onDownloadInvoice={handleDownloadInvoice}
        onMarkAsPaid={handleMarkAsPaid}
        onEditInvoice={onEditInvoice || undefined}
      />

      {/* Quick Actions */}
      {!loading && invoices.length > 0 && (
        <div id="billing-quick-actions" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                const overdue = invoices.filter(i => {
                  if (!i.due_date || i.status === 'paid' || i.status === 'cancelled') return false;
                  return new Date(i.due_date) < new Date();
                });
                if (overdue.length === 0) {
                  alert('No overdue invoices found.');
                  return;
                }
                // In a real app, this would send reminder emails
                alert(`Found ${overdue.length} overdue invoices. Reminder emails would be sent.`);
              }}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Reminders
            </button>
            <button
              onClick={() => {
                const currentMonth = new Date().toISOString().substring(0, 7);
                const monthlyInvoices = invoices.filter(i => 
                  i.created_at.startsWith(currentMonth)
                );
                alert(`Generated ${monthlyInvoices.length} invoices this month totaling ${formatCurrency(monthlyInvoices.reduce((sum, i) => sum + i.total, 0))}`);
              }}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Monthly Report
            </button>
            <button
              onClick={() => {
                const csvContent = generateCSVExport(invoices);
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              }}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to generate CSV export
function generateCSVExport(invoices: Invoice[]): string {
  const headers = ['Invoice Number', 'Date', 'Due Date', 'Amount', 'Tax', 'Total', 'Status', 'Payment Method', 'Paid Date'];
  const rows = invoices.map(invoice => [
    invoice.invoice_number,
    invoice.created_at.split('T')[0],
    invoice.due_date ? invoice.due_date.split('T')[0] : '',
    invoice.amount.toString(),
    invoice.tax.toString(),
    invoice.total.toString(),
    invoice.status,
    invoice.payment_method || '',
    invoice.paid_at ? invoice.paid_at.split('T')[0] : ''
  ]);

  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
}