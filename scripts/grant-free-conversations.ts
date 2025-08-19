import { createClient } from '../app/utils/supabase/server';

/**
 * Script to grant free conversation credits to a user
 * This increments the user's free_conversations_used allowance
 *
 * @param userId - The user's ID (obtained from Supabase auth session or database queries)
 * @param conversationsToAdd - Number of free conversations to grant (default: 10)
 * @returns Promise<void>
 *
 * Usage:
 * - Grant 10 conversations: await grantFreeConversations(userId)
 * - Grant specific amount: await grantFreeConversations(userId, 5)
 *
 * Getting the userId:
 * 1. From authenticated session in API routes:
 *    const { data: { user } } = await supabase.auth.getUser();
 *    const userId = user?.id;
 *
 * 2. From database queries:
 *    // Query the auth.users table directly (requires proper permissions)
 *    const { data: authUsers } = await supabase.auth.admin.listUsers();
 *
 *    // Query the profiles table (if you need additional user info)
 *    const { data: profiles } = await supabase.from('profiles').select('id, username, full_name');
 *
 *    // Query business planner usage table to find users with specific criteria
 *    const { data: usageRecords } = await supabase.from('business_planner_usage').select('user_id, free_conversations_used');
 *
 * 3. From API request parameters (ensure proper authentication/authorization):
 *    const userId = request.nextUrl.searchParams.get('userId');
 *
 * Database Structure:
 * - Primary user identity: auth.users table (managed by Supabase Auth)
 * - User profiles: profiles table (id references auth.users)
 * - Business planner data: business_planner_usage table (user_id references auth.users)
 *
 * Note: Direct access to auth.users requires admin privileges. For most use cases,
 * use the authenticated user's ID from the session or query application-level tables
 * like profiles or business_planner_usage that contain the user_id.
 */
async function grantFreeConversations(userId: string, conversationsToAdd: number = 10): Promise<void> {
  const supabase = await createClient();
  
  try {
    // Check if usage record exists
    const { data: existingUsage, error: fetchError } = await supabase
      .from('business_planner_usage')
      .select('id, free_conversations_used')
      .eq('user_id', userId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking for existing usage record:', fetchError);
      throw fetchError;
    }
    
    if (!existingUsage) {
      // Create new usage record with the granted conversations
      const { error: createError } = await supabase
        .from('business_planner_usage')
        .insert({
          user_id: userId,
          free_conversations_used: conversationsToAdd,
          paid_conversations_used: 0,
          total_tokens_used: 0,
          last_reset_date: new Date().toISOString().split('T')[0],
          subscription_status: 'free'
        });
        
      if (createError) {
        console.error('Error creating usage record:', createError);
        throw createError;
      }
      
      console.log(`Created new usage record for user ${userId} with ${conversationsToAdd} granted free conversations`);
    } else {
      // Update existing record by adding to current free_conversations_used
      const { error: updateError } = await supabase
        .from('business_planner_usage')
        .update({ 
          free_conversations_used: existingUsage.free_conversations_used + conversationsToAdd 
        })
        .eq('user_id', userId);
        
      if (updateError) {
        console.error('Error updating usage record:', updateError);
        throw updateError;
      }
      
      console.log(`Granted ${conversationsToAdd} free conversations to user ${userId}. New total: ${existingUsage.free_conversations_used + conversationsToAdd}`);
    }
  } catch (error) {
    console.error('Unexpected error in grantFreeConversations:', error);
    throw error;
  }
}

// Example usage:
// Grant 10 free conversations to a user
// await grantFreeConversations('user-123');

// Grant 5 free conversations to a user
// await grantFreeConversations('user-123', 5);

export { grantFreeConversations };