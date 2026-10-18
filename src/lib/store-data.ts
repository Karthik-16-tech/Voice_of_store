// DEMO DATA — no real incident backend is connected yet.
export type Severity = "critical" | "high" | "medium" | "low";

export const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low"];
export const SEVERITY_LABEL: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export type Department = {
  id: string;
  name: string;
  center: [number, number]; // x, z (meters)
  size: [number, number]; // width (x), depth (z)
};

export const DEPARTMENTS: Department[] = [
  { id: "dairy", name: "Dairy", center: [-12, -12.5], size: [10, 3] },
  { id: "frozen", name: "Freezer Section", center: [0, -11.5], size: [11, 5] },
  { id: "stockroom", name: "Stock Room", center: [13, -10], size: [10, 8] },
  { id: "beverages", name: "Beverages", center: [5.5, -2], size: [3.5, 8] },
  { id: "grocery", name: "Grocery Aisles", center: [-8.25, -1], size: [9, 11] },
  { id: "household", name: "Household", center: [-0.75, -1], size: [4.5, 11] },
  { id: "bakery", name: "Bakery", center: [-15.5, 8], size: [4.5, 7] },
  { id: "meat", name: "Meat & Seafood", center: [-15.75, -4], size: [4, 12] },
  { id: "produce", name: "Produce", center: [13, 2], size: [9, 10] },
  { id: "checkout", name: "Checkout", center: [7, 10], size: [13, 3.5] },
  { id: "entrance", name: "Entrance", center: [-4.5, 12.5], size: [6, 3] },
];

export type Incident = {
  id: string;
  departmentId: string | null; // null = unlocated
  severity: Severity;
  title: string;
  category: string;
  feedback: string;
  source: "Customer" | "Staff";
  detectedAt: string;
  owner: string | null;
  status: "Open" | "Investigating" | "Escalated";
  aiConfidence: number;
};

export const STORE = {
  id: "#1023",
  name: "Vizag Central",
  region: "South Region",
  lastUpdated: "Oct 18, 2026 10:24 AM",
};

export const INCIDENTS: Incident[] = [
  { id: "INC-4821", departmentId: "frozen", severity: "critical", title: "Temperature fluctuation", category: "Store Operations", feedback: "The ice cream was half melted and refrozen again.", source: "Customer", detectedAt: "Oct 18, 2026 10:24 AM", owner: "Operations Team", status: "Open", aiConfidence: 0.94 },
  { id: "INC-4817", departmentId: "frozen", severity: "critical", title: "Freezer door seal failing", category: "Equipment", feedback: "Door 4 doesn't close properly, frost everywhere inside.", source: "Staff", detectedAt: "Oct 18, 2026 08:12 AM", owner: null, status: "Open", aiConfidence: 0.89 },
  { id: "INC-4809", departmentId: "frozen", severity: "critical", title: "Thawed product on display", category: "Food Safety", feedback: "Frozen peas bag was soft and wet.", source: "Customer", detectedAt: "Oct 17, 2026 06:40 PM", owner: "Operations Team", status: "Investigating", aiConfidence: 0.91 },
  { id: "INC-4815", departmentId: "checkout", severity: "critical", title: "Repeated billing discrepancy", category: "Billing", feedback: "I was charged twice for the same milk carton.", source: "Customer", detectedAt: "Oct 18, 2026 09:05 AM", owner: "Front End Lead", status: "Open", aiConfidence: 0.96 },
  { id: "INC-4812", departmentId: "checkout", severity: "critical", title: "Promo price not applied", category: "Billing", feedback: "Shelf said 20% off but the bill showed full price.", source: "Customer", detectedAt: "Oct 18, 2026 08:47 AM", owner: null, status: "Open", aiConfidence: 0.87 },
  { id: "INC-4806", departmentId: "checkout", severity: "high", title: "Long queue wait", category: "Service", feedback: "Only one counter open at 6pm, waited 25 minutes.", source: "Customer", detectedAt: "Oct 17, 2026 06:15 PM", owner: "Store Manager", status: "Open", aiConfidence: 0.82 },
  { id: "INC-4811", departmentId: "dairy", severity: "high", title: "Expired yogurt on shelf", category: "Food Safety", feedback: "Found three yogurts past their date at the front.", source: "Customer", detectedAt: "Oct 18, 2026 07:58 AM", owner: null, status: "Open", aiConfidence: 0.9 },
  { id: "INC-4803", departmentId: "dairy", severity: "medium", title: "Milk out of stock", category: "Availability", feedback: "No toned milk again this morning.", source: "Customer", detectedAt: "Oct 17, 2026 09:30 AM", owner: "Inventory", status: "Investigating", aiConfidence: 0.85 },
  { id: "INC-4810", departmentId: "beverages", severity: "medium", title: "Stock complaints", category: "Availability", feedback: "Sparkling water shelf has been empty for days.", source: "Customer", detectedAt: "Oct 18, 2026 07:20 AM", owner: null, status: "Open", aiConfidence: 0.88 },
  { id: "INC-4802", departmentId: "beverages", severity: "low", title: "Spill near aisle end", category: "Cleanliness", feedback: "Sticky floor near the juice section.", source: "Staff", detectedAt: "Oct 17, 2026 04:02 PM", owner: "Housekeeping", status: "Open", aiConfidence: 0.79 },
  { id: "INC-4808", departmentId: "produce", severity: "high", title: "Product quality complaints", category: "Quality", feedback: "Tomatoes were bruised and soft.", source: "Customer", detectedAt: "Oct 17, 2026 05:10 PM", owner: "Produce Lead", status: "Open", aiConfidence: 0.86 },
  { id: "INC-4807", departmentId: "stockroom", severity: "medium", title: "Inventory discrepancy", category: "Inventory", feedback: "System shows 40 cases of rice, rack has 12.", source: "Staff", detectedAt: "Oct 17, 2026 03:44 PM", owner: "Inventory", status: "Investigating", aiConfidence: 0.92 },
  { id: "INC-4801", departmentId: null, severity: "low", title: "App coupon not working", category: "Digital", feedback: "The loyalty app coupon wouldn't scan.", source: "Customer", detectedAt: "Oct 17, 2026 11:20 AM", owner: null, status: "Open", aiConfidence: 0.74 },
];

export function topSeverity(list: Incident[]): Severity {
  return SEVERITY_ORDER.find((s) => list.some((i) => i.severity === s)) ?? "low";
}
