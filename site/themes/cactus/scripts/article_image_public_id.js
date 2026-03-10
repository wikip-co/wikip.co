const path = require("path");

function trimValue(value) {
  return String(value || "").trim();
}

function fromPagePath(pagePath) {
  const normalized = trimValue(pagePath)
    .replace(/\/?index\.html?$/i, "")
    .replace(/^\/+|\/+$/g, "");
  if (!normalized) {
    return "";
  }
  const parts = normalized.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

function fromSource(source) {
  const normalized = trimValue(source);
  if (!normalized) {
    return "";
  }
  return path.basename(normalized, path.extname(normalized));
}

function slugify(value) {
  return trimValue(value)
    .toLowerCase()
    .replace(/[^a-z0-9/_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "");
}

hexo.extend.helper.register("article_image_public_id", function (page) {
  if (page.image) {
    return trimValue(page.image);
  }

  const pathDerived = fromPagePath(page.path);
  if (pathDerived) {
    return pathDerived;
  }

  const sourceDerived = fromSource(page.source);
  if (sourceDerived) {
    return sourceDerived;
  }

  const slugDerived = slugify(page.slug);
  if (slugDerived) {
    return slugDerived;
  }

  return slugify(page.title);
});
