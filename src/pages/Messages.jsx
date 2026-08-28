import { useState, useEffect } from "react";

import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  db,
  auth,
} from "../firebase";


function Messages() {

  const [
    currentUser,
    setCurrentUser,
  ] = useState(null);

  const [
    selectedChat,
    setSelectedChat,
  ] = useState(null);

  const [
    chats,
    setChats,
  ] = useState([]);

  const [
    messages,
    setMessages,
  ] = useState([]);


  // =====================================================
  // Authentication
  // =====================================================

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {

          setCurrentUser(user);

          if (!user) {

            setChats([]);

            setSelectedChat(null);

            setMessages([]);

          }

        }
      );

    return () => unsubscribe();

  }, []);


  // =====================================================
  // Load User Chats
  // =====================================================

  useEffect(() => {

    if (!currentUser) {

      return;

    }

    const chatsQuery =
      query(
        collection(
          db,
          "chats"
        ),
        where(
          "participants",
          "array-contains",
          currentUser.uid
        )
      );


    const unsubscribe =
      onSnapshot(
        chatsQuery,
        (snapshot) => {

          const loadedChats =
            snapshot.docs.map(
              (docSnap) => ({

                id:
                  docSnap.id,

                ...docSnap.data(),

              })
            );


          // Sort by most recently updated chat.
          loadedChats.sort(
            (a, b) => {

              const aTime =
                a.updatedAt?.toMillis
                  ? a.updatedAt.toMillis()
                  : 0;

              const bTime =
                b.updatedAt?.toMillis
                  ? b.updatedAt.toMillis()
                  : 0;

              return bTime - aTime;

            }
          );


          setChats(
            loadedChats
          );

        },
        (error) => {

          console.error(
            "Failed to load chats:",
            error
          );

          setChats([]);

        }
      );


    return () => unsubscribe();

  }, [currentUser]);


  // =====================================================
  // Load Messages For Selected Chat
  // =====================================================

  useEffect(() => {

    if (
      !currentUser ||
      !selectedChat
    ) {

      setMessages([]);

      return;

    }


    const messagesQuery =
      query(
        collection(
          db,
          "chats",
          selectedChat.id,
          "messages"
        )
      );


    const unsubscribe =
      onSnapshot(
        messagesQuery,
        async (snapshot) => {

          const loadedMessages =
            snapshot.docs
              .map(
                (docSnap) => {

                  const data =
                    docSnap.data();


                  // =======================================
                  // Mark Incoming Message As Read
                  // =======================================

                  const readBy =
                    Array.isArray(
                      data.readBy
                    )
                      ? data.readBy
                      : [];


                  const isOwnMessage =
                    data.senderId ===
                    currentUser.uid;


                  const alreadyRead =
                    readBy.includes(
                      currentUser.uid
                    );


                  if (
  !isOwnMessage &&
  !alreadyRead
) {

  updateDoc(
    doc(
      db,
      "chats",
      selectedChat.id,
      "messages",
      docSnap.id
    ),
    {
      status: "read",

      readBy:
        arrayUnion(
          currentUser.uid
        ),
    }
  ).catch((error) => {

    console.error(
      "Failed to update read receipt:",
      error
    );

  });

}

                  return {

                    id:
                      docSnap.id,

                    ...data,

                  };

                }
              );


          // =============================================
          // Sort Messages Chronologically
          // =============================================

          loadedMessages.sort(
            (a, b) => {

              const aTime =
                a.createdAt?.toMillis
                  ? a.createdAt.toMillis()
                  : 0;

              const bTime =
                b.createdAt?.toMillis
                  ? b.createdAt.toMillis()
                  : 0;

              return aTime - bTime;

            }
          );


          setMessages(
            loadedMessages
          );

        },
        (error) => {

          console.error(
            "Failed to load messages:",
            error
          );

          setMessages([]);

        }
      );


    return () => unsubscribe();

  }, [
    currentUser,
    selectedChat,
  ]);


  // =====================================================
  // Render
  // =====================================================

  return (

    <div
      style={{
        height: "100vh",
        display: "flex",
        background: "#020617",
        color: "white",
      }}
    >

      <ChatList
        chats={chats}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />


      <ChatWindow
        selectedChat={selectedChat}
        messages={messages}
      />

    </div>

  );

}


export default Messages;
