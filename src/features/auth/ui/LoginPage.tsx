import React, { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import { login, getProfile } from "@/shared/http";
import { useHistory } from "react-router-dom";

export default function LoginPage() {
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const onFinish = async (values: any) => {
    setError(null);
    setLoading(true);
    try {
      const { access, refresh } = await login(values.email, values.password);
      localStorage.setItem("access_token", access);
      if (refresh) localStorage.setItem("refresh_token", refresh);
      await getProfile(access);
      history.replace("/posts");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "72px auto" }}>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }}/>}
      <Form onFinish={onFinish} layout="vertical" initialValues={{ email: "test@test.ru" }}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
        <Form.Item name="password" label="Пароль" rules={[{ required: true }]}>
          <Input.Password/>
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>Войти</Button>
      </Form>
    </div>
  );
}
