import api from "./api";
import { User } from "../types";

export async function login(email: string, password: string) {
  const res = await api.post<{ data: { token: string; user: User } }>(
    "/auth/login",
    { email, password }
  );
  return res.data.data;
}

export async function register(name: string, email: string, password: string) {
  const res = await api.post<{ data: User }>("/auth/register", {
    name,
    email,
    password,
  });
  return res.data.data;
}
