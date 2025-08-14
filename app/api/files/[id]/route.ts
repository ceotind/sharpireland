import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../utils/supabase/server';
import { logActivity, getRequestInfo } from '../../../utils/activity-logger';

// GET /api/files/[id] - Download or get file info
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { ipAddress, userAgent } = getRequestInfo(request);
    const fileId = params.id;

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
    const download = searchParams.get('download') === 'true';

    // Get file record
    const { data: file, error: fileError } = await supabase
      .from('user_files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', user.id)
      .single();

    if (fileError || !file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    if (download) {
      // Download file from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('user-files')
        .download(file.file_path);

      if (downloadError) {
        console.error('Error downloading file:', downloadError);
        return NextResponse.json(
          { error: 'Failed to download file' },
          { status: 500 }
        );
      }

      // Update download count
      await supabase
        .from('user_files')
        .update({ 
          download_count: (file.download_count || 0) + 1,
          last_accessed: new Date().toISOString()
        })
        .eq('id', fileId);

      // Log the activity
      await logActivity(
        {
          action: 'files.download',
          entity_type: 'file',
          entity_id: fileId,
          description: `Downloaded file: ${file.name}`,
          metadata: { 
            file_name: file.name,
            file_type: file.file_type,
            file_size: file.file_size
          }
        },
        { userId: user.id, ipAddress, userAgent }
      );

      // Return file as download
      const headers = new Headers();
      headers.set('Content-Type', file.file_type);
      headers.set('Content-Disposition', `attachment; filename="${file.original_name}"`);
      headers.set('Content-Length', file.file_size.toString());

      return new NextResponse(fileData, { headers });
    } else {
      // Return file info
      await logActivity(
        {
          action: 'files.view',
          entity_type: 'file',
          entity_id: fileId,
          description: `Viewed file info: ${file.name}`,
          metadata: { file_name: file.name }
        },
        { userId: user.id, ipAddress, userAgent }
      );

      return NextResponse.json({
        data: file
      });
    }

  } catch (error) {
    console.error('Unexpected error in GET /api/files/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/files/[id] - Update file metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { ipAddress, userAgent } = getRequestInfo(request);
    const fileId = params.id;

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, description, folder, tags } = body;

    // Validate input
    if (name && (typeof name !== 'string' || name.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Invalid file name' },
        { status: 400 }
      );
    }

    // Check if file exists and belongs to user
    const { data: existingFile, error: checkError } = await supabase
      .from('user_files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', user.id)
      .single();

    if (checkError || !existingFile) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description;
    if (folder !== undefined) updateData.folder = folder;
    if (tags !== undefined) updateData.tags = tags;

    // Update file metadata
    const { data: updatedFile, error: updateError } = await supabase
      .from('user_files')
      .update(updateData)
      .eq('id', fileId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating file:', updateError);
      return NextResponse.json(
        { error: 'Failed to update file' },
        { status: 500 }
      );
    }

    // Log the activity
    await logActivity(
      {
        action: 'files.update',
        entity_type: 'file',
        entity_id: fileId,
        description: `Updated file: ${updatedFile.name}`,
        metadata: { 
          file_name: updatedFile.name,
          updated_fields: Object.keys(updateData)
        }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({
      data: updatedFile,
      message: 'File updated successfully'
    });

  } catch (error) {
    console.error('Unexpected error in PUT /api/files/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/files/[id] - Delete file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { ipAddress, userAgent } = getRequestInfo(request);
    const fileId = params.id;

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get file record
    const { data: file, error: fileError } = await supabase
      .from('user_files')
      .select('*')
      .eq('id', fileId)
      .eq('user_id', user.id)
      .single();

    if (fileError || !file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('user-files')
      .remove([file.file_path]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete file record from database
    const { error: dbError } = await supabase
      .from('user_files')
      .delete()
      .eq('id', fileId)
      .eq('user_id', user.id);

    if (dbError) {
      console.error('Error deleting file from database:', dbError);
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      );
    }

    // Log the activity
    await logActivity(
      {
        action: 'files.delete',
        entity_type: 'file',
        entity_id: fileId,
        description: `Deleted file: ${file.name}`,
        metadata: { 
          file_name: file.name,
          file_type: file.file_type,
          file_size: file.file_size
        }
      },
      { userId: user.id, ipAddress, userAgent }
    );

    return NextResponse.json({
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Unexpected error in DELETE /api/files/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}