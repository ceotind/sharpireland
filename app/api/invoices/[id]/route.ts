import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { BillingActivityLogger } from '../../../utils/activity-logger';
interface InvoiceUpdateData {
  status?: string;
  payment_method?: string;
  paid_at?: string | null;
  due_date?: string | null;
  line_items?: Array<{ [key: string]: unknown }>;
  amount?: number;
  tax?: number;
  total?: number;
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

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error('Unexpected error in GET /api/invoices/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
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
    const body = await request.json();
    const {
      status,
      payment_method,
      paid_at,
      due_date,
      line_items,
      amount,
      tax
    } = body;

    // Get current invoice to check ownership
    const { data: currentInvoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }
      console.error('Error fetching invoice for update:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
    }

    // Prepare update data
    const updateData: InvoiceUpdateData = {};
    const updatedFields: string[] = [];

    if (status !== undefined && status !== currentInvoice.status) {
      updateData.status = status;
      updatedFields.push('status');
      
      // If marking as paid, set paid_at timestamp
      if (status === 'paid' && !currentInvoice.paid_at) {
        updateData.paid_at = new Date().toISOString();
        updatedFields.push('paid_at');
      }
    }

    if (payment_method !== undefined && payment_method !== currentInvoice.payment_method) {
      updateData.payment_method = payment_method;
      updatedFields.push('payment_method');
    }

    if (paid_at !== undefined) {
      const newPaidAt = paid_at ? new Date(paid_at).toISOString() : null;
      if (newPaidAt !== currentInvoice.paid_at) {
        updateData.paid_at = newPaidAt;
        updatedFields.push('paid_at');
      }
    }

    if (due_date !== undefined) {
      const newDueDate = due_date ? new Date(due_date).toISOString() : null;
      if (newDueDate !== currentInvoice.due_date) {
        updateData.due_date = newDueDate;
        updatedFields.push('due_date');
      }
    }

    if (line_items !== undefined) {
      updateData.line_items = line_items;
      updatedFields.push('line_items');
    }

    // Recalculate total if amount or tax changed
    if (amount !== undefined || tax !== undefined) {
      const newAmount = amount !== undefined ? amount : currentInvoice.amount;
      const newTax = tax !== undefined ? tax : currentInvoice.tax;
      
      if (newAmount !== currentInvoice.amount) {
        updateData.amount = newAmount;
        updatedFields.push('amount');
      }
      if (newTax !== currentInvoice.tax) {
        updateData.tax = newTax;
        updatedFields.push('tax');
      }
      
      const newTotal = newAmount + newTax;
      if (newTotal !== currentInvoice.total) {
        updateData.total = newTotal;
        updatedFields.push('total');
      }
    }

    // If no fields to update, return current invoice
    if (updatedFields.length === 0) {
      return NextResponse.json({ invoice: currentInvoice });
    }

    // Update invoice
    const { data: updatedInvoice, error: updateError } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating invoice:', updateError);
      return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
    }

    // Log activity for payment status changes
    if (updatedFields.includes('status') && updateData.status === 'paid') {
      await BillingActivityLogger.logPaymentProcessed(
        user.id,
        id,
        updatedInvoice.total,
        updateData.payment_method || 'unknown'
      );
    }

    return NextResponse.json({ invoice: updatedInvoice });
  } catch (error) {
    console.error('Unexpected error in PUT /api/invoices/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
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

    // Get invoice to check ownership and status
    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }
      console.error('Error fetching invoice for deletion:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
    }

    // Don't allow deletion of paid invoices
    if (invoice.status === 'paid') {
      return NextResponse.json(
        { error: 'Cannot delete paid invoices' },
        { status: 400 }
      );
    }

    // Instead of hard delete, mark as cancelled
    const { data: cancelledInvoice, error: cancelError } = await supabase
      .from('invoices')
      .update({
        status: 'cancelled'
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (cancelError) {
      console.error('Error cancelling invoice:', cancelError);
      return NextResponse.json({ error: 'Failed to cancel invoice' }, { status: 500 });
    }

    return NextResponse.json({ 
      invoice: cancelledInvoice,
      message: 'Invoice cancelled successfully' 
    });
  } catch (error) {
    console.error('Unexpected error in DELETE /api/invoices/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}