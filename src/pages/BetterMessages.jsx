import Messages from "./Messages";

/*
 * BetterMessages is retained as a compatibility entry point.
 * The production Messages page already contains the connected
 * messaging system, so this page must not create a second,
 * disconnected messaging implementation.
 */
export default function BetterMessages() {
  return <Messages />;
}
