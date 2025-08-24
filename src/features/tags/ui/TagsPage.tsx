import React, { useEffect, useMemo, useState } from "react";
import { Button, Table, Space, Modal, Form, Input, message } from "antd";
import { http } from "@/shared/api/http";

type Tag = { id: number; name: string };

export default function TagsPage() {
  const [rows, setRows] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const columns = useMemo(() => [
    { title: "ID", dataIndex: "id", width: 80 },
    { title: "Name", dataIndex: "name" },
    {
      title: "Actions",
      render: (_: any, rec: Tag) => (
        <Space>
          <Button onClick={() => onEdit(rec)}>Edit</Button>
          <Button danger onClick={() => onDelete(rec)}>Delete</Button>
        </Space>
      )
    }
  ], []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const r = await http.get("/api/manage/tags");
      setRows(r.data || []);
    } catch {
      message.error("Не удалось загрузить теги");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const onCreate = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const onEdit = (rec: Tag) => {
    setEditing(rec);
    form.setFieldsValue(rec);
    setOpen(true);
  };

  const onDelete = (rec: Tag) => {
    Modal.confirm({
      title: `Удалить тег #${rec.id}?`,
      onOk: async () => {
        try {
          await http.delete(`/manage/tags/${rec.id}`);
          message.success("Удалено");
          loadAll();
        } catch {
          message.error("Ошибка удаления");
        }
      }
    });
  };

  const onSubmit = async () => {
    const val = await form.validateFields();
    try {
      if (editing) {
        await http.put(`/manage/tags/${editing.id}`, val);
        message.success("Сохранено");
      } else {
        await http.post(`/manage/tags`, val);
        message.success("Создано");
      }
      setOpen(false);
      loadAll();
    } catch {
      message.error("Ошибка сохранения");
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={onCreate}>Добавить тег</Button>
        <Button onClick={loadAll}>Обновить</Button>
      </Space>
      <Table rowKey="id" dataSource={rows} columns={columns} loading={loading} />
      <Modal
        title={editing ? "Редактировать тег" : "Новый тег"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        okText="Сохранить"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Название" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

