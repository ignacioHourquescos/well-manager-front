import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { useDebugMode } from "./hooks/useDebugMode";
import { FilterProvider } from "./context/FilterContext";
import { useAuth } from "./context/AuthContext";
import axiosInstance from "./services/axiosInstance";
import { auth } from "./configuration/firebaseConfig";
import { FirebaseProvider } from "./context/FirebaseContext";
import { SignIn } from "./pages";
import Main from "./root/Main";
import { ForgotPassword } from "./pages/auth";
import { Spin } from "antd";
import i18n from "./configuration/i18n";

function AnimatedRoutes() {
	const { userData, dbUser, ready } = useAuth();

	useEffect(() => {
		if (dbUser?.language) {
			i18n.changeLanguage(dbUser.language);
		}
	}, [dbUser]);

	axiosInstance.interceptors.request.use(
		async (config) => {
			const token = await auth?.currentUser?.getIdToken();

			if (!token) {
				return config;
			}

			config.headers = {
				...config.headers,
				authorization: `Bearer ${token}`,
			};

			return config;
		},
		(error) => {
			console.log("axios interceptor error");
			return Promise.reject(error);
		},
	);

	return (
		<Routes>
			{/* <Route
					path="/signup"
					element={user ? <Navigate to="/" /> : <SignUp />}
				/>

				<Route
					path="/confirm-email"
					element={
						user && user.emailVerified ? <Navigate to="/" /> : <ConfirmEmail />
					}
				/>
      */}
			<Route path="/forgot-password" element={<ForgotPassword />} />

			<Route
				path="/*"
				element={
					!userData ? (
						<SignIn />
					) : !ready ? (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								height: "100vh",
							}}
						>
							<Spin />
						</div>
					) : (
						<FilterProvider>
							<FirebaseProvider>
								<Main />
							</FirebaseProvider>
						</FilterProvider>
					)
				}
			/>
		</Routes>
	);
}

function App() {
	useDebugMode();
	return (
		<FilterProvider>
			<BrowserRouter>
				<AnimatedRoutes />
			</BrowserRouter>
		</FilterProvider>
	);
}

export default App;
