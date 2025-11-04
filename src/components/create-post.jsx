"use client";
import { useState } from "react";

export default function CreatePostModal({ action }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button
        className="bg-[#c01378] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer "
        onClick={() => setShow(true)}
      >
        Create New Post
      </button>

      {show && (
        <div>
          <div>
            <button onClick={() => setShow(false)}>✕</button>
            <form action={action}>
              <label htmlFor="title">Title: </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="post title"
                required
              />

              <label htmlFor="content">Content: </label>
              <textarea
                name="content"
                id="content"
                placeholder="Post Content"
                required
              />

              <label htmlFor="img_url">Image URL: </label>
              <input
                type="text"
                id="img_url"
                name="img_url"
                placeholder="Insert Image"
              />

              <button type="submit">Post</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
