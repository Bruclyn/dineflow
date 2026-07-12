# Known Limitations

This document records deliberate scope decisions and known limitations in the
DineFlow prototype. These are accepted behaviours for a final-year prototype and
are flagged here as candidates for future enhancement.

## Guest checkout

Order placement requires an authenticated Supabase session. Unauthenticated
users who reach the checkout flow are redirected to the login page.

True guest checkout would require changes to the backend — specifically the
Row Level Security (RLS) rules and the `place_order` RPC — so that orders can be
created without an authenticated user. That backend work is out of scope for the
current UI/UX pass and is scoped as a **future enhancement**.

## Fee breakdown

The checkout UI displays a ₦500 flat delivery fee and a 5% service fee in the
cost summary. These figures are **display-only**.

The `place_order` RPC computes its own order total (the item subtotal)
server-side and does **not** include the delivery or service fees in the stored
order record. As a result, the total shown on the checkout screen may differ
from the total stored against the order and shown on the order-confirmation page.

Because payment is simulated in this prototype, this discrepancy is cosmetic and
is **accepted behaviour**. Wiring the fees into the stored order would require
changing the `place_order` RPC, which is out of scope for the UI pass.
