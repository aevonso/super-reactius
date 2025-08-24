import React from "react";
import { Table, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { FETCH_REQUEST } from "../model/slice";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PostListPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();
  const page = Number(query.get("page") ?? 1);
  const pageSize = Number(query.get("pageSize") ?? 10);

  const { items, total, loading, error } = useSelector((s: any) => s.posts || { items: [], total: 0, loading: false });

  React.useEffect(() => {
    dispatch({ type: FETCH_REQUEST, payload: { page, pageSize } });
  }, [page, pageSize]);

  return (
    <>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      <Table
        rowKey="id"
        loading={loading}
        dataSource={items}
        columns={[
          { title: "ID", dataIndex: "id", width: 80 },
          { title: "Title", dataIndex: "title" },
        ]}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (p, ps) => {
            const params = new URLSearchParams(location.search);
            params.set("page", String(p));
            params.set("pageSize", String(ps));
            history.push({ pathname: "/posts", search: `?${params.toString()}` });
          },
        }}
      />
    </>
  );
}
