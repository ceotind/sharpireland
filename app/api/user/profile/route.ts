import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { UserProfile, ProfileUpdateData, ApiResponse } from '../../../types/dashboard';

// GET /api/user/profile - Get current user profile
export async function GET(): Promise<NextResponse<ApiResponse<UserProfile>>> {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      // If profile doesn't exist, create a basic one
      if (profileError.code === 'PGRST116') {
        const newProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          timezone: 'UTC',
          language: 'en',
          email_notifications: true,
          marketing_emails: false,
          onboarding_completed: false
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return NextResponse.json(
            { error: 'Failed to create profile' },
            { status: 500 }
          );
        }

        return NextResponse.json({ data: createdProfile });
      }

      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error('Unexpected error in GET /api/user/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest): Promise<NextResponse<ApiResponse<UserProfile>>> {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the request body
    let updateData: ProfileUpdateData;
    try {
      updateData = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate the update data
    const allowedFields: (keyof ProfileUpdateData)[] = [
      'username',
      'full_name',
      'phone',
      'company',
      'role',
      'bio',
      'website',
      'social_links',
      'timezone',
      'language',
      'email_notifications',
      'marketing_emails'
    ];

    const filteredData: Partial<ProfileUpdateData> = Object.fromEntries(
      allowedFields
        .filter(field => updateData[field] !== undefined)
        .map(field => [field, updateData[field]])
    ) as Partial<ProfileUpdateData>;

    // Validate specific fields
    if (filteredData.username) {
      const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
      if (!usernameRegex.test(filteredData.username)) {
        return NextResponse.json(
          { error: 'Username must be 3-30 characters and contain only letters, numbers, underscores, and hyphens' },
          { status: 400 }
        );
      }
    }

    if (filteredData.website) {
      try {
        new URL(filteredData.website);
      } catch {
        return NextResponse.json(
          { error: 'Website must be a valid URL' },
          { status: 400 }
        );
      }
    }

    if (filteredData.social_links) {
      const { linkedin, twitter, github } = filteredData.social_links;
      if (linkedin && !linkedin.includes('linkedin.com')) {
        return NextResponse.json(
          { error: 'LinkedIn URL must be a valid LinkedIn profile' },
          { status: 400 }
        );
      }
      if (twitter && !twitter.includes('twitter.com') && !twitter.includes('x.com')) {
        return NextResponse.json(
          { error: 'Twitter URL must be a valid Twitter/X profile' },
          { status: 400 }
        );
      }
      if (github && !github.includes('github.com')) {
        return NextResponse.json(
          { error: 'GitHub URL must be a valid GitHub profile' },
          { status: 400 }
        );
      }
    }

    // Update the profile
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(filteredData)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating profile:', updateError);
      
      // Handle unique constraint violations
      if (updateError.code === '23505' && updateError.message.includes('username')) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      data: updatedProfile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Unexpected error in PUT /api/user/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}