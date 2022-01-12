import axios from "axios";
import { Filter, Poll, PollStats } from "./types";

const API_URL = process.env.REACT_APP_API_URL;

export const login = async (
  username: string,
  password: string
): Promise<string> => {
  return (
    await axios.post(`${API_URL}/login`, {
      username,
      password,
    })
  ).data;
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
        Authorization: `Bearer ${authToken}`,
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
        Authorization: `Bearer ${authToken}`,
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
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

export const deletePoll = async (
  pollUid: string,
  authToken: string
): Promise<any> => {
  await axios.delete(`${API_URL}/polls/${pollUid}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
};

export const getAllPolls = async (
  authToken: string
): Promise<{ polls: Poll[] }> => {
  return (
    await axios.get(`${API_URL}/polls`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
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
        Authorization: `Bearer ${authToken}`,
      },
    })
  ).data;
};
