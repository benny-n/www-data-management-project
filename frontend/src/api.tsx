import axios from "axios";

export const login = async (
  username: string,
  password: string
): Promise<any> => {
  await axios.post("http://localhost:5000/login", {
    username: username,
    password: password,
  });
};
