import type { Locale } from "./i18n";

export type TranslationKey =
  | "app.title"
  | "app.description"
  | "nav.home"
  | "nav.about"
  | "nav.map"
  | "nav.projects"
  | "nav.routes"
  | "nav.local_guides"
  | "nav.statistics"
  | "nav.reports"
  | "status.completed"
  | "status.in_progress"
  | "status.planned"
  | "project.back_to_projects"
  | "project.back_to_map"
  | "project.back"
  | "project.edit"
  | "project.delete"
  | "project.delete_confirm"
  | "project.export_excel"
  | "project.description"
  | "project.completion_percentage"
  | "project.gallery"
  | "project.visitor_summary"
  | "project.main_features"
  | "project.services"
  | "project.project_importance"
  | "project.project_links"
  | "project.responsible_entity"
  | "project.executing_entity"
  | "project.start_date"
  | "project.end_date"
  | "project.duration"
  | "project.area"
  | "project.coordinates"
  | "project.no_images"
  | "restaurant.place_type"
  | "restaurant.location"
  | "restaurant.place_summary"
  | "restaurant.visitor_summary"
  | "restaurant.menu"
  | "restaurant.menu_button"
  | "restaurant.menu_not_added"
  | "restaurant.visit_info"
  | "restaurant.opening_hours"
  | "restaurant.place_links"
  | "restaurant.instagram"
  | "restaurant.reservation"
  | "restaurant.phone"
  | "restaurant.website"
  | "restaurant.map_link"
  | "category.health"
  | "category.commercial"
  | "category.transport"
  | "category.heritage_tourism"
  | "category.education"
  | "category.entertainment"
  | "category.entertainment_humanization"
  | "category.wildlife"
  | "category.investment"
  | "category.residential_investment"
  | "category.hotel"
  | "category.infrastructure"
  | "category.restaurants_cafes"
  | "routes.suggested_routes"
  | "routes.all_routes"
  | "routes.personalized_recommendation"
  | "routes.location"
  | "routes.interests"
  | "routes.experience_type"
  | "routes.available_time"
  | "routes.suggest"
  | "routes.recommended_for_you"
  | "routes.stops"
  | "routes.view_on_map"
  | "routes.under_two_hours"
  | "routes.two_to_four"
  | "routes.half_day"
  | "routes.full_day"
  | "routes.two_days"
  | "routes.three_days_plus"
  | "routes.use_current_location"
  | "routes.location_error"
  | "empty.no_images"
  | "empty.no_data"
  | "button.cancel"
  | "button.save"
  | "button.delete"
  | "button.close"
  | "button.back"
  | "button.add"
  | "button.upload_images"
  | "button.delete_image"
  | "language.ar"
  | "language.en";

