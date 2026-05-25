import ApplicantCard, { type Applicant } from '@/components/ApplicantCard'
import { Badge } from '@/components/ui/badge'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronDown, type LucideIcon } from 'lucide-react'

export type Stage = {
    title: string
    icon: LucideIcon
    defaultOpen?: boolean
    applicants: Applicant[]
}

type StageSectionProps = {
    stage: Stage
    activeRole: string
}

function StageSection({ stage, activeRole }: StageSectionProps) {
    const StageIcon = stage.icon

    return (
        <Collapsible defaultOpen={stage.defaultOpen}>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <CollapsibleTrigger asChild>
                    <button
                        type="button"
                        className="flex w-full items-center justify-between gap-4 bg-card px-5 py-4 text-left transition-colors hover:bg-muted/50"
                    >
                        <div className="flex items-center gap-3">
                            <StageIcon className="size-5 text-primary" />
                            <span className="text-base font-semibold text-foreground">{stage.title}</span>
                            <Badge variant={stage.defaultOpen ? 'default' : 'secondary'}>
                                {stage.applicants.length}
                            </Badge>
                        </div>
                        <ChevronDown className="size-5 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180" />
                    </button>
                </CollapsibleTrigger>

                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                    <div className="border-t border-border bg-background p-5">
                        <div className="flex flex-col gap-4">
                            {stage.applicants.map((applicant) => (
                                <ApplicantCard key={applicant.name} applicant={applicant} activeRole={activeRole} />
                            ))}
                        </div>
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    )
}

export default StageSection
