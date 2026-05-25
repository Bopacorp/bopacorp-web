import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { useState, useEffect } from 'react';
import CRMSidebar from '@/components/CRMSidebar'
import TitleBar from '@/components/TitleBar'
import {
  menu,
  sections,
  type AppSectionKey,
  type AppMenuItem,
} from '@/components/sections/Empleabilidad'

function App() {
  const [activeSection, setActiveSection] = useState<AppSectionKey>('empleabilidad')
  const currentSection = sections[activeSection]

  useEffect(() => {
    const applyHash = () => {
      const h = location.hash.replace('#', '')
      if (h && Object.prototype.hasOwnProperty.call(sections, h)) {
        setActiveSection(h as keyof typeof sections)
      }
    }

    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [])

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <CRMSidebar menu={menu as AppMenuItem[]} activeSection={activeSection} />

        <SidebarInset className="flex h-screen flex-1 flex-col">
            <TitleBar title={currentSection.title} description={currentSection.description} />
            <main className="flex-1 overflow-auto">{currentSection.content}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default App

