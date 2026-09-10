import * as XLSX from "xlsx";
import type { Project } from "@/data/projects";
import { getStatusLabel, getCategoryLabel, formatArea } from "./display";
import { supabase } from "./supabase";

const fields = (p: Project): [string, string][] => [
  ["اسم المشروع", p.name],
  ["التصنيف", p.category],
  ["الحالة", p.status],
  ["نسبة الإنجاز", `${p.progress}%`],
  ["تاريخ البداية", p.startDate || "—"],
  ["تاريخ النهاية", p.endDate || "—"],
  ["المدة", p.durationYears ? `${p.durationYears} سنوات` : "—"],
  ["الجهة المسؤولة", p.ownerEntity],
  ["الجهة المنفذة", p.executorEntity || "—"],
  ["المساحة", p.area ? `${p.area} ${p.areaUnit}` : "—"],
  ["الإحداثيات", `${p.lat}, ${p.lng}`],
];

// ---------- Utility Functions ----------
function escape(s: string) {
  return String(s)
    .replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
    )
    .replace(/\n/g, "<br>");
}

function formatDateYearOnly(value: string) {
  if (!value) return "—";
  const match = value.match(/(\d{4})/);
  return match ? `${match[1]}` : value;
}

function getDurationYears(durationYears: number, startDate: string, endDate: string) {
  if (durationYears > 0) return durationYears;
  const start = Number((startDate.match(/(\d{4})/) || [])[1]);
  const end = Number((endDate.match(/(\d{4})/) || [])[1]);
  if (Number.isFinite(start) && Number.isFinite(end) && end >= start) {
    return Math.max(1, end - start);
  }
  return 0;
}

