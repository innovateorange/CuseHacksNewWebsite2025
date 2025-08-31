import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react'
import { mockAPI, featureFlags as initialFlags } from '../lib/mockData'

interface FeatureFlags {
  projectSubmissionsEnabled: boolean
  registrationEnabled: boolean
  votingEnabled: boolean
  adminPanelEnabled: boolean
}

interface FeatureFlagContextType {
  flags: FeatureFlags
  updateFlag: (flag: keyof FeatureFlags, value: boolean) => Promise<void>
  loading: boolean
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined)

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext)
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider')
  }
  return context
}

interface FeatureFlagProviderProps {
  children: ReactNode
}

export const FeatureFlagProvider = ({ children }: FeatureFlagProviderProps) => {
  const [flags, setFlags] = useState<FeatureFlags>(initialFlags)
  const [loading, setLoading] = useState(false)

  const loadFlags = useCallback(async () => {
    setLoading(true)
    try {
      const currentFlags = await mockAPI.getFeatureFlags()
      setFlags(currentFlags)
    } catch (error) {
      console.error('Failed to load feature flags:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateFlag = useCallback(async (flag: keyof FeatureFlags, value: boolean) => {
    setLoading(true)
    try {
      const result = await mockAPI.updateFeatureFlag(flag, value)
      if (result.success) {
        setFlags(result.flags)
      }
    } catch (error) {
      console.error('Failed to update feature flag:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Load initial feature flags
    loadFlags()
  }, [loadFlags])

  const value = useMemo(() => ({
    flags,
    updateFlag,
    loading
  }), [flags, updateFlag, loading])

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  )
}