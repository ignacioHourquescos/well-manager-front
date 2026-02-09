import React from "react";
import { AntdImg } from "./styles";
import Fallback from "../../../assets/images/Fallback.png";

export default function Image({
	src,
	width,
	height,
	preview = false,
	borderRadius,
	objectFit = "contain",
	...rest
}) {
	return (
		<>
			<AntdImg
				fallback={Fallback}
				src={src}
				onError={({ currentTarget }) => {
					currentTarget.onerror = null;
				}}
				style={{
					width,
					height,
					objectFit,
					borderRadius,
				}}
				{...rest}
				preview={preview ? preview : false}
			/>
		</>
	);
}
