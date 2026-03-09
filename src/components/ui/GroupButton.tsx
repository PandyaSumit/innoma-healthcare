import { useEffect, useRef, useState } from "react";

type ButtonItem = {
  label: string;
  value: string;
};

interface GroupButtonProps {
  btns: ButtonItem[];
  value: string | undefined;
  onChange: (value: string) => void;
}

function GroupButton({ btns = [], value, onChange }: GroupButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderStyle, setSliderStyle] = useState({
    width: 0,
    left: 0,
  });

  useEffect(() => {
    const activeButton = containerRef?.current?.querySelector(
      `[data-value="${value}"]`,
    ) as HTMLButtonElement;

    if (activeButton) {
      setSliderStyle({
        width: activeButton.offsetWidth,
        left: activeButton.offsetLeft,
      });
    }
  }, [value]);

  return (
    <div className="flex-1">
      <div
        ref={containerRef}
        className="relative flex items-center gap-2 w-max overflow-x-auto no-scrollbar px-1 py-1 rounded-sm "
      >
        {/* Sliding Background */}
        <span
          className="absolute top-1 bottom-1 bg-brand-blue rounded-sm transition-all duration-300"
          style={{
            width: sliderStyle.width - sliderStyle.width * 0.05,
            transform: `translateX(${sliderStyle.left}px)`,
          }}
        />

        {btns.map((btn) => (
          <button
            key={btn.value}
            data-value={btn.value}
            onClick={() => onChange(btn.value)}
            className={`relative capitalize z-10 px-5 py-2.5 text-center rounded-sm text-xs font-bold whitespace-nowrap cursor-pointer transition-colors duration-300 ${
              value === btn.value ? "text-white" : "text-healthcare-text-muted"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GroupButton;
