import { createClient } from './supabase/server';
import { ActivityLogData } from '../types/dashboard';

/**
 * Activity Logger Utility
 * Logs user activities to the activity_logs table for audit and tracking purposes
 */

interface LogActivityOptions {
  userId?: string;
  ipAddress?: string | undefined;
  userAgent?: string | undefined;
}

/**
 * Log an activity to the database
 * @param activityData - The activity data to log
 * @param options - Additional options like userId, IP address, user agent
 */
export async function logActivity(
  activityData: ActivityLogData,
  options: LogActivityOptions = {}
): Promise<void> {
  try {
    const supabase = await createClient();
    
    let userId = options.userId;
    
    // If userId is not provided, try to get it from the current session
    if (!userId) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.warn('Could not get user for activity logging:', error?.message);
        return;
      }
      userId = user.id;
    }

    // Prepare the activity log entry
    const logEntry = {
      user_id: userId,
      action: activityData.action,
      entity_type: activityData.entity_type || null,
      entity_id: activityData.entity_id || null,
      description: activityData.description || null,
      metadata: activityData.metadata || null,
      ip_address: options.ipAddress || null,
      user_agent: options.userAgent || null,
    };

    // Insert the activity log
    const { error: insertError } = await supabase
      .from('activity_logs')
      .insert(logEntry);

    if (insertError) {
      console.error('Error logging activity:', insertError);
    }
  } catch (error) {
    console.error('Unexpected error in logActivity:', error);
  }
}

/**
 * Log authentication activities
 */
export const AuthActivityLogger = {
  async logLogin(userId: string, provider: string, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'auth.login',
        description: `User logged in via ${provider}`,
        metadata: { provider }
      },
      { userId, ipAddress, userAgent }
    );
  },

  async logLogout(userId: string, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'auth.logout',
        description: 'User logged out'
      },
      { userId, ipAddress, userAgent }
    );
  },

  async logPasswordChange(userId: string, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'auth.password_change',
        description: 'User changed password'
      },
      { userId, ipAddress, userAgent }
    );
  },

  async logPasswordReset(userId: string, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'auth.password_reset',
        description: 'User reset password'
      },
      { userId, ipAddress, userAgent }
    );
  }
};

/**
 * Log profile activities
 */
export const ProfileActivityLogger = {
  async logProfileUpdate(userId: string, updatedFields: string[], ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'profile.update',
        entity_type: 'profile',
        entity_id: userId,
        description: `Profile updated: ${updatedFields.join(', ')}`,
        metadata: { updated_fields: updatedFields }
      },
      { userId, ipAddress, userAgent }
    );
  },

  async logAvatarUpload(userId: string, filename: string, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'profile.avatar_upload',
        entity_type: 'profile',
        entity_id: userId,
        description: 'Avatar uploaded',
        metadata: { filename }
      },
      { userId, ipAddress, userAgent }
    );
  },

  async logAvatarRemove(userId: string, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'profile.avatar_remove',
        entity_type: 'profile',
        entity_id: userId,
        description: 'Avatar removed'
      },
      { userId, ipAddress, userAgent }
    );
  }
};

/**
 * Log project activities
 */
export const ProjectActivityLogger = {
  async logProjectCreate(userId: string, projectId: string, projectName: string, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'project.create',
        entity_type: 'project',
        entity_id: projectId,
        description: `Created project: ${projectName}`,
        metadata: { project_name: projectName }
      },
      { userId, ipAddress, userAgent }
    );
  },

  async logProjectUpdate(userId: string, projectId: string, projectName: string, updatedFields: string[], ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'project.update',
        entity_type: 'project',
        entity_id: projectId,
        description: `Updated project: ${projectName}`,
        metadata: { project_name: projectName, updated_fields: updatedFields }
      },
      { userId, ipAddress, userAgent }
    );
  },

  async logProjectDelete(userId: string, projectId: string, projectName: string, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'project.delete',
        entity_type: 'project',
        entity_id: projectId,
        description: `Deleted project: ${projectName}`,
        metadata: { project_name: projectName }
      },
      { userId, ipAddress, userAgent }
    );
  },

  async logProjectStatusChange(userId: string, projectId: string, projectName: string, oldStatus: string, newStatus: string, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'project.status_change',
        entity_type: 'project',
        entity_id: projectId,
        description: `Changed project status from ${oldStatus} to ${newStatus}: ${projectName}`,
        metadata: { project_name: projectName, old_status: oldStatus, new_status: newStatus }
      },
      { userId, ipAddress, userAgent }
    );
  }
};

/**
 * Log billing activities
 */
export const BillingActivityLogger = {
  async logInvoiceGenerated(userId: string, invoiceId: string, amount: number, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'billing.invoice_generated',
        entity_type: 'invoice',
        entity_id: invoiceId,
        description: `Invoice generated for $${amount}`,
        metadata: { amount }
      },
      { userId, ipAddress, userAgent }
    );
  },

  async logPaymentProcessed(userId: string, invoiceId: string, amount: number, paymentMethod: string, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'billing.payment_processed',
        entity_type: 'invoice',
        entity_id: invoiceId,
        description: `Payment processed for $${amount} via ${paymentMethod}`,
        metadata: { amount, payment_method: paymentMethod }
      },
      { userId, ipAddress, userAgent }
    );
  },

  async logSubscriptionChange(userId: string, subscriptionId: string, action: 'created' | 'updated' | 'cancelled', planName: string, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: `billing.subscription_${action}`,
        entity_type: 'subscription',
        entity_id: subscriptionId,
        description: `Subscription ${action}: ${planName}`,
        metadata: { plan_name: planName }
      },
      { userId, ipAddress, userAgent }
    );
  }
};

/**
 * Log security activities
 */
export const SecurityActivityLogger = {
  async logFailedLogin(email: string, reason: string, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'security.failed_login',
        description: `Failed login attempt for ${email}: ${reason}`,
        metadata: { email, reason }
      },
      { ipAddress, userAgent }
    );
  },

  async logSuspiciousActivity(userId: string, activityType: string, details: string, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'security.suspicious_activity',
        description: `Suspicious activity detected: ${activityType} - ${details}`,
        metadata: { activity_type: activityType, details }
      },
      { userId, ipAddress, userAgent }
    );
  },

  async logAccountLocked(userId: string, reason: string, ipAddress?: string, userAgent?: string) {
    await logActivity(
      {
        action: 'security.account_locked',
        description: `Account locked: ${reason}`,
        metadata: { reason }
      },
      { userId, ipAddress, userAgent }
    );
  }
};

/**
 * Helper function to extract IP address and User Agent from Next.js request
 */
export function getRequestInfo(request: Request) {
  const ipAddress = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return { ipAddress, userAgent };
}

/**
 * Get recent activity logs for a user
 */
export async function getRecentActivity(userId: string, limit: number = 10) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getRecentActivity:', error);
    return [];
  }
}