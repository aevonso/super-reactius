import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { http } from "@/shared/http";

export default function AuthorListPage() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    http.get("/manage/authors").then(r => setData(r.data || []));
  }, []);
  return <Table rowKey="id" dataSource={data}
    columns={[{title:"ID",dataIndex:"id"},{title:"Имя",dataIndex:"name"}]}/>;
}
