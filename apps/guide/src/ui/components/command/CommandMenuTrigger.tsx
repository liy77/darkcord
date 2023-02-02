import { iconSize, SearchIcon } from '@expo/styleguide';
import { Button } from 'ariakit/button';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useKey } from 'react-use';
import { isAppleDevice } from '~/utils/isAppleDevice';

type CommandMenuTriggerProps = {
	setOpen: Dispatch<SetStateAction<boolean>>;
	visibleOnMobile: boolean;
};

export function CommandMenuTrigger({ setOpen, visibleOnMobile }: CommandMenuTriggerProps) {
	const [isMac, setIsMac] = useState<boolean | null>(null);

	useEffect(() => {
		setIsMac(typeof navigator !== 'undefined' && isAppleDevice());
	}, []);

	useKey(
		(event) => {
			if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				return true;
			}

			return false;
		},
		() => setOpen(true),
		{ event: 'keydown', options: {} },
		[],
	);

	return visibleOnMobile ? (
		<Button
			as="div"
			className="focus:ring-width-2 focus:ring-blue border-base rounded border px-4 py-2.5 outline-0 focus:ring"
			onClick={() => setOpen(true)}
		>
			<div className="flex flex-row place-items-center gap-4">
				<SearchIcon color="currentColor" size={iconSize.sm} />

				<span className="opacity-65">Search</span>

				<div className="opacity-65 flex flex-row place-items-center gap-2">
					{isMac !== null && <div>{isMac ? '⌘' : 'Ctrl'} K</div>}
				</div>
			</div>
		</Button>
	) : (
		<Button as="div" className="border-base rounded border px-4 py-2.5 outline-0" onClick={() => setOpen(true)}>
			<SearchIcon color="#787f85" size={iconSize.sm} />
		</Button>
	);
}
