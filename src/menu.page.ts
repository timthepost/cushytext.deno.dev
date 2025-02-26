/**
 * Write a navigation-tree-walk so server Middleware
 * can easily access the output of /nav.
 *
 * This gets processedd like any other content page,
 * and is NOT guaranteed to run in-time for templates
 * to use it.
 *
 * This is intended to be consumed *after* the server has
 * started.
 *
 * See the /nav code in _server_routes.ts
 *
 * @nav Lume Nav() (from the plugin)
 * @writes _site/menu.json
 */

export default function* ({ nav }: Lume.Data) {
  const menu = nav.menu(
    "/",
    `hide_menu!=true`,
    "order=asc title=asc-locale basename=asc-locale",
  )?.children ||
    [];
  yield {
    url: `/menu.json`,
    content: JSON.stringify(menu, null, 2),
  };
  return;
}
