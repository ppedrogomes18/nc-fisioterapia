/** Rótulo em caixa alta entre dois traços finos, como "— FISIOTERAPIA —" no logo. */
export function Kicker({ children, claro, reveal = true }: { children: React.ReactNode; claro?: boolean; reveal?: boolean }) {
  return (
    <p className={"nc-kicker" + (claro ? " is-claro" : "")} {...(reveal ? { "data-reveal": "" } : {})}>
      {children}
    </p>
  );
}

/** Divide um título em linhas pelo "\n". */
export function linhas(t: string): string[] {
  return t
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
