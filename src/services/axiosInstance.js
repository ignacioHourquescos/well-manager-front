import axios from "axios";

// export default axios.create({
//   baseURL: "https://onemarket-api.azurewebsites.net/api/",
// });

export default axios.create({
	baseURL: process.env.REACT_APP_API_BASE_URL,
});
