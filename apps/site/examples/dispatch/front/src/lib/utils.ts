import { createCn } from "cn/config"

// The theme type classes are font sizes, not colors.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "h1", "h2", "body", "label"] }],
    },
  },
})