function formatCoordinates(lat?: number, lng?: number) {
  if (lat == null || lng == null) return "—";
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

function generateQRCode(projectId: string): string {
  // Generate QR code URL for the project details page
  const projectUrl = `${window.location.origin}/projects/${projectId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(projectUrl)}`;
  return qrUrl;
}

function formatNumberWithCommas(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return num.toLocaleString("ar-SA");
}

// ---------- QR Mapping Functions ----------
/**
 * Extract coordinates from Google Maps URL
 * Handles formats like: https://maps.google.com/?q=24.5282,46.7054
 * Or: https://www.google.com/maps/@24.5282,46.7054
 */
function extractCoordinatesFromUrl(url: string): { lat: number; lng: number } | null {
  try {
    // Try to match @lat,lng format (used in maps.google.com/@lat,lng)
    const atMatch = url.match(/@([-\d.]+),([-\d.]+)/);
    if (atMatch) {
      const lat = parseFloat(atMatch[1]);
      const lng = parseFloat(atMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }

    // Try to match q=lat,lng format
    const qMatch = url.match(/[?&]q=([-\d.]+),([-\d.]+)/);
    if (qMatch) {
      const lat = parseFloat(qMatch[1]);
      const lng = parseFloat(qMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }

    // Try to match generic lat,lng pattern
    const coordMatch = url.match(/([-\d.]+),([-\d.]+)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
  } catch (e) {
    console.error("Error extracting coordinates from URL:", url, e);
  }
  return null;
}

/**
 * Check if two coordinates match within tolerance
 * Tolerance: 0.0001 degrees (approximately 10 meters)
 */
function coordinatesMatch(
  coord1: { lat: number; lng: number } | null,
  coord2: { lat: number; lng: number } | null,
  tolerance = 0.0001,
): boolean {
  if (!coord1 || !coord2) return false;
  const latDiff = Math.abs(coord1.lat - coord2.lat);
  const lngDiff = Math.abs(coord1.lng - coord2.lng);
  return latDiff <= tolerance && lngDiff <= tolerance;
}

/**
 * Build QR image mapping from Supabase Storage by matching coordinates
 * Returns a Map of project.id -> QR_image_public_url
 */
async function buildQrMapping(projects: Project[]): Promise<Map<string, string>> {
  const mapping = new Map<string, string>();

  try {
    // Fetch all files from project-qr bucket
    const { data: files, error } = await supabase.storage.from("project-qr").list("", {
      limit: 1000,
    });

    if (error) {
      console.warn("Could not fetch QR files from Supabase Storage:", error);
      return mapping;
    }

    if (!files || files.length === 0) {
      console.log("No QR files found in project-qr bucket");
      return mapping;
    }

    // Process each file
    for (const file of files) {
      if (!file.name) continue;

      try {
        // Get public URL for the file
        const { data } = supabase.storage.from("project-qr").getPublicUrl(file.name);
        const publicUrl = data.publicUrl;

        // Extract coordinates from the file metadata or name
        // The file might have coordinates in the name or we need to read its content
        const qrCoords = extractCoordinatesFromUrl(file.name);

        if (!qrCoords) {
          // Try to extract from public URL as fallback
          const urlCoords = extractCoordinatesFromUrl(publicUrl);
          if (!urlCoords) continue;
          const matchingProject = projects.find(
            (p) => p.lat && p.lng && coordinatesMatch(urlCoords, { lat: p.lat, lng: p.lng }),
          );
          if (matchingProject) {
            mapping.set(matchingProject.id, publicUrl);
          }
        } else {
          // Match coordinates with projects
          const matchingProject = projects.find(
            (p) => p.lat && p.lng && coordinatesMatch(qrCoords, { lat: p.lat, lng: p.lng }),
          );
          if (matchingProject) {
            mapping.set(matchingProject.id, publicUrl);
          }
        }
      } catch (e) {
        console.warn(`Error processing QR file ${file.name}:`, e);
      }
    }
  } catch (e) {
    console.error("Error building QR mapping:", e);
  }

  return mapping;
}

/**
 * Get QR image URL for a project
 * Falls back to generated QR code if no mapping found
 */
async function getQRImageUrl(project: Project): Promise<string> {
  try {
    // Try to find pre-built mapping (this would be passed in)
    // For now, we'll generate a fallback
    return generateQRCode(project.id);
  } catch (e) {
    console.warn("Error getting QR image URL:", e);
    return generateQRCode(project.id);
  }
}

// ---------- PDF Template via browser print ----------
function openPrintWindow(title: string, bodyHtml: string) {
  const w = window.open("", "_blank", "width=900,height=1100");
  if (!w) {
    alert("يرجى السماح للنوافذ المنبثقة لتصدير PDF");
    return;
  }
  w.document.write(`<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"/>
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap">
<style>
  *{box-sizing:border-box}
  body{font-family:'Tajawal',sans-serif;color:#2d3f37;margin:0;padding:0;background:#fff;line-height:1.6}
  .page{page-break-after:always;padding:25px;min-height:297mm}
  
  /* Header */
  .header{text-align:center;margin-bottom:25px;padding-bottom:15px;border-bottom:4px solid #c9a961}
  .logo-section{margin-bottom:8px}
  .logo-text{font-size:32px;font-weight:900;color:#3f7358;letter-spacing:-0.5px}
  .logo-subtext{font-size:9px;color:#8a8a8a;margin-top:1px;font-weight:500;letter-spacing:0.5px}
  .report-title{font-size:20px;font-weight:800;color:#2d5a3f;margin:12px 0 6px 0;text-transform:uppercase;letter-spacing:1px}
  .project-number{font-size:11px;color:#8a8a8a;font-weight:600;letter-spacing:0.5px}
  
  /* Project Title - Centered Above Content */
  .project-title-section{text-align:center;margin-bottom:20px}
  .project-title{font-size:26px;font-weight:900;color:#2d5a3f;margin:0;line-height:1.2;letter-spacing:-0.5px}
  
  /* Main Content - Two Column Layout (Reversed) */
  .main-content{display:grid;grid-template-columns:40% 60%;gap:25px;margin-bottom:20px}
  
  /* Left Column - Large Image + QR */
  .left-column{display:flex;flex-direction:column;gap:18px}
  .project-image{width:100%;aspect-ratio:3/2.5;border-radius:6px;overflow:hidden;border:3px solid #c9a961;background:#f0ede4;box-shadow:0 2px 8px rgba(0,0,0,0.08)}
  .project-image img{width:100%;height:100%;object-fit:cover}
  .no-image{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#c0bab3;font-size:14px;font-weight:600}
  
  /* QR Code - Larger */
  .qr-container{text-align:center;background:#faf9f6;border:2px solid #c9a961;border-radius:6px;padding:14px;box-shadow:0 1px 4px rgba(0,0,0,0.05)}
  .qr-image{width:160px;height:160px;margin:0 auto;border:2px solid #e4e0d3;border-radius:4px;background:#fff;display:flex;align-items:center;justify-content:center}
  .qr-image img{width:100%;height:100%;object-fit:contain;padding:4px}
  .qr-label{font-size:11px;color:#3f7358;margin-top:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px}
  
  /* Right Column - Information Panel */
  .right-column{display:flex;flex-direction:column}
  
  /* Information Panel - Large unified card */
  .info-panel{background:#faf9f6;border:2px solid #3f7358;border-radius:6px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,0.08)}
  .info-panel-title{font-size:12px;font-weight:800;color:#3f7358;text-transform:uppercase;letter-spacing:1px;margin:0 0 14px 0;padding-bottom:10px;border-bottom:2px solid #c9a961}
  .info-list{display:flex;flex-direction:column;gap:0}
  .info-row{display:flex;justify-content:space-between;align-items:flex-start;padding:11px 0;border-bottom:1px solid #e4e0d3}
  .info-row:last-child{border-bottom:none}
  .info-label{font-size:11px;color:#3f7358;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;flex:0 0 48%;min-width:140px}
  .info-value{font-size:12px;font-weight:600;color:#2d3f37;flex:1;text-align:left;word-break:break-word;line-height:1.4}
  
  /* Footer */
  .footer{margin-top:25px;padding-top:12px;border-top:2px solid #c9a961;font-size:8px;color:#8a8a8a;text-align:center;line-height:1.5}
  
  @media print{body{padding:0;margin:0}.page{page-break-after:always;min-height:100vh;padding:20mm}}
</style></head><body>${bodyHtml}
<script>window.onload=()=>{setTimeout(()=>window.print(),500)};</script>
</body></html>`);
  w.document.close();
}

function projectPdfHtml(p: Project, qrImageUrl?: string): string {
  const statusLabel = getStatusLabel(p.status);
  const categoryLabel = getCategoryLabel(p.category);
  const durationYears = getDurationYears(p.durationYears, p.startDate, p.endDate);
  const startYear = formatDateYearOnly(p.startDate);
  const endYear = formatDateYearOnly(p.endDate);
  const coordinates = formatCoordinates(p.lat, p.lng);
  const qrUrl = qrImageUrl || generateQRCode(p.id);
  const mainImage = p.images.length > 0 ? p.images[0] : "";
  const areaFormatted = p.area ? escape(formatArea(p.area, p.areaUnit)) : "—";
  const executorEntity = escape(p.executorEntity || "—");

  return `
    <div class="page">
      <!-- Header -->
      <div class="header">
        <div class="logo-section">
          <div class="logo-text">مدار</div>
          <div class="logo-subtext">منصة المشاريع التنموية</div>
        </div>
        <div class="report-title">تقرير المشروع</div>
        <div class="project-number">رقم المشروع: ${escape(p.id)}</div>
      </div>

      <!-- Project Title - Centered -->
      <div class="project-title-section">
        <h1 class="project-title">${escape(p.name)}</h1>
      </div>

      <!-- Main Content: Two Column Layout -->
      <div class="main-content">
        <!-- Left Column: Information Panel -->
        <div class="right-column">
          <!-- Information Panel -->
          <div class="info-panel">
            <div class="info-panel-title">معلومات المشروع</div>
            <div class="info-list">
              <div class="info-row">
                <span class="info-label">حالة المشروع</span>
                <span class="info-value">${escape(statusLabel)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">التصنيف</span>
                <span class="info-value">${escape(categoryLabel)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">مدة المشروع</span>
                <span class="info-value">${durationYears} ${durationYears === 1 ? "سنة" : "سنوات"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">نسبة الإنجاز</span>
                <span class="info-value">${Math.min(100, Math.max(0, p.progress))}%</span>
              </div>
              <div class="info-row">
                <span class="info-label">سنة البداية</span>
                <span class="info-value">${escape(startYear)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">سنة النهاية</span>
                <span class="info-value">${escape(endYear)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">المساحة</span>
                <span class="info-value">${areaFormatted}</span>
              </div>
              <div class="info-row">
                <span class="info-label">الإحداثيات</span>
                <span class="info-value">${escape(coordinates)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">الجهة المنفذة</span>
                <span class="info-value">${executorEntity}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Large Image + QR -->
        <div class="left-column">
          <!-- Project Image -->
          <div class="project-image">
            ${mainImage ? `<img src="${mainImage}" alt="${escape(p.name)}">` : `<div class="no-image">صورة غير متاحة</div>`}
          </div>

          <!-- QR Code -->
          <div class="qr-container">
            <div class="qr-image">
              <img src="${qrUrl}" alt="QR Code">
            </div>
            <div class="qr-label">مسح للتفاصيل</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div>منصة مدار لمراقبة المشاريع التنموية | المدينة المنورة</div>
        <div>تاريخ التقرير: ${new Date().toLocaleDateString("ar-SA")}</div>
      </div>
    </div>
  `;
}

// ---------- PDF Export API ----------
export async function exportProjectPDF(p: Project) {
  try {
    // Try to fetch QR image from Supabase Storage
    const { data: files, error } = await supabase.storage.from("project-qr").list("", {
      limit: 1000,
    });

    let qrImageUrl: string | undefined;

    if (!error && files && files.length > 0) {
      // Find matching QR file by coordinates
      for (const file of files) {
        if (!file.name) continue;

        try {
          const { data: publicUrlData } = supabase.storage
            .from("project-qr")
            .getPublicUrl(file.name);
          const publicUrl = publicUrlData.publicUrl;

          // Extract coordinates from file name
          const qrCoords = extractCoordinatesFromUrl(file.name);
          const urlCoords = extractCoordinatesFromUrl(publicUrl);
          const coords = qrCoords || urlCoords;

          if (coords && p.lat && p.lng && coordinatesMatch(coords, { lat: p.lat, lng: p.lng })) {
            qrImageUrl = publicUrl;
            break;
          }
        } catch (e) {
          console.warn(`Error processing QR file ${file.name}:`, e);
        }
      }
    }

    const html = projectPdfHtml(p, qrImageUrl);
    openPrintWindow(`${p.name} - مدار`, html);
  } catch (e) {
    console.error("Error in exportProjectPDF:", e);
    // Fallback: generate PDF with auto-generated QR code
    const html = projectPdfHtml(p);
    openPrintWindow(`${p.name} - مدار`, html);
  }
}

export async function exportProjectsPDF(list: Project[], title = "تقرير المشاريع") {
  if (list.length === 0) return;

  try {
    // Fetch all QR files once
    const { data: files, error } = await supabase.storage.from("project-qr").list("", {
      limit: 1000,
    });

    const qrMapping = new Map<string, string>();

    if (!error && files && files.length > 0) {
      // Build QR mapping for all projects
      for (const file of files) {
        if (!file.name) continue;

        try {
          const { data: publicUrlData } = supabase.storage
            .from("project-qr")
            .getPublicUrl(file.name);
          const publicUrl = publicUrlData.publicUrl;

          // Extract coordinates from file name
          const qrCoords = extractCoordinatesFromUrl(file.name);
          const urlCoords = extractCoordinatesFromUrl(publicUrl);
          const coords = qrCoords || urlCoords;

          if (coords) {
            // Find matching project
            const matchingProject = list.find(
              (p) => p.lat && p.lng && coordinatesMatch(coords, { lat: p.lat, lng: p.lng }),
            );
            if (matchingProject) {
              qrMapping.set(matchingProject.id, publicUrl);
            }
          }
        } catch (e) {
          console.warn(`Error processing QR file ${file.name}:`, e);
        }
      }
    }

    const body = list
      .map(
        (p, i) =>
          `<div${i > 0 ? ' style="page-break-before:always"' : ""}>${projectPdfHtml(p, qrMapping.get(p.id))}</div>`,
      )
      .join("");
    openPrintWindow(`${title} - مدار`, body);
  } catch (e) {
    console.error("Error in exportProjectsPDF:", e);
    // Fallback: generate PDFs without fetched QR codes
    const body = list
      .map(
        (p, i) =>
          `<div${i > 0 ? ' style="page-break-before:always"' : ""}>${projectPdfHtml(p)}</div>`,
      )
      .join("");
    openPrintWindow(`${title} - مدار`, body);
  }
}

// ---------- Excel Export ----------
export function exportProjectExcel(p: Project) {
  const ws = XLSX.utils.aoa_to_sheet([["الحقل", "القيمة"], ...fields(p), ["الوصف", p.description]]);
  ws["!cols"] = [{ wch: 24 }, { wch: 80 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "المشروع");
  XLSX.writeFile(wb, `${p.id}.xlsx`);
}

export function exportProjectsExcel(list: Project[], filename = "madar-projects.xlsx") {
  const data = list.map((p) => ({
    "اسم المشروع": p.name,
    التصنيف: p.category,
    الحالة: p.status,
    "نسبة الإنجاز": p.progress,
    "تاريخ البداية": p.startDate,
    "تاريخ النهاية": p.endDate,
    "المدة (سنوات)": p.durationYears,
    "الجهة المسؤولة": p.ownerEntity,
    "الجهة المنفذة": p.executorEntity || "",
    المساحة: p.area,
    الوحدة: p.areaUnit,
    "خط العرض": p.lat,
    "خط الطول": p.lng,
    الوصف: p.description,
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = Object.keys(data[0] || {}).map(() => ({ wch: 22 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "المشاريع");
  XLSX.writeFile(wb, filename);
}
