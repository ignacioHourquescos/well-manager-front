import React, { useMemo } from "react";
import { Timeline, Tag, Typography, Collapse, Descriptions, Empty } from "antd";

const { Text } = Typography;

function formatDate(dt) {
	try {
		return new Date(dt).toLocaleString();
	} catch {
		return dt;
	}
}

function actionTag(action) {
	const a = (action || "").toUpperCase();
	if (a === "INSERT") return <Tag color="green">Creación</Tag>;
	if (a === "UPDATE") return <Tag color="blue">Edición</Tag>;
	if (a === "DELETE") return <Tag color="red">Eliminado</Tag>;
	return <Tag>{action}</Tag>;
}

function computeDiff(oldData, newData) {
	if (!oldData || !newData) return [];

	const keys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
	const changes = [];

	keys.forEach((k) => {
		const a = oldData?.[k];
		const b = newData?.[k];

		// stringify para comparar objetos
		const sa = typeof a === "object" ? JSON.stringify(a) : String(a);
		const sb = typeof b === "object" ? JSON.stringify(b) : String(b);

		if (sa !== sb) changes.push({ field: k, from: a, to: b });
	});

	// orden estable: primero campos “importantes”
	const priority = [
		"code",
		"description",
		"well_type_id",
		"drilling_type",
		"method_production",
		"reservoir_type",
		"depth_mts",
	];
	changes.sort((x, y) => {
		const ix = priority.indexOf(x.field);
		const iy = priority.indexOf(y.field);
		if (ix === -1 && iy === -1) return x.field.localeCompare(y.field);
		if (ix === -1) return 1;
		if (iy === -1) return -1;
		return ix - iy;
	});

	return changes;
}

function pretty(v) {
	if (v === null || v === undefined) return "—";
	if (typeof v === "object") return JSON.stringify(v);
	return String(v);
}

export default function WellHistoryTimeline({ auditRows }) {
	const items = useMemo(() => {
		if (!Array.isArray(auditRows)) return [];

		return auditRows.map((row) => {
			const diff = computeDiff(row.old_data, row.new_data);
			const header = (
				<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: 8,
							flexWrap: "wrap",
						}}
					>
						{actionTag(row.action)}
						<Text strong>{formatDate(row.changed_at)}</Text>
						<Text type="secondary">
							{row.changed_by_name ||
								row.changed_by_email ||
								(row.changed_by_user_id
									? `User #${row.changed_by_user_id}`
									: "Sistema")}
						</Text>
					</div>

					{row.action === "UPDATE" ? (
						<Text type="secondary">
							{diff.length
								? `${diff.length} cambio(s)`
								: "Sin cambios detectables"}
						</Text>
					) : null}
				</div>
			);

			const details =
				row.action === "UPDATE" ? (
					diff.length ? (
						<Collapse
							size="small"
							items={[
								{
									key: "diff",
									label: "Ver cambios",
									children: (
										<Descriptions size="small" column={1} bordered>
											{diff.map((c) => (
												<Descriptions.Item key={c.field} label={c.field}>
													<div style={{ display: "grid", gap: 6 }}>
														<div>
															<Text type="secondary">Antes:</Text>{" "}
															{pretty(c.from)}
														</div>
														<div>
															<Text type="secondary">Después:</Text>{" "}
															{pretty(c.to)}
														</div>
													</div>
												</Descriptions.Item>
											))}
										</Descriptions>
									),
								},
							]}
						/>
					) : null
				) : row.action === "INSERT" ? (
					<Collapse
						size="small"
						items={[
							{
								key: "new",
								label: "Ver datos creados",
								children: (
									<pre
										style={{ margin: 0, fontSize: 12, whiteSpace: "pre-wrap" }}
									>
										{JSON.stringify(row.new_data, null, 2)}
									</pre>
								),
							},
						]}
					/>
				) : null;

			return {
				key: row.id,
				children: (
					<div style={{ display: "grid", gap: 10 }}>
						{header}
						{details}
					</div>
				),
			};
		});
	}, [auditRows]);

	if (!auditRows?.length)
		return <Empty description="Sin historial por ahora" />;

	return <Timeline items={items} />;
}
