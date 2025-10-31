import { db } from "@/utils/connect";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const { isAuthenticated, redirectToSignIn, userId } = await auth();

  console.log("userID", userId);

  if (!isAuthenticated) {
    redirectToSignIn();
  }

  const res = await db.query(`SELECT * FROM userprofiles WHERE clerk_id = $1`, [
    userId,
  ]);

  const userInfo = res.rows[0];
  console.log(userInfo);

  const notInDb = userInfo === undefined;

  if (notInDb) redirect("/create-profile");

  return (
    <div>
      <div>
        <img src={userInfo.img_url} alt="Users Profile Picture"></img>
        <h1>{userInfo.username}'s Profile</h1>
        <p>{userInfo.bio}</p>
      </div>
      <Link href={"/profile/edit-profile"}>Edit Profile</Link>
    </div>
  );
}
