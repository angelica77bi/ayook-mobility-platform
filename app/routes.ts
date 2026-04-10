import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("booking/:bookingNumber", "routes/booking.$bookingNumber.tsx"),
  route("api/bookings", "routes/api.bookings.ts"),
  route("api/bookings/:bookingNumber", "routes/api.bookings.$bookingNumber.ts"),
] satisfies RouteConfig;
