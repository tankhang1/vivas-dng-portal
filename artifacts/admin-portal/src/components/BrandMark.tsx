import React from "react";

const LOGO_URL =
  "https://upload.wikimedia.org/wikipedia/commons/a/a3/Emblem_of_Vietnam.svg";

type BrandMarkProps = {
  className?: string;
  imageClassName?: string;
  labelClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  showText?: boolean;
  compact?: boolean;
};

export function BrandMark({
  className = "",
  imageClassName = "",
  labelClassName = "",
  titleClassName = "text-white",
  subtitleClassName = "text-sidebar-foreground/70",
  showText = true,
  compact = false,
}: BrandMarkProps) {
  return (
    <div
      className={`flex w-full justify-center items-center gap-3 ${className}`}
    >
      <div className={`shrink-0 overflow-hidden h-10`}>
        <img
          src={LOGO_URL}
          alt="Logo"
          className={`h-full w-full object-contain ${imageClassName}`}
        />
      </div>
      {showText && (
        <div className={`leading-tight ${labelClassName}`}>
          <p className={`font-bold text-sm ${titleClassName}`}>Cổng Quản Trị</p>
          <p className={`text-[11px] ${subtitleClassName}`}>UBND Xã Tây Hồ</p>
        </div>
      )}
    </div>
  );
}
