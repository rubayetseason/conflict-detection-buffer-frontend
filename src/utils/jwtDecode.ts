// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jwtDecode<T = any>(token: string): T | null {
  try {
    const payload = token.split(".")[1]; // get the middle part
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
}
