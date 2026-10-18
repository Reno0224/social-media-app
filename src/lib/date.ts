import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const timeAgo = (date: string) => dayjs(date).fromNow();
export const formatDate = (date: string) => dayjs(date).format("D MMMM YYYY");
