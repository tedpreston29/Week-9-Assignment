import { db } from "@/utils/connect";

export default async function IndivPost({ params }) {
  const { id } = await params;

  const postResult = await db.query(
    `SELECT posts.*, userprofiles.id, userprofiles.username FROM posts JOIN userprofiles ON posts.user_id = userprofiles.id`
  );

  const posts = postResult.rows[0];

  if (!posts) {
    return <p>Post Not Found</p>;
  }

  const commentsResult = await db.query(
    `SELECT comments.comment, comments.created_at, userprofiles.username
    FROM comments
    JOIN userprofiles ON comments.user_id = userprofiles.id
    WHERE comments.post_id = $1`,
    [id]
  );
  const comments = commentsResult.rows;

  console.log("comments", comments);

  return (
    <div className="m-5">
      <div className="pb-10" key={posts.id}>
        <h2>
          {posts.title} | {posts.created_at.toLocaleDateString("en-gb")}
        </h2>
        <img src={posts.img_url} />
        <p>{posts.username}</p>
        <p>{posts.content}</p>
      </div>
      <div>
        {comments.map((comment) => (
          <div className="pb-3" key={comment.id}>
            <p>{comment.username}:</p>
            <p>
              {comment.comment} |{" "}
              {comment.created_at.toLocaleDateString("en-gb")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
