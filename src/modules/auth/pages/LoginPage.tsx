import { LoginRequestSchema } from '@bopacorp/shared/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { z } from 'zod';
import { Button } from '@/components/ui/button.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.js';
import { Input } from '@/components/ui/input.js';
import { PasswordInput } from '@/components/ui/password-input.js';
import { hasAnyAdminRole } from '@/modules/auth/constants.js';
import { LOGIN_ERROR_KEYS } from '@/shared/errors/auth.js';
import { getErrorMessage } from '@/shared/errors/index.js';
import { FormAlert } from '@/shared/ui/FormAlert.js';
import { ModeToggle } from '@/shared/ui/ModeToggle.js';
import { useAuth } from '../context/AuthContext.js';

type LoginFormValues = z.input<typeof LoginRequestSchema>;

export default function LoginPage() {
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const next = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
  };
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

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!form.formState.isDirty) return;
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [form.formState.isDirty]);

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    try {
      await login(
        { email: values.email, password: values.password },
        { validate: (u) => hasAnyAdminRole(u.roles) },
      );
      toast.success(t('auth.sessionStarted'));
      navigate(from, { replace: true });
    } catch (err) {
      setAuthError(getErrorMessage(err, LOGIN_ERROR_KEYS));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="fixed top-4 right-4 flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleLang}>
          <Globe className="size-4" />
          <span className="sr-only">{i18n.language === 'es' ? 'English' : 'Español'}</span>
        </Button>
        <ModeToggle />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">BOPACORP</CardTitle>
          <CardDescription>{t('auth.login')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            {authError && <FormAlert message={authError} />}

            <FieldGroup>
              <Field data-invalid={form.formState.errors.email ? true : undefined}>
                <FieldLabel htmlFor="email">{t('auth.email')}</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@bopacorp.com"
                  autoComplete="email"
                  maxLength={150}
                  disabled={form.formState.isSubmitting}
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <FieldError>{form.formState.errors.email.message}</FieldError>
                )}
              </Field>

              <Field data-invalid={form.formState.errors.password ? true : undefined}>
                <FieldLabel htmlFor="password">{t('auth.password')}</FieldLabel>
                <PasswordInput
                  id="password"
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

            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting ||
                (form.formState.isSubmitted && !form.formState.isValid)
              }
              className="w-full"
            >
              {form.formState.isSubmitting && (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              )}
              {t('auth.login')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
