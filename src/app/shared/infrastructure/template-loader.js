export async function loadTemplate(relativePath) {
  const response = await fetch(relativePath);
  if (!response.ok) {
    throw new Error(`Could not load template: ${relativePath}`);
  }
  return response.text();
}
