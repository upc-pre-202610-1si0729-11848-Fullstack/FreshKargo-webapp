export async function loadTemplate(relativePath) {
  const path = relativePath.startsWith('/') 
    ? `${import.meta.env.BASE_URL}${relativePath.slice(1)}` 
    : relativePath;
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Could not load template: ${relativePath}`);
  }
  return response.text();
}
