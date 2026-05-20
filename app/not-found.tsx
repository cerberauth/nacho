'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <html>
      <body>
        <div className="h-svh">
          <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
            <h1 className="text-[7rem] font-bold leading-tight">404</h1>
            <span className="font-medium">Page Not Found</span>
            <div className="mt-6 flex gap-4">
              <Button asChild>
                <Link href="/en">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
