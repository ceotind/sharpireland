import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Build query
    let query = supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id);

    // Apply status filter if provided
    if (status && ['pending', 'paid', 'overdue', 'cancelled'].includes(status)) {
      query = query.eq('status', status);
    }

    // Apply date range filter if provided
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Apply pagination and ordering
    const { data: invoices, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching invoices:', error);
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (status && ['pending', 'paid', 'overdue', 'cancelled'].includes(status)) {
      countQuery = countQuery.eq('status', status);
    }
    if (startDate) {
      countQuery = countQuery.gte('created_at', startDate);
    }
    if (endDate) {
      countQuery = countQuery.lte('created_at', endDate);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Error counting invoices:', countError);
      return NextResponse.json({ error: 'Failed to count invoices' }, { status: 500 });
    }

    // Calculate summary statistics
    const { data: summaryData, error: summaryError } = await supabase
      .from('invoices')
      .select('status, total')
      .eq('user_id', user.id);

    let summary = {
      total_amount: 0,
      pending_amount: 0,
      paid_amount: 0,
      overdue_amount: 0,
      total_count: 0,
      pending_count: 0,
      paid_count: 0,
      overdue_count: 0
    };

    if (!summaryError && summaryData) {
      summary = summaryData.reduce((acc: any, invoice: any) => {
        acc.total_amount += invoice.total || 0;
        acc.total_count += 1;
        
        switch (invoice.status) {
          case 'pending':
            acc.pending_amount += invoice.total || 0;
            acc.pending_count += 1;
            break;
          case 'paid':
            acc.paid_amount += invoice.total || 0;
            acc.paid_count += 1;
            break;
          case 'overdue':
            acc.overdue_amount += invoice.total || 0;
            acc.overdue_count += 1;
            break;
        }
        
        return acc;
      }, summary);
    }

    return NextResponse.json({
      invoices,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      },
      summary
    });
  } catch (error) {
    console.error('Unexpected error in GET /api/invoices:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      amount,
      tax = 0,
      due_date,
      line_items,
      payment_method,
      description
    } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount is required and must be greater than 0' },
        { status: 400 }
      );
    }

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber(supabase, user.id);

    const total = amount + tax;

    // Create new invoice
    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        invoice_number: invoiceNumber,
        amount,
        tax,
        total,
        status: 'pending',
        due_date: due_date ? new Date(due_date).toISOString() : null,
        payment_method,
        line_items: line_items || [
          {
            description: description || 'Service charge',
            amount: amount,
            quantity: 1
          }
        ],
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating invoice:', error);
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
    }

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/invoices:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to generate unique invoice number
async function generateInvoiceNumber(supabase: any, userId: string): Promise<string> {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  // Get count of invoices for this user this month
  const { count } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', `${year}-${month}-01`)
    .lt('created_at', `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01`);

  const sequence = String((count || 0) + 1).padStart(4, '0');
  return `INV-${year}${month}-${sequence}`;
}