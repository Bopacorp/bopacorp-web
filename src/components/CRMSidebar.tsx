import React from 'react'
import SidebarNav from '@/components/SidebarNav'

type MenuItem = {
  id: string
  title: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

type CRMSidebarProps = {
  menu: MenuItem[]
  activeSection: string
}

function CRMSidebar({ menu, activeSection }: CRMSidebarProps) {
  return <SidebarNav menu={menu} activeSection={activeSection} />
}

export default CRMSidebar
