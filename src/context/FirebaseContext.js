import React, { useContext, useState, useEffect } from "react";

const FirebaseContext = React.createContext();

export function useFirebase() {
	return useContext(FirebaseContext);
}

export function FirebaseProvider({ children }) {
	const [actualMonth, setActualMonth] = useState();

	useEffect(() => {
		var actualDate = new Date();
		actualDate?.setHours(actualDate?.getHours() - 3);

		setActualMonth(actualDate.toISOString().slice(0, 10).replace(/-/g, ""));
	}, []);

	const value = {};

	return (
		<FirebaseContext.Provider value={value}>
			{children}
		</FirebaseContext.Provider>
	);
}
