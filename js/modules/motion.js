/**
 * Shared motion preference.
 * Every module asks this rather than querying matchMedia itself, so
 * "respect reduced motion" is decided in exactly one place.
 */
const query = window.matchMedia('(prefers-reduced-motion: reduce)');

export const prefersReducedMotion = () => query.matches;
