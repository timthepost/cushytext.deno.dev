export const layout = "layouts/post-archive.vto";

export default function* ({ search, paginate, locale }) {
  const posts = search.pages("%blog%", "date=desc");

  for (
    const data of paginate(posts, { url, size: 10 })
  ) {
    // Show the first page in the menu
    if (data.pagination.page === 1) {
      data.menu = {
        visible: true,
        order: 1,
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
