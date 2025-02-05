import axios from 'axios';
// const API_BASE_URL = "https://wertone-billing.onrender.com/";
// const API_BASE_URL = "https://wertone-billing.onrender.com/";

export const API_BASE_URL = "https://rajeshpal.online/";

// export const API_BASE_URL = "http://192.168.1.35:2235/";



export const NORM_URL="https://dailysabji.com/"
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
      console.error("error is , error")
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
  export const fontSize = {
    headingLarge: 24,
    headingMedium: 22,
    heading: 20,
    headingSmall: 18,
    labelLarge: 16,
    labelMedium: 14,
    label: 12,
    labelSmall: 10,
    labelXSmall:9,
    labelXXSmall:8,
  };


  export const fontFamily = {
    regular: "Poppins-Regular",
    bold: "Poppins-Bold",
    medium: "Poppins-Medium",
    thin: "Poppins-Thin",
  };




export const ButtonColor  = {
  SubmitBtn :"#007bff",
}