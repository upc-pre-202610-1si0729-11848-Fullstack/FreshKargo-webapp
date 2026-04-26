import { bootstrapFreshKargo } from './app/app.js';

bootstrapFreshKargo().catch((error) => {
  console.error('FreshKargo could not start.', error);
});
