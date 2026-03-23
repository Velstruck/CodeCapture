"use client";

import { useUser } from "@/components/auth-provider";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TagsPage() {
  const { user } = useUser();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Manage Tags</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tags Overview</CardTitle>
          <CardDescription>
            This page is under construction. It will allow you to see analytics on tags and rename or delete them across your snippets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">You can currently filter by tags on the main Dashboard view.</p>
          <div className="flex gap-2">
            <Badge variant="outline">demo-tag</Badge>
            <Badge variant="outline">react</Badge>
            <Badge variant="outline">auth</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
