---
title: Archetypes & Theme Archetype Extensions
order: 3
---

# Archetypes & Theme Archetype Extensions

Many Lume themes let you produce a great looking wiki, or a great looking
blog, or landing pages for events, or even an e-book. There's really no 
limit to creativity when it comes to the kinds of sites that Lume can 
produce.

However, I found that there weren't many options that let you do a wiki, 
a blog _and_ some landing and branding pages. So, I created this theme 
that doesn't try to be the perfect wiki, or the perfect blog, but rather
focuses on making it easy to do multiple things at once.

To do that, the theme embraces the concept of archetypes, and extends
them through the data model.

# What are the supported archetypes?

The three supported archetypes are:

 - `blog` : A basic blog. Generates a blog index page, archive page, 
   tag pages and author pages. You can have multiple blogs with 
   isolated tags and archive pages, but all searchable together.
   Maybe you want a product blog, and a release notes feed? It's 
   easy.

 - `docs` : Like a blog, but sidebar is auto generated, no archive pages, 
   tag pages, or author pages. Tags can be applied to help guide search, 
   but are only used for taxonomy. Can have many independently working
   in the same site, all centrally searchable / filterable. 
 
 - `pages` : Full-page, sidebar-less MDX pages that aren't auto-linked, but 
    searchable and can be tagged. No archives, no author pages, and is set 
    up with demo landing page content with available helpers and components.

What defines them is the `_data.yml` file in the folder. For instance, let's 
take a look at `_data.yml` in `/docs` on this site:

```yml
layout: layouts/docupage.vto
tags:
  - "%docs%"
docs:
  basedir: /docs/
  archetypeTag: "%docs%"
  title: Documentation Home
  sidebar: auto
```

Not only does this set the default layout, and apply a special _archetype_ tag
called `%docs%` to each child page in the folder, it also contains some configuration
options about how the feature should work (in this case, auto-generate the sidebars).

What's also interesting is that it self-references its location, so it can build
its nav independently. 

Special `%archetype%` tags aren't shown, they're just used behind the scenes to 
include or exclude various parts of the site from different kinds of searches, including
(coming soon) the main site search. Get results from documentation and the blog, but
not landing pages, for instance. 

We could make a copy of `docs/` called `docs-2/` and change the archetype tag to the 
same, and filter it in / out of page searches. So go ahead, publish your recipes too.

## Creating Content In Archetypes

Just use `lume new <archetype> <path>/<slug>`. 

A file with all needed frontmatter will be generated for you.







