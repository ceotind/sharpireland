import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/app/utils/supabase/server';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
    security: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'team';
    activityTracking: boolean;
    dataCollection: boolean;
  };
  dashboard: {
    defaultView: string;
    itemsPerPage: number;
    showTutorials: boolean;
  };
}

interface ProfileUpdatePayload {
  preferences: UserPreferences;
  updated_at: string;
  timezone?: string;
  language?: string;
  email_notifications?: boolean;
  marketing_emails?: boolean;
}

/**
 * GET /api/user/preferences
 *
 * Get user preferences
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user preferences from database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        timezone,
        language,
        email_notifications,
        marketing_emails,
        preferences
      `)
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500 }
      );
    }

    // Default preferences
    const defaultPreferences: UserPreferences = {
      theme: 'system',
      language: profile?.language || 'en',
      timezone: profile?.timezone || 'UTC',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      notifications: {
        email: profile?.email_notifications ?? true,
        push: true,
        marketing: profile?.marketing_emails ?? false,
        security: true
      },
      privacy: {
        profileVisibility: 'team',
        activityTracking: true,
        dataCollection: true
      },
      dashboard: {
        defaultView: 'overview',
        itemsPerPage: 25,
        showTutorials: true
      }
    };

    // Merge with stored preferences
    const storedPreferences = profile?.preferences || {};
    const preferences = {
      ...defaultPreferences,
      ...storedPreferences,
      notifications: {
        ...defaultPreferences.notifications,
        ...storedPreferences.notifications
      },
      privacy: {
        ...defaultPreferences.privacy,
        ...storedPreferences.privacy
      },
      dashboard: {
        ...defaultPreferences.dashboard,
        ...storedPreferences.dashboard
      }
    };

    return NextResponse.json(preferences);

  } catch (error) {
    console.error('Preferences API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/preferences
 * 
 * Update user preferences
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const preferences: UserPreferences = await request.json();

    // Validate preferences structure
    const validationError = validatePreferences(preferences);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    // Update profile with basic preferences
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        timezone: preferences.timezone,
        language: preferences.language,
        email_notifications: preferences.notifications.email,
        marketing_emails: preferences.notifications.marketing,
        preferences: preferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('Error updating user preferences:', profileError);
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500 }
      );
    }

    // Log activity
    try {
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action: 'preferences_updated',
          entity_type: 'user_preferences',
          entity_id: user.id,
          description: 'User updated their preferences',
          metadata: {
            updated_fields: Object.keys(preferences),
            timestamp: new Date().toISOString()
          }
        });
    } catch (logError) {
      console.error('Error logging activity:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      message: 'Preferences updated successfully',
      preferences
    });

  } catch (error) {
    console.error('Preferences update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/preferences
 * 
 * Partially update user preferences
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const partialPreferences = await request.json();

    // Get current preferences
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('preferences, timezone, language, email_notifications, marketing_emails')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching current preferences:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch current preferences' },
        { status: 500 }
      );
    }

    // Merge with existing preferences
    const currentPreferences = profile?.preferences || {};
    const updatedPreferences = deepMerge(currentPreferences, partialPreferences);

    // Update profile
    const updateData: ProfileUpdatePayload = {
      preferences: updatedPreferences,
      updated_at: new Date().toISOString()
    };

    // Update basic fields if provided
    if (partialPreferences.timezone) {
      updateData.timezone = partialPreferences.timezone;
    }
    if (partialPreferences.language) {
      updateData.language = partialPreferences.language;
    }
    if (partialPreferences.notifications?.email !== undefined) {
      updateData.email_notifications = partialPreferences.notifications.email;
    }
    if (partialPreferences.notifications?.marketing !== undefined) {
      updateData.marketing_emails = partialPreferences.notifications.marketing;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating preferences:', updateError);
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Preferences updated successfully',
      preferences: updatedPreferences
    });

  } catch (error) {
    console.error('Preferences patch API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/preferences
 * 
 * Reset user preferences to defaults
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Reset to default preferences
    const defaultPreferences: UserPreferences = {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      notifications: {
        email: true,
        push: true,
        marketing: false,
        security: true
      },
      privacy: {
        profileVisibility: 'team',
        activityTracking: true,
        dataCollection: true
      },
      dashboard: {
        defaultView: 'overview',
        itemsPerPage: 25,
        showTutorials: true
      }
    };

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        timezone: defaultPreferences.timezone,
        language: defaultPreferences.language,
        email_notifications: defaultPreferences.notifications.email,
        marketing_emails: defaultPreferences.notifications.marketing,
        preferences: defaultPreferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error resetting preferences:', updateError);
      return NextResponse.json(
        { error: 'Failed to reset preferences' },
        { status: 500 }
      );
    }

    // Log activity
    try {
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action: 'preferences_reset',
          entity_type: 'user_preferences',
          entity_id: user.id,
          description: 'User reset their preferences to defaults',
          metadata: {
            timestamp: new Date().toISOString()
          }
        });
    } catch (logError) {
      console.error('Error logging activity:', logError);
    }

    return NextResponse.json({
      message: 'Preferences reset to defaults',
      preferences: defaultPreferences
    });

  } catch (error: unknown) {
    console.error('Preferences reset API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Validate preferences structure
 */
function validatePreferences(preferences: Partial<UserPreferences>): string | null {
  if (!preferences || typeof preferences !== 'object') {
    return 'Invalid preferences format';
  }

  // Validate theme
  if (preferences.theme && !['light', 'dark', 'system'].includes(preferences.theme)) {
    return 'Invalid theme value';
  }

  // Validate language
  if (preferences.language && typeof preferences.language !== 'string') {
    return 'Invalid language value';
  }

  // Validate timezone
  if (preferences.timezone && typeof preferences.timezone !== 'string') {
    return 'Invalid timezone value';
  }

  // Validate notifications
  if (preferences.notifications) {
    const { email, push, marketing, security } = preferences.notifications;
    if (email !== undefined && typeof email !== 'boolean') {
      return 'Invalid email notification setting';
    }
    if (push !== undefined && typeof push !== 'boolean') {
      return 'Invalid push notification setting';
    }
    if (marketing !== undefined && typeof marketing !== 'boolean') {
      return 'Invalid marketing notification setting';
    }
    if (security !== undefined && typeof security !== 'boolean') {
      return 'Invalid security notification setting';
    }
  }

  // Validate privacy settings
  if (preferences.privacy) {
    const { profileVisibility, activityTracking, dataCollection } = preferences.privacy;
    if (profileVisibility && !['public', 'private', 'team'].includes(profileVisibility)) {
      return 'Invalid profile visibility setting';
    }
    if (activityTracking !== undefined && typeof activityTracking !== 'boolean') {
      return 'Invalid activity tracking setting';
    }
    if (dataCollection !== undefined && typeof dataCollection !== 'boolean') {
      return 'Invalid data collection setting';
    }
  }

  // Validate dashboard settings
  if (preferences.dashboard) {
    const { itemsPerPage, showTutorials } = preferences.dashboard;
    if (itemsPerPage !== undefined && (typeof itemsPerPage !== 'number' || itemsPerPage < 1 || itemsPerPage > 100)) {
      return 'Invalid items per page setting';
    }
    if (showTutorials !== undefined && typeof showTutorials !== 'boolean') {
      return 'Invalid show tutorials setting';
    }
  }

  return null;
}

/**
 * Deep merge two objects
 */
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target } as T;

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const targetValue = result[key];
      const sourceValue = source[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        // Cast to Record<string, any> for the recursive call
        result[key] = deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>];
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }
  return result;
}