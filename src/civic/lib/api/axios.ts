// src/lib/api/axios.ts
import axios from "axios";
import { API_URL } from "@/lib/config";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});