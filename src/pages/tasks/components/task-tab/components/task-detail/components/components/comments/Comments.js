import React from "react";
import { Timeline } from "antd";

const Comments = () => {
	// Define your entityComments array here
	const entityComments = [
		{
			color: "gray",
			children: (
				<>
					<h4 style={{ margin: 0, padding: 0 }}>
						Carlos Rodríguez{" "}
						<span style={{ fontWeight: "normal" }}>(2023-05-18 14:30)</span>
					</h4>
					<p style={{ margin: 0, padding: 0 }}>
						Observado disminución en la tasa de producción del pozo #3.
					</p>
				</>
			),
		},
		{
			color: "gray",
			children: (
				<>
					<h4 style={{ margin: 0, padding: 0 }}>
						Ana María Gómez{" "}
						<span style={{ fontWeight: "normal" }}>(2023-05-20 09:15)</span>
					</h4>
					<p style={{ margin: 0, padding: 0 }}>
						Realizada prueba de presión de rutina en el pozo #7. Resultados
						normales.
					</p>
				</>
			),
		},
		{
			color: "gray",
			children: (
				<>
					<h4 style={{ margin: 0, padding: 0 }}>
						Javier Fernández{" "}
						<span style={{ fontWeight: "normal" }}>(2023-05-25 11:45)</span>
					</h4>
					<p style={{ margin: 0, padding: 0 }}>
						Iniciado trabajo de reacondicionamiento para reemplazar la bomba de
						fondo en el pozo #5.
					</p>
				</>
			),
		},
		{
			color: "gray",
			children: (
				<>
					<h4 style={{ margin: 0, padding: 0 }}>
						Elena Martínez{" "}
						<span style={{ fontWeight: "normal" }}>(2023-06-02 16:20)</span>
					</h4>
					<p style={{ margin: 0, padding: 0 }}>
						Completado tratamiento de acidificación para mejorar la
						permeabilidad del pozo #2.
					</p>
				</>
			),
		},
		{
			color: "gray",
			children: (
				<>
					<h4 style={{ margin: 0, padding: 0 }}>
						Ricardo Sánchez{" "}
						<span style={{ fontWeight: "normal" }}>(2023-06-10 13:05)</span>
					</h4>
					<p style={{ margin: 0, padding: 0 }}>
						Ajustado el tamaño del estrangulador para optimizar la tasa de flujo
						del pozo #9.
					</p>
				</>
			),
		},
	];

	// Function to shuffle array
	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	// Get random length between 1 and the original array length
	const randomLength = Math.floor(Math.random() * entityComments.length) + 1;

	// Shuffle and slice the array
	const commentsToDisplay = shuffleArray([...entityComments]).slice(
		0,
		randomLength
	);

	return (
		<Timeline>
			{commentsToDisplay.map((comment, index) => (
				<Timeline.Item key={index} color={comment.color}>
					{comment.children}
				</Timeline.Item>
			))}
		</Timeline>
	);
};

export default Comments;
