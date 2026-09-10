import React, { createContext, useContext, useState } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value,
  onValueChange,
  className = "",
  children,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeTab = value !== undefined ? value : internalValue;

  const setActiveTab = (tab: string) => {
    if (value === undefined) setInternalValue(tab);
    onValueChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({
  className = "",
  children,
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1 border-b border-black/10 w-full overflow-x-auto no-scrollbar ${className}`}
      role="tablist"
    >
      {children}
    </div>
  );
};

export interface TabTriggerProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const TabTrigger: React.FC<TabTriggerProps> = ({
  value,
  disabled = false,
  className = "",
  children,
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabTrigger must be used within Tabs");

  const isActive = context.activeTab === value;

  return (
    <button
      role="tab"
      type="button"
      disabled={disabled}
      aria-selected={isActive}
      onClick={() => context.setActiveTab(value)}
      className={`relative px-5 py-3 text-sm font-medium tracking-wide transition-colors duration-200 whitespace-nowrap focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${
        isActive
          ? "text-deep-forest font-semibold"
          : "text-muted-stone hover:text-charcoal"
      } ${className}`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-deep-forest rounded-full" />
      )}
    </button>
  );
};

export interface TabContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabContent: React.FC<TabContentProps> = ({
  value,
  className = "",
  children,
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabContent must be used within Tabs");

  if (context.activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      className={`animate-fade-in pt-6 focus:outline-none ${className}`}
    >
      {children}
    </div>
  );
};
