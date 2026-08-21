import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The design system defines named font sizes (text-h1, text-body, …) in
 * @theme. tailwind-merge can't tell those from color utilities, so without
 * this it treats `text-body` as a color and silently strips `text-white`
 * alongside it. Register them as font sizes so both survive a merge.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "body",
            "small",
            "micro",
            "data",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
