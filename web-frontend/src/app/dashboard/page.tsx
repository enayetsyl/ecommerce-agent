"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAppContext } from "@/contexts/AppContext";
import { useGetMe } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAppContext();
  const { data: userData, isLoading } = useGetMe();

  const displayUser = (userData || user) as {
    id: string;
    email?: string;
    name?: string | null;
    created_at?: string;
    updated_at?: string;
  } | null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Here&apos;s your account information.
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      ) : displayUser ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-lg font-semibold">
                    {displayUser.name || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-lg font-semibold">
                    {displayUser.email || "Not set"}
                  </p>
                </div>
              </div>
              {userData && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Account Created
                      </p>
                      <p className="text-lg font-semibold">
                        {format(new Date(userData.created_at), "MMMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Last Updated
                      </p>
                      <p className="text-lg font-semibold">
                        {format(new Date(userData.updated_at), "MMMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account ID</CardTitle>
              <CardDescription>Your unique account identifier</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-sm text-muted-foreground">
                {displayUser.id}
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No user data available
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
