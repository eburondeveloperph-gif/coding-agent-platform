'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { EmailAuthForm } from '@/components/auth/email-auth-form'

export function SignIn() {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <Button onClick={() => setShowDialog(true)} variant="outline" size="sm">
        Login / Register
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome</DialogTitle>
            <DialogDescription>Login or create an account to continue.</DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <EmailAuthForm onSuccess={() => setShowDialog(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
