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
