# Release Plan

1. Create a new repository, `cushytext-theme` on GitHub. This is going to be the
   'proper' name / namespace of the theme. Create a nice README file and set up
   the repo properly for community use.

2. Copy the absolute _bare_ minimum needed to render the site from the current
   install over to the theme repo. This should be the manifest:

   - One example index page
   - A snapshot of `/docs` so they start with the theme documentation locally
   - A welcome example blog post with exactly two tags written by a cartoon
     character
   - All `src/_includes/` `src/_plugins/` `src/_archetypes/` and
     `src/_components/`
   - `plugins.ts` verbatim
   - A "re-set" version of `_data/demo.yml`:
     - Only need enough for the front page.
     - Should be just generic placeholder text
   - A "re-set" version of `_data/tagWiki.yml`:
     - Include one tag from the demo blog post (so they can see a tag wiki is
       needed for the tag feed)
   - A "re-set" version of `_config.ts`
   - A "re-set" version of `mod.ts`
   - A "re-set" version of `.gitignore`
   - A "re-set" version of `.env-local`
   - A "re-set" version of `_cms.ts` (I will pursue CMS hooks soon)

3. Remove google site verification meta tag from template. Check for any others
   in `head.vto`.

4. Make sure it works! Test thoroughly.

5. Tag a release. It's now a template people can Deploy straight to Deno Deploy,
   or a remote theme, or they can grab the repo.

6. The current cushytext repo changes to pull in packages I publish from the
   theme one, for the most part. It just becomes the dev site, and where the
   project site and blog live.

7. The cushytext github repo is renamed to cushytext.deno.dev, and the docs
   index page is updated to installation instructions. The front page hero is
   updated to point to the docs index. The docs index links to the new template
   repo where appropriate. Github links on the site are changed to point to the
   template as needed.

8. Collapse in exhaustion and have a beer!
