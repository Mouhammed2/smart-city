import { type FormEvent, useState } from 'react';
import { Eye, EyeOff, Globe, Lock, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AuthShell } from './auth-shell';
import { type AuthErrors, type RegisterDTO, validateRegister } from './auth-dto';
import { Button } from '../../fixMyCity/components/ui/button';
import { Input } from '../../fixMyCity/components/ui/input';
import { Label } from '../../fixMyCity/components/ui/label';
import { useAppDispatch } from '../../busWay/store/hooks';
import { showNotification } from '../../busWay/store/slices/uiSlice';

const initialValues: RegisterDTO = {
  name: '',
  lastName: '',
  email: '',
  password: '',
  website: '',
};

export function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [values, setValues] = useState<RegisterDTO>(initialValues);
  const [errors, setErrors] = useState<AuthErrors<RegisterDTO>>({});
  const [showPassword, setShowPassword] = useState(false);

  function setField<K extends keyof RegisterDTO>(field: K, value: RegisterDTO[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegister(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    dispatch(
      showNotification({
        message: 'Compte cree. Connectez-vous avec vos identifiants.',
        severity: 'success',
      }),
    );
    navigate('/login');
  }

  return (
    <AuthShell
      title="Creer un compte"
      description="Inscrivez-vous pour signaler et suivre les incidents"
      activeTab="register"
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="register-name">Prenom</Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="register-name"
                autoComplete="given-name"
                className="pl-9"
                placeholder="Votre prenom"
                value={values.name}
                onChange={(event) => setField('name', event.target.value)}
              />
            </div>
            {errors.name ? <p className="text-sm text-red-600">{errors.name}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-last-name">Nom</Label>
            <Input
              id="register-last-name"
              autoComplete="family-name"
              placeholder="Votre nom"
              value={values.lastName}
              onChange={(event) => setField('lastName', event.target.value)}
            />
            {errors.lastName ? <p className="text-sm text-red-600">{errors.lastName}</p> : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email">Adresse e-mail</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              className="pl-9"
              placeholder="exemple@ville.ma"
              value={values.email}
              onChange={(event) => setField('email', event.target.value)}
            />
          </div>
          {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">Mot de passe</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="pl-9 pr-10"
              placeholder="Choisissez un mot de passe"
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

        <div className="space-y-2">
          <Label htmlFor="register-website">Site web (optionnel)</Label>
          <div className="relative">
            <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              id="register-website"
              type="url"
              placeholder="https://monsite.com"
              className="pl-9"
              value={values.website}
              onChange={(event) => setField('website', event.target.value)}
            />
          </div>
          {errors.website ? <p className="text-sm text-red-600">{errors.website}</p> : null}
        </div>

        <Button className="w-full" type="submit">
          S'inscrire
        </Button>
      </form>
    </AuthShell>
  );
}

