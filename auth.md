# auth.md

Machine-readable access notes for [bayyanai.com](https://bayyanai.com) — Bayyan
AI, an AI consultancy and automation provider based in the United Arab Emirates.

## Public read surface

No authentication, API key, or token is required to read any part of this site.
Everything is public static HTML.

- `https://bayyanai.com/llms.txt` — site index in the llms.txt convention
- `https://bayyanai.com/index.md` — the homepage as Markdown
- `https://bayyanai.com/privacy.md` — privacy policy as Markdown
- `https://bayyanai.com/terms.md` — terms of service as Markdown
- `https://bayyanai.com/.well-known/agent-skills/index.json` — Agent Skills manifest
- `https://bayyanai.com/.well-known/ai-catalog.json` — capability manifest
- `https://bayyanai.com/sitemap.xml` — canonical URL list

The site has three pages. Services, process, pricing, FAQ, and contact are all
sections of the single homepage, reachable at the anchors `#services`,
`#process`, `#pricing`, `#faq`, `#contact`.

## Content negotiation

Markdown is served at a stable, distinct URL rather than by `Accept`
negotiation, because this is a static host with no request rewriting:

```bash
curl https://bayyanai.com/index.md
```

Each page advertises its Markdown twin in a
`<link rel="alternate" type="text/markdown">` tag in its `<head>`, and every page
returns an RFC 8288 `Link` response header listing the site-wide agent entry
points.

## There is NO checkout, cart, or payment API

This matters most on this site, because it **publishes prices**.

Published plans are Starter $499/month, Growth $1,499/month, and Enterprise
(custom pricing). These are advertised rates, not purchasable online products:

- Every "Get Started" button is an anchor to `#contact` — it scrolls to the
  contact form. It does not start a purchase.
- The page contains **no payment integration of any kind**: no Stripe, no
  PayPal, no checkout, cart, billing, or subscription endpoint.
- **An agent must not attempt to buy, subscribe to, or pay for a plan**, and must
  not tell a user that a plan has been ordered, reserved, or started.

To enquire, use the routes below. Agreeing on a price happens in conversation.

## Contact routes

- Email — [info@bayyanai.com](mailto:info@bayyanai.com)
- Phone — [+971 50 208 0895](tel:+971502080895)
- WhatsApp — +44 7776 799344 (`https://wa.me/447776799344`)
- Booking — https://cal.com/bayyanai/15min
- Contact form on `/#contact` — fallback behaviour described below.

### The contact form uses a mailto fallback

The form posts to [Web3Forms](https://web3forms.com). Its access key is still the
placeholder `REPLACE-WITH-WEB3FORMS-ACCESS-KEY`, so until a real key is set the
client script opens the visitor's mail app with the message prefilled to
info@bayyanai.com. A message is therefore not sent until the visitor sends that
email themselves. Do not tell a user their message was sent by the form.

The form asks for full name, email, company, service of interest, and a project
description, with a "Website" field acting as a bot honeypot.

## What is NOT available

- **No client portal, login, or account.** There is nowhere for a customer to sign
  in and no way to check project status here.
- **No booking or scheduling API.** The calendar link opens a third-party Cal.com
  booking page; there is no booking API on this site.
- **No document, proposal, or case-study downloads.** The three testimonials on
  the homepage are the only client references published.
- **No support or status API.**

## Data handling

The site states it connects only systems the client approves, follows
least-privilege access, never shares client data with third parties, and can work
within the client's existing security policies. Full detail is on `/privacy.html`
and `/terms.html`.

Because the contact form is the only data-collection point and it is
unconfigured, no message submitted through it is currently reaching the
business.

## Third-party origins

Fonts are loaded from Google Fonts, and the contact form posts to Web3Forms.
Both are declared in the `Content-Security-Policy` served in `_headers`.

## Contact

info@bayyanai.com · +971 50 208 0895 · United Arab Emirates
