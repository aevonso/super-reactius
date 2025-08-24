import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Typography, message, Card } from "antd";

const { Title } = Typography;

// axios без baseURL — ходим по относительным путям через Vite proxy
const http = axios.create({
  timeout: 15000,
  withCredentials: false, // важно: не включаем, чтобы не ловить CORS по credential-policy
  validateStatus: (s) => s < 500,
});

type TokenResponse = {
  access?: string;        // если SimpleJWT-подобный
  refresh?: string;
  token?: string;         // если токен в одном поле
  [k: string]: any;
};

async function loginExact(email: string, password: string) {
  // у разных беков бывает username или email — попробуем оба формата
  const candidates = [
    { data: { email, password },         note: "JSON {email,password}" },
    { data: { username: email, password }, note: "JSON {username,password}" },
  ];

  for (const c of candidates) {
    const res = await http.post<TokenResponse>("/auth/token-generate", c.data, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });

    if (res.status >= 200 && res.status < 300 && res.data) {
      // нормализуем токен
      const access = res.data.access || res.data.token || res.data.jwt || res.data.Authorization;
      if (!access) {
        // на всякий — вдруг токен лежит под другим ключом
        const firstTokenLike = Object.values(res.data).find(
          (v) => typeof v === "string" && v.length > 20
        ) as string | undefined;
        if (firstTokenLike) return { token: firstTokenLike, raw: res.data, note: c.note };
      }
      return { token: access, raw: res.data, note: c.note };
    }

    if (res.status === 400 || res.status === 401) {
      // маршрут существует, но формат/данные не подошли — пробуем следующий формат
      continue;
    }
  }

  throw new Error("[login] Не удалось получить токен на /auth/token-generate");
}

async function refreshToken(refresh: string) {
  const res = await http.post<TokenResponse>("/auth/token-refresh", { refresh }, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  if (res.status >= 200 && res.status < 300) return res.data;
  throw new Error("[refresh] Не удалось обновить токен");
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { token, raw, note } = await loginExact(values.email, values.password);
      if (!token) throw new Error("Токен не найден в ответе.");
      localStorage.setItem("auth_token", token);
      message.success("Успешный вход");
      console.log("[LOGIN OK]", { note, raw });

      // пример защищённого запроса
      const me = await http.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("[PROFILE]", me.status, me.data);
    } catch (e: any) {
      console.error("[LOGIN ERROR]", e);
      message.error(e?.message || "Не удалось войти");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <Card style={{ width: 380 }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>Вход</Title>
        <Form layout="vertical" onFinish={onFinish} initialValues={{ email: "test@test.ru", password: "123456" }}>
          <Form.Item name="email" label="Email" rules={[{ required: true }, { type: "email" }]}><Input /></Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{ required: true }]}><Input.Password /></Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>Войти</Button>
        </Form>
      </Card>
    </div>
  );
}
