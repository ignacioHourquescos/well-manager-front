import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	Button,
	Divider,
	Drawer,
	Form,
	Input,
	InputNumber,
	Select,
	Space,
	Switch,
	Table,
	Tag,
	Tabs,
	Typography,
	message,
	Spin,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import LayoutPage from "../../components/layout/pages/LayoutPage";
import {
	fetch_wells_total_data,
	create_well,
	update_well,
	fetch_well_types,
	fetch_well_audit,
	fetch_well_tipoestado,
	fetch_well_substates,
	fetch_well_states,
} from "../../services/general";
import { useAuth } from "../../context/AuthContext";
import { Typo } from "../../theme";
import {
	SectionTitle,
	ThreeCol,
	Toolbar,
	ToolbarLeft,
	ToolbarRight,
	TwoCol,
} from "./styles";
import WellHistoryTimeline from "./components/WellHistoryTimeline";
import LockableItem from "../../components/common/LockableItem";

const { Title } = Typography;

const METHOD_PRODUCTION_OPTIONS = [
	null,
	"N/A",
	"Sucker rod pumping",
	"Swabbing",
	"Progressive cavity pump (PCP)",
	"Surgencia Natural",
	"Electrosubmergible pump (ESP)",
	"Gas Lift",
	"Plunger Lift",
	"Jet Pump",
];
const RESERVOIR_TYPE_OPTIONS = [null, "Conventional", "Unconventional"];

const GASPLUS_OPTIONS = [null, "si", "no"];

const EXTRACTION_TYPE_OPTIONS = [
	"Sin Sistema de Extracción",
	"Bombeo Mecánico",
	"Pistoneo (Swabbing)",
	"Cavidad Progresiva",
	"Surgencia Natural",
	"Bombeo Electrosumergible",
	"Gas Lift",
	"Plunger Lift",
	"Jet pump",
];

const defaultValues = {
	code: "",
	description: null,
	type: "N/A",
	method_production: "N/A",
	drilling_type: "Vertical",
	reservoir_type: "N/A",
	depth_mts: 0,
	dest_batt: null,
	dest_plant: null,
	dest_sat: null,
	wf_project: null,
	well_type_id: null,
	ignore: null,
};

function optionize(arr) {
	return arr.map((v) => ({
		value: v === null ? "__NULL__" : v,
		label: v === null ? "(Vacío)" : v,
	}));
}

function parseGeoToLatLng(geojson) {
	if (
		!geojson ||
		geojson.type !== "Point" ||
		!Array.isArray(geojson.coordinates)
	) {
		return { geo_lat: null, geo_lng: null };
	}
	const [lng, lat] = geojson.coordinates;
	const nLat = Number(lat);
	const nLng = Number(lng);
	if (!Number.isFinite(nLat) || !Number.isFinite(nLng))
		return { geo_lat: null, geo_lng: null };
	return { geo_lat: nLat, geo_lng: nLng };
}

function buildGeojsonFromLatLng(lat, lng) {
	if (
		lat === null ||
		lat === undefined ||
		lat === "" ||
		lng === null ||
		lng === undefined ||
		lng === ""
	) {
		return null;
	}
	const nLat = Number(lat);
	const nLng = Number(lng);
	if (!Number.isFinite(nLat) || !Number.isFinite(nLng)) return null;
	return { type: "Point", coordinates: [nLng, nLat] };
}

const ALWAYS_EDITABLE = new Set([
	"dest_batt",
	"dest_plant",
	"dest_sat",
	"wf_project",
	"state_id",
	"substate_id",
	"tipoestado_id",
]);

