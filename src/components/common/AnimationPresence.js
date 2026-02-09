import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Import your page components
import Home from "../pages/home/Home";
import Tasks from "../pages/tasks/Tasks";
// Import other pages as needed

const AnimatedRoutes = () => {
	const location = useLocation();

	return (
		<Routes location={location} key={location.pathname}>
			<Route path="/" element={<Home />} />
			<Route path="/tasks/:id" element={<Tasks />} />
			{/* Add other routes as needed */}
		</Routes>
	);
};

export default AnimatedRoutes;
