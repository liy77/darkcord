"use client";

import { Section, SectionOptions } from "@/components/Section";
import { PropsWithChildren } from "react";
import { useMedia } from "react-use";

export function DocumentationSection(
  props: PropsWithChildren<SectionOptions & { separator?: boolean }>,
) {
  const matches = useMedia("(max-width: 768px)", true);

  const { children, separator, ...rest } = props;

  const options = {
    ...rest,
    dense: matches,
  };

  return (
    <Section {...options}>
      {children}
      {separator && (
        <div className="border-light-900 dark:border-dark-100 -mx-8 mt-6 border-t-2" />
      )}
    </Section>
  );
}
