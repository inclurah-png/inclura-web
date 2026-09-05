import { useEffect, useState } from "react";

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
  getDocs,
  limit,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { db, auth } from "../firebase";


function Messages() {
  const [currentUser, setCurrentUser] =
    useState(null);

  const [selectedChat, setSelectedChat] =
    useState(null);

  const [chats, setChats] =
    useState([]);

  const [messages, setMessages] =
    useState([]);

  const [loadingChats, setLoadingChats] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [showNewConversation, setShowNewConversation] =
    useState(false);

  const [users, setUsers] =
    useState([]);

  const [userSearch, setUserSearch] =
    useState("");

  const [loadingUsers, setLoadingUsers] =
    useState(false);

  const [creatingChat, setCreatingChat] =
    useState(false);


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
      setChats([]);
      setLoadingChats(false);
      return;
    }

    setLoadingChats(true);

    const chatsQuery =
      query(
        collection(db, "chats"),
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
                id: docSnap.id,
                ...docSnap.data(),
              })
            );

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

          setChats(loadedChats);

          /*
           * Keep the currently selected conversation
           * synchronized with the newest Firestore data.
           */
          if (selectedChat) {
            const refreshedSelectedChat =
              loadedChats.find(
                (chat) =>
                  chat.id === selectedChat.id
              );

            if (refreshedSelectedChat) {
              setSelectedChat(
                refreshedSelectedChat
              );
            }
          }

          setLoadingChats(false);
        },
        (error) => {
          console.error(
            "Inclura Messages Chat Load Error:",
            error
          );

          setChats([]);
          setLoadingChats(false);
        }
      );

    return () => unsubscribe();
  }, [
    currentUser,
    selectedChat?.id,
  ]);


  // =====================================================
  // Load Messages For Selected Chat
  // =====================================================

  useEffect(() => {
    if (
      !currentUser ||
      !selectedChat
    ) {
      setMessages([]);
      setLoadingMessages(false);
      return;
    }

    setLoadingMessages(true);

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
        (snapshot) => {
          const loadedMessages =
            snapshot.docs
              .map(
                (docSnap) => {
                  const data =
                    docSnap.data();

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
                    ).catch(
                      (error) => {
                        console.error(
                          "Inclura Read Receipt Error:",
                          error
                        );
                      }
                    );
                  }

                  return {
                    id:
                      docSnap.id,
                    ...data,
                  };
                }
              );

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

          setLoadingMessages(false);
        },
        (error) => {
          console.error(
            "Inclura Messages Load Error:",
            error
          );

          setMessages([]);
          setLoadingMessages(false);
        }
      );

    return () => unsubscribe();
  }, [
    currentUser,
    selectedChat?.id,
  ]);


  // =====================================================
  // Load Users For New Conversation
  // =====================================================

  async function loadUsers() {
    if (!currentUser) {
      return;
    }

    setLoadingUsers(true);

    try {
      const usersQuery =
        query(
          collection(
            db,
            "users"
          ),
          limit(50)
        );

      const snapshot =
        await getDocs(
          usersQuery
        );

      const loadedUsers =
        snapshot.docs
          .map(
            (docSnap) => ({
              id:
                docSnap.id,
              ...docSnap.data(),
            })
          )
          .filter(
            (user) =>
              user.id !==
              currentUser.uid
          );

      loadedUsers.sort(
        (a, b) => {
          const aName =
            String(
              a.displayName ||
              a.username ||
              a.email ||
              ""
            ).toLowerCase();

          const bName =
            String(
              b.displayName ||
              b.username ||
              b.email ||
              ""
            ).toLowerCase();

          return aName.localeCompare(
            bName
          );
        }
      );

      setUsers(
        loadedUsers
      );
    } catch (error) {
      console.error(
        "Inclura User Search Error:",
        error
      );

      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }


  // =====================================================
  // Open New Conversation
  // =====================================================

  async function openNewConversation() {
    setShowNewConversation(true);
    setUserSearch("");

    if (users.length === 0) {
      await loadUsers();
    }
  }


  // =====================================================
  // Create Or Open Conversation
  // =====================================================

  async function startConversation(targetUser) {
    if (
      !currentUser ||
      !targetUser ||
      creatingChat
    ) {
      return;
    }

    if (
      targetUser.id ===
      currentUser.uid
    ) {
      return;
    }

    setCreatingChat(true);

    try {
      /*
       * Deterministic two-user chat ID.
       *
       * This prevents duplicate one-to-one
       * conversations between the same users.
       */
      const participantIds = [
        currentUser.uid,
        targetUser.id,
      ].sort();

      const chatId =
        participantIds.join("_");

      const chatRef =
        doc(
          db,
          "chats",
          chatId
        );

      const currentDisplayName =
        currentUser.displayName ||
        currentUser.email ||
        "Inclura User";

      const targetDisplayName =
        targetUser.displayName ||
        targetUser.username ||
        targetUser.email ||
        "Inclura User";

      await setDoc(
        chatRef,
        {
          participants:
            participantIds,

          participantNames: {
            [currentUser.uid]:
              currentDisplayName,

            [targetUser.id]:
              targetDisplayName,
          },

          participantProfiles: {
            [currentUser.uid]: {
              displayName:
                currentDisplayName,

              photoURL:
                currentUser.photoURL ||
                "",
            },

            [targetUser.id]: {
              displayName:
                targetDisplayName,

              photoURL:
                targetUser.photoURL ||
                "",
            },
          },

          createdBy:
            currentUser.uid,

          updatedAt:
            serverTimestamp(),

          lastMessage:
            "",

          lastSenderId:
            "",
        },
        {
          merge: true,
        }
      );

      const newChat = {
        id: chatId,

        participants:
          participantIds,

        participantNames: {
          [currentUser.uid]:
            currentDisplayName,

          [targetUser.id]:
            targetDisplayName,
        },

        participantProfiles: {
          [currentUser.uid]: {
            displayName:
              currentDisplayName,

            photoURL:
              currentUser.photoURL ||
              "",
          },

          [targetUser.id]: {
            displayName:
              targetDisplayName,

            photoURL:
              targetUser.photoURL ||
              "",
          },
        },

        createdBy:
          currentUser.uid,

        lastMessage:
          "",

        lastSenderId:
          "",

        updatedAt:
          null,
      };

      setSelectedChat(
        newChat
      );

      setShowNewConversation(
        false
      );

      setUserSearch("");
    } catch (error) {
      console.error(
        "Inclura Start Conversation Error:",
        error
      );

      alert(
        "Unable to start the conversation. Please try again."
      );
    } finally {
      setCreatingChat(false);
    }
  }


  // =====================================================
  // Find Display Name
  // =====================================================

  function getUserDisplayName(user) {
    return (
      user.displayName ||
      user.username ||
      user.email ||
      "Inclura User"
    );
  }


  // =====================================================
  // Filter New Conversation Users
  // =====================================================

  const filteredUsers =
    users.filter(
      (user) => {
        const search =
          userSearch
            .trim()
            .toLowerCase();

        if (!search) {
          return true;
        }

        const name =
          String(
            user.displayName ||
            ""
          ).toLowerCase();

        const username =
          String(
            user.username ||
            ""
          ).toLowerCase();

        const email =
          String(
            user.email ||
            ""
          ).toLowerCase();

        const role =
          String(
            user.role ||
            ""
          ).toLowerCase();

        return (
          name.includes(search) ||
          username.includes(search) ||
          email.includes(search) ||
          role.includes(search)
        );
      }
    );


  // =====================================================
  // Render
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#020617",
        color: "white",
        overflow: "hidden",
      }}
    >

      {/* =================================================
          Messages Header
      ================================================= */}

      <header
        style={{
          minHeight: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "12px 20px",
          background: "#0f172a",
          borderBottom:
            "1px solid #1e293b",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "800",
            }}
          >
            💬 Messages
          </h1>

          <p
            style={{
              margin:
                "4px 0 0",
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            Connect with mentors,
            friends, creators,
            organizations and
            other Inclura users.
          </p>
        </div>

        <button
          type="button"
          onClick={
            openNewConversation
          }
          style={{
            border: "none",
            borderRadius: "12px",
            padding:
              "11px 16px",
            background:
              "#38bdf8",
            color: "#020617",
            fontWeight: "800",
            cursor: "pointer",
            whiteSpace:
              "nowrap",
          }}
        >
          ✏️ New Message
        </button>

      </header>


      {/* =================================================
          Main Messages Workspace
      ================================================= */}

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          overflow: "hidden",
        }}
      >

        {/* =================================================
            Conversation List
        ================================================= */}

        <aside
          style={{
            width: "340px",
            minWidth: "280px",
            maxWidth: "38%",
            background: "#0b1224",
            borderRight:
              "1px solid #1e293b",
            overflow: "auto",
            boxSizing: "border-box",
          }}
        >

          {loadingChats ? (
            <div
              style={{
                padding: "32px 20px",
                color: "#94a3b8",
                textAlign:
                  "center",
              }}
            >
              Loading conversations...
            </div>
          ) : (
            <ChatList
              chats={chats}
              selectedChat={
                selectedChat
              }
              setSelectedChat={
                setSelectedChat
              }
            />
          )}

        </aside>


        {/* =================================================
            Chat Area
        ================================================= */}

        <main
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            background:
              "#020617",
            position:
              "relative",
          }}
        >

          {selectedChat ? (
            <div
              style={{
                flex: 1,
                minWidth: 0,
                minHeight: 0,
                display: "flex",
              }}
            >
              <ChatWindow
                selectedChat={
                  selectedChat
                }
                messages={
                  messages
                }
              />
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                padding: "32px",
                boxSizing:
                  "border-box",
              }}
            >

              <div
                style={{
                  width: "100%",
                  maxWidth: "560px",
                  background:
                    "#0f172a",
                  border:
                    "1px solid #1e293b",
                  borderRadius:
                    "24px",
                  padding: "40px 32px",
                  textAlign:
                    "center",
                  boxSizing:
                    "border-box",
                }}
              >

                <div
                  style={{
                    fontSize: "52px",
                    marginBottom:
                      "16px",
                  }}
                >
                  💬
                </div>

                <h2
                  style={{
                    margin:
                      "0 0 10px",
                    fontSize:
                      "24px",
                  }}
                >
                  Your Messages
                </h2>

                <p
                  style={{
                    margin:
                      "0 auto 24px",
                    maxWidth:
                      "440px",
                    color:
                      "#94a3b8",
                    lineHeight:
                      "1.6",
                  }}
                >
                  Select a conversation
                  to start messaging,
                  or start a new
                  conversation with a
                  mentor, friend, creator,
                  organization or another
                  Inclura user.
                </p>

                <button
                  type="button"
                  onClick={
                    openNewConversation
                  }
                  style={{
                    border: "none",
                    borderRadius:
                      "14px",
                    padding:
                      "13px 22px",
                    background:
                      "#38bdf8",
                    color:
                      "#020617",
                    fontWeight:
                      "800",
                    cursor:
                      "pointer",
                  }}
                >
                  ✏️ Start New Conversation
                </button>

              </div>

            </div>
          )}

          {loadingMessages &&
            selectedChat && (
              <div
                style={{
                  position:
                    "absolute",
                  top: "14px",
                  right: "18px",
                  padding:
                    "7px 12px",
                  borderRadius:
                    "999px",
                  background:
                    "#1e293b",
                  color:
                    "#cbd5e1",
                  fontSize:
                    "12px",
                  zIndex: 10,
                }}
              >
                Loading messages...
              </div>
            )}

        </main>

      </div>


      {/* =================================================
          New Conversation Modal
      ================================================= */}

      {showNewConversation && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-conversation-title"
          style={{
            position:
              "fixed",
            inset: 0,
            zIndex: 1000,
            background:
              "rgba(2, 6, 23, 0.82)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: "20px",
            boxSizing:
              "border-box",
          }}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              maxHeight:
                "85vh",
              display: "flex",
              flexDirection:
                "column",
              background:
                "#0f172a",
              border:
                "1px solid #334155",
              borderRadius:
                "24px",
              overflow:
                "hidden",
              boxShadow:
                "0 24px 80px rgba(0,0,0,0.5)",
            }}
          >

            {/* Modal Header */}

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "space-between",
                gap: "12px",
                padding:
                  "20px",
                borderBottom:
                  "1px solid #1e293b",
              }}
            >

              <div>
                <h2
                  id="new-conversation-title"
                  style={{
                    margin: 0,
                    fontSize:
                      "20px",
                  }}
                >
                  New Conversation
                </h2>

                <p
                  style={{
                    margin:
                      "5px 0 0",
                    color:
                      "#94a3b8",
                    fontSize:
                      "13px",
                  }}
                >
                  Find a mentor or
                  another Inclura user.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowNewConversation(
                    false
                  )
                }
                aria-label="Close new conversation"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius:
                    "50%",
                  border:
                    "1px solid #334155",
                  background:
                    "#1e293b",
                  color:
                    "white",
                  cursor:
                    "pointer",
                  fontSize:
                    "18px",
                }}
              >
                ×
              </button>

            </div>


            {/* Search */}

            <div
              style={{
                padding:
                  "16px 20px",
                borderBottom:
                  "1px solid #1e293b",
              }}
            >

              <input
                type="search"
                value={
                  userSearch
                }
                onChange={(event) =>
                  setUserSearch(
                    event.target.value
                  )
                }
                placeholder="Search name, username, email or role..."
                aria-label="Search users"
                autoFocus
                style={{
                  width:
                    "100%",
                  boxSizing:
                    "border-box",
                  padding:
                    "13px 15px",
                  borderRadius:
                    "14px",
                  border:
                    "1px solid #334155",
                  background:
                    "#1e293b",
                  color:
                    "white",
                  outline:
                    "none",
                  fontSize:
                    "14px",
                }}
              />

            </div>


            {/* User Results */}

            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY:
                  "auto",
                padding:
                  "8px",
              }}
            >

              {loadingUsers ? (
                <div
                  style={{
                    padding:
                      "30px 20px",
                    textAlign:
                      "center",
                    color:
                      "#94a3b8",
                  }}
                >
                  Finding Inclura users...
                </div>
              ) : filteredUsers.length ===
                0 ? (
                <div
                  style={{
                    padding:
                      "30px 20px",
                    textAlign:
                      "center",
                    color:
                      "#94a3b8",
                  }}
                >
                  No users found.
                </div>
              ) : (
                filteredUsers.map(
                  (user) => (
                    <button
                      key={
                        user.id
                      }
                      type="button"
                      onClick={() =>
                        startConversation(
                          user
                        )
                      }
                      disabled={
                        creatingChat
                      }
                      style={{
                        width:
                          "100%",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap:
                          "13px",
                        padding:
                          "13px",
                        marginBottom:
                          "4px",
                        border:
                          "none",
                        borderRadius:
                          "14px",
                        background:
                          "transparent",
                        color:
                          "white",
                        textAlign:
                          "left",
                        cursor:
                          creatingChat
                            ? "wait"
                            : "pointer",
                      }}
                    >

                      {user.photoURL ? (
                        <img
                          src={
                            user.photoURL
                          }
                          alt=""
                          style={{
                            width:
                              "46px",
                            height:
                              "46px",
                            borderRadius:
                              "50%",
                            objectFit:
                              "cover",
                            background:
                              "#1e293b",
                          }}
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          style={{
                            width:
                              "46px",
                            height:
                              "46px",
                            borderRadius:
                              "50%",
                            background:
                              "#1e3a5f",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontSize:
                              "20px",
                            flexShrink:
                              0,
                          }}
                        >
                          👤
                        </div>
                      )}

                      <div
                        style={{
                          minWidth:
                            0,
                          flex: 1,
                        }}
                      >

                        <div
                          style={{
                            fontWeight:
                              "750",
                            fontSize:
                              "15px",
                          }}
                        >
                          {
                            getUserDisplayName(
                              user
                            )
                          }
                        </div>

                        {user.username && (
                          <div
                            style={{
                              marginTop:
                                "2px",
                              color:
                                "#94a3b8",
                              fontSize:
                                "12px",
                            }}
                          >
                            @
                            {
                              user.username
                            }
                          </div>
                        )}

                        {user.role && (
                          <div
                            style={{
                              marginTop:
                                "3px",
                              color:
                                "#38bdf8",
                              fontSize:
                                "12px",
                              textTransform:
                                "capitalize",
                            }}
                          >
                            {user.role}
                          </div>
                        )}

                      </div>

                      {user.isVerified && (
                        <span
                          title="Verified"
                          aria-label="Verified"
                        >
                          ✅
                        </span>
                      )}

                    </button>
                  )
                )
              )}

            </div>


            {/* Modal Footer */}

            <div
              style={{
                padding:
                  "14px 20px",
                borderTop:
                  "1px solid #1e293b",
                color:
                  "#64748b",
                fontSize:
                  "12px",
              }}
            >
              🔒 Conversations remain
              within Inclura's messaging
              system.
            </div>

          </div>

        </div>
      )}

    </div>
  );
}


export default Messages;
