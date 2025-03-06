---
title: Extensions To The Archetype Concept
order: 3
---

# Extensions To The Archetype Concept

In Lume, _archetypes_ are scripts that Lume runs which can create base 
content for (blog posts, content pages, photo galleries, whatever). This
lets you automate quite a few things about content creation.

In this theme, we also extend archetypes to the folder-level `_data.yml`
files, to inform our generators and templates of details around how the 
content within the folder should be handled.

## What Problem Does Extending Archetypes Solve?

Versatility. This theme is built on Infima, which is a content style 
framework developed specifically for content-heavy static sites, tested
and vetted by thousands of open source projects. Infima has enough tools
to do practically anything with text responsively and accessibly. 

Many Lume themes let you produce a great looking wiki, or a great looking
blog, or landing pages for events, or even an e-book. But, there's really
no coherent, centrally-searchable theme that lets you do _all_ of those 
things under a single design and site.

I wanted to be able to run a blog, a dedicated release notes feed, a 
docs generator that took unsorted markdown and made something nice out
of it automatically, and an easy way to make content and landing pages.

This was originally named "Cushy Docs"; I changed it because I don't want
to put disproportionate weight on any of the archetypes: this is a good
theme _for lots of text_, however you want to organize it.

# What are the supported archetypes?

The three supported archetypes are:

 - `blogs` : A blog with a working tag system, feeds, archive, tag and 
    author pages. Supports multiple instances with independent tags.

 - `docs` : Like a blog, but sidebar is auto generated, no archive pages, 
   tag pages, or author pages. Tags can be applied to help guide search, 
   but are only used for taxonomy. Supports multiple instances with 
   independent tags.

 - `pages` : Full-page, sidebar-less MDX pages that aren't auto-linked, but
    can be tagged and are searchable. Meant for creating long-form content, 
    galleries, presentations, landing pages, company branding or whatever.
    Essentially the default when no archetype is specified in data.

Let's take a look at the `_data.yml` file in `/docs` on this site:

```yml
# This makes it a documentation page with a sidebar 
layout: layouts/docupage.vto
# This lets searches include or exclude content from this folder
tags:
  - "%docs%" 

# This controls the behavior of this docs folder
docs:
  basedir: /docs/
  archetypeTag: "%docs%"
  title: Documentation Home
  sidebar: auto
```

Not only does this set the default layout, and apply a special _archetype_ tag
called `%docs%` to each child page in the folder, it also contains some configuration
options about how the feature should work (in this case, auto-generate the sidebar,
specify a title for the top category).

What's also interesting is that it self-references its location, so it can build
its nav independently without having to talk to the OS to find out where it is. 

Special `%archetype%` tags aren't generated, they're just used behind the scenes to 
include or exclude various parts of the site from different kinds of searches, including
user searches from the search bar.

You could have 10 different installs of documentation, as long as the `basedir` values
and `archetypeTag` are unique (for some reason, I can't get `"=other_value"` to work in 
YAML on Lume 3; it'll be cleaner once I do.

See also the one from the blog:

```yml
layout: layouts/post.vto
tags:
  - "%blog%"

blog:
  basedir: /blog/
  archetypeTag: "%blog%"
  title: Cushy Text Blog
  recent: 5
```

This looks slightly different, because it needs to know how many posts should go on the 
blog index page, but the pattern is the same as far as fundamental mechanics. 

## Creating Content In Archetypes

Just use `lume new <archetype> <path>/<slug>` and a file with all needed frontmatter 
appropriate for the archetype will be generated for you.

Soon, scripts (lume scripts) will go in to make this smarter.







