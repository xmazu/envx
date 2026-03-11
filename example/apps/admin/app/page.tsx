"use client";

import { useList } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@example/ui/components/card";
import { Button } from "@example/ui/components/button";
import Link from "next/link";
import { Plus, LayoutDashboard, Users, FileText } from "lucide-react";

const stats = [
  { title: "Total Users", value: "1,234", icon: Users, color: "bg-blue-500" },
  { title: "Total Posts", value: "567", icon: FileText, color: "bg-green-500" },
  { title: "Active Now", value: "42", icon: LayoutDashboard, color: "bg-purple-500" },
];

export default function DashboardPage() {
  const { result: usersResult, query: usersQuery } = useList({ resource: "users", pagination: { pageSize: 5 } });
  const { result: postsResult, query: postsQuery } = useList({ resource: "posts", pagination: { pageSize: 5 } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Users</CardTitle>
            <Link href="/users">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {usersResult?.data?.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between border-b py-2 last:border-0">
                  <div>
                    <p className="font-medium">{user.name || user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              )) || <p className="text-muted-foreground">No users found</p>}
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Posts</CardTitle>
            <Link href="/posts">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {postsResult?.data?.map((post: any) => (
                <div key={post.id} className="flex items-center justify-between border-b py-2 last:border-0">
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{post.content}</p>
                  </div>
                </div>
              )) || <p className="text-muted-foreground">No posts found</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
