import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import StageSection, { type Stage } from '@/components/StageSection'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    BriefcaseBusiness,
    CalendarDays,
    Download,
    Eye,
    FileEdit,
    Mail,
    Plus,
    Sparkles,
    Trash2,
    Users,
} from 'lucide-react'
import { useState } from 'react'

type JobOffering = {
    id: string
    title: string
}

const initialJobOfferings: JobOffering[] = [
    { id: 'frontend-sr', title: 'Senior Frontend Engineer' },
    { id: 'backend-ssr', title: 'Semi Senior Backend Engineer' },
    { id: 'product-designer', title: 'Product Designer' },
]

const stages: Stage[] = [
    {
        title: 'New Applicants',
        icon: Sparkles,
        defaultOpen: true,
        applicants: [
            {
                name: 'Sarah Chen',
                note: 'Applied 2h ago',
                role: initialJobOfferings[0].title,
                experience: '6 Years',
                location: 'San Francisco, CA',
                resumeLabel: 'Download resume',
            },
        ],
    },
    {
        title: 'Under Review',
        icon: Eye,
        applicants: [
            {
                name: 'Aria Lee',
                note: 'Reviewed Yesterday',
                role: initialJobOfferings[0].title,
                experience: '4 Years',
                location: 'Remote',
                resumeLabel: 'View Profile',
            },
        ],
    },
    {
        title: 'Interview Phase',
        icon: CalendarDays,
        applicants: [
            {
                name: 'Elena Rodriguez',
                note: 'Interview: Oct 24, 10:00 AM',
                role: initialJobOfferings[0].title,
                experience: '10 Years',
                location: 'Seattle, WA',
                resumeLabel: 'View Profile',
            },
        ],
    },
]

const totalApplicants = stages.reduce((count, stage) => count + stage.applicants.length, 0)
const newTodayCount = stages[0]?.applicants.length ?? 0

function Empleabilidad() {
    const [jobOfferings, setJobOfferings] = useState<JobOffering[]>(initialJobOfferings)
    const [activeJobId, setActiveJobId] = useState<string>(initialJobOfferings[0].id)
    const [newJobTitle, setNewJobTitle] = useState('')

    const activeJob =
        jobOfferings.find((offering) => offering.id === activeJobId) ?? jobOfferings[0]

    const handleOfferingTitleChange = (id: string, title: string) => {
        setJobOfferings((previous) =>
            previous.map((offering) =>
                offering.id === id ? { ...offering, title } : offering
            )
        )
    }

    const handleAddOffering = () => {
        const trimmedTitle = newJobTitle.trim()

        if (!trimmedTitle) {
            return
        }

        const nextOffering = {
            id: `${trimmedTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
            title: trimmedTitle,
        }

        setJobOfferings((previous) => [...previous, nextOffering])
        setActiveJobId(nextOffering.id)
        setNewJobTitle('')
    }

    const handleDeleteOffering = (id: string) => {
        if (jobOfferings.length <= 1) {
            return
        }

        const nextOfferings = jobOfferings.filter((offering) => offering.id !== id)
        setJobOfferings(nextOfferings)

        if (activeJobId === id) {
            setActiveJobId(nextOfferings[0].id)
        }
    }

    return (
        <section className="flex flex-col gap-6 p-4 md:p-6">
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Quick actions</h3>
                    <p className="text-sm text-muted-foreground">
                        Review applicants, send follow-ups, or export profiles from a single place.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <FileEdit data-icon="inline-start" />
                                Editar ofertas
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Editor de ofertas laborales</DialogTitle>
                                <DialogDescription>
                                    Modifica las ofertas cargadas en el combobox de Active Job Posting Title.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="max-h-72 overflow-auto pr-1">
                                <FieldGroup>
                                    {jobOfferings.map((offering, index) => (
                                        <Field key={offering.id}>
                                            <FieldLabel htmlFor={`offering-${offering.id}`}>
                                                Oferta {index + 1}
                                            </FieldLabel>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    id={`offering-${offering.id}`}
                                                    value={offering.title}
                                                    onChange={(event) =>
                                                        handleOfferingTitleChange(
                                                            offering.id,
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDeleteOffering(offering.id)}
                                                    disabled={jobOfferings.length <= 1}
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </div>
                                        </Field>
                                    ))}
                                </FieldGroup>
                            </div>

                            <div className="rounded-lg border border-border bg-muted/30 p-3">
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="new-offering-title">Nueva oferta</FieldLabel>
                                        <Input
                                            id="new-offering-title"
                                            placeholder="Ej: Talent Acquisition Specialist"
                                            value={newJobTitle}
                                            onChange={(event) => setNewJobTitle(event.target.value)}
                                        />
                                    </Field>
                                    <Button type="button" variant="secondary" onClick={handleAddOffering}>
                                        <Plus data-icon="inline-start" />
                                        Agregar al combobox
                                    </Button>
                                </FieldGroup>
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button>Guardar cambios</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

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

            <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-5 shadow-sm md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                            Manage Applicants
                        </h2>
                        <div className="mt-2 flex flex-col gap-2">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                                Active Job Posting Title
                            </p>
                            <Select value={activeJob?.id} onValueChange={setActiveJobId}>
                                <SelectTrigger className="w-full min-w-72 justify-start gap-2 md:w-auto">
                                    <BriefcaseBusiness />
                                    <SelectValue placeholder="Selecciona una oferta" />
                                </SelectTrigger>
                                <SelectContent align="start">
                                    <SelectGroup>
                                        {jobOfferings.map((offering) => (
                                            <SelectItem key={offering.id} value={offering.id}>
                                                {offering.title}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
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
                        <StageSection key={stage.title} stage={stage} activeRole={activeJob?.title ?? ''} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Empleabilidad