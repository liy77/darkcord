'use client';

import type { LinkProps } from 'next/link';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

export interface ItemLinkProps
	extends Omit<LinkProps, 'href'>,
		React.RefAttributes<HTMLAnchorElement>,
		Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
	className?: string;
	itemURI: string;
}

export function ItemLink(props: PropsWithChildren<ItemLinkProps>) {
  const path = usePathname();

  if (!path) {
		throw new Error('ItemLink must be used inside a Next.js page.');
	}

  const end = path.split('/')?.length < 3 ? path?.length : -1;

  const pathPrefix = path?.split('/').slice(0, end).join('/');

  const { itemURI, ...linkProps } = props;

	return <Link href={`${pathPrefix}${itemURI}`} {...linkProps} />;
}