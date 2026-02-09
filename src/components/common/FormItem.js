import { Tooltip, Form } from "antd";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

export default function FormItem({
	label,
	name,
	rules,
	hint,
	value,
	width,
	inputProps = {},
	inputComponent, // Add this line
	...restProps
}) {
	const ref = useRef();
	const [onFocus, setOnFocus] = useState(false);

	useEffect(() => {
		const onBodyClick = (event) => {
			if (ref.current.contains(event.target)) return;
			setOnFocus(false);
		};

		document.body.addEventListener("click", onBodyClick, { capture: true });

		return () => {
			document.body.removeEventListener("click", onBodyClick, {
				capture: true,
			});
		};
	}, []);

	return (
		<Inner
			ref={ref}
			onFocus={() => setOnFocus(true)}
			onBlur={() => setOnFocus(false)}
			{...restProps}
		>
			<Tooltip title={hint} placement="left" zIndex={999}>
				<Form.Item name={name} rules={rules} width={"100%"}>
					{React.cloneElement(inputComponent, { ...inputProps })}
				</Form.Item>

				<Label hasFocus={value || onFocus}>{label}</Label>
			</Tooltip>
		</Inner>
	);
}
const Inner = styled.div`
	position: relative;
	transition: all ease-in-out 0s;
`;

const Label = styled.label`
	position: absolute;
	z-index: 100;
	padding: 0 5px;
	left: 7px;
	line-height: 8px;
	transition: all ease-in-out 0.2s;
	transition-property: top, font-size;
	pointer-events: none;

	${({ hasFocus }) =>
		hasFocus
			? "top: -7px; left: 6px;font-size:10px!important;background: transparent; color: lightgray"
			: "top:11px;"}
`;
