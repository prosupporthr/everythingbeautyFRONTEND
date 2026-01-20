import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useFetchData } from "@/hooks/useFetchData";
import { uniqBy } from "lodash";
import { Socket } from "@/helper/utils/socket-io";
import { IChatMessage } from "@/helper/model/chat";

export function useChatScroller(chatId: string, limit = 20) {
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const topObserver = useRef<IntersectionObserver | null>(null);

  /* ------------------ Pagination Query Key ------------------ */
  const queryKey = useMemo(
    () => ["chat-messages", chatId, page],
    [chatId, page]
  );

  const { data, isLoading, isFetching, refetch, isRefetching } = useFetchData<any>({
    endpoint: `/messaging/chats/${chatId}/messages`,
    queryKey,
    params: { limit, page },
    pagination: true,
    enable: Boolean(chatId),
  });

  /* ------------------ Intersection Observer ------------------ */
  const ref = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;

      if (topObserver.current) topObserver.current.disconnect();

      topObserver.current = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetching) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) topObserver.current.observe(node);
    },
    [isLoading, hasNextPage, isFetching]
  );

  /* ------------------ Pagination Merge ------------------ */
  useEffect(() => {
    if (!data?.data) return; 

    if(page === 1) {
      setMessages([])
    }

    setMessages((prev) => {
      const merged =
        page === 1
          ? (data.data as IChatMessage[])
          : [...prev, ...(data.data as IChatMessage[])];

      return uniqBy(merged, "_id");
    });

    const total = Number(data?.total ?? 0);
    const loaded = page * limit;
    setHasNextPage(loaded < total);
  }, [data, isRefetching]);

  console.log(messages);
  

  // ░░░ REALTIME SOCKET MESSAGES ░░░
  useEffect(() => {
    Socket.connect();

    if (!chatId) return;

    const messageEvent = `chat:${chatId}`;

    console.log(messageEvent);


    const handleNewMessage = (msg: IChatMessage) => {
      setMessages((prev) =>
        uniqBy([...prev, msg], "_id")
      );

      console.log(msg);

      requestAnimationFrame(() => {
        const el = scrollRef ? scrollRef.current : null;
        if (el) {
          el.scrollTo({
            top: el.scrollHeight,
            behavior: "smooth",
          });
        }
      });
    };

    Socket.on(messageEvent, handleNewMessage);

    return () => {
      Socket.off(messageEvent, handleNewMessage);
    };
  }, [chatId]);

  return {
    messages,
    isLoading: isLoading && messages.length === 0,
    isRefetching: isFetching && messages.length > 0,
    scrollRef,
    ref, // sentinel for infinite scroll
    refetch,
    setPage
  };
}
