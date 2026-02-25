'use client'

import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface EmailAuthFormProps {
  onSuccess?: () => void
}

async function submitAuth(path: '/api/auth/login' | '/api/auth/register', payload: Record<string, string>) {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(data.error || 'Authentication failed')
  }
}

export function EmailAuthForm({ onSuccess }: EmailAuthFormProps) {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [registerName, setRegisterName] = useState('')
  const [registerUsername, setRegisterUsername] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('')

  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const finishAuth = () => {
    onSuccess?.()
    window.location.reload()
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!loginEmail.trim() || !loginPassword) {
      toast.error('Email and password are required')
      return
    }

    setIsLoggingIn(true)
    try {
      await submitAuth('/api/auth/login', {
        email: loginEmail,
        password: loginPassword,
      })
      toast.success('Logged in successfully')
      finishAuth()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!registerEmail.trim() || !registerPassword) {
      toast.error('Email and password are required')
      return
    }

    if (registerPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (registerPassword !== registerConfirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsRegistering(true)
    try {
      await submitAuth('/api/auth/register', {
        email: registerEmail,
        password: registerPassword,
        username: registerUsername,
        name: registerName,
      })
      toast.success('Account created successfully')
      finishAuth()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="pt-3">
        <form onSubmit={handleLogin} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              disabled={isLoggingIn}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              disabled={isLoggingIn}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="register" className="pt-3">
        <form onSubmit={handleRegister} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="register-name">Name</Label>
            <Input
              id="register-name"
              type="text"
              autoComplete="name"
              value={registerName}
              onChange={(event) => setRegisterName(event.target.value)}
              disabled={isRegistering}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="register-username">Username</Label>
            <Input
              id="register-username"
              type="text"
              autoComplete="username"
              value={registerUsername}
              onChange={(event) => setRegisterUsername(event.target.value)}
              disabled={isRegistering}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="register-email">Email</Label>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              value={registerEmail}
              onChange={(event) => setRegisterEmail(event.target.value)}
              disabled={isRegistering}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="register-password">Password</Label>
            <Input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={registerPassword}
              onChange={(event) => setRegisterPassword(event.target.value)}
              disabled={isRegistering}
              minLength={8}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="register-password-confirm">Confirm password</Label>
            <Input
              id="register-password-confirm"
              type="password"
              autoComplete="new-password"
              value={registerConfirmPassword}
              onChange={(event) => setRegisterConfirmPassword(event.target.value)}
              disabled={isRegistering}
              minLength={8}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isRegistering}>
            {isRegistering ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  )
}
