import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import App from '@/App'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export default function EmployeePortalPage() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [employeeEmail, setEmployeeEmail] = useState('')
  const [employeePassword, setEmployeePassword] = useState('')

  const handlePortalLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!employeeEmail.trim() || !employeePassword.trim()) {
      return
    }

    setIsAuthenticated(true)
  }

  if (isAuthenticated) {
    return <App />
  }

  return (
    <main className="min-h-screen w-full bg-background px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Portal interno</p>
            <h1 className="text-2xl font-semibold text-foreground">Ingreso de empleados</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Volver al sitio
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Acceso al CRM</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-4" onSubmit={handlePortalLogin}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="employee-email">Correo corporativo</FieldLabel>
                  <Input
                    id="employee-email"
                    type="email"
                    value={employeeEmail}
                    onChange={(event) => setEmployeeEmail(event.target.value)}
                    placeholder="empleado@bopacorp.com"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="employee-password">Clave de acceso</FieldLabel>
                  <Input
                    id="employee-password"
                    type="password"
                    value={employeePassword}
                    onChange={(event) => setEmployeePassword(event.target.value)}
                    placeholder="Ingresa tu clave"
                  />
                </Field>
              </FieldGroup>

              <div className="flex justify-end">
                <Button type="submit">Entrar al CRM</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
