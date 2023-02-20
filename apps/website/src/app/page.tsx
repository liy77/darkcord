import Image from "next/image";
import Link from "next/link";
import darkcord_logo from "../assets/darkcord-logo.svg";

export default function Page() {
  return (
    <section className="flex w-screen h-screen flex-col place-items-center place-content-center">
      <section className="flex relative rounded-lg">
        <Image
          width={300}
          height={300}
          src={darkcord_logo}
          alt="darkcord_icon"
        />
      </section>

      <section className="mt-12 flex flex-row gap-4">
        <Link
          className="dark:bg-white bg-dark-800 text-white dark:text-dark-800 focus:ring-width-2 flex h-11 transform-gpu cursor-pointer select-none appearance-none flex-row place-items-center rounded border-0 px-6 text-base font-semibold leading-none text-white no-underline outline-0 focus:ring focus:ring-white active:translate-y-px"
          href="/docs"
          prefetch={false}
        >
          Go to Docs
        </Link>

        <Link
          className="dark:bg-white bg-dark-800 text-white dark:text-dark-800 focus:ring-width-2 flex h-11 transform-gpu cursor-pointer select-none appearance-none flex-row place-items-center rounded border-0 px-6 text-base font-semibold leading-none text-white no-underline outline-0 focus:ring focus:ring-white active:translate-y-px"
          href="https://darkcord-guide.vercel.app/"
          prefetch={false}
        >
          Go to Guide
        </Link>
      </section>
    </section>
  );
}
