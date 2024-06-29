
// const API_BASE_URL = "http://192.168.1.6:8888/";

// const apiRequest = async (method, url, data = null, headers = {}) => {
//     try {
//       const response = await axios({
//         method,
//         url: `${API_BASE_URL}${url}`,
//         data,
//         headers,
//       });
//       return response.data;
//     } catch (error) {
//       console.error(`Error with ${method.toUpperCase()} request to ${url}:`, error.response || error.message);
//       throw error.response || error.message;
//     }
//   };
//   //CREATE  
//   export const createApi = async (endpoint, data, headers) => {
//     return apiRequest('post', endpoint, data, headers);
//   };

// // READ
//   export const readApi = async (endpoint, headers) => {
//     return apiRequest('get', endpoint, null, headers);
//   };

// // UPDATE
// export const updateApi = async (endpoint, data, headers) => {
//     return apiRequest('put', endpoint, data, headers);
//   };
  
//   // DELETE
//   export const deleteApi = async (endpoint, headers) => {
//     return apiRequest('delete', endpoint, null, headers);
//   };