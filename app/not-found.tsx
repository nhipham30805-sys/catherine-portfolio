import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap flex min-h-svh flex-col justify-center pt-20">
      <h1 className="display max-w-4xl text-6xl md:text-8xl">You&apos;ve wandered off the trail.</h1>
      <Link href="/" className="btn btn-sun mt-8 w-fit">
        Head back to Base Camp
      </Link>
    </section>
  );
}
