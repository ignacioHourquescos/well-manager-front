import React, { useMemo } from "react";
import { Modal, Table, Tag, Typography } from "antd";

const { Text } = Typography;

function safeParseJson(v) {
	if (!v) return null;
	if (typeof v === "object") return v;
	if (typeof v !== "string") return v;
	try {
		return JSON.parse(v);
	} catch {
		return v;
	}
}

function normalizeValue(v) {
	if (v === undefined) return undefined;
	if (v === null) return null;
	if (typeof v === "object") return JSON.stringify(v);
	return String(v);
}

function isDifferent(a, b) {
	return normalizeValue(a) !== normalizeValue(b);
}

function buildDiffRows(oldDataRaw, newDataRaw) {
	const oldData = safeParseJson(oldDataRaw) || {};
	const newData = safeParseJson(newDataRaw) || {};

	const keys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
	const rows = [];

	keys.forEach((k) => {
		const from = oldData[k];
		const to = newData[k];

		if (from === undefined && to === undefined) return;

		if (!isDifferent(from, to)) return;

		const fromN = normalizeValue(from);
		const toN = normalizeValue(to);

		let changeType = "changed";
		if (from === undefined && to !== undefined) changeType = "added";
		if (from !== undefined && to === undefined) changeType = "removed";

		rows.push({
			key: k,
			field: k,
			from: fromN,
			to: toN,
			changeType,
		});
	});

	const priority = [
		"code",
		"description",
		"well_type_id",
		"well_type_description",
		"depth_mts",
		"drilling_type",
		"method_production",
		"reservoir_type",
		"geojson",
		"cod_yacimiento",
		"yacimiento",
		"area",
		"provincia",
	];

	rows.sort((a, b) => {
		const ia = priority.indexOf(a.field);
		const ib = priority.indexOf(b.field);
		if (ia === -1 && ib === -1) return a.field.localeCompare(b.field);
		if (ia === -1) return 1;
		if (ib === -1) return -1;
		return ia - ib;
	});

	return rows;
}

function ChangeTag({ type }) {
	if (type === "added") return <Tag color="green">Agregado</Tag>;
	if (type === "removed") return <Tag color="red">Eliminado</Tag>;
	return <Tag color="gold">Modificado</Tag>;
}

export default function WellAuditDiffModal({ open, onClose, auditRow }) {
	const rows = useMemo(() => {
		if (!auditRow) return [];
		return buildDiffRows(auditRow.old_data, auditRow.new_data);
	}, [auditRow]);

	const columns = [
		{
			title: "Campo",
			dataIndex: "field",
			width: 220,
			render: (v) => <Text strong>{v}</Text>,
		},
		{
			title: "Cambio",
			dataIndex: "changeType",
			width: 120,
			render: (t) => <ChangeTag type={t} />,
		},
		{
			title: "Antes",
			dataIndex: "from",
			render: (v, r) => {
				if (r.changeType === "added") return <Text type="secondary">—</Text>;
				return (
					<div
						style={{
							background: "#fff1f0",
							border: "1px solid #ffccc7",
							padding: "8px 10px",
							borderRadius: 8,
							wordBreak: "break-word",
							whiteSpace: "pre-wrap",
						}}
					>
						<Text style={{ color: "#cf1322" }}>{v ?? "—"}</Text>
					</div>
				);
			},
		},
		{
			title: "Después",
			dataIndex: "to",
			render: (v, r) => {
				if (r.changeType === "removed") return <Text type="secondary">—</Text>;
				return (
					<div
						style={{
							background: "#f6ffed",
							border: "1px solid #b7eb8f",
							padding: "8px 10px",
							borderRadius: 8,
							wordBreak: "break-word",
							whiteSpace: "pre-wrap",
						}}
					>
						<Text style={{ color: "#237804" }}>{v ?? "—"}</Text>
					</div>
				);
			},
		},
	];

	return (
		<Modal
			title={`Detalle del cambio #${auditRow?.id ?? ""}`}
			open={open}
			onCancel={onClose}
			onOk={onClose}
			okText="Cerrar"
			cancelButtonProps={{ style: { display: "none" } }}
			width={980}
			destroyOnClose
		>
			<div style={{ display: "grid", gap: 12 }}>
				<div
					style={{
						display: "flex",
						gap: 8,
						flexWrap: "wrap",
						alignItems: "center",
					}}
				>
					<Tag
						color={
							auditRow?.action === "UPDATE"
								? "blue"
								: auditRow?.action === "INSERT"
									? "green"
									: "red"
						}
					>
						{auditRow?.action}
					</Tag>
					<Text type="secondary">
						{auditRow?.changed_at
							? new Date(auditRow.changed_at).toLocaleString()
							: ""}
					</Text>
					<Text>
						{auditRow?.changed_by_name ||
							auditRow?.changed_by_email ||
							(auditRow?.changed_by_user_id
								? `User #${auditRow.changed_by_user_id}`
								: "Sistema")}
					</Text>
				</div>

				<Table
					size="small"
					columns={columns}
					dataSource={rows}
					pagination={false}
					bordered
					locale={{ emptyText: "No se detectaron diferencias" }}
					rowKey="key"
				/>
			</div>
		</Modal>
	);
}
