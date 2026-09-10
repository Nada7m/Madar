-- Backup before deleting duplicate hotel rows
CREATE TABLE IF NOT EXISTS public.projects_hotel_backup_20260828 AS
SELECT *
FROM public.projects
WHERE category = 'فندقي';

-- Preview current hotel rows
SELECT project_name, category
FROM public.projects
WHERE category = 'فندقي'
ORDER BY project_name;

-- Delete only duplicate / non-approved hotel rows
DELETE FROM public.projects
WHERE category = 'فندقي'
  AND project_name NOT IN (
    'ذا أوبروي المدينة',
    'أنوار المدينة موفنبيك',
    'بولمان زمزم المدينة',
    'شذا المدينة',
    'دار التقوى',
    'سوفيتل شهد المدينة',
    'هيلتون المدينة',
    'كراون بلازا المدينة',
    'ماريوت المدينة',
    'طيبة المدينة'
  );

-- Final verification query
SELECT project_name, category
FROM public.projects
WHERE category = 'فندقي'
ORDER BY project_name;
