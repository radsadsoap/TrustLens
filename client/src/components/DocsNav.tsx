import { useState, useEffect } from "react";
import {
    InfoIcon,
    ShieldCheckIcon,
    PlayIcon,
    BookOpenIcon,
    WarningCircleIcon,
    RocketLaunchIcon,
    LightbulbIcon,
    DotsSixVerticalIcon,
} from "@phosphor-icons/react";

const sections = [
    { id: "what-is-trustlens", title: "What is TrustLens?", icon: InfoIcon },
    { id: "why-it-matters", title: "Why It Matters", icon: ShieldCheckIcon },
    { id: "how-to-use", title: "How to Use", icon: PlayIcon },
    {
        id: "understanding-results",
        title: "Understanding Results",
        icon: BookOpenIcon,
    },
    {
        id: "what-can-detect",
        title: "What It Can Detect",
        icon: ShieldCheckIcon,
    },
    { id: "limitations", title: "Limitations", icon: WarningCircleIcon },
    { id: "running-locally", title: "Running Locally", icon: RocketLaunchIcon },
    { id: "support", title: "Support & Contributing", icon: LightbulbIcon },
];

export default function DocsNav() {
    const [activeSection, setActiveSection] = useState("what-is-trustlens");

    useEffect(() => {
        const container = document.getElementById("docs-content");
        if (!container) return;

        const handleScroll = () => {
            const scrollPosition = container.scrollTop + 100;
            const allIds = sections.map((s) => s.id);

            for (const id of allIds) {
                const element = document.getElementById(id);
                if (element) {
                    const offsetTop = element.offsetTop - container.offsetTop;
                    const offsetBottom = offsetTop + element.offsetHeight;

                    if (
                        scrollPosition >= offsetTop &&
                        scrollPosition < offsetBottom
                    ) {
                        setActiveSection(id);
                        break;
                    }
                }
            }
        };

        container.addEventListener("scroll", handleScroll);
        setTimeout(handleScroll, 100);

        return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const container = document.getElementById("docs-content");
        const element = document.getElementById(id);
        if (element && container) {
            const offsetTop = element.offsetTop - container.offsetTop;
            container.scrollTo({ top: offsetTop - 20, behavior: "smooth" });
        }
    };

    const activeIndex = sections.findIndex((s) => s.id === activeSection);

    return (
        <div className="w-1/4 border-l border-white overflow-y-auto bg-black flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white">
                <div className="flex items-center gap-2 ">
                    <BookOpenIcon size={14} weight="bold" />
                    <span className="text-xs font-semibold uppercase tracking-widest">
                        On This Page
                    </span>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-3">
                <ul className="space-y-0.5">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        const isActive = activeSection === section.id;
                        return (
                            <li key={section.id}>
                                <a
                                    onClick={() => scrollToSection(section.id)}
                                    className={`relative flex items-center justify-between gap-3 py-2.5 px-3 text-sm rounded-lg cursor-pointer transition-all duration-200 group ${
                                        isActive
                                            ? "bg-red-500/10 text-red-400"
                                            : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            size={15}
                                            weight={
                                                isActive ? "duotone" : "regular"
                                            }
                                            className={`shrink-0 transition-colors duration-200 ${
                                                isActive
                                                    ? "text-red-400"
                                                    : "text-gray-600 group-hover:text-gray-400"
                                            }`}
                                        />
                                        <span
                                            className={`leading-tight transition-all duration-200 ${
                                                isActive ? "font-medium" : ""
                                            }`}
                                        >
                                            {section.title}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <DotsSixVerticalIcon size={20} />
                                    )}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
