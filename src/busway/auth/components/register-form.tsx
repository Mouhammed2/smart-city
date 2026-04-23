import { type FormEvent, useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthShell } from './auth-shell';
import { type AuthErrors, type RegisterPayload, validateRegister } from './auth-dto';
import { Button } from 'fixMyCity/components/ui/button';
import { Checkbox } from 'fixMyCity/components/ui/checkbox';
import { Input } from 'fixMyCity/components/ui/input';
import { Label } from 'fixMyCity/components/ui/label';
import { register } from '../store/authSlice';

const initialValues: RegisterPayload = { email: '', password: '', rememberMe: true };

const resolveRedirect = (candidate: string | null | undefined, fallback: string) =>
  candidate && candidate.startsWith('/') ? candidate : fallback;

export function RegisterForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState<RegisterPayload>(initialValues);
  const [errors, setErrors] = useState<AuthErrors<RegisterPayload>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryRedirect = new URLSearchParams(location.search).get('redirect');
  const fromState = (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from;
  const stateRedirect = fromState?.pathname
    ? `${fromState.pathname}${fromState.search ?? ''}${fromState.hash ?? ''}`
    : undefined;
  const redirectTo = resolveRedirect(queryRedirect ?? stateRedirect, '/fixmycity');

  function setField<K extends keyof RegisterPayload>(field: K, value: RegisterPayload[K]) {
    setValues((c) => ({ ...c, [field]: value }));
    setErrors((c) => ({ ...c, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegister(values);
    if (Object.keys(nextErrors).length > 0) { setErrors(nextErrors); return; }

    setLoading(true);
    try {
      await register(values);
      toast.success('Inscription reussie');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inscription';
      setErrors({ email: message });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
      <AuthShell title="Creer un compte" description="Inscrivez-vous pour signaler et suivre les incidents" activeTab="register">
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="register-email">Adresse e-mail</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input id="register-email" type="email" autoComplete="email" className="pl-9"
                     placeholder="exemple@ville.ma" value={values.email} onChange={(e) => setField('email', e.target.value)} />
            </div>
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password">Mot de passe</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input id="register-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                     className="pl-9 pr-10" placeholder="Choisissez un mot de passe"
                     value={values.password} onChange={(e) => setField('password', e.target.value)} />
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword((c) => !c)}
                      className="absolute right-1 top-1/2 h-8 -translate-y-1/2 px-2 text-slate-500">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="register-remember-me" checked={values.rememberMe}
                      onCheckedChange={(checked) => setField('rememberMe', checked === true)} />
            <Label htmlFor="register-remember-me" className="font-normal text-slate-600">Rester connecte</Label>
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Inscription...' : "S'inscrire"}
          </Button>
        </form>
      </AuthShell>
  );
}