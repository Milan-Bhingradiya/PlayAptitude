import axios, { AxiosError } from "axios";
import { addGameHistoryInput, addGameHistoryResponse, GameMappingResponse, getUserProfileReponse, insertIntoPoolResponse, LoginResponse, updateUserProfileInput } from "../types";
import { BASE_URL } from "../constants";
import cookie from "js-cookie";

export async function loginUser(credentials: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  try {
    const { data } = await axios.post<LoginResponse>(
      `${BASE_URL}/login`,
      credentials
    );
    return data;
  } catch (error: AxiosError | unknown) {
    const err = error as AxiosError;
    return err.response?.data as LoginResponse;
  }
}

// use less start
export async function insertUserInPool(): Promise<insertIntoPoolResponse> {
  try {
    const { data } = await axios.post<insertIntoPoolResponse>(
      `${BASE_URL}/insertIntoPool`, {},
      {
        headers: {
          Authorization: `Bearer ${cookie.get("userToken")}`,
        },
      }
    );
    return data;
  } catch (error: AxiosError | unknown) {
    const err = error as AxiosError;
    return err.response?.data as insertIntoPoolResponse;
  }
}

export async function deleteUserFromPool(): Promise<null> {
  try {
    const { data } = await axios.post<null>(
      `${BASE_URL}/deleteFromPool`, {},
      {
        headers: {
          Authorization: `Bearer ${cookie.get("userToken")}`,
        },
      }
    );
    return data;
  } catch (error: AxiosError | unknown) {
    const err = error as AxiosError;
    return err.response?.data as null;
  }
}
export async function findOpponent(): Promise<GameMappingResponse> {
  try {
    const { data } = await axios.post<GameMappingResponse>(
      `${BASE_URL}/findOpponent`, {},
      {
        headers: {
          Authorization: `Bearer ${cookie.get("userToken")}`,
        },
      }
    );
    return data;
  } catch (error: AxiosError | unknown) {
    const err = error as AxiosError;
    return err.response?.data as GameMappingResponse;
  }
}
// use less end

export async function addGameHistory(inputdata: addGameHistoryInput): Promise<addGameHistoryResponse> {
  try {
    const { data } = await axios.post<addGameHistoryResponse>(
      `${BASE_URL}/addGameHistory`, inputdata,
      {
        headers: {
          Authorization: `Bearer ${cookie.get("userToken")}`,
        },
      }
    );
    return data;
  } catch (error: AxiosError | unknown) {
    const err = error as AxiosError;
    return err.response?.data as addGameHistoryResponse;
  }
}

export async function updateUserProfile(inputdata: updateUserProfileInput): Promise<getUserProfileReponse> {
  try {
    const { data } = await axios.post<getUserProfileReponse>(
      `${BASE_URL}/updateUserProfile`, inputdata,
      {
        headers: {
          Authorization: `Bearer ${cookie.get("userToken")}`,
        },
      }
    );
    return data;
  } catch (error: AxiosError | unknown) {
    const err = error as AxiosError;
    return err.response?.data as getUserProfileReponse;
  }
}