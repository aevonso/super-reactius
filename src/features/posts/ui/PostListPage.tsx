// src/features/posts/ui/PostListPage.tsx
import React, { useEffect, useState } from "react";
import { Table, Button, Space } from "antd";
import { http } from "@/shared/http";

export default function PostListPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await http.get("/manage/posts"); // Bearer добавится сам
      if (res.status >= 200 && res.status < 300) {
        setData(Array.isArray(res.data) ? res.data : (res.data?.items || []));
      } else {
        // ничего в консоль — просто оставим таблицу пустой
        setData([]);
      }
    } catch {
      // тихо глотаем
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary">Добавить пост</Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        columns={[
          { title: "ID", dataIndex: "id", width: 100 },
          { title: "Title", dataIndex: "title" },
          {
            title: "Actions",
            width: 180,
            render: (_, rec) => (
              <Space>
                <Button size="small">Edit</Button>
                <Button size="small" danger>Delete</Button>
              </Space>
            ),
          },
        ]}
      />
    </div>
  );
}
