import { Route } from 'next';
import Link from 'next/link';
import { buttonVariants } from '~/components/ui/button';

export default function NotFound() {
	return (
		<div className="mx-auto max-w-lg min-h-screen flex flex-col items-center justify-center gap-8 px-8 py-16 lg:px-6 lg:py-0">
			<h1 className="text-[9rem] font-black leading-none md:text-[12rem]">404</h1>
			<h2 className="text-[2rem] md:text-[3rem]">Not found.</h2>
			<Link href={'/guide' as Route} className={buttonVariants({ variant: 'default' })}>
				Return
			</Link>
		</div>
	);
}
