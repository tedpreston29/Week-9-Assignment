import UserSignpForm from "@/components/UserSignUpForm";
import { db } from "@/utils/connect";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function UserPage({ params }) {
  const { id } = await params;
  const { isAuthenticated, redirectToSignIn, userId } = await auth();

  if (!isAuthenticated) {
    redirectToSignIn();
  }

  const res = await db.query(`SELECT * FROM userprofiles WHERE clerk_id = $1`, [
    id,
  ]);

  const userInfo = res.rows[0];
  console.log(userInfo);

  const notInDb = userInfo === undefined;

  if (notInDb) {
    return (
      <div>
        <UserSignpForm />
      </div>
    );
  }

  return (
    <div>
      <h1>Hey!</h1>
    </div>
  );
}
