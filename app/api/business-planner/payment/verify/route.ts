/**
 * Business Planner Payment Verification API Endpoint
 * Handles admin verification of wire transfer payments
 * 
 * @fileoverview Payment verification endpoint for admin use
 * @author Sharp Ireland Development Team
 * @date 2025-08-13
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { 
  BusinessPlannerPayment,
  BusinessPlannerUsage,
  BusinessPlannerApiResponse
} from '@/app/types/business-planner';
import { 
  ERROR_CODES
} from '@/app/utils/business-planner/constants';
import { 
  validatePaymentReference,
  calculateConversations
} from '@/app/utils/business-planner/payment';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if user has admin privileges
 * @param supabase - Supabase client
 * @param userId - User ID to check
 * @returns Whether user is admin
 */
async function isAdmin(supabase: SupabaseClient): Promise<boolean> {
  try {
    // Check if user has admin role in profiles table or similar
    // For now, we'll check if user email is in admin list
    const { data: user, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return false;
    }
    
    // Define admin emails (in production, this should be in environment variables or database)
    const adminEmails = [
      'admin@sharpireland.com',
      'billing@sharpireland.com',
      'finance@sharpireland.com'
    ];
    
    return adminEmails.includes(user.user?.email || '');
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Get payment by reference
 * @param supabase - Supabase client
 * @param paymentReference - Payment reference to find
 * @returns Payment record or null
 */
async function getPaymentByReference(
  supabase: SupabaseClient,
  paymentReference: string
): Promise<BusinessPlannerPayment | null> {
  try {
    const { data: payment, error } = await supabase
      .from('business_planner_payments')
      .select('*')
      .eq('payment_reference', paymentReference)
      .single();
    
    if (error) {
      console.error('Error fetching payment by reference:', error);
      return null;
    }
    
    return payment;
  } catch (error) {
    console.error('Unexpected error in getPaymentByReference:', error);
    return null;
  }
}

/**
 * Update payment status to completed
 * @param supabase - Supabase client
 * @param paymentId - Payment ID to update
 * @returns Updated payment record
 */
async function completePayment(
  supabase: SupabaseClient,
  paymentId: string
): Promise<BusinessPlannerPayment | null> {
  try {
    const { data: updatedPayment, error } = await supabase
      .from('business_planner_payments')
      .update({
        payment_status: 'completed',
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating payment status:', error);
      return null;
    }
    
    return updatedPayment;
  } catch (error) {
    console.error('Unexpected error in completePayment:', error);
    return null;
  }
}

/**
 * Credit user's account with purchased conversations
 * @param supabase - Supabase client
 * @param userId - User ID to credit
 * @param conversations - Number of conversations to add
 * @returns Updated usage record
 */
async function creditUserAccount(
  supabase: SupabaseClient,
  userId: string,
  conversationsToAdd: number
): Promise<BusinessPlannerUsage | null> {
  try {
    // Get or create usage record
    let usage: BusinessPlannerUsage | null;
    const { data, error: fetchError } = await supabase
      .from('business_planner_usage')
      .select('*')
      .eq('user_id', userId)
      .single();
    usage = data;
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching usage record:', fetchError);
      return null;
    }
    
    // Create usage record if it doesn't exist
    if (!usage) {
      const newUsage = {
        user_id: userId,
        free_conversations_used: 0,
        paid_conversations_used: conversationsToAdd, // Initialize with conversationsToAdd
        total_tokens_used: 0,
        last_reset_date: new Date().toISOString().split('T')[0],
        subscription_status: 'paid'
      };
      
      const { data: createdUsage, error: createError } = await supabase
        .from('business_planner_usage')
        .insert(newUsage)
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating usage record:', createError);
        return null;
      }
      
      usage = createdUsage;
    } else {
      // Update existing usage record with paid subscription and add conversations
      const { data: updatedUsage, error: updateError } = await supabase
        .from('business_planner_usage')
        .update({
          subscription_status: 'paid',
          paid_conversations_used: usage.paid_conversations_used + conversationsToAdd, // Add conversations
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating usage record:', updateError);
        return null;
      }
      
      usage = updatedUsage; // Update usage with the newly updated record
    }
    
    return usage; // Return the updated usage
  } catch (error: unknown) {
    console.error('Unexpected error in creditUserAccount:', error);
    return null;
  }
}

/**
 * Log payment verification activity
 * @param supabase - Supabase client
 * @param adminUserId - Admin user ID who verified
 * @param paymentId - Payment ID that was verified
 * @param action - Action taken ('verified' or 'rejected')
 */
async function logVerificationActivity(
  adminUserId: string,
  paymentId: string,
  action: 'verified' | 'rejected'
): Promise<void> {
  try {
    // In a production system, you might want to log this to an audit table
    console.log(`Payment verification: Admin ${adminUserId} ${action} payment ${paymentId} at ${new Date().toISOString()}`);
    
    // Could insert into an audit log table here
    // await supabase.from('payment_audit_log').insert({...})
  } catch (error) {
    console.error('Error logging verification activity:', error);
  }
}

// =============================================================================
// API HANDLERS
// =============================================================================

/**
 * POST /api/business-planner/payment/verify - Verify wire transfer payment
 */
export async function POST(request: NextRequest): Promise<NextResponse<BusinessPlannerApiResponse<{
  payment: BusinessPlannerPayment;
  usage: BusinessPlannerUsage;
  conversations_credited: number;
}>>> {
  try {
    const supabase = await createClient();
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { 
          error: {
            code: ERROR_CODES.UNAUTHORIZED,
            message: 'Authentication required',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      );
    }
    
    // Check admin privileges
    const userIsAdmin = await isAdmin(supabase);
    
    if (!userIsAdmin) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.FORBIDDEN,
            message: 'Admin privileges required for payment verification',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 403 }
      );
    }
    
    // Parse request body
    let requestData: { 
      payment_reference: string;
      action: 'verify' | 'reject';
      notes?: string;
    };
    
    try {
      requestData = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Invalid JSON in request body',
            details: {},
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!requestData.payment_reference || !requestData.action) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Payment reference and action are required',
            details: { 
              required: ['payment_reference', 'action'],
              allowedActions: ['verify', 'reject']
            },
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    // Validate payment reference format
    if (!validatePaymentReference(requestData.payment_reference)) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Invalid payment reference format',
            details: { 
              expected_format: 'BP-YYYYMMDD-XXXX',
              received: requestData.payment_reference
            },
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    // Validate action
    if (!['verify', 'reject'].includes(requestData.action)) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_INPUT,
            message: 'Invalid action',
            details: { allowedActions: ['verify', 'reject'] },
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    // Find payment by reference
    const payment = await getPaymentByReference(supabase, requestData.payment_reference);
    
    if (!payment) {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: 'Payment not found',
            details: { payment_reference: requestData.payment_reference },
            timestamp: new Date().toISOString()
          }
        },
        { status: 404 }
      );
    }
    
    // Check if payment is already processed
    if (payment.payment_status === 'completed') {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_PAYMENT,
            message: 'Payment has already been verified',
            details: { 
              current_status: payment.payment_status,
              paid_at: payment.paid_at
            },
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    if (payment.payment_status === 'failed') {
      return NextResponse.json(
        {
          error: {
            code: ERROR_CODES.INVALID_PAYMENT,
            message: 'Payment has already been rejected',
            details: { current_status: payment.payment_status },
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }
    
    let updatedPayment: BusinessPlannerPayment;
    let updatedUsage: BusinessPlannerUsage | null = null;
    let conversationsCredited = 0;
    let message = '';
    
    if (requestData.action === 'verify') {
      // Complete the payment
      const completedPayment = await completePayment(supabase, payment.id);
      
      if (!completedPayment) {
        return NextResponse.json(
          {
            error: {
              code: ERROR_CODES.DATABASE_ERROR,
              message: 'Failed to update payment status',
              details: {},
              timestamp: new Date().toISOString()
            }
          },
          { status: 500 }
        );
      }
      
      // Credit user's account
      conversationsCredited = calculateConversations(payment.amount);
      updatedUsage = await creditUserAccount(supabase, payment.user_id, conversationsCredited);
      
      if (!updatedUsage) {
        // Rollback payment status if crediting fails
        await supabase
          .from('business_planner_payments')
          .update({ payment_status: 'pending' })
          .eq('id', payment.id);
        
        return NextResponse.json(
          {
            error: {
              code: ERROR_CODES.DATABASE_ERROR,
              message: 'Failed to credit user account',
              details: {},
              timestamp: new Date().toISOString()
            }
          },
          { status: 500 }
        );
      }
      
      updatedPayment = completedPayment;
      message = 'Payment verified and user account credited successfully';
      
      // Log verification activity
      await logVerificationActivity(user.id, payment.id, 'verified');
      
    } else { // action === 'reject'
      // Mark payment as failed
      const { data: rejectedPayment, error: rejectError } = await supabase
        .from('business_planner_payments')
        .update({
          payment_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.id)
        .select()
        .single();
      
      if (rejectError) {
        return NextResponse.json(
          {
            error: {
              code: ERROR_CODES.DATABASE_ERROR,
              message: 'Failed to reject payment',
              details: {},
              timestamp: new Date().toISOString()
            }
          },
          { status: 500 }
        );
      }
      
      updatedPayment = rejectedPayment;
      message = 'Payment rejected successfully';
      
      // Log rejection activity
      await logVerificationActivity(user.id, payment.id, 'rejected');
    }
    
    return NextResponse.json({
      data: {
        payment: updatedPayment,
        usage: updatedUsage!,
        conversations_credited: conversationsCredited
      },
      message,
      meta: {
        timestamp: new Date().toISOString(),
        request_id: `payment_verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    });
    
  } catch (error: unknown) {
    console.error('Unexpected error in POST /api/business-planner/payment/verify:', error);
    
    return NextResponse.json(
      {
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Internal server error',
          details: {},
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// METHOD NOT ALLOWED HANDLERS
// =============================================================================

/**
 * Handle unsupported HTTP methods
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'GET method not supported for this endpoint',
        details: { allowedMethods: ['POST'] },
        timestamp: new Date().toISOString()
      }
    },
    { status: 405 }
  );
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'PUT method not supported for this endpoint',
        details: { allowedMethods: ['POST'] },
        timestamp: new Date().toISOString()
      }
    },
    { status: 405 }
  );
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'DELETE method not supported for this endpoint',
        details: { allowedMethods: ['POST'] },
        timestamp: new Date().toISOString()
      }
    },
    { status: 405 }
  );
}