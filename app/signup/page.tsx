'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function handleSignup() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMsg(error.message)
      return
    }

    const user = data.user

    // 🔥 THIS IS THE FIX (you don't have this yet)
    if (user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            email: email,
          },
        ])

      if (profileError) {
        setMsg(profileError.message)
        return
      }
    }

    setMsg('Signup success ✅')
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Signup</h2>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleSignup}>Signup</button>

      <p>{msg}</p>
    </div>
  )
}