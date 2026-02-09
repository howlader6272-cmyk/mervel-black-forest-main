
# Thank You Page After Order Confirmation

## What Will Happen

Order confirm করার পর home page-এ redirect না করে একটা dedicated **Thank You page**-এ নিয়ে যাবে। এই page-তে order confirmation details দেখাবে — animated checkmark, order summary, আর shop-এ ফেরার button।

## User Experience Flow

1. Customer checkout page-এ form fill up করে "Place Order" click করে
2. 1.2 সেকেন্ড processing এর পর সরাসরি `/thank-you` page-এ redirect হবে
3. Thank You page-তে দেখবে:
   - Animated gold checkmark icon
   - "Order Confirmed!" heading
   - Thank you message
   - Order summary (ordered items, total price, combo discount if any)
   - "Back to Shop" button
4. Cart clear হয়ে যাবে (আগেই হতো, এখনও হবে)

## Technical Details

### 1. Create new Thank You page (`src/pages/ThankYou.tsx`)
- A beautiful, brand-consistent confirmation page with:
  - Animated check icon with gold accent styling
  - Order details passed via `useLocation` state (items, total, combo discount info)
  - If no order data in state (direct URL visit), show a generic confirmation with "Back to Shop" link
  - Navbar and Footer included for consistency
  - Fade-in animations matching the site's style

### 2. Update Checkout (`src/pages/Checkout.tsx`)
- Change `navigate("/")` to `navigate("/thank-you", { state: { items, total, subtotal, comboDiscount, comboDiscountAmount, shippingCost } })`
- Pass order data via router state so the Thank You page can display it

### 3. Update App routes (`src/App.tsx`)
- Add new route: `/thank-you` pointing to the ThankYou page

### Files to Create
- `src/pages/ThankYou.tsx` — New Thank You confirmation page

### Files to Modify
- `src/pages/Checkout.tsx` — Redirect to `/thank-you` with order state
- `src/App.tsx` — Add `/thank-you` route
