import Image from "next/image";
import { db } from "@/utils/connect";
import Link from "next/link";

export default async function Home({ searchParams }) {
  const resolvedParams = await searchParams;
  const sortParam = resolvedParams?.sort;

  let order = sortParam === "desc" ? "DESC" : "ASC";

  console.log("order is", order);

  const results = await db.query(
    `SELECT posts.*, userprofiles.id, userprofiles.username FROM posts JOIN userprofiles ON posts.user_id = userprofiles.id ORDER BY posts.created_at ${order}`
  );
  const posts = results.rows;
  console.log("results", posts);

  return (
    <div>
      <div>
        <h1 className="flex justify-center text-4xl mt-5 mb-6">Posts Feed</h1>
      </div>
      <div className="flex justify-end gap-4 pr-5 underline">
        <Link className="text-red-700" href="/posts?sort=asc">
          Oldest
        </Link>
        <Link className="text-cyan-300" href="/posts?sort=desc">
          Most Recent
        </Link>
      </div>
      <div className="m-6 max-w-52">
        {posts.map((post) => (
          <div className="flex flex-row" key={post.id}>
            <Link href={`posts/posts.id`}>
              <h2>
                {post.title} | {post.created_at.toLocaleDateString("en-gb")}
              </h2>

              <img src={post.img_url} />
              <p>{post.username}</p>
              <p>{post.content}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