export default function WellsPage() {
	const { dbUser } = useAuth();
	const clientId = dbUser?.client_id;

	const [loading, setLoading] = useState(true);
	const [wells, setWells] = useState([]);
	const [q, setQ] = useState("");

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [saving, setSaving] = useState(false);
	const [editingWell, setEditingWell] = useState(null);
	const [activeTab, setActiveTab] = useState("data");
	const [form] = Form.useForm();

	const [wellTypes, setWellTypes] = useState([]);
	const [wellTypesLoading, setWellTypesLoading] = useState(false);

	const [auditRows, setAuditRows] = useState([]);
	const [auditLoading, setAuditLoading] = useState(false);

	const [unlocked, setUnlocked] = useState({});
	const [states, setStates] = useState([]);
	const [substates, setSubstates] = useState([]);
	const [tipoestadoOptions, setTipoestadoOptions] = useState([]);
	const [statusLoading, setStatusLoading] = useState(false);

	const stateId = Form.useWatch("state_id", form);
	const substateId = Form.useWatch("substate_id", form);

	const pendingSubstateIdRef = useRef(null);
	const pendingTipoestadoIdRef = useRef(null);
	const hydratingRef = useRef(false);

	const loadStates = async () => {
		try {
			setStatusLoading(true);
			const data = await fetch_well_states();
			setStates(Array.isArray(data) ? data : []);
		} catch (e) {
			console.error(e);
			message.error("Error cargando estados");
		} finally {
			setStatusLoading(false);
		}
	};

	const loadSubstates = async (stId) => {
		try {
			setStatusLoading(true);
			const data = await fetch_well_substates(stId);
			setSubstates(Array.isArray(data) ? data : []);
		} catch (e) {
			console.error(e);
			message.error("Error cargando subestados");
		} finally {
			setStatusLoading(false);
		}
	};

	const loadTipoestado = async (ssId) => {
		try {
			setStatusLoading(true);
			const data = await fetch_well_tipoestado(ssId);
			setTipoestadoOptions(Array.isArray(data) ? data : []);
		} catch (e) {
			console.error(e);
			message.error("Error cargando tipoestado");
		} finally {
			setStatusLoading(false);
		}
	};

	useEffect(() => {
		loadStates();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!stateId) {
			setSubstates([]);
			setTipoestadoOptions([]);
			return;
		}

		loadSubstates(stateId).then(() => {
			if (hydratingRef.current && pendingSubstateIdRef.current != null) {
				const wanted = pendingSubstateIdRef.current;
				pendingSubstateIdRef.current = null;

				form.setFieldsValue({ substate_id: wanted });
				return;
			}
			if (!hydratingRef.current) {
				form.setFieldsValue({ substate_id: null, tipoestado_id: null });
			}
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stateId]);

	useEffect(() => {
		if (!substateId) {
			setTipoestadoOptions([]);
			return;
		}

		loadTipoestado(substateId).then(() => {
			if (hydratingRef.current && pendingTipoestadoIdRef.current != null) {
				const wanted = pendingTipoestadoIdRef.current;
				pendingTipoestadoIdRef.current = null;

				form.setFieldsValue({ tipoestado_id: wanted });

				hydratingRef.current = false;
				return;
			}

			if (!hydratingRef.current) {
				form.setFieldsValue({ tipoestado_id: null });
			}
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [substateId]);

	const loadWellTypes = async () => {
		try {
			setWellTypesLoading(true);
			const data = await fetch_well_types();
			setWellTypes(Array.isArray(data) ? data : []);
		} catch (e) {
			console.error(e);
			message.error("Error cargando tipos de pozo");
		} finally {
			setWellTypesLoading(false);
		}
	};

	useEffect(() => {
		loadWellTypes();
	}, []);

	const load = async () => {
		try {
			setLoading(true);
			const data = await fetch_wells_total_data("", clientId);
			setWells(Array.isArray(data) ? data : []);
		} catch (e) {
			console.error(e);
			message.error("Error cargando pozos");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!clientId) return;
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clientId]);

	const loadAudit = async (well) => {
		if (!well?.id_well) return;
		try {
			setAuditLoading(true);
			const data = await fetch_well_audit(well.id_well, clientId);
			setAuditRows(Array.isArray(data) ? data : []);
		} catch (e) {
			console.error(e);
			message.error("No se pudo cargar el historial");
		} finally {
			setAuditLoading(false);
		}
	};

	const filtered = useMemo(() => {
		const qq = (q || "").trim().toLowerCase();
		if (!qq) return wells;
		return wells.filter((w) => {
			const code = (w.code || "").toLowerCase();
			const desc = (w.description || "").toLowerCase();
			const area = (w.area || "").toLowerCase();
			const yac = (w.yacimiento || "").toLowerCase();
			return (
				code.includes(qq) ||
				desc.includes(qq) ||
				area.includes(qq) ||
				yac.includes(qq)
			);
		});
	}, [wells, q]);

	const openCreate = () => {
		setEditingWell(null);
		setActiveTab("data");
		setAuditRows([]);
		setAuditLoading(false);
		setUnlocked({});

		form.setFieldsValue({
			client_id: clientId,
			code: "",
			description: null,
			type: "N/A",
			drilling_type: "__NULL__",
			method_production: "__NULL__",
			reservoir_type: "__NULL__",
			depth_mts: 0,
			ignore: false,
			dest_batt: null,
			dest_plant: null,
			dest_sat: null,
			wf_project: null,
			well_type_id: null,

			area: null,
			cod_area: null,
			empresa: null,
			yacimiento: null,
			cod_yacimiento: null,
			formacion: null,
			cuenca: null,
			provincia: null,
			cota: null,
			clasificacion: null,
			subclasificacion: null,
			tipo_recurso: null,
			sub_tipo_recurso: null,
			gasplus: null,
			tipopozo: null,
			tipoextraccion: null,
			state_id: null,
			substate_id: null,
			tipoestado_id: null,

			adjiv_fecha_inicio_perf: null,
			adjiv_fecha_inicio_term: null,
			adjiv_fecha_fin_term: null,
			adjiv_fecha_fin_perf: null,

			geo_lat: null,
			geo_lng: null,
		});

		setDrawerOpen(true);
	};

	const openEdit = (record) => {
		hydratingRef.current = true;

		setEditingWell(record);
		setActiveTab("data");
		setUnlocked({});
		setAuditRows([]);
		setAuditLoading(false);

		const { geo_lat, geo_lng } = parseGeoToLatLng(record.geojson);

		const stId = record.state_id != null ? Number(record.state_id) : null;
		const ssId = record.substate_id != null ? Number(record.substate_id) : null;
		const teId =
			record.tipoestado_id != null ? Number(record.tipoestado_id) : null;

		pendingSubstateIdRef.current = ssId;
		pendingTipoestadoIdRef.current = teId;

		form.setFieldsValue({
			...defaultValues,
			...record,
			client_id: clientId,

			drilling_type: record.drilling_type ?? "__NULL__",
			method_production: record.method_production ?? "__NULL__",
			reservoir_type: record.reservoir_type ?? "__NULL__",

			ignore: !!record.ignore,
			geo_lat,
			geo_lng,

			state_id: stId,
			substate_id: null,
			tipoestado_id: null,
		});

		setDrawerOpen(true);
	};

	const closeDrawer = () => {
		setDrawerOpen(false);
		setEditingWell(null);
		setActiveTab("data");
		setAuditRows([]);
		setAuditLoading(false);
		form.resetFields();
	};

	const onSubmit = async () => {
		try {
			const values = await form.validateFields();
			setSaving(true);

			const payload = {
				...values,
				client_id: clientId,
				drilling_type:
					values.drilling_type === "__NULL__" ? null : values.drilling_type,
				method_production:
					values.method_production === "__NULL__"
						? null
						: values.method_production,
				reservoir_type:
					values.reservoir_type === "__NULL__" ? null : values.reservoir_type,
				ignore: values.ignore ? true : null,
				geojson: buildGeojsonFromLatLng(values.geo_lat, values.geo_lng),
				state_id: values.state_id,
				substate_id: values.substate_id,
				tipoestado_id: values.tipoestado_id,
			};

			delete payload.geo_lat;
			delete payload.geo_lng;

			payload.code = (payload.code || "").trim();

			if (payload.well_type_id !== null && payload.well_type_id !== undefined) {
				payload.well_type_id = Number(payload.well_type_id);
			}

			if (editingWell?.id_well) {
				await update_well(editingWell.id_well, payload);
				message.success("Pozo actualizado");

				await loadAudit({ id_well: editingWell.id_well });
			} else {
				await create_well(payload);
				message.success("Pozo creado");
			}

			//setActiveTab("history");

			closeDrawer();
			await load();
		} catch (e) {
			if (e?.errorFields) return;

			const apiMsg = e?.response?.data?.error;
			if (e?.response?.status === 409) {
				message.error(apiMsg || "Ya existe un pozo con ese código");
				return;
			}

			console.error(e);
			message.error("No se pudo guardar el pozo");
		} finally {
			setSaving(false);
		}
	};

	const columns = [
		{
			title: "Código",
			dataIndex: "code",
			width: 90,
			render: (_, r) => <Typo>{r.code}</Typo>,
		},
		{
			title: "Área",
			dataIndex: "area",
			width: 180,
			render: (v) => <Typo>{v || "-"}</Typo>,
		},
		{
			title: "Tipo pozo",
			dataIndex: "well_type_description",
			width: 180,
			render: (v) => <Typo>{v || "-"}</Typo>,
		},
		{
			title: "Yacimiento",
			dataIndex: "yacimiento",
			width: 180,
			render: (v) => <Typo>{v || "-"}</Typo>,
		},
		{
			title: "Prov.",
			dataIndex: "provincia",
			width: 130,
			render: (v) => <Typo>{v || "-"}</Typo>,
		},
		{
			title: "Perforación",
			dataIndex: "drilling_type",
			width: 120,
			render: (v) => <Typo>{v || "-"}</Typo>,
		},
		{
			title: "Método",
			dataIndex: "method_production",
			width: 180,
			render: (v) => <Typo>{v || "-"}</Typo>,
		},
		{
			title: "Reservorio",
			dataIndex: "reservoir_type",
			width: 130,
			render: (v) => <Typo>{v || "-"}</Typo>,
		},
		{
			title: "Prof. (mts)",
			dataIndex: "depth_mts",
			width: 110,
			align: "right",
			render: (v) => <Typo>{Number(v || 0)}</Typo>,
		},
		{
			title: "Geo",
			key: "geo",
			width: 110,
			render: (_, r) =>
				r.geojson?.type === "Point" && Array.isArray(r.geojson?.coordinates) ? (
					<Tag color="blue">Point</Tag>
				) : (
					<Tag>—</Tag>
				),
		},
		{
			title: "Ignorar",
			dataIndex: "ignore",
			width: 90,
			align: "center",
			render: (v) =>
				v ? <Tag color="red">Sí</Tag> : <Tag color="green">No</Tag>,
		},
		{
			title: "",
			key: "actions",
			width: 110,
			fixed: "right",
			render: (_, r) => (
				<Button icon={<EditOutlined />} onClick={() => openEdit(r)}>
					Editar
				</Button>
			),
		},
	];

	const wellTypeOptions = useMemo(() => {
		return wellTypes.map((wt) => ({
			value: wt.id,
			label: `${wt.description}`,
		}));
	}, [wellTypes]);

	const drawerTitle = editingWell
		? `Editar pozo ${editingWell.code}`
		: "Nuevo pozo";

	const tabs = [
		{
			key: "data",
			label: "Datos",
			children: (
				<Form form={form} layout="vertical">
					<SectionTitle>Identificación</SectionTitle>
					<TwoCol>
						<LockableItem
							name="code"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item
									label="Código"
									name="code"
									rules={[
										{ required: true, message: "El código es requerido" },
									]}
								>
									<Input placeholder="Ej: CVa.a-4" disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>
						<LockableItem
							name="type"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Tipo" name="type">
									<Select
										allowClear
										loading={wellTypesLoading}
										options={wellTypeOptions}
										placeholder="Elegí un tipo…"
										showSearch
										optionFilterProp="label"
										disabled={!isUnlocked}
									/>
								</Form.Item>
							)}
						</LockableItem>
					</TwoCol>
					<LockableItem
						name="description"
						unlockedMap={unlocked}
						setUnlockedMap={setUnlocked}
						alwaysEditableFields={ALWAYS_EDITABLE}
					>
						{(isUnlocked) => (
							<Form.Item label="Descripción" name="description">
								<Input.TextArea
									rows={2}
									placeholder="Opcional"
									disabled={!isUnlocked}
								/>
							</Form.Item>
						)}
					</LockableItem>
					<Divider />

					<SectionTitle>Operación</SectionTitle>
					<ThreeCol>
						<LockableItem
							name="drilling_type"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Perforación" name="drilling_type">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>
						<LockableItem
							name="method_production"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item
									label="Método de producción"
									name="method_production"
								>
									<Select
										showSearch
										optionFilterProp="label"
										options={optionize(METHOD_PRODUCTION_OPTIONS)}
										disabled={!isUnlocked}
									/>
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="reservoir_type"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Reservorio" name="reservoir_type">
									<Select
										options={optionize(RESERVOIR_TYPE_OPTIONS)}
										disabled={!isUnlocked}
									/>
								</Form.Item>
							)}
						</LockableItem>
					</ThreeCol>

					<TwoCol>
						<LockableItem
							name="depth_mts"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Profundidad (mts)" name="depth_mts">
									<InputNumber
										min={0}
										style={{ width: "100%" }}
										disabled={!isUnlocked}
									/>
								</Form.Item>
							)}
						</LockableItem>
						<LockableItem
							name="ignore"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item
									label="Ignorar"
									name="ignore"
									valuePropName="checked"
								>
									<Switch
										checkedChildren="Sí"
										unCheckedChildren="No"
										disabled={!isUnlocked}
									/>
								</Form.Item>
							)}
						</LockableItem>
					</TwoCol>

					<Divider />

					<SectionTitle>Destinos</SectionTitle>
					<ThreeCol>
						<LockableItem
							name="dest_batt"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Dest. Batería" name="dest_batt">
									<Input placeholder="BAT-CVA-01" disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="dest_plant"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Dest. Planta" name="dest_plant">
									<Input placeholder="N/A" disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="dest_sat"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Dest. SAT" name="dest_sat">
									<Input placeholder="N/A" disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>
					</ThreeCol>

					<TwoCol>
						<LockableItem
							name="wf_project"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="WF Project" name="wf_project">
									<Input
										placeholder="Primary Producer"
										disabled={!isUnlocked}
									/>
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="well_type_id"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Tipo de pozo" name="well_type_id">
									<Select
										allowClear
										loading={wellTypesLoading}
										options={wellTypeOptions}
										placeholder="Elegí un tipo…"
										showSearch
										optionFilterProp="label"
										disabled={!isUnlocked}
									/>
								</Form.Item>
							)}
						</LockableItem>
					</TwoCol>

					<Divider />

					<SectionTitle>Clasificación / Contexto</SectionTitle>
					<ThreeCol>
						<LockableItem
							name="area"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Área" name="area">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="cod_area"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Cod. Área" name="cod_area">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="empresa"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Empresa" name="empresa">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>
					</ThreeCol>

					<ThreeCol>
						<LockableItem
							name="yacimiento"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Yacimiento" name="yacimiento">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="cod_yacimiento"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Cod. Yacimiento" name="cod_yacimiento">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="formacion"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Formación" name="formacion">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>
					</ThreeCol>

					<ThreeCol>
						<LockableItem
							name="cuenca"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Cuenca" name="cuenca">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="provincia"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Provincia" name="provincia">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="cota"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Cota" name="cota">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>
					</ThreeCol>

					<ThreeCol>
						<LockableItem
							name="clasificacion"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Clasificación" name="clasificacion">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="subclasificacion"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Subclasificación" name="subclasificacion">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="tipo_recurso"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Tipo recurso" name="tipo_recurso">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>
					</ThreeCol>

					<ThreeCol>
						<LockableItem
							name="sub_tipo_recurso"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Sub tipo recurso" name="sub_tipo_recurso">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="gasplus"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Gasplus" name="gasplus">
									<Select
										disabled={!isUnlocked}
										options={optionize(GASPLUS_OPTIONS)}
									/>
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="tipopozo"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Tipopozo" name="tipopozo">
									<Select
										allowClear
										loading={wellTypesLoading}
										options={wellTypeOptions}
										placeholder="Elegí un tipo…"
										showSearch
										optionFilterProp="label"
										disabled={!isUnlocked}
									/>
								</Form.Item>
							)}
						</LockableItem>
					</ThreeCol>

					<ThreeCol>
						<LockableItem
							name="tipoextraccion"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Tipo extracción" name="tipoextraccion">
									<Select
										disabled={!isUnlocked}
										options={optionize(EXTRACTION_TYPE_OPTIONS)}
									/>
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="geom"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Geom (raw)" name="geom">
									<Input disabled={!isUnlocked} />
								</Form.Item>
							)}
						</LockableItem>
					</ThreeCol>

					<ThreeCol>
						<LockableItem
							name="state_id"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Estado" name="state_id">
									<Select
										disabled={!isUnlocked}
										loading={statusLoading}
										options={states.map((x) => ({
											value: Number(x.id),
											label: x.name,
										}))}
										placeholder="Seleccioná estado..."
										showSearch
										optionFilterProp="label"
										allowClear
									/>
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="substate_id"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Subestado" name="substate_id">
									<Select
										disabled={!isUnlocked || !stateId}
										loading={statusLoading}
										options={substates?.map((x) => ({
											value: Number(x.id),
											label: `${x.cod_estado} — ${x.name}`,
										}))}
										placeholder={
											stateId
												? "Seleccioná subestado..."
												: "Elegí estado primero"
										}
										showSearch
										optionFilterProp="label"
										allowClear
									/>
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="tipoestado_id"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Tipo estado" name="tipoestado_id">
									<Select
										disabled={!isUnlocked || !substateId}
										loading={statusLoading}
										options={tipoestadoOptions?.map((x) => ({
											value: Number(x.id),
											label: x.name,
										}))}
										placeholder={
											substateId
												? "Seleccioná tipo estado..."
												: "Elegí subestado primero"
										}
										showSearch
										optionFilterProp="label"
										allowClear
									/>
								</Form.Item>
							)}
						</LockableItem>
					</ThreeCol>

					<Divider />

					<SectionTitle>Geolocalización (GeoJSON Point)</SectionTitle>
					<TwoCol>
						<LockableItem
							name="geo_lat"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Latitud" name="geo_lat">
									<InputNumber
										style={{ width: "100%" }}
										placeholder="-46.1234"
										disabled={!isUnlocked}
									/>
								</Form.Item>
							)}
						</LockableItem>

						<LockableItem
							name="geo_lng"
							unlockedMap={unlocked}
							setUnlockedMap={setUnlocked}
							alwaysEditableFields={ALWAYS_EDITABLE}
						>
							{(isUnlocked) => (
								<Form.Item label="Longitud" name="geo_lng">
									<InputNumber
										style={{ width: "100%" }}
										placeholder="-67.1234"
										disabled={!isUnlocked}
									/>
								</Form.Item>
							)}
						</LockableItem>
					</TwoCol>

					<Form.Item
						label="GeoJSON"
						shouldUpdate={(prev, cur) =>
							prev.geo_lat !== cur.geo_lat || prev.geo_lng !== cur.geo_lng
						}
					>
						{() => {
							const lat = form.getFieldValue("geo_lat");
							const lng = form.getFieldValue("geo_lng");
							const gj = buildGeojsonFromLatLng(lat, lng);
							return (
								<Input.TextArea
									rows={2}
									value={gj ? JSON.stringify(gj) : ""}
									readOnly
								/>
							);
						}}
					</Form.Item>
				</Form>
			),
		},
		{
			key: "history",
			label: "Histórico",
			disabled: !editingWell?.id_well,
			children: auditLoading ? (
				<div style={{ padding: 12 }}>
					<Spin />
				</div>
			) : (
				<div style={{ paddingTop: 4 }}>
					<WellHistoryTimeline auditRows={auditRows} />
				</div>
			),
		},
	];

	return (
		<LayoutPage pageName="Pozos" displayFilter={false}>
			<Title level={4}>Pozos</Title>

			<Toolbar>
				<ToolbarLeft>
					<Input
						allowClear
						placeholder="Buscar por código / desc / área / yacimiento…"
						value={q}
						onChange={(e) => setQ(e.target.value)}
						style={{ width: 420 }}
					/>
				</ToolbarLeft>

				<ToolbarRight>
					<Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
						Nuevo pozo
					</Button>
				</ToolbarRight>
			</Toolbar>

			<Table
				loading={loading}
				dataSource={filtered}
				columns={columns}
				pagination={{ pageSize: 50, showSizeChanger: true }}
				size="middle"
				rowKey="id_well"
				scroll={{ x: 1600, y: 600 }}
			/>

			<Drawer
				title={drawerTitle}
				placement="right"
				width={820}
				onClose={closeDrawer}
				open={drawerOpen}
				destroyOnClose
				extra={
					<Space>
						<Button onClick={closeDrawer}>Cancelar</Button>
						<Button type="primary" loading={saving} onClick={onSubmit}>
							Guardar
						</Button>
					</Space>
				}
			>
				<Tabs
					activeKey={activeTab}
					onChange={(k) => {
						setActiveTab(k);
						if (
							k === "history" &&
							editingWell?.id_well &&
							auditRows.length === 0 &&
							!auditLoading
						) {
							loadAudit(editingWell);
						}
					}}
					items={tabs}
				/>
			</Drawer>
		</LayoutPage>
	);
}
