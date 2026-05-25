import logoBopacorp from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

type TitleBarProps = {
  title: string
  description: string
}

function TitleBar({ title, description }: TitleBarProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background px-4">
      <div className="flex items-center gap-3">
        <img src={logoBopacorp} alt="Logo Bopacorp" className="size-8 rounded-md object-contain" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-none text-foreground">BOPACORP</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Partner Movistar</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center text-center">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Button>
        <Plus data-icon="inline-start" />
        Nuevo cliente
      </Button>
    </header>
  )
}

export default TitleBar
