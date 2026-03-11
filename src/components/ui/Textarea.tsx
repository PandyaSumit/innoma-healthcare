export default function Textarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
  props?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}) {
  return (
    <textarea
      {...props}
      className={`w-full p-3 text-md  border border-healthcare-border/70 rounded-md focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/5 outline-none bg-healthcare-surface/20 text-healthcare-text placeholder:text-healthcare-text-muted/40 font-medium transition-all ${className}`}
    />
  );
}
