/**
 * Borrowed from simple blog, modified a bit.
 * https://lume.land/theme/simple-blog/
 */
export const layout = "layouts/post-archive.vto";

export default function* ({ search, locale }) {
  // Generate a page for each tag
  for (const tag of search.values("tags", "waypoint=%blog%")) {
    yield {
      url: `/archive/${tag}/`,
      title: `${locale.archive.things_tagged}  “${tag}”`,
      query: tag,
      type: "tag",
      search_query: `waypoint=%blog% '${tag}'`,
      tag,
    };
  }

  // Generate a page for each author
  for (const author of search.values("author", "waypoint=%blog%")) {
    yield {
      url: `/author/${author}/`,
      title: `${locale.archive.posts_by} ${author}`,
      type: "author",
      search_query: `waypoint=%blog% author='${author}'`,
      author,
    };
  }
}
