export default function (title: string) {
  const slug = title.replace(/\s+/g, "-").toLowerCase();
  const pageContent = `

# \${title}
  
Supportive text.
  
## First Heading

Additional supportive text.

`;
  /* TODO: Sanity Check The Path */
  return {
    path: `docs/${slug}.mdx`,
    content: {
      title: title,
      date: new Date().toISOString().slice(0, 10),
      author: "Mike Wazowski",
      draft: true,
      menu: {
        visible: true,
        order: 0,
      },
      metas: {
        lang: "en",
        description: "Short meta description (up to 170 chars)",
        tags: ["meta tag one", "meta tag two"],
        // TODO: These need to take custom arguments so /docs isn't hard-coded
        image: "/docs/" + slug + "/index.png",
        robots: true,
        generator: true,
      },
      content: pageContent,
    },
  };
}
