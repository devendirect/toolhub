import dynamic from "next/dynamic";
import type React from "react";

type WC = React.ComponentType;

const Skeleton = () => (
  <div className="border border-line min-h-[420px] bg-bg-1 animate-pulse" />
);

function lazy(load: () => Promise<{ [k: string]: unknown }>, name: string): WC {
  return dynamic(() => load().then((m) => ({ default: m[name] as WC })), {
    ssr: false,
    loading: Skeleton,
  });
}

const lazyDiffViewer = lazy(
  () => import("@/components/workspaces/DiffViewer"),
  "DiffViewer"
);

export const WORKSPACE_REGISTRY: Partial<Record<string, WC>> = {
  "json-formatter":    lazy(() => import("@/components/workspaces/JsonFormatter"),    "JsonFormatter"),
  "qr-generator":      lazy(() => import("@/components/workspaces/QrGenerator"),      "QrGenerator"),
  "base64":            lazy(() => import("@/components/workspaces/Base64Tool"),        "Base64Tool"),
  "image-converter":   lazy(() => import("@/components/workspaces/ImageConverter"),   "ImageConverter"),
  "palette-generator": lazy(() => import("@/components/workspaces/PaletteGenerator"), "PaletteGenerator"),
  "pdf-merge":         lazy(() => import("@/components/workspaces/PdfMerge"),         "PdfMerge"),
  "uuid-generator":    lazy(() => import("@/components/workspaces/UuidGenerator"),    "UuidGenerator"),
  "remove-linebreaks": lazy(() => import("@/components/workspaces/RemoveLineBreaks"), "RemoveLineBreaks"),
  "text-reverser":     lazy(() => import("@/components/workspaces/TextReverser"),     "TextReverser"),
  "url-encoder":       lazy(() => import("@/components/workspaces/UrlEncoder"),       "UrlEncoder"),
  "html-entities":     lazy(() => import("@/components/workspaces/HtmlEntities"),     "HtmlEntities"),
  "word-counter":      lazy(() => import("@/components/workspaces/WordCounter"),       "WordCounter"),
  "case-converter":    lazy(() => import("@/components/workspaces/CaseConverter"),    "CaseConverter"),
  "password-generator":lazy(() => import("@/components/workspaces/PasswordGenerator"),"PasswordGenerator"),
  "gradient-generator":lazy(() => import("@/components/workspaces/GradientGenerator"),"GradientGenerator"),
  "hash-generator":    lazy(() => import("@/components/workspaces/HashGenerator"),    "HashGenerator"),
  "markdown-html":     lazy(() => import("@/components/workspaces/MarkdownHtml"),     "MarkdownHtml"),
  "regex-tester":      lazy(() => import("@/components/workspaces/RegexTester"),      "RegexTester"),
  "cron-generator":    lazy(() => import("@/components/workspaces/CronGenerator"),    "CronGenerator"),
  "ip-lookup":         lazy(() => import("@/components/workspaces/IpLookup"),         "IpLookup"),
  "meta-preview":      lazy(() => import("@/components/workspaces/MetaPreview"),      "MetaPreview"),
  "seo-analyzer":      lazy(() => import("@/components/workspaces/SeoAnalyzer"),      "SeoAnalyzer"),
  "audio-converter":   lazy(() => import("@/components/workspaces/AudioConverter"),   "AudioConverter"),
  "video-converter":   lazy(() => import("@/components/workspaces/VideoConverter"),   "VideoConverter"),
  "pdf-converter":     lazy(() => import("@/components/workspaces/PdfConverter"),     "PdfConverter"),
  "deduplicate-lines": lazy(() => import("@/components/workspaces/DeduplicateLines"), "DeduplicateLines"),
  "slug-generator":    lazy(() => import("@/components/workspaces/SlugGenerator"),    "SlugGenerator"),
  "string-escape":     lazy(() => import("@/components/workspaces/StringEscape"),     "StringEscape"),
  "lorem-ipsum":       lazy(() => import("@/components/workspaces/LoremIpsum"),       "LoremIpsum"),
  "jwt-decoder":       lazy(() => import("@/components/workspaces/JwtDecoder"),       "JwtDecoder"),
  "timestamp":         lazy(() => import("@/components/workspaces/TimestampConverter"),"TimestampConverter"),
  "base-converter":    lazy(() => import("@/components/workspaces/BaseConverter"),    "BaseConverter"),
  "color-picker":      lazy(() => import("@/components/workspaces/ColorPicker"),      "ColorPicker"),
  "box-shadow":        lazy(() => import("@/components/workspaces/BoxShadow"),        "BoxShadow"),
  "border-radius":     lazy(() => import("@/components/workspaces/BorderRadius"),     "BorderRadius"),
  "contrast-checker":  lazy(() => import("@/components/workspaces/ContrastChecker"),  "ContrastChecker"),
  "robots-txt":        lazy(() => import("@/components/workspaces/RobotsTxt"),        "RobotsTxt"),
  "sitemap-generator": lazy(() => import("@/components/workspaces/SitemapGenerator"), "SitemapGenerator"),
  "og-checker":        lazy(() => import("@/components/workspaces/OgChecker"),        "OgChecker"),
  "schema-generator":  lazy(() => import("@/components/workspaces/SchemaGenerator"),  "SchemaGenerator"),
  "diff-viewer":       lazyDiffViewer,
  "text-diff":         lazyDiffViewer,
  "csv-json":          lazy(() => import("@/components/workspaces/CsvJson"),          "CsvJson"),
  "env-formatter":     lazy(() => import("@/components/workspaces/EnvFormatter"),     "EnvFormatter"),
  "css-minifier":      lazy(() => import("@/components/workspaces/CssMinifier"),      "CssMinifier"),
  "favicon-generator": lazy(() => import("@/components/workspaces/FaviconGenerator"), "FaviconGenerator"),
  "image-compressor":  lazy(() => import("@/components/workspaces/ImageCompressor"),  "ImageCompressor"),
  "css-grid":          lazy(() => import("@/components/workspaces/CssGrid"),          "CssGrid"),
  "zip-extractor":     lazy(() => import("@/components/workspaces/ZipExtractor"),     "ZipExtractor"),
  "svg-optimizer":     lazy(() => import("@/components/workspaces/SvgOptimizer"),     "SvgOptimizer"),
  "utm-builder":       lazy(() => import("@/components/workspaces/UtmBuilder"),       "UtmBuilder"),
  "jwt-generator":     lazy(() => import("@/components/workspaces/JwtGenerator"),     "JwtGenerator"),
  "md-table":          lazy(() => import("@/components/workspaces/MarkdownTable"),    "MarkdownTable"),
  "toml-json":         lazy(() => import("@/components/workspaces/TomlJson"),         "TomlJson"),
  "headers-checker":   lazy(() => import("@/components/workspaces/HeadersChecker"),  "HeadersChecker"),
  "readability":       lazy(() => import("@/components/workspaces/ReadabilityScore"), "ReadabilityScore"),
};
