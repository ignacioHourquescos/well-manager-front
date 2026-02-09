import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({
	user,
	children,
	redirectPath = "/",
	requiredPath,
}) => {
	const location = useLocation();

	if (!user) {
		return <Navigate to={redirectPath} replace />;
	}

	const hasPermission = user.menus?.some(
		(mod) => mod.path === requiredPath //|| location.pathname.startsWith(mod.path)
	);

	if (!hasPermission) {
		return <Navigate to={redirectPath} replace />;
	}

	return children ? children : <Outlet />;
};

export default ProtectedRoute;
