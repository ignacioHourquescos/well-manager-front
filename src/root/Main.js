import { Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import LayoutGeneral from "../components/layout/LayoutGeneral";
import {
	Analytics,
	Home,
	PersonalTasks,
	Tasks,
	Well,
	WellsPage,
} from "../pages";
import MyAccount from "../pages/my-account/MyAccount";

export default function Main({ isMobile }) {
	const location = useLocation();
	const { dbUser } = useAuth();

	return (
		<LayoutGeneral>
			<Routes location={location} key={location.pathname}>
				<Route
					path="/"
					element={
						<ProtectedRoute user={dbUser} requiredPath="/" redirectPath={"/"}>
							<Home />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/entity/:wellCode/:wellId"
					element={
						<ProtectedRoute user={dbUser} requiredPath="/" redirectPath={"/"}>
							<Well />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/tasks/:wellCode/:wellId/:workOrderId"
					element={
						<ProtectedRoute user={dbUser} requiredPath="/" redirectPath={"/"}>
							<Tasks />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/my-tasks"
					element={
						<ProtectedRoute
							user={dbUser}
							requiredPath="/my-tasks"
							redirectPath={"/"}
						>
							<PersonalTasks />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/analytics"
					element={
						<ProtectedRoute
							user={dbUser}
							requiredPath="/analytics"
							redirectPath={"/"}
						>
							<Analytics />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/my-account"
					element={
						<ProtectedRoute
							user={dbUser}
							requiredPath="/my-account"
							redirectPath={"/"}
						>
							<MyAccount />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/abm-wells"
					element={
						<ProtectedRoute
							user={dbUser}
							requiredPath="/abm-wells"
							redirectPath={"/"}
						>
							<WellsPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="*"
					element={
						<main style={{ padding: "1rem" }}>
							<p>There's nothing here!</p>
						</main>
					}
				/>
			</Routes>
		</LayoutGeneral>
	);
}
