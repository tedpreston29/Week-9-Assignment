import { db } from "@/utils/connect";
import Link from "next/link";
import CreatePostModal from "@/components/create-post";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function Posts({ searchParams }) {
  const resolvedParams = await searchParams;
  const sortParam = resolvedParams?.sort;

  let order = sortParam === "desc" ? "DESC" : "ASC";

  console.log("order is", order);

  const results = await db.query(
    `SELECT posts.*, userprofiles.id AS user_id, userprofiles.username FROM posts JOIN userprofiles ON posts.user_id = userprofiles.id ORDER BY posts.created_at ${order}`
  );
  const posts = results.rows;
  console.log("results", posts);

  async function handleCreatePost(formData) {
    "use server";

    const { title, content, img_url } = Object.fromEntries(formData);

    const { userId } = await auth();

    const sqlId = (
      await db.query(`SELECT ID FROM userprofiles WHERE clerk_id = $1`, [
        userId,
      ])
    ).rows[0].id;

    await db.query(
      `INSERT INTO posts (user_id, title, content, img_url) VALUES ($1, $2, $3, $4)`,
      [sqlId, title, content, img_url]
    );

    revalidatePath("/posts");
    redirect("/posts");
  }

  return (
    <div>
      <div>
        <h1 className="flex justify-center text-4xl mt-5 mb-6">Posts Feed</h1>
      </div>
      <div className="flex justify-center gap-4 ">
        <CreatePostModal action={handleCreatePost} />
        <Link
          className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base pt-3 h-10 sm:h-12 px-4 sm:px-5 cursor-pointer items-center"
          href="/posts?sort=asc"
        >
          Oldest
        </Link>
        <Link
          className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base pt-3 h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"
          href="/posts?sort=desc"
        >
          Most Recent
        </Link>
      </div>

      <div className="m-6  flex flex-col items-center gap-8">
        {posts.map((post) => (
          <div
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-md p-4 mb-6  hover:shadow-lg transition"
            key={post.id}
          >
            <Link href={`posts/${post.id}`}>
              <h2>
                {post.title} | {post.created_at.toLocaleDateString("en-gb")}
              </h2>

              <img src={post.img_url} className="w-[650px] h-[700px]" />
              <p>{post.username}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
