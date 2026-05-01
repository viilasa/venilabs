import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { ContactDialog } from '../components/ContactDialog'

const ContactDialogContext = createContext(null)

export function ContactDialogProvider({ children }) {
  const [contactOpen, setContactOpen] = useState(false)
  const openContact = useCallback(() => setContactOpen(true), [])
  const closeContact = useCallback(() => setContactOpen(false), [])

  const value = useMemo(
    () => ({ contactOpen, openContact, closeContact }),
    [contactOpen, openContact, closeContact],
  )

  return (
    <ContactDialogContext.Provider value={value}>
      {children}
      <ContactDialog open={contactOpen} onClose={closeContact} />
    </ContactDialogContext.Provider>
  )
}

export function useContactDialog() {
  const ctx = useContext(ContactDialogContext)
  if (!ctx) {
    throw new Error('useContactDialog must be used within ContactDialogProvider')
  }
  return ctx
}
