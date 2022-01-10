export interface Poll {
  uid: string;
  question: string;
  answers: string[];
}
export interface PollStats extends Poll {
  votes: number[];
}

export interface Filter {
  pollUid: string;
  answerIndex: number;
}
