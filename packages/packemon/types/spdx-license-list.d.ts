declare module 'spdx-license-list' {
  interface License {
    name: string;
    url: string;
    osiApproved: boolean;
  }

  const list: Record<string, License>;

  export default list;
}
