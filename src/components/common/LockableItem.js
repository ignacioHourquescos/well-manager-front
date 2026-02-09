import React from "react";
import { Button, Space, Tooltip } from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";

export default function LockableItem({
	name,
	unlockedMap,
	setUnlockedMap,
	children,
	alwaysEditableFields,
}) {
	const isAlwaysEditable = alwaysEditableFields.has(name);
	const isUnlocked = isAlwaysEditable || !!unlockedMap[name];

	return (
		<div style={{ position: "relative" }}>
			{/* Candado solo si NO es always-editable */}
			{!isAlwaysEditable && (
				<Space
					style={{
						position: "absolute",
						right: 0,
						top: -2,
						zIndex: 2,
					}}
				>
					<Tooltip title={isUnlocked ? "Bloquear" : "Desbloquear"}>
						<Button
							size="small"
							icon={isUnlocked ? <UnlockOutlined /> : <LockOutlined />}
							onClick={() =>
								setUnlockedMap((prev) => ({
									...prev,
									[name]: !prev[name],
								}))
							}
						/>
					</Tooltip>
				</Space>
			)}

			{typeof children === "function" ? children(isUnlocked) : children}
		</div>
	);
}
