import type { IconProps } from '@expo/styleguide';
import { iconSize } from '@expo/styleguide';

export const GuideIcon = ({ size = iconSize.md }: IconProps) => (
	<svg fill="none" height={size} viewBox="0 0 16 16" width={size}>
		<path
			d="M2.66675 12.9999C2.66675 12.5579 2.84234 12.134 3.1549 11.8214C3.46746 11.5088 3.89139 11.3333 4.33341 11.3333H13.3334"
			stroke="#787f85"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.4"
		/>
		<path
			d="M4.33341 1.33325H13.3334V14.6666H4.33341C3.89139 14.6666 3.46746 14.491 3.1549 14.1784C2.84234 13.8659 2.66675 13.4419 2.66675 12.9999V2.99992C2.66675 2.55789 2.84234 2.13397 3.1549 1.82141C3.46746 1.50885 3.89139 1.33325 4.33341 1.33325V1.33325Z"
			stroke="#787f85"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.4"
		/>
	</svg>
);
