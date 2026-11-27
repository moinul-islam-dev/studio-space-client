import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCurrentUser } from './lib/actions/auth-actions'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const user = await getCurrentUser();

    if(!user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next();
}

export const config = {
  matcher: [ '/dashboard/:path*',  ],
}