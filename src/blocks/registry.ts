import Cards from "./Cards/Cards";
import { meta as cardsMeta } from "./Cards/meta";
import { cardsSchema } from "./Cards/schema";
import Catalogue from "./Catalogue/Catalogue";
import { meta as catalogueMeta } from "./Catalogue/meta";
import { catalogueSchema } from "./Catalogue/schema";
import Contact from "./Contact/Contact";
import { meta as contactMeta } from "./Contact/meta";
import { contactSchema } from "./Contact/schema";
import Cta from "./Cta/Cta";
import { meta as ctaMeta } from "./Cta/meta";
import { ctaSchema } from "./Cta/schema";
import Gallery from "./Gallery/Gallery";
import { meta as galleryMeta } from "./Gallery/meta";
import { gallerySchema } from "./Gallery/schema";
import GlitchIntro from "./GlitchIntro/GlitchIntro";
import { meta as glitchIntroMeta } from "./GlitchIntro/meta";
import { glitchIntroSchema } from "./GlitchIntro/schema";
import Logos from "./Logos/Logos";
import { meta as logosMeta } from "./Logos/meta";
import { logosSchema } from "./Logos/schema";
import Notice from "./Notice/Notice";
import { meta as noticeMeta } from "./Notice/meta";
import { noticeSchema } from "./Notice/schema";
import PageHeading from "./PageHeading/PageHeading";
import { meta as pageHeadingMeta } from "./PageHeading/meta";
import { pageHeadingSchema } from "./PageHeading/schema";
import ShatterMenu from "./ShatterMenu/ShatterMenu";
import { meta as shatterMenuMeta } from "./ShatterMenu/meta";
import { shatterMenuSchema } from "./ShatterMenu/schema";
import Text from "./Text/Text";
import { meta as textMeta } from "./Text/meta";
import { textSchema } from "./Text/schema";

/** Vsi bloki, ki jih stran (in urejevalnik) pozna. */
export const blocks = {
  glitchIntro: { Component: GlitchIntro, schema: glitchIntroSchema, meta: glitchIntroMeta },
  shatterMenu: { Component: ShatterMenu, schema: shatterMenuSchema, meta: shatterMenuMeta },
  catalogue: { Component: Catalogue, schema: catalogueSchema, meta: catalogueMeta },
  gallery: { Component: Gallery, schema: gallerySchema, meta: galleryMeta },
  pageHeading: { Component: PageHeading, schema: pageHeadingSchema, meta: pageHeadingMeta },
  text: { Component: Text, schema: textSchema, meta: textMeta },
  cards: { Component: Cards, schema: cardsSchema, meta: cardsMeta },
  contact: { Component: Contact, schema: contactSchema, meta: contactMeta },
  cta: { Component: Cta, schema: ctaSchema, meta: ctaMeta },
  notice: { Component: Notice, schema: noticeSchema, meta: noticeMeta },
  logos: { Component: Logos, schema: logosSchema, meta: logosMeta },
} as const;

/** Bloki, ki izrišejo <h1> strani (na strani je lahko samo eden). */
export const headingBlocks = ["glitchIntro", "shatterMenu", "catalogue", "pageHeading"] as const;
