export interface MockDestination {
	id: string;
	name: string;
	category: string;
	lat?: number;
	lng?: number;
	shortDescription: string;
}

// Experimental visitor destinations remain local until a visitor data source is approved.
export const mockDestinations: MockDestination[] = [
	{
		id: "madinah-cultural-center",
		name: "مركز المدينة الثقافي",
		category: "ثقافي",
		lat: 24.4814,
		lng: 39.6118,
		shortDescription: "وجهة ثقافية mock للتجربة المحلية.",
	},
	{
		id: "madinah-transport-hub",
		name: "مركز تجربة التنقل",
		category: "نقل وتجربة وصول",
		lat: 24.524,
		lng: 39.697,
		shortDescription: "نقطة تجريبية تجمع خيارات الوصول والتنقل.",
	},
	{
		id: "madinah-hospitality",
		name: "ضيافة المدينة",
		category: "إقامة وفنادق",
		lat: 24.4675,
		lng: 39.612,
		shortDescription: "وجهة إقامة mock للتجربة المحلية.",
	},
	{
		id: "oasis-hotel",
		name: "فندق الواحة التجريبي",
		category: "إقامة وفنادق",
		lat: 24.477,
		lng: 39.624,
		shortDescription: "خيار إقامة محلي تجريبي.",
	},
	{
		id: "family-park",
		name: "حديقة العائلة التجريبية",
		category: "ترفيهي",
		lat: 24.505,
		lng: 39.64,
		shortDescription: "وجهة ترفيهية عائلية mock.",
	},
];

export const visitorDestinations = mockDestinations;

export const manualStartingPoints = [
	{ id: "city-center", name: "وسط المدينة", lat: 24.4672, lng: 39.6112 },
	{ id: "airport", name: "مطار الأمير محمد بن عبدالعزيز", lat: 24.5534, lng: 39.705 },
	{ id: "haramain", name: "محطة قطار الحرمين", lat: 24.472678, lng: 39.699436 },
	{ id: "qiblatain", name: "منطقة مسجد القبلتين", lat: 24.4934, lng: 39.5837 },
];