import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../utils/supabase/server';
import { logActivity, getRequestInfo } from '../../utils/activity-logger';

// GET /api/files - Get all files for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { ipAddress, userAgent } = getRequestInfo(request);

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    let query = supabase
      .from('user_files')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (type) {
      query = query.eq('file_type', type);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: files, error: filesError, count } = await query;

    if (filesError) {
      console.error('Error fetching files:', filesError);
      return NextResponse.json(
        { error: 'Failed to fetch files' },
        { status: 500 }
      );
    }

    // Log the activity
    await logActivity(
      {
        action: 'files.list',
        description: 'Retrieved files list',
        metadata: { 
          files_count: files?.length || 0,
          page,
          limit,
          search,
          type
        }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({
      data: files || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/files - Upload a new file
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { ipAddress, userAgent } = getRequestInfo(request);

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';
    const description = formData.get('description') as string || '';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'text/csv',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip', 'application/x-zip-compressed'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${timestamp}_${randomString}.${fileExtension}`;
    const filePath = `${user.id}/${folder}/${uniqueFileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('user-files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-files')
      .getPublicUrl(filePath);

    // Save file metadata to database
    const { data: fileRecord, error: dbError } = await supabase
      .from('user_files')
      .insert({
        user_id: user.id,
        name: file.name,
        original_name: file.name,
        file_path: filePath,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        folder: folder,
        description: description,
        storage_provider: 'supabase'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error saving file metadata:', dbError);
      // Try to clean up uploaded file
      await supabase.storage.from('user-files').remove([filePath]);
      return NextResponse.json(
        { error: 'Failed to save file metadata' },
        { status: 500 }
      );
    }

    // Log the activity
    await logActivity(
      {
        action: 'files.upload',
        entity_type: 'file',
        entity_id: fileRecord.id,
        description: `Uploaded file: ${file.name}`,
        metadata: { 
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          folder: folder
        }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({
      data: fileRecord,
      message: 'File uploaded successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in POST /api/files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}