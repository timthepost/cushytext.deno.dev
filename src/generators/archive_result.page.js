/**
 * Borrowed from simple blog, modified a bit.
 * https://lume.land/theme/simple-blog/
 */
export const layout = "layouts/post-archive_stub.vto";

export default function* ({ search, _locale }) {
  // Generate a page for each tag
  for (const tag of search.values("tags", "waypoint=%blog%")) {
    if (tag[0] !== "%") {
      yield {
        url: `/archive/${tag}/`,
        title: `Things Tagged:  “${tag}”`,
        type: "tag",
        search_query: `waypoint=%blog% '${tag}'`,
        tag,
      };
    }
  }

  // Generate a page for each author
  for (const author of search.values("author", "waypoint=%blog%")) {
    yield {
      url: `/author/${author.replace(/\ /g, "-")}/`,
      title: `Posts By ${author}`,
      type: "author",
      search_query: `waypoint=%blog% author='${author}'`,
      author,
    };
  }
}
