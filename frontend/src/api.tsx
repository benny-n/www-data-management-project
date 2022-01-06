import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const login = async (
  username: string,
  password: string
): Promise<any> => {
  await axios.post(`${API_URL}/login`, {
    username,
    password,
  });
};

export const logout = async (): Promise<any> => {
  await axios.get(`${API_URL}/logout`);
};

export const register = async (
  username: string,
  password: string,
  authToken: string
): Promise<any> => {
  console.log("http register", username, password);
  await axios.post(
    `${API_URL}/admins`,
    {
      username,
      password,
    },
    {
      headers: {
        Authorization: `Basic ${authToken}`,
      },
    }
  );
};
