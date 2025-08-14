'use client';

import React, { useState } from 'react';
import { Invoice } from '../../types/dashboard';

interface InvoiceTableProps {
  invoices: Invoice[];
  loading?: boolean;
  onViewInvoice?: (invoiceId: string) => void;
  onDownloadInvoice?: (invoiceId: string) => void;
  onMarkAsPaid?: (invoiceId: string) => void;
  onEditInvoice?: (invoice: Invoice) => void;
}

export default function InvoiceTable({
  invoices,
  loading = false,
  onViewInvoice,
  onDownloadInvoice,
  onMarkAsPaid,
  onEditInvoice
}: InvoiceTableProps) {
  const [sortField, setSortField] = useState<keyof Invoice>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Invoice) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    let comparison = 0;
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      comparison = aValue - bValue;
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (invoice: Invoice) => {
    if (!invoice.due_date || invoice.status === 'paid' || invoice.status === 'cancelled') {
      return false;
    }
    return new Date(invoice.due_date) < new Date();
  };

  const SortIcon = ({ field }: { field: keyof Invoice }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div id="invoice-table-loading" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div id="invoice-table-empty" className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
        <p className="text-gray-600">Invoices will appear here once they are created.</p>
      </div>
    );
  }

  return (
    <div id="invoice-table" className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                id="invoice-header-number"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('invoice_number')}
              >
                <div className="flex items-center space-x-1">
                  <span>Invoice #</span>
                  <SortIcon field="invoice_number" />
                </div>
              </th>
              <th 
                id="invoice-header-date"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <SortIcon field="created_at" />
                </div>
              </th>
              <th 
                id="invoice-header-due-date"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('due_date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Due Date</span>
                  <SortIcon field="due_date" />
                </div>
              </th>
              <th 
                id="invoice-header-amount"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('total')}
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  <SortIcon field="total" />
                </div>
              </th>
              <th 
                id="invoice-header-status"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <SortIcon field="status" />
                </div>
              </th>
              <th id="invoice-header-actions" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedInvoices.map((invoice) => (
              <tr 
                key={invoice.id}
                id={`invoice-row-${invoice.id}`}
                className={`hover:bg-gray-50 ${isOverdue(invoice) ? 'bg-red-50' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.invoice_number}
                    </div>
                    {isOverdue(invoice) && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Overdue
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(invoice.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={isOverdue(invoice) ? 'text-red-600 font-medium' : ''}>
                    {formatDate(invoice.due_date)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(invoice.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                    {invoice.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div id={`invoice-actions-${invoice.id}`} className="flex items-center justify-end space-x-2">
                    {onViewInvoice && (
                      <button
                        onClick={() => onViewInvoice(invoice.id)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View Invoice"
                      >
                        View
                      </button>
                    )}
                    {onDownloadInvoice && (
                      <button
                        onClick={() => onDownloadInvoice(invoice.id)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Download Invoice"
                      >
                        Download
                      </button>
                    )}
                    {onMarkAsPaid && invoice.status === 'pending' && (
                      <button
                        onClick={() => onMarkAsPaid(invoice.id)}
                        className="text-purple-600 hover:text-purple-900 transition-colors"
                        title="Mark as Paid"
                      >
                        Mark Paid
                      </button>
                    )}
                    {onEditInvoice && invoice.status !== 'paid' && (
                      <button
                        onClick={() => onEditInvoice(invoice)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="Edit Invoice"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}