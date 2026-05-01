import { Route, Routes } from 'react-router-dom'
import { ContactReminderDialog } from './components/ContactReminderDialog'
import { ScrollToHash } from './components/ScrollToHash'
import { StickyContactDock } from './components/StickyContactDock'
import { BlogPostPage } from './pages/BlogPostPage'
import { BlogsPage } from './pages/BlogsPage'
import { HomePage } from './pages/HomePage'

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogPostPage />} />
      </Routes>
      <StickyContactDock />
      <ContactReminderDialog />
    </>
  )
}
