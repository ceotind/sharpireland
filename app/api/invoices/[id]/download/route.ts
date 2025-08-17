import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../utils/supabase/server';
interface Invoice {
  id: string;
  user_id: string;
  pdf_url?: string;
  invoice_number: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  line_items?: Array<{
    description?: string;
    quantity?: number;
    amount?: number;
  }>;
  amount: number;
  tax: number;
  total: number;
  created_at: string;
  due_date: string;
  paid_at?: string;
  payment_method?: string;
}

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    company?: string;
    [key: string]: unknown; // Allow other properties if they exist
  };
  // Add other properties of the Supabase User object if needed
}

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Get invoice by ID for the user
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }
      console.error('Error fetching invoice:', error);
      return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
    }

    // If PDF URL already exists, redirect to it
    if (invoice.pdf_url) {
      return NextResponse.redirect(invoice.pdf_url);
    }

    // Generate PDF content (simplified HTML-to-PDF approach)
    const pdfContent = generateInvoicePDF(invoice, user);
    
    // In a real implementation, you would:
    // 1. Use a PDF generation library like puppeteer, jsPDF, or PDFKit
    // 2. Store the PDF in cloud storage (S3, Supabase Storage, etc.)
    // 3. Update the invoice record with the PDF URL
    // 4. Return the PDF file or redirect to the stored PDF
    
    // For now, return the HTML content that could be converted to PDF
    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="invoice-${invoice.invoice_number}.html"`
      }
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/invoices/[id]/download:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to generate invoice PDF content
function generateInvoicePDF(invoice: Invoice, user: User): string {
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
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: '#f59e0b',
      paid: '#10b981',
      overdue: '#ef4444',
      cancelled: '#6b7280'
    };
    return `<span style="background-color: ${colors[status as keyof typeof colors] || '#6b7280'}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">${status.toUpperCase()}</span>`;
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoice.invoice_number}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
        }
        .company-info h1 {
            margin: 0;
            color: #1f2937;
            font-size: 28px;
        }
        .company-info p {
            margin: 5px 0;
            color: #6b7280;
        }
        .invoice-info {
            text-align: right;
        }
        .invoice-info h2 {
            margin: 0;
            color: #1f2937;
            font-size: 24px;
        }
        .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        .bill-to, .invoice-meta {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
        }
        .bill-to h3, .invoice-meta h3 {
            margin-top: 0;
            color: #374151;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 10px;
        }
        .line-items {
            margin-bottom: 30px;
        }
        .line-items table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
        }
        .line-items th {
            background: #f3f4f6;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
        }
        .line-items td {
            padding: 15px;
            border-bottom: 1px solid #f3f4f6;
        }
        .line-items tr:last-child td {
            border-bottom: none;
        }
        .totals {
            margin-left: auto;
            width: 300px;
            background: #f9fafb;
            border-radius: 8px;
            padding: 20px;
        }
        .totals table {
            width: 100%;
        }
        .totals td {
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .totals .total-row {
            font-weight: bold;
            font-size: 18px;
            color: #1f2937;
        }
        .totals .total-row td {
            border-top: 2px solid #374151;
            border-bottom: none;
            padding-top: 15px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        .text-right {
            text-align: right;
        }
        @media print {
            body {
                margin: 0;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-info">
            <h1>Sharp Ireland</h1>
            <p>Digital Solutions & Services</p>
            <p>Ireland</p>
        </div>
        <div class="invoice-info">
            <h2>INVOICE</h2>
            <p><strong>${invoice.invoice_number}</strong></p>
            <p>${getStatusBadge(invoice.status)}</p>
        </div>
    </div>

    <div class="invoice-details">
        <div class="bill-to">
            <h3>Bill To</h3>
            <p><strong>${user.user_metadata?.full_name || user.email}</strong></p>
            <p>${user.email}</p>
            ${user.user_metadata?.company ? `<p>${user.user_metadata.company}</p>` : ''}
        </div>
        <div class="invoice-meta">
            <h3>Invoice Details</h3>
            <p><strong>Invoice Date:</strong> ${formatDate(invoice.created_at)}</p>
            <p><strong>Due Date:</strong> ${formatDate(invoice.due_date)}</p>
            ${invoice.paid_at ? `<p><strong>Paid Date:</strong> ${formatDate(invoice.paid_at)}</p>` : ''}
            ${invoice.payment_method ? `<p><strong>Payment Method:</strong> ${invoice.payment_method}</p>` : ''}
        </div>
    </div>

    <div class="line-items">
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="text-right">Quantity</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${(invoice.line_items || []).map((item: { description?: string; quantity?: number; amount?: number }) => `
                    <tr>
                        <td>${item.description || 'Service'}</td>
                        <td class="text-right">${item.quantity || 1}</td>
                        <td class="text-right">${formatCurrency((item.amount || 0) / (item.quantity || 1))}</td>
                        <td class="text-right">${formatCurrency(item.amount || 0)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="totals">
        <table>
            <tr>
                <td>Subtotal:</td>
                <td class="text-right">${formatCurrency(invoice.amount)}</td>
            </tr>
            <tr>
                <td>Tax:</td>
                <td class="text-right">${formatCurrency(invoice.tax)}</td>
            </tr>
            <tr class="total-row">
                <td>Total:</td>
                <td class="text-right">${formatCurrency(invoice.total)}</td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <p>Thank you for your business!</p>
        <p>This invoice was generated on ${formatDate(new Date().toISOString())}</p>
    </div>
</body>
</html>
  `;
}