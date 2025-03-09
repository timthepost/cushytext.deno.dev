export default function (title: string) {
  const slug = title.replace(/\s+/g, "-").toLowerCase();
  const pageContent = `

Opening Text

<img src="/uploads/${slug}.jpg" alt="TODO: Description" title="TODO: Title" />

{/* more */} 
  
Supportive text.
  
## First Heading

Additional supportive text.

`;
  /* TODO: Sanity Check The Path */
  return {
    path: `${slug}.mdx`,
    content: {
      title: title,
      date: new Date().toISOString().slice(0, 10),
      author: "Mike Wazowski",
      draft: true,
      menu: {
        visible: true,
        order: 0,
      },
      tags: ["tag-1", "tag-2"],
      metas: {
        lang: "en",
        description: "Short meta description (up to 170 chars)",
        tags: ["meta tag one", "meta tag two"],
        image: "/uploads/" + slug + ".jpg",
        robots: true,
        generator: true,
      },
      content: pageContent,
    },
  };
}
