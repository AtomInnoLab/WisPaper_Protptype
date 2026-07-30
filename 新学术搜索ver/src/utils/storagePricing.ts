export const STORAGE_RMB_PER_GB = 0.6;
export const RMB_PER_USD = 7;
export const CREDITS_PER_USD = 10_000;

export function calculateStorageCredits(gigabytes: number) {
  return Math.round((gigabytes * STORAGE_RMB_PER_GB / RMB_PER_USD) * CREDITS_PER_USD);
}

export function calculateStorageRmb(gigabytes: number) {
  return gigabytes * STORAGE_RMB_PER_GB;
}

export function calculateStorageUsd(gigabytes: number) {
  return calculateStorageRmb(gigabytes) / RMB_PER_USD;
}
