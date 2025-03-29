export default function (title: string) {
  const slug = title.replace(/\s+/g, "-").toLowerCase();
  const pageContent = `

{/* At this point you're in the main container */}
<h1>${title}</h1>
<p>Content goes here.</p>

{/* TODO: Show MDX Component Use Here */}

`;
  /* TODO: Sanity Check The Path */
  return {
    path: `${slug}.mdx`,
    content: {
      title: title,
      date: new Date().toISOString().slice(0, 10),
      draft: true,
      metas: {
        lang: "en",
        description: "Short meta description (up to 170 chars)",
        tags: ["meta tag one", "meta tag two"],
        // TODO (see also docs) need to have arguments here
        image: "/" + slug + "/index.png",
        robots: true,
        generator: true,
      },
      content: pageContent,
    },
  };
}
