# Urban Glimmer — Implementation Notes

## Brand direction
- Editorial, contemporary jewellery aesthetic
- Warm ivory canvas, charcoal ink, muted olive accents
- Serif display typography paired with compact mono labels
- Product photography and generous whitespace
- Responsive from mobile through wide desktop

## Frontend architecture
- `app/page.tsx`: interactive storefront and demo UI state
- `app/layout.tsx`: metadata and document shell
- `app/globals.css`: design system and responsive styling
- `components/ui/button.tsx`: reusable button with variants
- `lib/utils.ts`: `cn()` helper for Tailwind class composition

## User journeys to test
1. Use Shop All / category tabs to filter the catalogue.
2. Search for “chain”, “gold”, or “earrings”.
3. Open a product quick view and save it to wishlist.
4. Quick-add a product; change quantity or remove it in the bag.
5. Add enough products to unlock free shipping (₹1,999).
6. Continue to demo checkout; submit valid test details and observe simulated order confirmation.
7. Subscribe with an email address to see the demo feedback.
8. Test the mobile navigation at a narrow viewport.

## Production follow-ups
- Replace transient state with server-persisted carts and wishlists.
- Add database-backed product, inventory, customer and order models.
- Validate prices, stock, discounts and totals on the server; never trust client totals.
- Add authentication, authorization, CSRF/security protections and rate limiting.
- Build admin dashboard and persisted customer support chat.
- Wire newsletter form to a consent-aware mailing provider.
- Use a payment gateway sandbox before any live integration.
- Add tests, accessibility checks, error states, image optimization and analytics consent controls.
