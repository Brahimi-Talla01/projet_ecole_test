import { PasswordStrength } from "../../validators/auth.schema";

interface PasswordStrengthBarProps {
  strength: PasswordStrength | null;
  label: string;
  weakLabel: string;
  mediumLabel: string;
  strongLabel: string;
}

export function PasswordStrengthBar({
  strength,
  label,
  weakLabel,
  mediumLabel,
  strongLabel,
}: PasswordStrengthBarProps) {
  if (!strength) return null;

  const config: Record<PasswordStrength, { width: string; color: string; text: string }> = {
    weak:   { width: 'w-1/3', color: 'bg-red-500',    text: weakLabel },
    medium: { width: 'w-2/3', color: 'bg-orange-400', text: mediumLabel },
    strong: { width: 'w-full', color: 'bg-green-500', text: strongLabel },
  };

  const { width, color, text } = config[strength];

  return (
    <div className="mt-2" aria-label={label}>
      <div className="h-1.5 w-full rounded-full bg-gray-200">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${width} ${color}`}
          role="progressbar"
          aria-valuenow={strength === 'weak' ? 33 : strength === 'medium' ? 66 : 100}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className={`mt-1 text-xs font-medium ${
        strength === 'weak' ? 'text-red-500' :
        strength === 'medium' ? 'text-orange-400' :
        'text-green-500'
      }`}>
        {text}
      </p>
    </div>
  );
}