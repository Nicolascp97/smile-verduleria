export const ESPECIALIDAD_FLAG: Record<string, string> = {
  peruana: "pe",
  china: "cn",
  chilena: "cl",
};

interface FlagIconProps {
  code: string;
  label: string;
  size?: number;
  className?: string;
}

export function FlagIcon({ code, label, size = 28, className = "" }: FlagIconProps) {
  return (
    <img
      src={`/flags/${code}.svg`}
      alt={label}
      width={size}
      height={Math.round(size * 0.7)}
      className={`inline-block rounded-sm ${className}`}
      loading="eager"
    />
  );
}
