import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
    BriefcaseBusiness,
    CalendarDays,
    ChevronDown,
    Download,
    Eye,
    Mail,
    Sparkles,
    Users,
} from 'lucide-react'

type Applicant = {
    name: string
    avatar?: string
    initials?: string
    note: string
    role: string
    experience: string
    location: string
    resumeLabel: string
}

type Stage = {
    title: string
    icon: typeof Sparkles
    count: number
    defaultOpen?: boolean
    applicants: Applicant[]
}

const activeRole = 'Senior Frontend Engineer'

const stages: Stage[] = [
    {
        title: 'New Applicants',
        icon: Sparkles,
        count: 24,
        defaultOpen: true,
        applicants: [
            {
                name: 'Sarah Chen',
                avatar:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBOHnnLyZFpbKVeCaeBE8Y-iOl5Wlt4JYK_SH7tXjRWHDtgFcyJQfZrSItW4V79g--61BYnKzyV_sXPljwYaonW5bMLjRErHm8MjEfio2MJ8bSXPbpx4YNt0GHnr2FAeQ5D7xLD79q7RDKiOuDWANa03JEHLP7cC6wzFCKvWH0FUWab984AXJIIqZbS5FSwS12qJMuz5vDojV1VGykGR0IlIaeByBURG8INX4gtCNjtnIjmalnL-MV2AXnAFUO126lufOAAEcIF7yw',
                note: 'Applied 2h ago',
                role: activeRole,
                experience: '6 Years',
                location: 'San Francisco, CA',
                resumeLabel: 'Download resume',
            },
        ],
    },
    {
        title: 'Under Review',
        icon: Eye,
        count: 12,
        applicants: [
            {
                name: 'Aria Lee',
                initials: 'AL',
                note: 'Reviewed Yesterday',
                role: activeRole,
                experience: '4 Years',
                location: 'Remote',
                resumeLabel: 'View Profile',
            },
        ],
    },
    {
        title: 'Interview Phase',
        icon: CalendarDays,
        count: 5,
        applicants: [
            {
                name: 'Elena Rodriguez',
                avatar:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuC1mCiJzZOHch81f-bumf5e2IGoXGv4ZdlL1itWLJXF0bMa5fuOmUS-yiK-WFSVTThyhIqCWdEN1676UQfjWpmiDLQnnsgrULy6_4asUHafB6FMwSbKTSA291ccMoer7nUxC7QnNY5r9N-9uEJLSPX025zilD4nSFO2TeG7rPhx6DLjeedDJn1JNsYTNEmubXPAzfRCqM7U5oAUqVEo5TC0z3MF8gb6ovij2hWdGZUeYR2vMiLN7bMyXA4TnCwFVNivindCdnt2Bmo',
                note: 'Interview: Oct 24, 10:00 AM',
                role: activeRole,
                experience: '10 Years',
                location: 'Seattle, WA',
                resumeLabel: 'View Profile',
            },
        ],
    },
]

const totalApplicants = stages.reduce((count, stage) => count + stage.applicants.length, 0)
const newTodayCount = stages[0]?.applicants.length ?? 0

function ApplicantCard({ applicant }: { applicant: Applicant }) {
    return (
        <article className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
                {applicant.avatar ? (
                    <img
                        alt={applicant.name}
                        className="size-12 rounded-full object-cover"
                        src={applicant.avatar}
                    />
                ) : (
                    <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                        {applicant.initials}
                    </div>
                )}

                <div>
                    <h4 className="text-sm font-semibold text-foreground">{applicant.name}</h4>
                    <p className="text-sm text-muted-foreground">{applicant.note}</p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 md:gap-8">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        Role
                    </p>
                    <p className="text-sm text-foreground">{applicant.role}</p>
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

function StageSection({ stage }: { stage: Stage }) {
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
                                <ApplicantCard key={applicant.name} applicant={applicant} />
                            ))}
                        </div>
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    )
}

function Empleabilidad() {
    return (
        <section className="flex flex-col gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-5 shadow-sm md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                            Manage Applicants
                        </h2>
                        <div className="mt-2 inline-flex">
                            <Button variant="outline" className="justify-between gap-3 px-4">
                                <span className="flex items-center gap-2">
                                    <BriefcaseBusiness data-icon="inline-start" />
                                    Active Job Posting:
                                    <span className="font-semibold text-foreground">{activeRole}</span>
                                </span>
                                <ChevronDown className="size-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Badge variant="secondary" className="h-7 px-3 text-sm">
                            <Users data-icon="inline-start" />
                            {totalApplicants} Total Applicants
                        </Badge>
                        <Badge className="h-7 px-3 text-sm">
                            <Sparkles data-icon="inline-start" />
                            {newTodayCount} New Today
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {stages.map((stage) => (
                        <StageSection key={stage.title} stage={stage} />
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Quick actions</h3>
                    <p className="text-sm text-muted-foreground">
                        Review applicants, send follow-ups, or export profiles from a single place.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button variant="outline">
                        <Download data-icon="inline-start" />
                        Export shortlist
                    </Button>
                    <Button>
                        <Mail data-icon="inline-start" />
                        Email all new applicants
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default Empleabilidad