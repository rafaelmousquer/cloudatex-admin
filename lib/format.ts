export function bytesToGB(bytes: bigint | number | null | undefined): number {
  if (bytes === null || bytes === undefined) return 0

  const value = typeof bytes === "bigint" ? Number(bytes) : bytes
  return value / 1024 / 1024 / 1024
}

export function formatBytesToGB(
  bytes: bigint | number | null | undefined
): string {
  return `${bytesToGB(bytes).toFixed(2)} GB`
}

export function calculateExtraGb(
  usedBytes: bigint | number | null | undefined,
  includedGb: number
): number {
  const usedGb = bytesToGB(usedBytes)
  return Math.max(0, usedGb - includedGb)
}

export function calculateExtraCost(
  usedBytes: bigint | number | null | undefined,
  includedGb: number,
  extraPricePerGb: number
): number {
  const extraGb = calculateExtraGb(usedBytes, includedGb)
  return extraGb * extraPricePerGb
}