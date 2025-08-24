import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Layout, Menu, Spin } from "antd";
import ProtectedRoute from "@/app/routes/ProtectedRoute";

const LoginPage = React.lazy(() => import("@/features/auth/ui/LoginPage"));
const PostListPage = React.lazy(() => import("@/features/posts/ui/PostListPage"));

const { Header, Content } = Layout;

export default function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <Menu theme="dark" mode="horizontal" selectable={false}>
          <Menu.Item key="posts">Posts</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: 24 }}>
        <React.Suspense fallback={<Spin />}>
          <Switch>
            <Route path="/login" component={LoginPage} />
            <ProtectedRoute path="/posts" component={PostListPage} />
            <Redirect exact from="/" to="/posts" />
            <Route render={() => <div>Not found</div>} />
          </Switch>
        </React.Suspense>
      </Content>
    </Layout>
  );
}
