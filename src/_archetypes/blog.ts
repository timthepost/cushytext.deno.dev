export default function (title: string) {
  const slug = title.replace(/\s+/g, "-").toLowerCase();
  const pageContent = `

Opening Text

<img
  class="blog_image"
  src="/blog/${slug}/index.png" 
  alt="TODO: Description" 
  title="TODO: Title" />

Supportive text.

{/* more */} 
  
Segue Text
  
## First Heading

Heading support text.

`;
  return {
    path: `blog/${slug}.mdx`,
    content: {
      title: title,
      description: "TODO: Description",
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
        description: '"=description"',
        tags: ["meta tag one", "meta tag two"],
        // TODO - add argument for path here
        image: "/blog/" + slug + "/index.png",
        robots: true,
        generator: true,
      },
      content: pageContent,
    },
  };
}
