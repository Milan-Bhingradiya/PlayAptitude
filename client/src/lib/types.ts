import { EXPORT_DETAIL } from "next/dist/shared/lib/constants";

export interface BaseResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse extends BaseResponse {
  data?: {
    token: string;
  };
}
export interface insertIntoPoolResponse extends BaseResponse {
  data: {
    id: string;
    userId: string;
    interestedModel?: string;
    joinedAt: string;
  };
}

//
export interface addGameMappingResponseHistoryResponse extends BaseResponse {
  data: {
    id: string;
    player1Username: string;
    player2Username: string;
    player1Total: number;
    player2Total: number;
    player1Scores: number[]; // assuming player scores are numeric
    player2Scores: number[]; // assuming player scores are numeric
    winner: string | null; // can be null if no winner yet
    createdAt: string; // ISO 8601 formatted date string
  };
}
export interface addGameHistoryInput {
  player2Username: string;
  player1Total: number;
  player2Total: number;
  player1Scores: number[]; // assuming player scores are numeric
  player2Scores: number[]; // assuming player scores are numeric
}

// game page
export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface ChatMessage {
  sender_uname: string;
  message: string;
  time: number;
}
export interface ChatMessage {
  sender_uname: string;
  message: string;
  time: number;
}

export interface Reaction {
  icon: React.ReactNode;
  label: string;
}

//
export interface listNGameHistoryResponse extends BaseResponse {
  // id: string;
  // player1Username: string;
  // player2Username: string;
  // player1Total: number;
  // player2Total: number;
  // player1Scores: number[];
  // player2Scores: number[];
  // winner: string;
  // playedAt: string;
  data: [{
    opponent: string;
    result: string;
    score: string;
    mode: string;
    playedAt: string;
  }]
}
//
export interface listTopPlayersReponse extends BaseResponse {

  data: [{
    username: string,
    num_of_games_won: number
  }]
}
export interface getUserProfileReponse extends BaseResponse {

  data: {
    username: string,
    createdAt: Date;
    password: string;
    img: string | null;
    bio: string | null;
    total_score: number | null;
    num_of_games_won: number | null;
    num_of_games_lost: number | null;

  }

}

export interface recentGame {
  opponent: string;
  result: string;
  score: string;
  mode: string;
  playedAt: string;
}
export interface topPlayer {
  rank: number;
  username: string;
  num_of_games_won: number;
}






export interface updateUserProfileInput {
  img?: string;
  bio?: string;

}

