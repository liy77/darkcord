import { TypeLink } from "./type-link";

export function Type({ names, nullable, variable}: {readonly names: any, nullable?: boolean, variable?: boolean}) {
  return (
    <div className="inline-block whitespace-pre-wrap">
      <span className="font-semibold">{nullable ? '?' : ''}{variable ? '...' : ''}</span>
      {Array.isArray(names) ? names.map((name, idx) => (
        <span key={idx}>
          <TypeLink type={name} />
        </span>
      )) : null}
    </div>
  )
}
