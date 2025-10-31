import Image from "next/image";
import { db } from "@/utils/connect";
import Link from "next/link";

export default async function Home({ searchParams }) {
  const resolvedParams = await searchParams;
  const sortParam = resolvedParams?.sort;

  const order = sortParam === "desc" ? "DESC" : "ASC";

  const results = await db.query(
    `SELECT posts.*, userprofiles.id FROM posts JOIN userprofiles ON posts.user_id = userrofiles.id`
  );

  return (
    <div>
      <h1 className="flex justify-center text-4xl mt-10">Central Hub</h1>
    </div>
  );
}
