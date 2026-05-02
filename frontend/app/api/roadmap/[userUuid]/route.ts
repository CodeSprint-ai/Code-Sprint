import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy route for the roadmap feature.
 * Forwards requests from Next.js to the NestJS backend.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userUuid: string }> }
) {
    const { userUuid } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
        const res = await fetch(`${backendUrl}/roadmap/${userUuid}`, {
            headers: {
                // Forward potential auth headers if needed, 
                // though the client-side axios usually handles this.
                // For a direct server-to-server call, we might need a service token.
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            next: { revalidate: 300 } // cache for 5 minutes at the edge
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch roadmap from backend' },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error('[Roadmap API Proxy Error]:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
