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
