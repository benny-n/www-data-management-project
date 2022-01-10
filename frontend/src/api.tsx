import axios from "axios";
import { Poll } from "./types";

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

//TODO maybe give type to return value instead of 'any'
export const getAllPolls = async (
  authToken: string
): Promise<{ polls: Poll[] }> => {
  return (
    await axios.get(`${API_URL}/polls`, {
      headers: {
        Authorization: `Basic ${authToken}`,
      },
    })
  ).data;
};
