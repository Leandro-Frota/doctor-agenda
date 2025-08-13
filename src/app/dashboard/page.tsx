import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SignOutButton from "./component/sign-out-button ";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { usersToClinicTable } from "@/db/schema";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  const clinics = await db.query.usersToClinicTable.findMany({
    where: eq(usersToClinicTable.userId, session.user.id),
  });


  if (clinics.length === 0) {
    redirect("/clinic-form");
  }
  console.log("Clinics:", clinics);
  console.log("Session:", session);
  return (
    <div>
      <h1>Dashboard</h1>
      <h1>{session?.user.name}</h1>
      <h1>{session?.user.email}</h1>
      <h2>{clinics.map(()=>{
        return clinics[0].clinicId;
      })}</h2>
      <p>Welcome to the dashboard!</p>
      <SignOutButton />
    </div>
  );
};

export default DashboardPage;
