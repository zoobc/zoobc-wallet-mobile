export interface ChatUser {
    name: string;
    path: number;
    address: string;
    token: string;
    uid: string;
    time: any;
}

export interface Chat {
    message: string;
    pair: string;
    sender: string;
    chatId: string;
    time: any;
}
