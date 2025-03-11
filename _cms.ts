import lumeCMS from "lume/cms/mod.ts";

const cms = lumeCMS({
  site: {
    name: "Cushy Text",
    description: "This is the back-end to Cushy Text",
    body: `
      <h2>Post Feedback Management:</h2>
      <p>
        We need a way to view feedback and other DenoKV data.
      </p>
    `,
  },
});

/**
 * Very sparse initial support - fields need setup before this
 * is useful.
 */
cms.collection("blogs", "src:blog/*.mdx", [
  "title: text",
  "content: markdown",
]);

cms.collection("docs", "src:docs/*.mdx", [
  "title: text",
  "content: markdown",
]);

cms.collection("pages", "src:features/*.mdx", [
  "title: text",
  "content: markdown",
]);

export default cms;
