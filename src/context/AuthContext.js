import React, { useContext, useState, useEffect } from "react";
import {
	confirmPasswordReset,
	getAuth,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	updatePassword,
} from "firebase/auth";
import { app, db } from "../configuration/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const auth = getAuth(app);
	const [ready, setReady] = useState(false);
	const [userData, setUserData] = useState();
	const [dbUser, setDbUser] = useState();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			setUserData(user);
			if (user) {
				onSnapshot(doc(db, "users", user.uid), (doc) => {
					if (doc.data()) {
						setDbUser(doc.data());
					} else {
						setDbUser(null);
					}
				});
			}
		});
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		localStorage.setItem("user", JSON.stringify(dbUser));
		localStorage.setItem("user-data", JSON.stringify(userData));
		setReady(dbUser && userData);
	}, [dbUser, userData]);

	// useEffect(() => {
	// 	let unsubscribe = () => {};
	// 	if (userData) {
	// 		unsubscribe = onSnapshot(doc(db, "users", userData.uid), (doc) => {
	// 			if (doc.data()) {
	// 				setDbUser(doc.data());
	// 			} else {
	// 				setDbUser(null);
	// 			}

	// 			setReady(true);
	// 		});
	// 	} else {
	// 		setDbUser(null);
	// 	}

	// 	return () => {
	// 		unsubscribe();
	// 	};
	// }, [db, userData]);

	// useEffect(() => {
	// 	localStorage.setItem("user-data", JSON.stringify(userData));
	// }, [userData]);

	// useEffect(() => {
	// 	if (dbUser) {
	// 		localStorage.setItem("user", JSON.stringify(dbUser));

	// 		axiosInstance.interceptors.request.use(
	// 			async (config) => {
	// 				const token = dbUser ? await getIdToken() : "";
	// 				config.headers.Authorization = `Bearer ${token}`;
	// 				config.params = {
	// 					...config.params,
	// 				};
	// 				return config;
	// 			},
	// 			(error) => {
	// 				return Promise.reject(error);
	// 			}
	// 		);
	// 	}

	// 	if (!dbUser) {
	// 		setReady(false);
	// 	}
	// }, [dbUser]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				localStorage.removeItem("auth_token");
				setUserData(user);
			} else {
				user.getIdToken().then((t) => {
					localStorage.setItem("auth_token", t);
					setUserData(user);
				});
			}
		});

		return () => {
			unsubscribe();
		};
	}, [auth]);

	async function login(email, password) {
		const res = await signInWithEmailAndPassword(auth, email, password);
		setUserData(res.user);
		return res;
	}

	function logout() {
		setUserData(null);
		setDbUser(null);
		return signOut(auth);
	}

	function resetPassword(email) {
		return sendPasswordResetEmail(auth, email, {
			url: "http://localhost:3000/",
		});
	}

	function changePassword(password) {
		return updatePassword(auth.currentUser, password);
	}

	function newPassword(oobCode, newPassword) {
		return confirmPasswordReset(auth, oobCode, newPassword);
	}

	function getIdToken() {
		return (
			localStorage.getItem("auth_token") || auth?.currentUser?.getIdToken(true)
		);
	}

	const value = {
		userData,
		dbUser,
		ready,
		setReady,
		login,
		logout,
		getIdToken,
		resetPassword,
		changePassword,
		newPassword,
	};
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
