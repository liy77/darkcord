import { Button } from 'ariakit';
import { FiCommand } from 'react-icons/fi';
import { VscColorMode, VscSearch } from 'react-icons/vsc';

export function Navbar() {
	return (
		<>
			<header className="header-base fixed top-0 left-0 z-20 w-full border-b">
				<div className="h-60px block px-6">
					<div className="flex h-full flex-row place-content-between place-items-center">
						<span>Logo</span>
						<div className="flex flex-row place-items-center gap-4">
							<Button as="div" className="border-base rounded border px-4 py-2.5 outline-0">
								<div className="flex flex-row place-items-center gap-24">
									<div className="flex flex-row place-items-center gap-2">
										<VscSearch size={18} />
										<span className="opacity-65">Search</span>
									</div>

									<div className="opacity-65 flex flex-row place-items-center gap-2">
										<FiCommand size={18} /> + K
									</div>
								</div>
							</Button>
							<Button
								aria-label="Toggle Theme"
								className="flex hidden h-6 w-6 transform-gpu cursor-pointer select-none appearance-none place-items-center rounded-full rounded border-0 bg-transparent p-0 leading-none no-underline outline-0 focus:ring active:translate-y-px"
							>
								<VscColorMode size={24} />
							</Button>
						</div>
					</div>
				</div>
			</header>
		</>
	);
}
