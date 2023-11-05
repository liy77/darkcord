export function TypeLink({ type }: { type: string | string[] | string[][] }) {
  const typeName = type[0] === 'function' ? 'Function' : type[0];


  return (
    <>
    <span className="hover:text-blue-300 text-blue-600 cursor-pointer">{typeName}</span>
    {type[1] && <span>{type[1]}</span>}    
    </>
  )
}
