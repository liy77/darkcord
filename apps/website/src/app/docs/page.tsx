import Link from 'next/link';
import { buttonVariants } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';

export const runtime = 'edge';

export default function Page() {
	const data = ['main', '1.0.0'];

	return (
		<div className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
			<div className="container flex max-w-[64rem] flex-col items-center gap-4">
				<Card className="w-[380px]">
					<CardHeader>
						<CardTitle>Version</CardTitle>
						<CardDescription>Select a version</CardDescription>
					</CardHeader>

					<CardContent>
						<div className="flex flex-col gap-4">
							{data.map((version, idx) => (
								<Link
									href={`/docs/${version}`}
									className={buttonVariants({ variant: 'outline' })}
									key={`${version}-${idx}`}
								>
									<div className="flex grow flex-row justify-between items-center gap-4">
										<div className="flex flex-row items-center justify-between gap-4">
											<h2>{version}</h2>
										</div>
									</div>
								</Link>
							))}
						</div>
					</CardContent>

					<CardFooter>
						<Link className={buttonVariants({ variant: 'link', size: 'sm' })} href="/">
							Go back
						</Link>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
