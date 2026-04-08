import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, Search } from 'lucide-react';

export const Select = React.forwardRef(({ className, value, onChange, children, searchable = false, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen, searchable]);

  const options = [];
  React.Children.forEach(children, child => {
    if (!child) return;
    if (child.type === 'option') {
       options.push({ value: child.props.value, label: child.props.children });
    } else if (Array.isArray(child)) {
       child.forEach(c => {
         if (c && c.type === 'option') {
           options.push({ value: c.props.value, label: c.props.children });
         }
       })
    }
  });

  const selectedOption = options.find(opt => String(opt.value) === String(value)) || options[0];

  const filteredOptions = searchable 
    ? options.filter(opt => (opt.label || "").toString().toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  return (
    <div className={cn("relative", className)} ref={containerRef} {...props}>
      <button
        type="button"
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        )}
        onClick={() => setIsOpen(!isOpen)}
        ref={ref}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
          <div className="flex w-full flex-col p-1 backdrop-blur">
            {searchable && (
              <div className="sticky top-0 z-10 p-1 bg-popover/90 backdrop-blur-sm border-b mb-1">
                <div className="relative">
                   <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                   <input
                     ref={searchInputRef}
                     type="text"
                     className="w-full bg-background border rounded-sm h-8 pl-8 pr-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                     placeholder="Search..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     onClick={(e) => e.stopPropagation()}
                   />
                </div>
              </div>
            )}
            
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">No options found.</div>
            ) : (
              filteredOptions.map((opt, i) => (
                <div
                  key={i}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none hover:border hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    String(opt.value) === String(value) && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => {
                     if (onChange) {
                       onChange({ target: { value: opt.value } });
                     }
                     setIsOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
});
Select.displayName = "Select";
