import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center">
      <h2>Where do you think you're going??</h2>
      <p>Could Not find requested post</p>
      <Link href={"/"}>Return to Home Page</Link>
    </div>
  );
}
