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

  const res = await db.query(
    `SELECT userprofiles.*, 
    ARRAY_AGG(
    JSON_BUILD_OBJECT(
    'id', posts.id, 
    'title', posts.title, 
    'content', posts.content, 
    'img_url', posts.img_url, 
    'created_at', posts.created_at
      ) 
    ) AS posts 
    FROM userprofiles 
    LEFT JOIN posts ON posts.user_id = userprofiles.id 
    WHERE userprofiles.clerk_id = $1 
    GROUP BY userprofiles.id`,
    [userId]
  );

  const userInfo = res.rows[0];
  console.log(userInfo);

  if (!userInfo) {
    redirect("/create-profile");
  }

  const userPosts = userInfo.posts || [];

  return (
    <div className="m-10">
      <div>
        <div className="edit-profile-button flex justify-between ">
          <h1>{userInfo.username}'s Profile</h1>
          <Link href={"/profile/edit-profile"} className="underline">
            Edit Profile Info Here
          </Link>
        </div>
        <img
          className="w-36"
          src={userInfo.img_url}
          alt="Users Profile Picture"
        ></img>

        <p>Bio: {userInfo.bio}</p>
      </div>

      <div className="mt-8">
        <h2 className="underline pb-4">My Posts</h2>
        {userPosts.length === 0 ? (
          <p>No Posts Yet? Go Make One!</p>
        ) : (
          <div className="flex flex-col gap-6">
            {userPosts.map((post) => (
              <div key={post.id}>
                <Link href={`posts/${post.id}`}>
                  <h3>{post.title} </h3>
                  <img className="max-w-40 max-h-60" src={post.img_url}></img>
                  <p>{post.content}</p>
                  <p></p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
