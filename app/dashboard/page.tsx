import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";

export default async function DashboardPage() {
  const session = await getSession();

  if (session?.user.role === "FREELANCER") {
    redirect("/freelancer/dashboard");
  }

  if (session?.user.role === "CLIENT") {
    redirect("/client/dashboard");
  }

  redirect("/");
}