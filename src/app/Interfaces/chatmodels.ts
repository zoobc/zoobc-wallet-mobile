export interface User {
    address: string;
    name: string;
    time: string;
    fcmToken: string;
    fcmUid: string;
}

export interface Chat {
    message: string;
    pair: string;
    sender: string;
    chatId: string;
    time: any;
}
