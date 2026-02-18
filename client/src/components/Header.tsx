import {
    ArrowSquareInIcon,
    ReadCvLogoIcon,
    MonitorArrowUpIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 border-b">
            <h1 className="border-r pr-6 py-4 text-xl tracking-wide">
                Deepfake Video Detector
            </h1>
            <ul className="flex [&_li]:cursor-pointer [&_li]:hover:bg-red-600 [&_li]:transition duration-200 [&_li]:py-4 [&_li]:px-4">
                <Link to="/" className="flex items-center gap-1">
                    <li className="flex items-center gap-1">
                        <MonitorArrowUpIcon />
                        Upload
                    </li>
                </Link>
                <Link to="/docs" className="flex items-center gap-1">
                    <li className="flex items-center gap-1">
                        <ReadCvLogoIcon />
                        Docs
                    </li>
                </Link>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                >
                    <li className="flex items-center gap-1">
                        <ArrowSquareInIcon /> GitHub
                    </li>
                </a>
            </ul>
        </header>
    );
}
