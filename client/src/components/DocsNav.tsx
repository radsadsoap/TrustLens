import { useState, useEffect } from "react";

const sections = [
    { id: "overview", title: "Overview", level: 1 },
    { id: "architecture", title: "Architecture & Technologies", level: 1 },
    { id: "project-flow", title: "Project Flow", level: 1 },
    {
        id: "how-it-works",
        title: "How It Works",
        level: 1,
        subItems: [
            { id: "upload-video", title: "Upload Video", level: 2 },
            { id: "processing", title: "Processing", level: 2 },
            { id: "review-results", title: "Review Results", level: 2 },
        ],
    },
    { id: "technical-details", title: "Technical Details", level: 1 },
    { id: "best-practices", title: "Best Practices", level: 1 },
    { id: "limitations", title: "Limitations", level: 1 },
    { id: "privacy-security", title: "Privacy & Security", level: 1 },
];

export default function DocsNav() {
    const [activeSection, setActiveSection] = useState("overview");

    useEffect(() => {
        const container = document.getElementById("docs-content");
        if (!container) return;

        const handleScroll = () => {
            const scrollPosition = container.scrollTop + 100;
            const allIds = sections.flatMap((s) =>
                s.subItems
                    ? [s.id, ...s.subItems.map((sub) => sub.id)]
                    : [s.id],
            );

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
        handleScroll();

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

    return (
        <div className="w-1/4 border-l p-6 overflow-y-auto">
            <h2 className="font-semibold mb-4 text-gray-400 uppercase text-sm tracking-wider">
                On This Page
            </h2>
            <nav>
                <ul className="space-y-1 border-l-2 border-gray-800">
                    {sections.map((section) => (
                        <li key={section.id}>
                            <a
                                onClick={() => scrollToSection(section.id)}
                                className={`block py-1.5 pl-4 border-l-2 -ml-0.5 cursor-pointer transition-all duration-200 ${
                                    activeSection === section.id
                                        ? "border-red-500 text-gray-50 font-medium"
                                        : "border-transparent text-gray-400 hover:text-gray-200 hover:border-red-500/50"
                                }`}
                            >
                                {section.title}
                            </a>
                            {section.subItems && (
                                <ul className="mt-1 space-y-1">
                                    {section.subItems.map((subItem) => (
                                        <li key={subItem.id}>
                                            <a
                                                onClick={() =>
                                                    scrollToSection(subItem.id)
                                                }
                                                className={`block py-1 pl-8 text-sm border-l-2 -ml-0.5 cursor-pointer transition-all duration-200 ${
                                                    activeSection === subItem.id
                                                        ? "border-red-500 text-gray-50 font-medium"
                                                        : "border-transparent text-gray-500 hover:text-gray-200 hover:border-red-500/50"
                                                }`}
                                            >
                                                {subItem.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
