export const layout = "layouts/post-archive.vto";

/**
 * Borrowed from simple blog, modified a bit.
 * https://lume.land/theme/simple-blog/
 */
export default function*({ search, paginate, locale }) {
  const posts = search.pages("waypoint=%blog%", "date=desc");

  for (
    const data of paginate(posts, { url, size: 10 })
  ) {
    // Allow the archive page to be picked up by auto-nav
    if (data.pagination.page === 1) {
      data.menu = {
        visible: true,
        order: 0,
      };
    }
    yield {
      ...data,
      title: locale.archive.heading,
    };
  }
}

function url(n) {
  if (n === 1) {
    return "/archive/";
  }
  return `/archive/${n}/`;
}
