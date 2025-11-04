import { db } from "@/utils/connect";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function EditUser() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) redirectToSignIn();

  const data = await db.query(
    `SELECT username, bio, img_url FROM userprofiles WHERE clerk_id =$1`,
    [userId]
  );
  const user = data.rows[0];

  async function handleEditUser(formData) {
    "use server";

    const username = formData.get("username");
    const bio = formData.get("bio");
    const img_url = formData.get("img_url");

    await db.query(
      `UPDATE userprofiles
        SET username = $1,
        bio = $2,
        img_url = $3
        WHERE clerk_id = $4`,
      [username, bio, img_url, userId]
    );

    redirect(`/profile`);
  }

  return (
    <div>
      <h2>Edit Profile Page</h2>
      <div>
        <form action={handleEditUser}>
          <input
            name="username"
            placeholder="Update Username"
            defaultValue={user.username}
          />
          <input name="bio" placeholder="Update Bio" defaultValue={user.bio} />
          <input
            name="img_url"
            placeholder="Update Profile Image"
            defaultValue={user.img_url}
          />
          <button className="ml-8" type="submit">
            Confirm Changes
          </button>
        </form>
      </div>
    </div>
  );
}
