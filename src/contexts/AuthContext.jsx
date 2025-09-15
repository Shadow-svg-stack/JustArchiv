import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProviderDebug = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState("reader")
  const [loading, setLoading] = useState(true)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      console.log("DebugAuth: initialisation session...")
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) console.error("DebugAuth getSession error:", error)

        if (mounted) {
          setUser(data?.session?.user ?? null)
          console.log("DebugAuth session:", data?.session?.user)
        }
      } catch (err) {
        console.error("DebugAuth unexpected error:", err)
      } finally {
        // 🔹 Force la fin du loading au bout de 3s max
        setTimeout(() => {
          if (mounted) {
            setLoading(false)
            console.log("DebugAuth: loading forcé à false")
          }
        }, 3000)
      }
    }

    init()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("DebugAuth authStateChange:", _event, session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription?.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        isActive,
        signIn: async () => {},
        signOut: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
