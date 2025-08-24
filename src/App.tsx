import React from "react";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import { Layout, Menu, Spin } from "antd";
import ProtectedRoute from "@/app/routes/ProtectedRoute";

const LoginPage = React.lazy(() => import("@/features/auth/ui/LoginPage"));
const PostListPage = React.lazy(() => import("@/features/posts/ui/PostListPage"));
const AuthorListPage = React.lazy(() => import("@/features/authors/ui/AuthorListPage"));
const TagListPage = React.lazy(() => import("@/features/tags/ui/TagListPage"));

const { Header, Content } = Layout;

export default function App() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <Menu theme="dark" mode="horizontal" selectable={false}>
          <Menu.Item key="posts"><Link to="/posts">Посты</Link></Menu.Item>
          <Menu.Item key="authors"><Link to="/authors">Авторы</Link></Menu.Item>
          <Menu.Item key="tags"><Link to="/tags">Теги</Link></Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: 24 }}>
        <React.Suspense fallback={<Spin />}>
          <Switch>
            <Route path="/login" component={LoginPage} />
            <ProtectedRoute path="/posts" component={PostListPage}/>
            <ProtectedRoute path="/authors" component={AuthorListPage}/>
            <ProtectedRoute path="/tags" component={TagListPage}/>
            <Redirect exact from="/" to="/posts"/>
          </Switch>
        </React.Suspense>
      </Content>
    </Layout>
  );
}
