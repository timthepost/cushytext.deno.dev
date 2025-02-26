# A Port of Infima Over to Lume + Vento

This is a theme for Lume built on Infima CSS, the same styles that Docusaurus
uses. This is not an attempt to be Docusaurus, but rather make Infima available
to anyone that works with content-heavy sites with Lume.

Infima was devekioped by Meta in the process of coming up with a framework that
suits the needs of developers, documentarians and even product managers. It's
not as modern as things like Tailwind, but it's extremely easy to use and
extremely flexible when it comes to laying out lots and lots of text.

## Status:

Infima has been applied to Lume (from scratch) and has been (mostly) put
together in templates. Theme switching has been optimized to use a single
theme instead of dark / light loading independently, and the default scripts
have been set up. All components work properly, they just need to be turned
into Lume components.

There is a **[Live Demo](https://cushydocs.deno.dev)** of progress deployed 
from `main` on Deno Deploy. 

Most major dev is happening around the general availability of Lume3, and I 
expect to be ready for testing not long after it ships. Right now, Lume is 
going through a lot of changes in the dev branch as v3 nears release so I'm
waiting on the dust to settle more before diving into components and features
that need middleware (except for search). Right now, it's hard to tell what's
a bug in Lume, and what's a bug of mine.

Nav, plugin setup, accessibility tweaks, internationalization
and search are really the main focus until v3 ships and has a little time to 
soak.

## Contributing

Clone the repo and type `deno task dev` to poke around. A roadmap and list of 
goals is on the [front page](src/index.mdx) (source link). If you want to 
collaborate, I'm `timthepost@protonmail.com`. I'm not big on using Discord,
and prefer async conversations.