const translations: Record<TranslationKey, { ar: string; en: string }> = {
  "app.title": { ar: "مدار", en: "Madar" },
  "app.description": { ar: "منصة تطوير المدينة المنورة", en: "Madinah Development Platform" },

  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.about": { ar: "عن مبادرة مدار", en: "About Madar" },
  "nav.map": { ar: "الخريطة", en: "Map" },
  "nav.projects": { ar: "المشاريع", en: "Projects" },
  "nav.routes": { ar: "المسارات المقترحة", en: "Suggested Routes" },
  "nav.local_guides": { ar: "مرشدك المحلي", en: "Local Guide" },
  "nav.statistics": { ar: "الإحصائيات", en: "Statistics" },
  "nav.reports": { ar: "التقارير", en: "Reports" },

  "status.completed": { ar: "مكتمل", en: "Completed" },
  "status.in_progress": { ar: "قيد التنفيذ", en: "In Progress" },
  "status.planned": { ar: "مخطط", en: "Planned" },

  "project.back_to_projects": { ar: "العودة للمشاريع", en: "Back to Projects" },
  "project.back_to_map": { ar: "العودة للخريطة", en: "Back to Map" },
  "project.back": { ar: "العودة", en: "Back" },
  "project.edit": { ar: "تعديل المشروع", en: "Edit Project" },
  "project.delete": { ar: "حذف المشروع", en: "Delete Project" },
  "project.delete_confirm": {
    ar: "هل أنت متأكد أنك تريد حذف هذا المشروع؟",
    en: "Are you sure you want to delete this project?",
  },
  "project.export_excel": { ar: "تصدير Excel", en: "Export Excel" },
  "project.description": { ar: "وصف المشروع", en: "Project Description" },
  "project.completion_percentage": { ar: "نسبة الإنجاز", en: "Completion Percentage" },
  "project.gallery": { ar: "معرج الصور", en: "Gallery" },
  "project.visitor_summary": { ar: "نبذة للزائر", en: "Visitor Summary" },
  "project.main_features": { ar: "المزايا الرئيسية", en: "Main Features" },
  "project.services": { ar: "الخدمات", en: "Services" },
  "project.project_importance": { ar: "أهمية المشروع", en: "Project Importance" },
  "project.project_links": { ar: "روابط المشروع", en: "Project Links" },
  "project.responsible_entity": { ar: "الجهة المسؤولة", en: "Responsible Entity" },
  "project.executing_entity": { ar: "الجهة المنفذة", en: "Executing Entity" },
  "project.start_date": { ar: "تاريخ البداية", en: "Start Date" },
  "project.end_date": { ar: "تاريخ النهاية", en: "End Date" },
  "project.duration": { ar: "مدة المشروع", en: "Project Duration" },
  "project.area": { ar: "المساحة", en: "Area" },
  "project.coordinates": { ar: "الإحداثيات", en: "Coordinates" },
  "project.no_images": { ar: "لا توجد صور متاحة", en: "No images available" },

  "restaurant.place_type": { ar: "نوع المكان", en: "Place Type" },
  "restaurant.location": { ar: "الموقع", en: "Location" },
  "restaurant.place_summary": { ar: "نبذة عن المكان", en: "About the Place" },
  "restaurant.visitor_summary": { ar: "نبذة للزائر", en: "Visitor Information" },
  "restaurant.menu": { ar: "المنيو", en: "Menu" },
  "restaurant.menu_button": { ar: "عرض المنيو", en: "View Menu" },
  "restaurant.menu_not_added": { ar: "لم تتم إضافة المنيو بعد", en: "Menu not yet added" },
  "restaurant.visit_info": { ar: "معلومات الزيارة", en: "Visit Information" },
  "restaurant.opening_hours": { ar: "ساعات العمل", en: "Opening Hours" },
  "restaurant.place_links": { ar: "روابط المكان", en: "Place Links" },
  "restaurant.instagram": { ar: "إنستغرام", en: "Instagram" },
  "restaurant.reservation": { ar: "الحجز", en: "Reservation" },
  "restaurant.phone": { ar: "رقم التواصل", en: "Contact Phone" },
  "restaurant.website": { ar: "الموقع الرسمي", en: "Official Website" },
  "restaurant.map_link": { ar: "الموقع على الخريطة", en: "Location on Map" },

  "category.health": { ar: "صحي", en: "Health" },
  "category.commercial": { ar: "تجاري", en: "Commercial" },
  "category.transport": { ar: "نقل و مواصلات", en: "Transport & Mobility" },
  "category.heritage_tourism": { ar: "تراثي و سياحي", en: "Heritage & Tourism" },
  "category.education": { ar: "تعليم", en: "Education" },
  "category.entertainment": { ar: "ترفيهي", en: "Entertainment" },
  "category.entertainment_humanization": {
    ar: "ترفيهي و أنسنة",
    en: "Entertainment & Humanization",
  },
  "category.wildlife": { ar: "محمية", en: "Wildlife Reserve" },
  "category.investment": { ar: "استثماري", en: "Investment" },
  "category.residential_investment": { ar: "سكني استثماري", en: "Residential Investment" },
  "category.hotel": { ar: "فندقي", en: "Hotel" },
  "category.infrastructure": { ar: "بنية تحتية", en: "Infrastructure" },
  "category.restaurants_cafes": { ar: "مطاعم ومقاهي", en: "Restaurants & Cafés" },

  "routes.suggested_routes": { ar: "المسارات المقترحة", en: "Suggested Routes" },
  "routes.all_routes": { ar: "جميع المسارات", en: "All Routes" },
  "routes.personalized_recommendation": {
    ar: "التوصيات الشخصية",
    en: "Personalized Recommendations",
  },
  "routes.location": { ar: "الموقع", en: "Location" },
  "routes.interests": { ar: "الاهتمامات", en: "Interests" },
  "routes.experience_type": { ar: "نوع التجربة", en: "Experience Type" },
  "routes.available_time": { ar: "الوقت المتاح", en: "Available Time" },
  "routes.suggest": { ar: "اقترح لي المسارات", en: "Suggest Routes" },
  "routes.recommended_for_you": { ar: "المسارات المناسبة لك", en: "Recommended for You" },
  "routes.stops": { ar: "محطات", en: "stops" },
  "routes.view_on_map": { ar: "عرض المسار على الخريطة", en: "View on Map" },
  "routes.under_two_hours": { ar: "أقل من ساعتين", en: "Under 2 hours" },
  "routes.two_to_four": { ar: "2–4 ساعات", en: "2–4 hours" },
  "routes.half_day": { ar: "نصف يوم", en: "Half day" },
  "routes.full_day": { ar: "يوم كامل", en: "Full day" },
  "routes.two_days": { ar: "يومان", en: "Two days" },
  "routes.three_days_plus": { ar: "3 أيام أو أكثر", en: "3+ days" },
  "routes.use_current_location": { ar: "استخدام موقعك الحالي", en: "Use Current Location" },
  "routes.location_error": { ar: "تعذر الوصول إلى الموقع", en: "Unable to access location" },

  "empty.no_images": { ar: "لا توجد صور متاحة", en: "No images available" },
  "empty.no_data": { ar: "لا توجد بيانات", en: "No data available" },

  "button.cancel": { ar: "إلغاء", en: "Cancel" },
  "button.save": { ar: "حفظ", en: "Save" },
  "button.delete": { ar: "حذف", en: "Delete" },
  "button.close": { ar: "إغلاق", en: "Close" },
  "button.back": { ar: "العودة", en: "Back" },
  "button.add": { ar: "إضافة", en: "Add" },
  "button.upload_images": { ar: "إضافة صور", en: "Upload Images" },
  "button.delete_image": { ar: "حذف الصورة", en: "Delete Image" },

  "language.ar": { ar: "العربية", en: "Arabic" },
  "language.en": { ar: "English", en: "English" },
};

export function t(key: TranslationKey, locale: Locale): string {
  const translation = translations[key];
  if (!translation) {
    console.warn(`Missing translation for key: ${key}`);
    return key;
  }
  return translation[locale];
}

export function getTranslations(locale: Locale): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, values] of Object.entries(translations)) {
    result[key] = values[locale];
  }
  return result;
}
