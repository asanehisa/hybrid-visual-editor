import "@yext/visual-editor/style.css";
import {
  Template,
  GetPath,
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
  HeadConfig,
  TagType,
  TemplateConfig,
} from "@yext/pages";
import { Render } from "@measured/puck";
import { repoConfig } from "../ve.config";
import {
  applyTheme,
  VisualEditorProvider,
  normalizeSlug,
  getPageMetadata,
  applyAnalytics,
  applyHeaderScript,
  metadata,
} from "@yext/visual-editor";
import { themeConfig } from "../../theme.config";
import { AnalyticsProvider, SchemaWrapper } from "@yext/pages-components";

export const config: TemplateConfig = {
  stream: {
    $id: "repo-location-stream",
    // Defines the scope of entities that qualify for this stream.
    // You can use entityTypes, savedFilterIds, and/or entityIds
    filter: {
      entityTypes: ["location"],
    },
    // Specifies the exact data that each generated document will contain.
    // This data is passed in directly as props to the default exported function.
    fields: [
      "id",
      "uid",
      "meta",
      "name",
      "address",
      "mainPhone",
      "description",
      "hours",
      "slug",
      "geocodedCoordinate",
      "services",
      // "c_exampleProducts.image",
      // "c_exampleProducts.name",
      // "c_exampleProducts.products.description.html",
      // "c_exampleEvents.events.description.html",
      // "c_exampleFAQs.faqs.answer.html",
      // "c_exampleInsights.insights.description.html",
      // "c_examplePromo.description.html",
      // "c_exampleTestimonials.testimonials.description.html",
      // "c_exampleProducts.category",
      // "c_exampleProducts.cta.label",
      // "c_exampleProducts.cta.link",
      // "c_exampleProducts.cta.linkType",
      // "c_exampleInsights",
      // "c_exampleOption",
      // "photoGallery",
      // These fields will be used in Module 5 of the Hitchhikers Pages Track: https://hitchhikers.yext.com/tracks/pages-development/pgs605-create-directory/01-yext-directory-manager/
      // "dm_directoryParents_us_directory.name",
      // "dm_directoryParents_us_directory.slug",
      // "dm_directoryParents_us_directory.meta",
      // "dm_directoryParents_us_directory.c_addressRegionDisplayName",
    ],
    // The entity language profiles that documents will be generated for.
    localization: {
      locales: ["en"],
    },
    // transform: {
    //   replaceOptionValuesWithDisplayNames: ["c_exampleOption"],
    // },
  },
  additionalProperties: {
    isVETemplate: true,
  },
};

export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  document,
}): HeadConfig => {
  const { title, description } = getPageMetadata(document);
  const faviconUrl = document?._site?.favicon?.url;

  return {
    title: title,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
    tags: [
      {
        type: "link",
        attributes: {
          rel: "icon",
          type: "image/x-icon",
        },
      },
      ...(description
        ? [
            {
              type: "meta" as TagType,
              attributes: {
                name: "description",
                content: description,
              },
            },
          ]
        : []),
      ...(faviconUrl
        ? [
            {
              type: "link" as TagType,
              attributes: {
                rel: "icon",
                type: "image/x-icon",
                href: faviconUrl,
              },
            },
          ]
        : []),
    ],
    other: [
      applyAnalytics(document),
      applyHeaderScript(document),
      applyTheme(document, themeConfig),
      SchemaWrapper(document._schema),
    ].join("\n"),
  };
};

export const getPath: GetPath<TemplateProps> = ({ document }) => {
  if (document.slug) {
    return "repo/" + document.slug;
  }

  const localePath = document.locale !== "en" ? `${document.locale}/` : "";
  const path = document.address
    ? `${localePath}${document.address.region}/${document.address.city}/${document.address.line1}`
    : `${localePath}${document.id}`;

  return normalizeSlug("repo/" + path);
};

const customMetadata: metadata = {
  contentEndpointIdEnvVar: "YEXT_CONTENT_ENDPOINT_ID",
}

const Repo: Template<TemplateRenderProps> = (props) => {
  const { document } = props;

  return (
    <AnalyticsProvider
      apiKey={document?._env?.YEXT_PUBLIC_EVENTS_API_KEY}
      templateData={props}
      currency="USD"
    >
      <VisualEditorProvider templateProps={props}>
        <Render config={repoConfig} data={JSON.parse(document.__.layout)} metadata={customMetadata}/>
      </VisualEditorProvider>
    </AnalyticsProvider>
  );
};

export default Repo;
