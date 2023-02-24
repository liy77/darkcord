import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";
import darkcord_logo from "../assets/darkcord-logo.svg";

function Button({ href, children }: PropsWithChildren<{ href: string }>) {
  return (
    <Link
      className="dark:bg-white bg-dark-800 text-white dark:text-dark-800 focus:ring-width-2 flex h-11 transform-gpu cursor-pointer select-none appearance-none flex-row place-items-center rounded border-0 px-6 text-base font-semibold leading-none text-white no-underline outline-0 focus:ring focus:ring-white active:translate-y-px"
      href={href}
      prefetch={false}
    >
      {children}
    </Link>
  );
}

export default function Page() {
  return (
    <main className="flex w-full h-full flex-col place-items-center place-content-center">
      <header className="flex relative rounded-lg">
        <Image
          width={300}
          height={300}
          src={darkcord_logo}
          alt="darkcord_icon"
        />
      </header>

      <section className="mt-12 grid grid-cols-2 gap-4">
        <Button href="/docs">Go to Docs</Button>
        <Button href="https://darkcord-guide.vercel.app">Go to Guide</Button>
      </section>

      <section className="mt-4">
        <Button href="https://github.com/JustAWaifuHunter/darkcord">
          GitHub
        </Button>
      </section>
    </main>
  );
}
