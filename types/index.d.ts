
declare type User = {
    id: string;
    name: string;
    email: string;
    emailVerified?: Date;
    googleId?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    chatRoomIDs?: string[];
    accounts?: Account[];
    sessions?: Session[];
    messages?: Message[];
    createdRooms?: ChatRoom[];
    chatRooms?: ChatRoom[];
}

declare type Account = {
    id: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
}

declare type Session = {
    id: string;
    userId: string;
    expires: Date;
    sessionToken: string;
}

declare type ChatRoom = {
    id: string;
    name: string;
    description: string;
    image?: string;
    createdById: string;
    userIDs: string[];
    messages?: Message[];
    createdAt: Date;
    updatedAt: Date;
}

declare type Message = {
    id: string;
    content: string;
    senderId: string;
    chatRoomId: string;
    createdAt: Date;
    updatedAt: Date;
    sender?: User;
}

