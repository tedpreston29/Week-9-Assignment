import { db } from "@/utils/connect";

export default async function IndivPost({ params }) {
  const { id } = await params;

  const result = await db.query(
    `SELECT posts.*, userprofiles.id, userprofiles.username FROM posts JOIN userprofiles ON posts.user_id = userprofiles.id`
  );

  const posts = result.rows[0];

  return (
    <div>
      <div key={posts.id}>
        <h2>
          {posts.title} | {posts.created_at.toLocaleDateString("en-gb")}
        </h2>
        <img src={posts.img_url} />
        <p>{posts.username}</p>
        <p>{posts.content}</p>
      </div>
    </div>
  );
}
