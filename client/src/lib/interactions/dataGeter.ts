import axios, { AxiosError } from "axios";
import { BASE_URL } from "../constants";
import cookie from "js-cookie";
import { getUserProfileReponse, listNGameHistoryResponse, listTopPlayersReponse } from "../types";


export async function listNGameHistory(n: number): Promise<listNGameHistoryResponse> {
  try {
    const { data } = await axios.get<listNGameHistoryResponse>(
      `${BASE_URL}/listGameHistory/` + n,
      {
        headers: {
          Authorization: `Bearer ${cookie.get("userToken")}`,
        },
      }

    );
    return data;
  } catch (error: AxiosError | unknown) {
    const err = error as AxiosError;
    return err.response?.data as listNGameHistoryResponse;
  }
}

export async function listTopPlayers(): Promise<listTopPlayersReponse> {
  try {
    const { data } = await axios.get<listTopPlayersReponse>(
      `${BASE_URL}/listTopPlayers/`,
      {
        headers: {
          Authorization: `Bearer ${cookie.get("userToken")}`,
        },
      }

    );
    return data;
  } catch (error: AxiosError | unknown) {
    const err = error as AxiosError;
    return err.response?.data as listTopPlayersReponse;
  }
}



export async function getUserProfile(): Promise<getUserProfileReponse> {
  try {
    const { data } = await axios.get<getUserProfileReponse>(
      `${BASE_URL}/getUserProfile/`,
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
