import { useState, useEffect } from "react";

export function useDebugMode() {
	const [debugMode, setDebugMode] = useState(false);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.ctrlKey && event.key === "ñ") {
				event.preventDefault();
				setDebugMode((prevMode) => !prevMode);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	useEffect(() => {
		if (debugMode) {
			document.body.classList.add("debug-border");
		} else {
			document.body.classList.remove("debug-border");
		}
	}, [debugMode]);

	return debugMode;
}
