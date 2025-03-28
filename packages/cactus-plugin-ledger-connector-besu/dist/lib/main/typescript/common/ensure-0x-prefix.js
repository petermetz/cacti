"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensure0xPrefix = ensure0xPrefix;
/**
 *
 * @param maybePrefixed
 * @returns The string itself if it was 0x prefixed or a new 0x prefixed version of if it wasn't.
 */
function ensure0xPrefix(maybePrefixed) {
    const fn = "ensure-0x-prefix.ts";
    if (!maybePrefixed)
        throw new Error(`${fn} Input cannot be empty`);
    if (typeof maybePrefixed !== "string")
        throw new Error(`${fn} Input must be a string`);
    if (!maybePrefixed.startsWith("0x")) {
        return `0x${maybePrefixed}`;
    }
    return maybePrefixed;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5zdXJlLTB4LXByZWZpeC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3R5cGVzY3JpcHQvY29tbW9uL2Vuc3VyZS0weC1wcmVmaXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSx3Q0FVQztBQWZEOzs7O0dBSUc7QUFDSCxTQUFnQixjQUFjLENBQUMsYUFBcUI7SUFDbEQsTUFBTSxFQUFFLEdBQUcscUJBQXFCLENBQUM7SUFDakMsSUFBSSxDQUFDLGFBQWE7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0lBQ25FLElBQUksT0FBTyxhQUFhLEtBQUssUUFBUTtRQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0lBRWxELElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDcEMsT0FBTyxLQUFLLGFBQWEsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFDRCxPQUFPLGFBQThCLENBQUM7QUFDeEMsQ0FBQyJ9