"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string = string> {
  id?: string;
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  disabled?: boolean;
  className?: string;
}

export function CustomSelect<T extends string = string>({
  id,
  value,
  onChange,
  options,
  disabled = false,
  className = "",
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const handleSelect = (optionValue: T) => {
    if (disabled) return;
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = options.findIndex((opt) => opt.value === value);
        const nextIndex = (currentIndex + 1) % options.length;
        onChange(options[nextIndex].value);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currentIndex = options.findIndex((opt) => opt.value === value);
        const prevIndex = (currentIndex - 1 + options.length) % options.length;
        onChange(options[prevIndex].value);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        style={{ outline: "none" }}
        className={`w-full h-11 px-3.5 bg-surface-raised rounded-md border flex items-center justify-between text-nav text-text-primary outline-none focus:outline-none focus-visible:outline-none cursor-pointer shadow-xs transition-all select-none ${
          isOpen
            ? "border-text-primary"
            : "border-border hover:border-[#0D0E0C]/40 focus:border-text-primary"
        } ${className}`}
      >
        <span className="font-medium text-sm text-[#0D0E0C] truncate">
          {selectedOption ? selectedOption.label : value}
        </span>
        <FiChevronDown
          className={`w-4 h-4 text-text-secondary transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-text-primary" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Options */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          style={{ outline: "none" }}
          className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-white rounded-lg border border-[#0D0E0C]/15 shadow-xl p-1.5 flex flex-col gap-0.5 outline-none focus:outline-none animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                style={{ outline: "none" }}
                className={`w-full px-3 py-2 rounded-md flex items-center justify-between text-sm transition-colors text-left outline-none focus:outline-none focus-visible:outline-none cursor-pointer select-none ${
                  isSelected
                    ? "bg-accent text-[#0D0E0C] font-semibold shadow-xs hover:bg-accent-hover"
                    : "text-[#262822] hover:bg-[#EAF7C6] hover:text-[#0D0E0C] focus:bg-[#EAF7C6] focus:text-[#0D0E0C] active:bg-[#DDF4A7]"
                }`}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <FiCheck className="w-4 h-4 text-[#0D0E0C] stroke-[2.5] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
