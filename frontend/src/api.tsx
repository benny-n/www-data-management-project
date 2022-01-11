import axios from "axios";
import { Filter, Poll, PollStats } from "./types";

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

export const getAllAdmins = async (
  authToken: string
): Promise<{ admins: string[] }> => {
  return (
    await axios.get(`${API_URL}/admins`, {
      headers: {
        Authorization: `Basic ${authToken}`,
      },
    })
  ).data;
};

export const createPoll = async (
  question: string,
  answers: string[],
  filters: Filter[],
  authToken: string
): Promise<any> => {
  await axios.post(
    `${API_URL}/polls`,
    {
      question,
      answers,
      filters,
    },
    {
      headers: {
        Authorization: `Basic ${authToken}`,
      },
    }
  );
};

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

export const getAllPollStats = async (
  authToken: string
): Promise<{ stats: PollStats[] }> => {
  return (
    await axios.get(`${API_URL}/polls/stats`, {
      headers: {
        Authorization: `Basic ${authToken}`,
      },
    })
  ).data;
};
