import { LoginRequestSchema } from '@bopacorp/shared/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import type { z } from 'zod';
import { Button } from '@/components/ui/button.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.js';
import { Input } from '@/components/ui/input.js';
import { FormAlert } from '@/shared/ui/FormAlert.js';
import { ModeToggle } from '@/shared/ui/ModeToggle.js';
import { useAuth } from '../context/AuthContext.js';

type LoginFormValues = z.input<typeof LoginRequestSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/admin';
  const [authError, setAuthError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    try {
      await login({ email: values.email, password: values.password });
      navigate(from, { replace: true });
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="fixed top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">BOPACORP</CardTitle>
          <CardDescription>Iniciar sesión en BOPADIGITAL</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            {authError && <FormAlert message={authError} />}

            <FieldGroup>
              <Field data-invalid={form.formState.errors.email ? true : undefined}>
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@bopacorp.com"
                  autoComplete="email"
                  disabled={form.formState.isSubmitting}
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
              </Field>

              <Field data-invalid={form.formState.errors.password ? true : undefined}>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={form.formState.isSubmitting}
                  {...form.register('password')}
                />
                {form.formState.errors.password && (
                  <FieldError>{form.formState.errors.password.message}</FieldError>
                )}
              </Field>
            </FieldGroup>

            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
              {form.formState.isSubmitting && (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              )}
              Iniciar sesión
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Si no tienes cuenta, contacta al administrador del sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
