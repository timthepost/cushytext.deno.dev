import lumeCMS from "lume/cms/mod.ts";

const cms = lumeCMS();

/**
 * This is only sparse support, I have to 
 * configure the fields and stuff. Also 
 * have to figure out how to write CMS 
 * plugins to view the submitted feedback.
 */
cms.collection("blogs", "src:blog/*.mdx", [
    "title: text",
    "content: markdown",
]);

cms.collection("docs", "src:docs/*.mdx", [
    "title: text",
    "content: markdown",
]);

cms.collection("pages", "src:features/*.mdx", [
    "title: text",
    "content: markdown",
]);

export default cms;
