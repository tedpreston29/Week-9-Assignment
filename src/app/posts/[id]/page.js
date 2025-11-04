import { db } from "@/utils/connect";
import NotFound from "@/components/not-found";

export default async function IndivPost({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  console.log("id:", id);

  const postResult = await db.query(
    `SELECT posts.*, userprofiles.id, userprofiles.username FROM posts JOIN userprofiles ON posts.user_id = userprofiles.id WHERE posts.id = $1`,
    [id]
  );

  const posts = postResult.rows[0];

  console.log("posts", posts);

  if (!posts) {
    return <NotFound />;
  }

  const commentsResult = await db.query(
    `SELECT comments.id, comments.comment, comments.created_at, userprofiles.username
    FROM comments
    JOIN userprofiles ON comments.user_id = userprofiles.id
    WHERE comments.post_id = $1`,
    [id]
  );
  const comments = commentsResult.rows;

  console.log("comments", comments);

  return (
    <div className="flex gap-1 m-5 justify-center">
      <div
        className="flex flex-col max-w-max bg-gray-800 border border-gray-700 rounded-xl shadow-md p-4 mb-6  hover:shadow-lg transition"
        key={posts.id}
      >
        <h2>
          {posts.title} | {posts.created_at.toLocaleDateString("en-gb")}
        </h2>
        <img className="w-[650px] h-[700px]" src={posts.img_url} />
        <p>{posts.username}</p>
        <p>{posts.content}</p>
      </div>
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-md p-4 mb-6  hover:shadow-lg transition">
        <h2 className="underline pb-3 text-[25px]">Comments</h2>
        {comments.map((comment) => (
          <div className="pb-3" key={comment.id}>
            <p>{comment.username}:</p>
            <p>
              {comment.comment} |{" "}
              {comment.created_at.toLocaleDateString("en-gb")}
            </p>
            <p>
              -----------------------------------------------------------------------
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
