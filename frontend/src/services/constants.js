export const VEHICLE_TYPES = [
  { id: 'car', label: 'Cars', icon: '🚗' },
  { id: 'van', label: 'Vans', icon: '🚐' },
  { id: 'bus', label: 'Buses', icon: '🚌' },
  { id: 'bike', label: 'Bikes', icon: '🏍️' },
  { id: 'three-wheeler', label: 'Three-Wheelers', icon: '🛺' },
  { id: 'truck', label: 'Trucks', icon: '🚚' },
  { id: 'suv', label: 'SUVs', icon: '🚙' },
  { id: 'ev', label: 'Electric Vehicles', icon: '⚡' },
];

export const VEHICLE_BRANDS = [
  'Toyota', 'Honda', 'Nissan', 'Suzuki', 'Mitsubishi',
  'BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Ford',
  'Hyundai', 'Kia', 'Mazda', 'Subaru', 'Isuzu',
  'Yamaha', 'Bajaj', 'TVS', 'Hero', 'Kawasaki',
  'Tata', 'Ashok Leyland', 'Volvo', 'Other',
];

export const SERVICE_CATEGORIES = [
  { id: 'engine-repair', label: 'Engine Repair', icon: '⚙️' },
  { id: 'oil-change', label: 'Oil Change', icon: '🛢️' },
  { id: 'battery', label: 'Battery Service', icon: '🔋' },
  { id: 'tire', label: 'Tire Service', icon: '🔄' },
  { id: 'ac-repair', label: 'AC Repair', icon: '❄️' },
  { id: 'electrical', label: 'Electrical Repair', icon: '⚡' },
  { id: 'painting', label: 'Painting', icon: '🎨' },
  { id: 'washing', label: 'Washing & Detailing', icon: '💧' },
  { id: 'towing', label: 'Towing', icon: '🚛' },
  { id: 'diagnostics', label: 'Diagnostic Services', icon: '🔍' },
  { id: 'brake', label: 'Brake Repair', icon: '🛑' },
  { id: 'suspension', label: 'Suspension', icon: '🔩' },
  { id: 'transmission', label: 'Transmission', icon: '⚙️' },
  { id: 'wheel-alignment', label: 'Wheel Alignment', icon: '🎯' },
];

export const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale',
  'Nuwara Eliya', 'Galle', 'Matara', 'Hambantota', 'Jaffna',
  'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu', 'Batticaloa',
  'Ampara', 'Trincomalee', 'Kurunegala', 'Puttalam', 'Anuradhapura',
  'Polonnaruwa', 'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle',
];

export const SUBSCRIPTION_PLANS = {
  FREE: { label: 'Free Trial', price: 0, duration: 30, features: ['Basic listing', '5 photos', 'Contact display'] },
  PRO: { label: 'Pro', price: 10, duration: 30, features: ['Featured listing', '20 photos', 'Priority search', 'Analytics', 'Badge'] },
};