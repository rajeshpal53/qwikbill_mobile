import axios from 'axios';
const API_BASE_URL = "http://192.168.5.248:8888/";

const apiRequest = async (method, url, data = null, headers) => {
    try {
        const response = await axios({
           url: `${API_BASE_URL}${url}`,
            method,
            data: data ? JSON.stringify(data) : null, // Stringify the data if present
           headers:{
              'Content-Type': 'application/json', // Set the content type to JSON
              ...headers,
            },
            withCredentials: true, // Include credentials
          });
          return response.data||'';
    } catch (error) {
      console.error(`Error with ${method.toUpperCase()} request to ${url}:`, error.response || error.message);
      throw error.response || error.message;
    }
  };

  const deleteApiRequest= async( method ,url )=>{
        const response= await axios({
          url:`${API_BASE_URL}${url}`,
          method,
          withCredentials:true
        })
        return response
  }
  //CREATE  
  export const createApi = async (endpoint, data, headers) => {
    return apiRequest('post', endpoint, data, headers);
  };

// READ
  export const readApi = async (endpoint, headers) => {
    return apiRequest('get', endpoint, null, headers);
  };

// UPDATE
export const updateApi = async (endpoint, data, headers) => {
    return apiRequest('patch', endpoint, data, headers);
  };
  
  // DELETE
  export const deleteApi = async (endpoint) => {
    return deleteApiRequest('delete', endpoint,);
  };