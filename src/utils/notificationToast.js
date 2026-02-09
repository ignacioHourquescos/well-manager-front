import { notification } from "antd";

const TYPE = {
	SUCCESS: "success",
	ERROR: "error",
	INFO: "info",
	WARNING: "warning",
};

const openNotificationWithIcon = (type, message, description) => {
	return notification[type]({
		message,
		description,
		placement: "topRight",
		top: 75,
	});
};

export { openNotificationWithIcon, TYPE };
