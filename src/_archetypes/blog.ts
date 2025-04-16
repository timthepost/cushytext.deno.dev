export default function(title: string) {
  const slug = title.replace(/\s+/g, "-").toLowerCase();
  const pageContent = `

Opening Text

<img
  class="blog_image"
  src="/blog/${slug}/index.png" 
  alt="TODO: Description" 
  title="TODO: Title" />

Supportive Text

{/* more */} 
<div id="more></div>

Segue Text
  
## First Heading

Supportive Text

## Second Heading

Supportive Text

## Closing Heading

Closing Text

`;
  return {
    path: `blog/${slug}.mdx`,
    content: {
      title: title,
      description: "TODO: Description (Used In OG Image Generation, Teaser Text On The Site)",
      date: new Date().toISOString().slice(0, 10),
      author: "Tim Post",
      draft: true,
      menu: {
        visible: true,
        order: 0,
      },
      tags: ["tag-1", "tag-2"],
      metas: {
        lang: "en",
        description: "TODO: Description (Used Strictly As Meta Description)",
        tags: ["meta tag one", "meta tag two"],
        // TODO - add argument for path here (for multi-instance compatibility)
        image: "/blog/" + slug + "/index.png",
        robots: true,
        generator: true,
      },
      content: pageContent,
    },
  };
}
