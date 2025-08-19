import { createClient } from '../app/utils/supabase/server';

/**
 * Script to reset or update free conversation credits for a user
 * Usage: 
 * - Reset to 0: await resetFreeConversations(userId)
 * - Set to specific value: await resetFreeConversations(userId, 10)
 */

async function resetFreeConversations(userId: string, newValue: number = 0): Promise<void> {
  const supabase = await createClient();
  
  try {
    // Check if usage record exists
    const { data: existingUsage, error: fetchError } = await supabase
      .from('business_planner_usage')
      .select('id')
      .eq('user_id', userId)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking for existing usage record:', fetchError);
      throw fetchError;
    }
    
    if (!existingUsage) {
      // Create new usage record with the specified free conversation count
      const { error: createError } = await supabase
        .from('business_planner_usage')
        .insert({
          user_id: userId,
          free_conversations_used: newValue,
          paid_conversations_used: 0,
          total_tokens_used: 0,
          last_reset_date: new Date().toISOString().split('T')[0],
          subscription_status: 'free'
        });
        
      if (createError) {
        console.error('Error creating usage record:', createError);
        throw createError;
      }
      
      console.log(`Created new usage record for user ${userId} with ${newValue} free conversations`);
    } else {
      // Update existing usage record
      const { error: updateError } = await supabase
        .from('business_planner_usage')
        .update({ free_conversations_used: newValue })
        .eq('user_id', userId);
        
      if (updateError) {
        console.error('Error updating usage record:', updateError);
        throw updateError;
      }
      
      console.log(`Updated user ${userId} free conversations to ${newValue}`);
    }
  } catch (error) {
    console.error('Unexpected error in resetFreeConversations:', error);
    throw error;
  }
}

// Example usage:
// Reset a user's free conversations to 10
// await resetFreeConversations('user-123', 10);

// Reset a user's free conversations to 0
// await resetFreeConversations('user-123');

export { resetFreeConversations };