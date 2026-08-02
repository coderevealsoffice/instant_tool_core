import { NextResponse } from "next/server"

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const url = formData.get('url') as string;
    let title = (formData.get('title') as string) || 'download';
    const isAudio = formData.get('audio') === 'true';
    
    if (!url) return new NextResponse('Missing url', { status: 400 });

    const response = await fetch(url, {
      headers: {
        'User-Agent': req.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }

    const headers = new Headers(response.headers);
    
    // Determine extension
    const ext = isAudio ? '.mp3' : '.mp4';
    // Clean title for filename (remove special chars)
    const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, "").substring(0, 50).trim();
    const filename = `${cleanTitle}${ext}`;
    
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Remove headers that might cause issues when proxying
    headers.delete('content-encoding');
    headers.delete('transfer-encoding');
    headers.delete('content-security-policy');
    
    return new NextResponse(response.body, {
      status: response.status,
      headers
    });
  } catch (error) {
    console.error("[PROXY_DOWNLOAD_ERROR]", error);
    // Return a script that alerts the user and closes the window if it was opened in a new tab
    return new NextResponse(
      `<script>alert("Failed to proxy download. Please try again or use a different quality."); window.history.back();</script>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}
