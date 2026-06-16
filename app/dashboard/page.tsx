import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("Dashboard session user:", session?.user);

  if (session?.user.role === "FREELANCER") {
    redirect("/freelancer/dashboard");
  }

  if (session?.user.role === "CLIENT") {
    redirect("/client/dashboard");
  }

  redirect("/");
}