export type UserLoginDTO = {
  email: string;
  password: string;
  stayLogin: boolean;
};

export type RegisterDTO = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  website: string;
};

export type AuthErrors<T> = Partial<Record<keyof T, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(values: UserLoginDTO): AuthErrors<UserLoginDTO> {
  const errors: AuthErrors<UserLoginDTO> = {};

  if (!values.email.trim()) {
    errors.email = "L'adresse e-mail est obligatoire";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Saisissez une adresse e-mail valide";
  }

  if (!values.password.trim()) {
    errors.password = "Le mot de passe est obligatoire";
  } else if (values.password.length < 3 || values.password.length > 50) {
    errors.password = "Le mot de passe doit contenir entre 3 et 50 caracteres";
  }

  return errors;
}

export function validateRegister(values: RegisterDTO): AuthErrors<RegisterDTO> {
  const errors: AuthErrors<RegisterDTO> = {};

  if (!values.name.trim()) {
    errors.name = "Le prenom est obligatoire";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "Le nom est obligatoire";
  }

  if (!values.email.trim()) {
    errors.email = "L'adresse e-mail est obligatoire";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Saisissez une adresse e-mail valide";
  }

  if (!values.password.trim()) {
    errors.password = "Le mot de passe est obligatoire";
  } else if (values.password.length < 6 || values.password.length > 100) {
    errors.password = "Le mot de passe doit contenir entre 6 et 100 caracteres";
  }

  if (values.website.trim()) {
    try {
      new URL(values.website);
    } catch {
      errors.website = "Le site web doit etre une URL valide";
    }
  }

  return errors;
}

