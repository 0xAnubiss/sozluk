"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type StoredUser = {
  name: string;
  profession: string;
  languages: string;
  email: string;
  password: string;
  avatarUrl?: string;
};

const USERS_KEY = "kalem-sozluk-users";
const SESSION_KEY = "kalem-sozluk-current-user";

function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

function saveSession(user: StoredUser) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      name: user.name,
      email: user.email,
      profession: user.profession,
      languages: user.languages,
      avatarUrl: user.avatarUrl
    })
  );
  window.dispatchEvent(new Event("kalem-auth-change"));
}

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    profession: "",
    languages: "",
    email: "",
    password: "",
    avatarUrl: ""
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateAvatar(file?: File) {
    if (!file) {
      updateField("avatarUrl", "");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateField("avatarUrl", typeof reader.result === "string" ? reader.result : "");
    };
    reader.readAsDataURL(file);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const user: StoredUser = {
      name: form.name.trim(),
      profession: form.profession.trim(),
      languages: form.languages.trim(),
      email: form.email.trim().toLocaleLowerCase("tr"),
      password: form.password,
      avatarUrl: form.avatarUrl
    };

    if (!user.name || !user.email || user.password.length < 6) {
      setIsError(true);
      setMessage("Ad, e-posta ve en az 6 karakterli şifre gerekli.");
      return;
    }

    const users = readUsers();
    if (users.some((item) => item.email === user.email)) {
      setIsError(true);
      setMessage("Bu e-posta ile daha önce kayıt olundu.");
      return;
    }

    localStorage.setItem(USERS_KEY, JSON.stringify([user, ...users]));
    saveSession(user);
    setIsError(false);
    setMessage("Kayıt tamamlandı. Profil ve katkı ekranları artık bu oturumu kullanabilir.");
    router.push("/contribute");
    router.refresh();
  }

  return (
    <section className="auth-panel">
      <span className="section-kicker">Yeni üyelik</span>
      <h1>Kale&apos;m Sözlük hesabı oluştur</h1>
      <form className="auth-form" onSubmit={submit}>
        <label className="field">
          <span>Ad soyad</span>
          <input type="text" value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Selin Arda" />
        </label>
        <label className="field">
          <span>Meslek</span>
          <input type="text" value={form.profession} onChange={(event) => updateField("profession", event.target.value)} placeholder="Çevirmen, öğretmen, öğrenci..." />
        </label>
        <label className="field">
          <span>Bildiği diller</span>
          <input type="text" value={form.languages} onChange={(event) => updateField("languages", event.target.value)} placeholder="Türkçe C2, Fransızca C1" />
        </label>
        <label className="field">
          <span>Profil resmi</span>
          <input type="file" accept="image/*" onChange={(event) => updateAvatar(event.target.files?.[0])} />
        </label>
        <label className="field">
          <span>E-posta</span>
          <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="ad@ornek.com" />
        </label>
        <label className="field">
          <span>Şifre</span>
          <input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} placeholder="En az 6 karakter" />
        </label>
        <button type="submit" className="primary-button">
          Kayıt ol
        </button>
      </form>
      {message ? <p className={isError ? "form-feedback error" : "form-feedback success"}>{message}</p> : null}
      <p>
        Zaten hesabın var mı? <Link href="/login">Giriş yap</Link>
      </p>
    </section>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const users = readUsers();
    const user = users.find((item) => item.email === email.trim().toLocaleLowerCase("tr") && item.password === password);

    if (!user) {
      setMessage("E-posta veya şifre hatalı. Önce kayıt olarak yeni hesap açabilirsin.");
      return;
    }

    saveSession(user);
    setMessage("");
    router.push("/contribute");
    router.refresh();
  }

  return (
    <section className="auth-panel">
      <span className="section-kicker">Üye girişi</span>
      <h1>Hesabına giriş yap</h1>
      <form className="auth-form" onSubmit={submit}>
        <label className="field">
          <span>E-posta</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ad@ornek.com" />
        </label>
        <label className="field">
          <span>Şifre</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Şifren" />
        </label>
        <button type="submit" className="primary-button">
          Giriş yap
        </button>
      </form>
      {message ? <p className="form-feedback error">{message}</p> : null}
      <p>
        Hesabın yok mu? <Link href="/register">Kayıt ol</Link>
      </p>
    </section>
  );
}
