import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export type Applicant = {
    name: string
    note: string
    role: string
    experience: string
    location: string
    resumeLabel: string
}

type ApplicantCardProps = {
    applicant: Applicant
    activeRole: string
}

function ApplicantCard({ applicant, activeRole }: ApplicantCardProps) {
    return (
        <article className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
                <h4 className="text-sm font-semibold text-foreground">{applicant.name}</h4>
                <p className="text-sm text-muted-foreground">{applicant.note}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 md:gap-8">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Role
                    </p>
                    <p className="text-sm text-foreground">{activeRole || applicant.role}</p>
                </div>
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Experience
                    </p>
                    <p className="text-sm text-foreground">{applicant.experience}</p>
                </div>
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Location
                    </p>
                    <p className="text-sm text-foreground">{applicant.location}</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <Button variant="link" asChild className="px-0 text-sm font-semibold">
                    <a href="#">{applicant.resumeLabel}</a>
                </Button>
                <Button size="sm">
                    <Mail data-icon="inline-start" />
                    Email
                </Button>
            </div>
        </article>
    )
}

export default ApplicantCard
