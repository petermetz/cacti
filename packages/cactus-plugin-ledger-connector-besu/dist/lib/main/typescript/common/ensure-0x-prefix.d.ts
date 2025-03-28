/**
 *
 * @param maybePrefixed
 * @returns The string itself if it was 0x prefixed or a new 0x prefixed version of if it wasn't.
 */
export declare function ensure0xPrefix(maybePrefixed: string): string & `0x${string}`;
