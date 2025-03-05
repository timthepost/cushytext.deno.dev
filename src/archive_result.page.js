export const layout = "layouts/post-archive_stub.vto";

export default function* ({ search, _locale }) {
  // Generate a page for each tag
  for (const tag of search.values("tags")) {
    if (tag[0] !== "%") {
        yield {
        url: `/archive/${tag}/`,
        title: `Things Tagged:  “${tag}”`,
        type: "tag",
        search_query: `'%blog%' '${tag}'`,
        tag,
        };
    }
  }

  // Generate a page for each author
  for (const author of search.values("author")) {
    yield {
      url: `/author/${author.replace(/\ /g, "-")}/`,
      title: `Posts By ${author}`,
      type: "author",
      search_query: `'%blog%' author='${author}'`,
      author,
    };
  }
}
