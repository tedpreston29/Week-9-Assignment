import { db } from "@/utils/connect";
import { auth } from "@clerk/nextjs/server";

export default async function UserSignUpForm() {
  const { userId } = await auth();

  console.log("user id:", userId);

  async function handleSubmit(formData) {
    "use server";

    const data = Object.fromEntries(formData);
    console.log("Data is", data);

    await db.query(
      `INSERT INTO userprofiles(username, bio, img_url, clerk_id) VALUES ($1, $2, $3, $4)`,
      [data.username, data.bio, data.img_url, userId]
    );
  }

  return (
    <form action={handleSubmit}>
      <input name="username" placeholder="Enter Username" required />
      <input name="bio" placeholder="Enter your Bio" required />
      <input name="img_url" placeholder="Add a Profile Picture" />
      <button type="submit">Submit</button>
    </form>
  );
}
