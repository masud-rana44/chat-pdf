import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertTAscii(inputString: string) {
  return inputString.replace(/[^\x00-\x7F]+/g, "");
}
