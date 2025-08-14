import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { ApiResponse, FileUploadResponse } from '../../../types/dashboard';

// POST /api/user/avatar - Upload user avatar
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<FileUploadResponse>>> {
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

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExtension}`;
    const filePath = `avatars/${fileName}`;

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath);

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile with avatar URL:', updateError);
      // Don't return error here as the file was uploaded successfully
      // The user can still use the URL manually
    }

    // Delete old avatar if it exists and is from our storage
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (profile?.avatar_url && profile.avatar_url.includes('user-uploads/avatars/')) {
        const oldFilePath = profile.avatar_url.split('user-uploads/')[1];
        if (oldFilePath !== filePath) {
          await supabase.storage
            .from('user-uploads')
            .remove([oldFilePath]);
        }
      }
    } catch (cleanupError) {
      // Ignore cleanup errors
      console.warn('Could not clean up old avatar:', cleanupError);
    }

    const response: FileUploadResponse = {
      url: publicUrl,
      filename: fileName,
      size: file.size,
      type: file.type
    };

    return NextResponse.json({
      data: response,
      message: 'Avatar uploaded successfully'
    });

  } catch (error) {
    console.error('Unexpected error in POST /api/user/avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/avatar - Remove user avatar
export async function DELETE(): Promise<NextResponse<ApiResponse<null>>> {
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

    // Get current avatar URL
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    // Remove avatar URL from profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error removing avatar URL from profile:', updateError);
      return NextResponse.json(
        { error: 'Failed to remove avatar' },
        { status: 500 }
      );
    }

    // Delete file from storage if it's from our storage
    if (profile?.avatar_url && profile.avatar_url.includes('user-uploads/avatars/')) {
      try {
        const filePath = profile.avatar_url.split('user-uploads/')[1];
        await supabase.storage
          .from('user-uploads')
          .remove([filePath]);
      } catch (deleteError) {
        console.warn('Could not delete avatar file from storage:', deleteError);
        // Don't return error as the profile was updated successfully
      }
    }

    return NextResponse.json({
      data: null,
      message: 'Avatar removed successfully'
    });

  } catch (error) {
    console.error('Unexpected error in DELETE /api/user/avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}