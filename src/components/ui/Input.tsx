export default function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
  props?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <input
      {...props}
      className={`w-full p-3 text-md font-medium border border-healthcare-border/70 rounded-lg focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/5 outline-none bg-healthcare-surface/20 text-healthcare-text placeholder:text-healthcare-text-muted/40 font-medium transition-all ${className}`}
    />
  );
}
