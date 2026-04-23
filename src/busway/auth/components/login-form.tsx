import { type FormEvent, useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthShell } from './auth-shell';
import { type AuthErrors, type LoginPayload, validateLogin } from './auth-dto';
import { Button } from 'fixMyCity/components/ui/button';
import { Checkbox } from 'fixMyCity/components/ui/checkbox';
import { Input } from 'fixMyCity/components/ui/input';
import { Label } from 'fixMyCity/components/ui/label';
import { login } from '../store/authSlice';
import { useAuth } from '../store/useAuth';

const initialValues: LoginPayload = { email: '', password: '', rememberMe: false };

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useAuth();
  const [values, setValues] = useState<LoginPayload>(initialValues);
  const [errors, setErrors] = useState<AuthErrors<LoginPayload>>({});
  const [showPassword, setShowPassword] = useState(false);

  function setField<K extends keyof LoginPayload>(field: K, value: LoginPayload[K]) {
    setValues((c) => ({ ...c, [field]: value }));
    setErrors((c) => ({ ...c, [field]: undefined }));
  }

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/fixmycity';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLogin(values);
    if (Object.keys(nextErrors).length > 0) { setErrors(nextErrors); return; }

    try {
      await login(values);
      toast.success('Connexion reussie');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur de connexion';
      setErrors({ email: message });
      toast.error(message);
    }
  }

  return (
      <AuthShell title="Bon retour" description="Connectez-vous a votre compte" activeTab="login">
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <Label htmlFor="login-email">Adresse e-mail</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input id="login-email" type="email" autoComplete="email" placeholder="exemple@ville.ma"
                     className="pl-9" value={values.email} onChange={(e) => setField('email', e.target.value)} />
            </div>
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Mot de passe</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                     placeholder="Saisissez votre mot de passe" className="pl-9 pr-10"
                     value={values.password} onChange={(e) => setField('password', e.target.value)} />
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword((c) => !c)}
                      className="absolute right-1 top-1/2 h-8 -translate-y-1/2 px-2 text-slate-500">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="remember-me" checked={values.rememberMe}
                      onCheckedChange={(checked) => setField('rememberMe', checked === true)} />
            <Label htmlFor="remember-me" className="font-normal text-slate-600">Rester connecte</Label>
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </AuthShell>
  );
}