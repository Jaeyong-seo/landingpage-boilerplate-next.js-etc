// Sanity schema (copy into your Sanity project)
// Document: landing
//
// Fields used by this repo:
// - heroTitle
// - heroSubtitle
const landing = {
  name: "landing",
  title: "Landing",
  type: "document",
  fields: [
    {
      name: "heroTitle",
      title: "Hero title",
      type: "string",
    },
    {
      name: "heroSubtitle",
      title: "Hero subtitle",
      type: "text",
      rows: 3,
    },
  ],
};

export default landing;

