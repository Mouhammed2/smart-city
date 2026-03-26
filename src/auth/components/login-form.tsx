import { type FormEvent, useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AuthShell } from './auth-shell';
import { type AuthErrors, type UserLoginDTO, validateLogin } from './auth-dto';
import { Button } from '../../fixMyCity/components/ui/button';
import { Checkbox } from '../../fixMyCity/components/ui/checkbox';
import { Input } from '../../fixMyCity/components/ui/input';
import { Label } from '../../fixMyCity/components/ui/label';
import { useAppDispatch } from '../../store/hooks';
import { login } from '../store/authSlice';
import { useAuth } from '../store/useAuth';
import { showNotification } from '../../store/slices/uiSlice';

const initialValues: UserLoginDTO = {
  email: '',
  password: '',
  stayLogin: false,
};

export function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAuth();
  const [values, setValues] = useState<UserLoginDTO>(initialValues);
  const [errors, setErrors] = useState<AuthErrors<UserLoginDTO>>({});
  const [showPassword, setShowPassword] = useState(false);

  function setField<K extends keyof UserLoginDTO>(field: K, value: UserLoginDTO[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLogin(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      await login({ email: values.email, password: values.password, stayLogin: values.stayLogin });

      dispatch(
        showNotification({
          message: 'Connexion reussie',
          severity: 'success',
        }),
      );
      navigate('/civic');
    } catch (error) {
      dispatch(
        showNotification({
          message: error instanceof Error ? error.message : 'Erreur de connexion',
          severity: 'error',
        }),
      );
    }
  }

  return (
    <AuthShell title="Bon retour" description="Connectez-vous a votre compte" activeTab="login">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="login-email">Adresse e-mail</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="exemple@ville.ma"
              className="pl-9"
              value={values.email}
              onChange={(event) => setField('email', event.target.value)}
            />
          </div>
          {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password">Mot de passe</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Saisissez votre mot de passe"
              className="pl-9 pr-10"
              value={values.password}
              onChange={(event) => setField('password', event.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-1 top-1/2 h-8 -translate-y-1/2 px-2 text-slate-500"
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          {errors.password ? <p className="text-sm text-red-600">{errors.password}</p> : null}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="stay-login"
            checked={values.stayLogin}
            onCheckedChange={(checked) => setField('stayLogin', checked === true)}
          />
          <Label htmlFor="stay-login" className="font-normal text-slate-600">
            Rester connecte
          </Label>
        </div>


        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>
    </AuthShell>
  );
}

