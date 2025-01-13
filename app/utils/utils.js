import { customAlphabet } from 'nanoid';
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[date.getMonth()]; 
  const day = date.getDate(); 
  let hours = date.getHours(); 
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const isPM = hours >= 12; 
  hours = hours % 12 || 12; 
  const ampm = isPM ? "pm" : "am";

  return `${month} ${day} at ${hours}:${minutes} ${ampm}`;
};

export const getRandomId = () => {
  const generateId = customAlphabet("1234567890", 10);
  const uniqueId = generateId();
  return parseInt(uniqueId);
};
