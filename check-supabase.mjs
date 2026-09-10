import { createClient } from '@supabase/supabase-js';

const url = 'https://cujluygsxzepsxqoerjh.supabase.co';
const key = 'sb_publishable_2kpeB9sL9SiBkABpsI-I5A_B9zL3N_v';
const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
});

const tables = ['projects', 'project_images', 'project_updates', 'profiles'];

const out = {};
for (const table of tables) {
  const { data, error } = await supabase.from(table).select('*');
  out[table] = { error: error ? { code: error.code, message: error.message, details: error.details, hint: error.hint } : null, count: data ? data.length : null, sample: data && data.length ? Object.keys(data[0]) : null, rows: data && data.length ? data.slice(0, 2) : [] };
}

console.log('TABLE_STATUS');
console.log(JSON.stringify(out, null, 2));

const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
console.log('BUCKET_STATUS');
console.log(JSON.stringify({ error: bucketErr ? { message: bucketErr.message } : null, count: buckets ? buckets.length : null, buckets: buckets ? buckets.map(b => ({ name: b.name, public: b.public, created_at: b.created_at })) : null }, null, 2));

for (const bucketName of ['project-images', 'project-qr']) {
  const { data, error } = await supabase.storage.from(bucketName).list('', { limit: 1000, offset: 0 });
  console.log('BUCKET_LIST', bucketName);
  console.log(JSON.stringify({ error: error ? { message: error.message, statusCode: error.statusCode } : null, count: data ? data.length : null, items: data ? data.slice(0, 10).map(x => ({ name: x.name, id: x.id, metadata: x.metadata, updated_at: x.updated_at })) : null }, null, 2));
}
