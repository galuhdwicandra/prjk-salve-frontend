import type { SidebarIconName } from "./menu";

export function SidebarIcon(props: { name: SidebarIconName; className?: string }) {
  const commonProps = {
    className: props.className ?? "h-4 w-4 shrink-0",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (props.name) {
    case "dashboard":
      return (
        <svg {...commonProps}>
          <path d="M3 13h8V3H3v10Z" />
          <path d="M13 21h8V11h-8v10Z" />
          <path d="M13 3v6h8V3h-8Z" />
          <path d="M3 21h8v-6H3v6Z" />
        </svg>
      );

    case "pos":
      return (
        <svg {...commonProps}>
          <path d="M4 7h16" />
          <path d="M6 7v12h12V7" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M8 12h8" />
          <path d="M8 16h4" />
        </svg>
      );

    case "orders":
      return (
        <svg {...commonProps}>
          <path d="M8 6h13" />
          <path d="M8 12h13" />
          <path d="M8 18h13" />
          <path d="M3 6h.01" />
          <path d="M3 12h.01" />
          <path d="M3 18h.01" />
        </svg>
      );

    case "receivables":
      return (
        <svg {...commonProps}>
          <path d="M4 5h16v14H4z" />
          <path d="M4 9h16" />
          <path d="M8 14h4" />
          <path d="M16 14h.01" />
        </svg>
      );

    case "operations":
      return (
        <svg {...commonProps}>
          <path d="M12 3v4" />
          <path d="M12 17v4" />
          <path d="M3 12h4" />
          <path d="M17 12h4" />
          <path d="M5.6 5.6l2.8 2.8" />
          <path d="M18.4 5.6l-2.8 2.8" />
          <path d="M5.6 18.4l2.8-2.8" />
          <path d="M18.4 18.4l-2.8-2.8" />
        </svg>
      );

    case "production":
      return (
        <svg {...commonProps}>
          <path d="M4 16V8l8-4 8 4v8l-8 4-8-4Z" />
          <path d="M4 8l8 4 8-4" />
          <path d="M12 12v8" />
        </svg>
      );

    case "washNotes":
      return (
        <svg {...commonProps}>
          <path d="M6 3h9l3 3v15H6V3Z" />
          <path d="M14 3v4h4" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
        </svg>
      );

    case "delivery":
      return (
        <svg {...commonProps}>
          <path d="M3 7h11v10H3z" />
          <path d="M14 11h3l3 3v3h-6v-6Z" />
          <path d="M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          <path d="M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        </svg>
      );

    case "masterData":
      return (
        <svg {...commonProps}>
          <path d="M4 5h16" />
          <path d="M4 12h16" />
          <path d="M4 19h16" />
          <path d="M8 3v4" />
          <path d="M16 10v4" />
          <path d="M10 17v4" />
        </svg>
      );

    case "users":
      return (
        <svg {...commonProps}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );

    case "branches":
      return (
        <svg {...commonProps}>
          <path d="M3 21h18" />
          <path d="M5 21V7l7-4 7 4v14" />
          <path d="M9 21v-6h6v6" />
          <path d="M9 10h.01" />
          <path d="M15 10h.01" />
        </svg>
      );

    case "services":
      return (
        <svg {...commonProps}>
          <path d="M12 3l2.2 4.5 4.8.7-3.5 3.4.8 4.8L12 14.1l-4.3 2.3.8-4.8L5 8.2l4.8-.7L12 3Z" />
          <path d="M4 21h16" />
        </svg>
      );

    case "customers":
      return (
        <svg {...commonProps}>
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );

    case "finance":
      return (
        <svg {...commonProps}>
          <path d="M3 10h18" />
          <path d="M5 10V7l7-4 7 4v3" />
          <path d="M6 10v8" />
          <path d="M10 10v8" />
          <path d="M14 10v8" />
          <path d="M18 10v8" />
          <path d="M4 18h16" />
          <path d="M3 21h18" />
        </svg>
      );

    case "cashBox":
      return (
        <svg {...commonProps}>
          <path d="M4 7h16v12H4z" />
          <path d="M4 11h16" />
          <path d="M8 15h.01" />
          <path d="M12 15h4" />
        </svg>
      );

    case "expenses":
      return (
        <svg {...commonProps}>
          <path d="M6 2h12v20H6z" />
          <path d="M9 6h6" />
          <path d="M9 10h6" />
          <path d="M9 14h3" />
          <path d="M15 18h.01" />
        </svg>
      );

    case "cashToday":
      return (
        <svg {...commonProps}>
          <path d="M12 8v5l3 2" />
          <path d="M21 12a9 9 0 1 1-3-6.7" />
          <path d="M21 3v6h-6" />
        </svg>
      );

    case "vouchers":
      return (
        <svg {...commonProps}>
          <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7Z" />
          <path d="M9 9h.01" />
          <path d="M15 15h.01" />
          <path d="M16 8l-8 8" />
        </svg>
      );

    case "reportsSettings":
      return (
        <svg {...commonProps}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 16v-5" />
          <path d="M12 16V8" />
          <path d="M16 16v-3" />
        </svg>
      );

    case "reports":
      return (
        <svg {...commonProps}>
          <path d="M5 3h14v18H5z" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
          <path d="M9 16h3" />
        </svg>
      );

    case "logout":
      return (
        <svg {...commonProps}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      );

    case "accounting":
      return (
        <svg {...commonProps}>
          <path d="M5 4h11a3 3 0 0 1 3 3v13H7a2 2 0 0 1-2-2V4Z" />
          <path d="M7 20a2 2 0 0 1 0-4h12" />
          <path d="M9 8h6" />
          <path d="M9 12h4" />
          <path d="M15 4v16" />
        </svg>
      );
    case "profitLoss":
      return (
        <svg {...commonProps}>
          <path d="M4 19h16" />
          <path d="M7 16V9" />
          <path d="M12 16V5" />
          <path d="M17 16v-4" />
          <path d="M6 9l3-3 3 3 5-5" />
          <path d="M17 4h-4" />
          <path d="M17 4v4" />
        </svg>
      );
    case "balanceSheet":
      return (
        <svg {...commonProps}>
          <path d="M4 5h16" />
          <path d="M6 5v14" />
          <path d="M18 5v14" />
          <path d="M4 19h16" />
          <path d="M9 9h6" />
          <path d="M8 13h8" />
          <path d="M12 5v14" />
        </svg>
      );
    case "cashFlow":
      return (
        <svg {...commonProps}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 15c2-4 4-4 6 0s4 4 6 0" />
          <path d="M8 9c2 4 4 4 6 0s4-4 6 0" />
          <path d="M12 4v16" />
        </svg>
      );

    case "settings":
      return (
        <svg {...commonProps}>
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.36.15.67.36.93.62.26.26.47.57.62.93H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51.45Z" />
        </svg>
      );

    default:
      return null;
  }
}